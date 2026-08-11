const { verifyAuth } = require('../../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const decoded = await verifyAuth(req);
    return res.status(200).json({ valid: true, sessionId: decoded.sessionId, exp: decoded.exp });
  } catch (err) {
    return res.status(401).json({ 
      valid: false, 
      error: err.message,
      isSessionOverride: !!err.isSessionOverride
    });
  }
};
