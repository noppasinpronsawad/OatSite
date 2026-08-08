const jwt = require('jsonwebtoken');
const connectToDatabase = require('../lib/db');
const AdminSession = require('../models/AdminSession');
require('dotenv').config();

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Robust body parsing for Vercel Serverless Function environment
    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('Failed to parse req.body string:', e);
      }
    }

    const { password } = body || {};
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
    const jwtSecret = process.env.JWT_SECRET || 'oatsite_jwt_secret_key_2026';

    if (!password || String(password).trim() !== String(adminPassword).trim()) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }

    // Generate Single Active Session ID (invalidates any previous active session)
    const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    global.activeAdminSessionId = sessionId;

    // Save/Update active session in MongoDB
    try {
      await connectToDatabase();
      await AdminSession.findOneAndUpdate(
        { key: 'admin_active_session' },
        { activeSessionId: sessionId, lastLoginAt: new Date() },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.error('Failed to persist AdminSession in DB:', dbErr);
    }

    // Generate JWT with EXACTLY 45 minutes expiration ('45m') and embedded sessionId
    const token = jwt.sign(
      { role: 'admin', user: 'Noppasin P.', sessionId },
      jwtSecret,
      { expiresIn: '45m' }
    );

    return res.status(200).json({
      success: true,
      token,
      sessionId,
      expiresIn: 2700, // 45 minutes in seconds
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
