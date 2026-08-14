const connectToDatabase = require('../../lib/db');
const ToeicPendingBatch = require('../../models/ToeicPendingBatch');
const ToeicQuestion = require('../../models/ToeicQuestion');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateWithGemini(content) {
  const prompt = `
You are an expert TOEIC test creator. Based on the following news article text, generate 3 TOEIC Part 7 reading comprehension questions.
Return ONLY a valid JSON array of objects with the exact following structure. No markdown formatting, no backticks, just raw JSON.

[
  {
    "question_id": "unique-id-like-bbc-timestamp-1",
    "part": 7,
    "passage_title": "Extracted Title or Headline",
    "passage_content": "The relevant paragraph or excerpt from the article used for this question.",
    "question_text": "What is the main topic...?",
    "choices": {
      "A": "Option 1",
      "B": "Option 2",
      "C": "Option 3",
      "D": "Option 4"
    },
    "correct_answer": "A",
    "detailed_explanation": {
      "correct_reason": "Explanation why A is correct based on the text.",
      "incorrect_reasons": "Why B, C, D are wrong."
    },
    "tags": ["Business", "BBC News"],
    "cefr_level": "B2"
  }
]

News Article Content:
${content.substring(0, 3000)}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  let text = response.text;
  if (text.startsWith('```json')) {
    text = text.replace(/```json\n?/, '').replace(/```\n?$/, '');
  }
  
  const questions = JSON.parse(text);
  
  // Ensure unique IDs
  const timestamp = Date.now();
  questions.forEach((q, idx) => {
    q.question_id = `bbc-gen-${timestamp}-${idx}`;
  });
  
  return questions;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();
    
    // 1. Find a pending batch in the database
    const batch = await ToeicPendingBatch.findOne({ status: 'pending' });
    if (!batch) return res.status(200).json({ message: 'No pending batches found.' });

    // 2. Mark it as 'processing'
    batch.status = 'processing';
    await batch.save();

    // 3. Call LLM to generate questions
    const generatedQuestions = await generateWithGemini(batch.content);
    
    // 4. Save to ToeicQuestion
    if (generatedQuestions && generatedQuestions.length > 0) {
      await ToeicQuestion.insertMany(generatedQuestions);
    }

    // 5. Mark batch as 'completed'
    batch.status = 'completed';
    await batch.save();

    return res.status(200).json({ 
      success: true, 
      message: `Batch Processed: LLM generated ${generatedQuestions.length} questions for the pending batch.` 
    });
  } catch (err) {
    console.error('Batch Generation Error:', err);
    // If it fails, we should ideally mark batch as failed
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
