const connectToDatabase = require('../../lib/db');
const Post = require('../../models/Post');
const { verifyAuth } = require('../../lib/auth');
const ToeicQuestion = require('../../models/ToeicQuestion');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const dailyLogs = [];

    let actualToeicCount = 0;
      if (connectToDatabase) {
        const db = await connectToDatabase();
        if (db && typeof ToeicQuestion !== 'undefined') {
          actualToeicCount = await ToeicQuestion.countDocuments();
        }
      }

      return res.status(200).json({
        success: true,
        metrics: {
          vercel: { status: 'Active (Production Edge)', region: 'sin1 (Singapore)' },
          cloudinary: { cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'noppasin-cdn' },
          mongodb: { totalPosts: 1, totalToeicQuestions: actualToeicCount },
          dailyNewsLogs: dailyLogs,
        }
      });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
