const connectToDatabase = require('../../lib/db');
const AdminSession = require('../../models/AdminSession');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { DEFAULT_JWT_SECRET } = require('../../lib/auth');
require('dotenv').config();

const JWT_SECRET = String(process.env.JWT_SECRET || DEFAULT_JWT_SECRET).trim().replace(/^["']|["']$/g, '');

module.exports = async (req, res) => {
  // Always set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body || {};

    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    } else if (Buffer.isBuffer && Buffer.isBuffer(body)) {
      try { body = JSON.parse(body.toString('utf-8')); } catch (e) {}
    }

    const password = String(body.password || '').trim();

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Ultra-resilient password matching: accepts @Dmin123, admin1234, and process.env.ADMIN_PASSWORD
    const envPass = String(process.env.ADMIN_PASSWORD || '').trim().replace(/^["']|["']$/g, '');
    const validPasswords = ['@Dmin123', 'admin1234'];
    if (envPass) validPasswords.push(envPass);

    if (!validPasswords.includes(password)) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }

    // Generate unique sessionId for Single Active Session enforcement
    const sessionId = crypto.randomBytes(16).toString('hex');
    global.activeAdminSessionId = sessionId;

    // Non-blocking MongoDB session save (Safe & Resilient)
    (async () => {
      try {
        const db = await connectToDatabase();
        if (db && AdminSession) {
          await AdminSession.findOneAndUpdate(
            { key: 'admin_active_session' },
            { activeSessionId: sessionId, lastLoginAt: new Date() },
            { upsert: true, new: true }
          ).catch(() => {});
        }
      } catch (e) {
        // Non-blocking silent fallback
      }
    })();

    // Generate 45-minute JWT Token with sessionId
    const token = jwt.sign(
      { role: 'admin', authenticated: true, sessionId },
      JWT_SECRET,
      { expiresIn: '45m' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      sessionId,
      expiresInSeconds: 2700
    });
  } catch (err) {
    console.error('Login handler error:', err);
    return res.status(500).json({ error: `Login Error: ${err.message || String(err)}` });
  }
};
