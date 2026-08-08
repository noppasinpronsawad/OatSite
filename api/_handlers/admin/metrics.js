const { verifyAuth } = require('../../lib/auth');
const connectToDatabase = require('../../lib/db');
const Post = require('../../models/Post');
const ToeicQuestion = require('../../models/ToeicQuestion');
require('dotenv').config();

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Single Active Session Authentication Check
    await verifyAuth(req);

    // MongoDB Data Queries
    let postsCount = 0;
    let toeicCount = 0;
    let mongoStatus = 'Disconnected';

    try {
      await connectToDatabase();
      mongoStatus = 'Connected (MongoDB Atlas)';
      postsCount = await Post.countDocuments({});
      toeicCount = await ToeicQuestion.countDocuments({});
    } catch (dbErr) {
      console.error('Metrics MongoDB query error:', dbErr);
    }

    // Cloudinary Credentials Check
    const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || '').trim();
    const cloudinaryConfigured = !!(cloudName && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

    // Gemini API Key Check
    const geminiKey = String(process.env.GEMINI_API_KEY || '').trim();
    const geminiConfigured = !!(geminiKey && geminiKey.startsWith('AIza'));
    const maskedGeminiKey = geminiConfigured ? `${geminiKey.substring(0, 7)}...${geminiKey.substring(geminiKey.length - 4)}` : 'Not Configured';

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        vercel: {
          status: 'Active (Production)',
          region: 'Singapore (SIN1)',
          bandwidthLimit: '100 GB / Month',
          serverlessExecution: 'Normal (OK)'
        },
        cloudinary: {
          configured: cloudinaryConfigured,
          cloudName: cloudName || 'Default',
          storageQuota: '25 GB Free Tier',
          transformationsQuota: '25,000 / Month'
        },
        mongodb: {
          status: mongoStatus,
          storageQuota: '512 MB Free Tier (M0 Cluster)',
          totalPosts: postsCount,
          totalToeicQuestions: toeicCount
        },
        gemini: {
          configured: geminiConfigured,
          maskedKey: maskedGeminiKey,
          status: geminiConfigured ? 'Active & Ready for AI Gen' : 'Pending Key in Vercel',
          rateLimit: '15 RPM / 1,500 RPD (Free Tier)'
        }
      }
    });
  } catch (authErr) {
    return res.status(authErr.statusCode || 401).json({
      error: authErr.message,
      isSessionOverride: !!authErr.isSessionOverride
    });
  }
};
