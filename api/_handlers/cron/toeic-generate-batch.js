const connectToDatabase = require('../../lib/db');
const ToeicPendingBatch = require('../../models/ToeicPendingBatch');
const ToeicQuestion = require('../../models/ToeicQuestion');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const themes = [
  'Human Resources & Recruitment', 'Marketing & Sales Strategies', 'Corporate Contracts & Legal',
  'Logistics & Shipping Operations', 'Office Management & Facilities', 'Financial Reports & Accounting',
  'Business Travel & Conferences', 'Product Development & Launch', 'Customer Service & Feedback',
  'Information Technology & Software', 'Employee Training & Development', 'Mergers & Acquisitions',
  'Public Relations & Media', 'Manufacturing & Quality Control', 'Retail Banking & Finance',
  'Real Estate & Property Management', 'Environmental Sustainability', 'Workplace Safety Guidelines',
  'E-commerce & Digital Retail', 'Healthcare Administration'
];

const grammars = [
  'Parts of Speech', 'Verb Tenses', 'Prepositions', 'Conjunctions',
  'Relative Clauses', 'Gerunds & Infinitives', 'Subject-Verb Agreement',
  'Passive Voice', 'Conditionals (If-clauses)', 'Comparatives & Superlatives',
  'Adjective vs Adverb placement', 'Pronoun Reference', 'Participial Phrases',
  'Causative Verbs', 'Modal Verbs', 'Noun Clauses', 'Inversions',
  'Tag Questions', 'Articles (A, An, The)', 'Quantifiers (Much, Many, Few, Little)'
];

async function generateWithGemini(contextTheme, grammarFocus, bbcContent, modelName) {
  let prompt = `You are an expert English language assessor and TOEIC test creator. Your task is to generate realistic, unique, and high-quality TOEIC Reading Part questions (Part 5, Part 6, and Part 7).

You must output the result strictly in a single, valid JSON array containing EXACTLY 25 flat objects. Do NOT include markdown code blocks.

**Context Theme:** ${contextTheme}
**Grammar Focus (Part 5):** ${grammarFocus}

**Output Structure Rules:**
Output a flat array of exactly 25 question objects. DO NOT nest questions inside arrays. 
- Questions 1-7 (Part 5): Standalone grammar/vocab sentences.
- Questions 8-11 (Part 6): 4 questions sharing the EXACT same 'group_id' and 'passage_text'.
- Questions 12-25 (Part 7): 3 distinct reading passages. Questions sharing a passage must share the same 'group_id', 'passage_type', and 'passages' content.
- 'knowledge_tag' MUST be a specific grammar or reading concept (e.g., Tense, Preposition, Gerund, Vocabulary, Inference, Main Idea). DO NOT use generic tags like "General".

**STRICT JSON SCHEMA PER QUESTION (DO NOT NEST):**
[
  {
    "part": 5,
    "group_id": null,
    "passage_type": null,
    "passage_title": null,
    "passage_text": null,
    "passages": null,
    "knowledge_tag": "Part of Speech",
    "question_text": "The inspector requested that equipment be _______ checked.",
    "choice_A": "thorough",
    "choice_B": "thoroughly",
    "choice_C": "thoroughness",
    "choice_D": "through",
    "correct_answer": "B",
    "correct_reason": "Explanation in Thai...",
    "incorrect_reasons": "Explanation for A, C, D in a SINGLE string here."
  },
  {
    "part": 6,
    "group_id": "group-1",
    "passage_type": "Email",
    "passage_title": "Office Relocation",
    "passage_text": "Dear Staff, we are moving to... [8] ...",
    "passages": null,
    "knowledge_tag": "Vocabulary",
    "question_text": "Choose the correct option for blank [8].",
    "choice_A": "...",
    "choice_B": "...",
    "choice_C": "...",
    "choice_D": "...",
    "correct_answer": "A",
    "correct_reason": "Explanation in Thai...",
    "incorrect_reasons": "Explanation in Thai..."
  }
]
CRITICAL: Every item must have choice_A, choice_B, choice_C, choice_D, correct_reason, and incorrect_reasons as simple strings.
`;

  if (bbcContent) {
    prompt += `\n\n**BBC News Context to use for passages:**\n${bbcContent.substring(0, 3000)}`;
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    generationConfig: { responseMimeType: "application/json" }
  });

  let text = response.text;

  // JSON Sanitization (Error Prevention)
  text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    text = text.substring(firstBracket, lastBracket + 1);
  }

  const rawData = JSON.parse(text.trim());

  // 1. Hybrid Parsing (Handles BOTH Flat and Nested outputs safely)
  let flatRaw = [];
  for (const item of rawData) {
      if (item.questions && Array.isArray(item.questions)) {
          for (const subQ of item.questions) {
              flatRaw.push({ ...item, ...subQ, questions: undefined });
          }
      } else {
          flatRaw.push(item);
      }
  }

  // 2. Smart Extraction (Quality First - NO FAKE DATA)
  const timestamp = Date.now();
  
  const d = new Date(timestamp);
  const pad = (n) => String(n).padStart(2, '0');
  const timeSuffix = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  
  const groupIdMap = {};
  let groupCounter = 1;

  let formattedQuestions = flatRaw.map((q, index) => {
      
      let ch = q.choices || q.options || {};
      let choiceA = String(q.choice_A || ch.A || ch['(A)'] || ch.a || "").trim();
      let choiceB = String(q.choice_B || ch.B || ch['(B)'] || ch.b || "").trim();
      let choiceC = String(q.choice_C || ch.C || ch['(C)'] || ch.c || "").trim();
      let choiceD = String(q.choice_D || ch.D || ch['(D)'] || ch.d || "").trim();
      
      // Extract Enum safely. If it fails, leave it empty to trigger validation failure.
      let rawCorrect = String(q.correct_answer || "").trim().toUpperCase();
      let match = rawCorrect.match(/^[A-D]$|(?<=\()[A-D](?=\))/); // Matches "A" or "(A)"
      if (!match) match = rawCorrect.match(/[A-D]/);
      let correct = match ? match[0] : ""; 

      let exp = q.detailed_explanation || {};
      let c_reason = String(q.correct_reason || exp.correct_reason || "").trim();
      
      let i_reasons = q.incorrect_reasons || exp.incorrect_reasons || "";
      if (typeof i_reasons === 'object') {
          try { 
              i_reasons = Object.entries(i_reasons).map(([k,v]) => `${k}: ${v}`).join('\n');
          } catch(e) { 
              i_reasons = ""; 
          }
      }
      i_reasons = String(i_reasons).trim();

      // Combine passage data into a unified Markdown passage_content
      let rawContent = q.passage_text || q.passages || "";
      if (typeof rawContent !== "string") {
          try { rawContent = JSON.stringify(rawContent, null, 2); } catch(e) { rawContent = String(rawContent); }
      }
      let p_type = q.passage_type ? `**[${q.passage_type}]**\n\n` : "";
      let finalContent = rawContent.trim() ? `${p_type}${rawContent.trim()}` : "";

      let uniquePassageId = null;
      if (q.group_id) {
          let rawId = String(q.group_id).trim();
          if (!groupIdMap[rawId]) {
              groupIdMap[rawId] = `p${q.part || 6}-group-${groupCounter++}-${timeSuffix}`;
          }
          uniquePassageId = groupIdMap[rawId];
      }

      return {
          question_id: `bbc-gen-${timestamp}-${index}`,
          part: q.part || 5,
          passage_id: uniquePassageId,
          passage_title: String(q.passage_title || "").trim(),
          passage_content: finalContent,
          tags: [ String(q.knowledge_tag || "General").trim() ],
          question_text: String(q.question_text || q.question || "").trim(), // No fake defaults
          choices: { A: choiceA, B: choiceB, C: choiceC, D: choiceD },
          correct_answer: correct,
          detailed_explanation: { correct_reason: c_reason, incorrect_reasons: i_reasons }
      };
  });

  // 3. Absolute Validation Trigger (Zero Tolerance)
  if (formattedQuestions.length !== 25) {
      throw new Error(`Validation Failed: Expected 25 questions, got ${formattedQuestions.length}`);
  }
  for (let i = 0; i < formattedQuestions.length; i++) {
      const q = formattedQuestions[i];
      if (!q.question_text) throw new Error(`Validation Failed (Q${i+1}): Missing question_text`);
      if (!q.choices.A || !q.choices.B || !q.choices.C || !q.choices.D) {
          throw new Error(`Validation Failed (Q${i+1}): Missing one or more choices`);
      }
      if (!['A', 'B', 'C', 'D'].includes(q.correct_answer)) {
          throw new Error(`Validation Failed (Q${i+1}): Invalid correct_answer (${q.correct_answer})`);
      }
      if (!q.detailed_explanation.correct_reason || !q.detailed_explanation.incorrect_reasons) {
          throw new Error(`Validation Failed (Q${i+1}): Missing explanation`);
      }
  }

  return formattedQuestions;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();

    // Select Random Theme and Grammar
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomGrammar = grammars[Math.floor(Math.random() * grammars.length)];

    let useBbc = Math.random() < 0.5;
    let batch = null;
    let finalTheme = randomTheme;

    if (useBbc) {
      batch = await ToeicPendingBatch.findOne({ status: 'pending' });
      if (!batch) {
        useBbc = false; // Fallback to random theme
      }
    }

    let bbcContent = null;
    if (useBbc && batch) {
      batch.status = 'processing';
      await batch.save();
      bbcContent = batch.content;
      finalTheme = 'BBC News Article Context';
    }

    // Call LLM with Fallback Loop
    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'];
    let generatedQuestions = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        generatedQuestions = await generateWithGemini(finalTheme, randomGrammar, bbcContent, modelName);
        break; // Success
      } catch (err) {
        console.warn(`\x1b[33m⚠️ Fallback: Model ${modelName} failed. Trying next...\x1b[0m`);
        lastError = err;
        continue; // Try next model immediately
      }
    }

    if (generatedQuestions && generatedQuestions.length > 0) {
      await ToeicQuestion.insertMany(generatedQuestions);
    } else {
      const ToeicGenError = require('../../models/ToeicGenError');
      await ToeicGenError.create({
        error_message: lastError ? lastError.message : 'No questions returned',
        attempted_models: modelsToTry,
        context_used: finalTheme
      });
      throw new Error('All models failed to generate questions.');
    }

    // Mark BBC Article as "Processed"
    if (useBbc && batch) {
      batch.status = 'completed';
      await batch.save();
    }

    return res.status(200).json({
      success: true,
      message: `Batch Processed: LLM generated ${generatedQuestions.length} questions. Context: ${useBbc ? 'BBC Article' : 'Random Theme'}`,
      theme: finalTheme,
      grammar: randomGrammar
    });
  } catch (err) {
    console.error('Batch Generation Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
