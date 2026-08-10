let handlers = {};
let startupError = null;

try {
  // Static top-level requires for Vercel's Node File Trace (NFT)
  handlers.login = require('./_handlers/auth/login');
  handlers.session = require('./_handlers/auth/session');
  handlers.posts = require('./_handlers/posts/index');
  handlers.postDetail = require('./_handlers/posts/detail');
  handlers.upload = require('./_handlers/upload/index');
  handlers.toeicQuestions = require('./_handlers/toeic/questions');
  handlers.metrics = require('./_handlers/admin/metrics');

  // Normalize handlers (handle default exports if needed)
  for (let key in handlers) {
    if (handlers[key] && typeof handlers[key].default === 'function') {
      handlers[key] = handlers[key].default;
    }
  }
} catch (err) {
  startupError = err;
  console.error("CRITICAL STARTUP ERROR in API Gateway:", err);
}

/**
 * Native Vercel Serverless API Gateway
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (startupError) {
    return res.status(500).json({
      error: 'API Gateway failed to initialize (Startup Crash)',
      details: startupError.message,
      stack: startupError.stack
    });
  }

  const rawUrl = String(req.url || '').split('?')[0];

  try {
    if (rawUrl.includes('/auth/login') || rawUrl.includes('/login')) {
      return await handlers.login(req, res);
    }
    if (rawUrl.includes('/auth/session') || rawUrl.includes('/session')) {
      return await handlers.session(req, res);
    }
    if (rawUrl.includes('/posts/detail') || rawUrl.includes('/detail')) {
      return await handlers.postDetail(req, res);
    }
    if (rawUrl.includes('/posts')) {
      return await handlers.posts(req, res);
    }
    if (rawUrl.includes('/upload')) {
      return await handlers.upload(req, res);
    }
    if (rawUrl.includes('/toeic/questions') || rawUrl.includes('/questions')) {
      return await handlers.toeicQuestions(req, res);
    }
    if (rawUrl.includes('/admin/metrics') || rawUrl.includes('/metrics')) {
      return await handlers.metrics(req, res);
    }



    // Default API Gateway Status Response
    return res.status(200).json({
      status: 'OK',
      message: 'OatSite Unified API Gateway is active',
      rawUrl
    });
  } catch (err) {
    console.error('Vercel API Gateway Exception:', err);
    return res.status(500).json({
      error: `API Gateway Error: ${err.message || String(err)}`
    });
  }
};
