const connectToDatabase = require('../../lib/db');
const ToeicQuestion = require('../../models/ToeicQuestion');
const { verifyAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await verifyAuth(req);
    const db = await connectToDatabase();
    if (db && ToeicQuestion) {
      // Fetch latest 100 questions from MongoDB
      const questions = await ToeicQuestion.find({}).sort({ createdAt: -1 }).limit(100);
      return res.status(200).json({ success: true, questions });
    } else {
      return res.status(500).json({ success: false, error: 'Database not available' });
    }
  } catch (err) {
    console.error('Admin questions fetch error:', err);
    return res.status(err.statusCode || 401).json({ success: false, error: err.message });
  }
};