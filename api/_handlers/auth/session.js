const { verifyAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-ID');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authData = await verifyAuth(req);
    const activeSessionId = global.activeAdminSessionId || authData.sessionId || 'session_default';

    return res.status(200).json({
      success: true,
      authenticated: true,
      role: authData.role || 'admin',
      activeSessionId: activeSessionId
    });
  } catch (err) {
    return res.status(err.statusCode || 401).json({
      success: false,
      authenticated: false,
      error: err.message,
      isSessionOverride: err.isSessionOverride || false
    });
  }
};
