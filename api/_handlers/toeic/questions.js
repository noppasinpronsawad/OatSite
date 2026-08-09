const { connectToDatabase } = require('../../_utils/mongodb');
const ToeicQuestion = require('../../../models/ToeicQuestion');
const PRESEEDED_QUESTIONS = require('../../_data/preseeded_questions');

function shuffleQuestionChoices(q) {
  const choices = q.choices || {};
  const keys = ['A', 'B', 'C', 'D'];
  const originalCorrectText = choices[q.correct_answer] || choices['A'] || '';

  // Simple Fisher-Yates shuffle
  const shuffledKeys = [...keys];
  for (let i = shuffledKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledKeys[i], shuffledKeys[j]] = [shuffledKeys[j], shuffledKeys[i]];
  }

  const newChoices = {};
  let newCorrectKey = 'A';

  shuffledKeys.forEach((origKey, newIdx) => {
    const targetKey = keys[newIdx];
    newChoices[targetKey] = choices[origKey] || '';
    if (choices[origKey] === originalCorrectText) {
      newCorrectKey = targetKey;
    }
  });

  return {
    ...q,
    choices: newChoices,
    correct_answer: newCorrectKey
  };
}

module.exports = async function handler(req, res) {
  // Disable API caching completely (Force Dynamic Response)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const mode = req.query.mode || 'full'; // 'full' (100 Qs) or 'quick' (20 Qs)
    let questions = [];

    try {
      await connectToDatabase();

      if (mode === 'quick') {
        // Target: 6 Part 5, 3 Part 6, 11 Part 7 (Total 20)
        const part5 = await ToeicQuestion.aggregate([{ $match: { part: 5 } }, { $sample: { size: 15 } }]);
        const part6 = await ToeicQuestion.aggregate([{ $match: { part: 6 } }, { $sample: { size: 8 } }]);
        const part7 = await ToeicQuestion.aggregate([{ $match: { part: 7 } }, { $sample: { size: 20 } }]);
        questions = [...part5, ...part6, ...part7];
      } else {
        // Full 100 Qs: 30 Part 5, 16 Part 6, 54 Part 7
        const part5 = await ToeicQuestion.aggregate([{ $match: { part: 5 } }, { $sample: { size: 30 } }]);
        const part6 = await ToeicQuestion.aggregate([{ $match: { part: 6 } }, { $sample: { size: 16 } }]);
        const part7 = await ToeicQuestion.aggregate([{ $match: { part: 7 } }, { $sample: { size: 54 } }]);
        questions = [...part5, ...part6, ...part7];
      }

      // Fallback if aggregate returned few items
      if (!questions || questions.length < 10) {
        questions = await ToeicQuestion.find({}).sort({ part: 1, question_id: 1 });
      }
    } catch (dbErr) {
      console.warn('MongoDB query failed, using PRESEEDED_QUESTIONS pool:', dbErr.message);
      questions = PRESEEDED_QUESTIONS;
    }

    if (!questions || questions.length === 0) {
      questions = PRESEEDED_QUESTIONS;
    }

    // Clean AI Generated prefix and Deduplicate
    const seenTexts = new Set();
    const cleanUniqueQuestions = [];

    for (const qObj of questions) {
      const q = qObj._doc || qObj;
      const rawText = String(q.question_text || '');
      const cleanedText = rawText.replace(/^\[AI Generated Q?\d*\]\s*/i, '').trim();
      const textKey = cleanedText.toLowerCase();

      if (cleanedText && !seenTexts.has(textKey)) {
        seenTexts.add(textKey);
        cleanUniqueQuestions.push({
          ...q,
          question_text: cleanedText
        });
      }
    }

    let selectedQuestions = cleanUniqueQuestions;

    if (mode === 'quick') {
      const part5 = selectedQuestions.filter(q => q.part === 5);
      const part6 = selectedQuestions.filter(q => q.part === 6);
      const part7 = selectedQuestions.filter(q => q.part === 7);

      selectedQuestions = [
        ...part5.slice(0, 6),
        ...part6.slice(0, 3),
        ...part7.slice(0, 11)
      ];

      // Array Padding: If deduplication dropped length below 20, pad with remaining pool items
      if (selectedQuestions.length < 20) {
        const pool = PRESEEDED_QUESTIONS.concat(cleanUniqueQuestions);
        for (const p of pool) {
          if (selectedQuestions.length >= 20) break;
          const cleanPText = String(p.question_text || '').replace(/^\[AI Generated Q?\d*\]\s*/i, '').trim();
          if (!selectedQuestions.some(existing => existing.question_text === cleanPText)) {
            selectedQuestions.push({
              ...p,
              question_text: cleanPText
            });
          }
        }
      }
    }

    // Shuffle choices evenly across A, B, C, D
    const shuffledQuestions = selectedQuestions.map(q => shuffleQuestionChoices(q));

    return res.status(200).json({
      success: true,
      mode,
      total: shuffledQuestions.length,
      questions: shuffledQuestions
    });
  } catch (err) {
    console.error('TOEIC questions handler error:', err);
    return res.status(500).json({
      error: 'Failed to fetch TOEIC questions',
      message: err.message
    });
  }
};
