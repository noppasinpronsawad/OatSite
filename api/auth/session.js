const { verifyAuth } = require('../lib/auth');
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
    const decoded = await verifyAuth(req);
    return res.status(200).json({
      success: true,
      active: true,
      user: decoded.user || 'Noppasin P.',
      sessionId: decoded.sessionId
    });
  } catch (authErr) {
    return res.status(authErr.statusCode || 401).json({
      error: authErr.message,
      isSessionOverride: !!authErr.isSessionOverride
    });
  }
};
