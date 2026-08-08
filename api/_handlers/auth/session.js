const { verifyAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const auth = await verifyAuth(req);
    return res.status(200).json({
      success: true,
      active: true,
      sessionId: auth.sessionId
    });
  } catch (err) {
    return res.status(err.statusCode || 401).json({
      error: err.message,
      isSessionOverride: !!err.isSessionOverride
    });
  }
};
