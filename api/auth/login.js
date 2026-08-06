const jwt = require('jsonwebtoken');
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
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminPassword || !jwtSecret) {
      return res.status(500).json({ error: 'Server configuration error: ADMIN_PASSWORD or JWT_SECRET missing' });
    }

    if (!password || String(password).trim() !== String(adminPassword).trim()) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }

    // Generate JWT with EXACTLY 15 minutes expiration ('15m')
    const token = jwt.sign(
      { role: 'admin', user: 'Noppasin P.' },
      jwtSecret,
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      success: true,
      token,
      expiresIn: 900, // 15 minutes in seconds
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
