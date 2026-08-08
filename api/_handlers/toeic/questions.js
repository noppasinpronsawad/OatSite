const connectToDatabase = require('../../lib/db');
const ToeicQuestion = require('../../models/ToeicQuestion');
const { calculateToeicReadingScore } = require('./score');

// Import exact pre-seeded questions array from original questions handler
const originalQuestionsHandler = require('../../toeic/questions');

// Re-export or forward handler directly
module.exports = async (req, res) => {
  return originalQuestionsHandler(req, res);
};
