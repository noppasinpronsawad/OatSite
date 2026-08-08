const loginHandler = require('./_handlers/auth/login');
const sessionHandler = require('./_handlers/auth/session');
const postsHandler = require('./_handlers/posts/index');
const postDetailHandler = require('./_handlers/posts/detail');
const uploadHandler = require('./_handlers/upload/index');
const toeicQuestionsHandler = require('./_handlers/toeic/questions');
const metricsHandler = require('./_handlers/admin/metrics');

/**
 * Native Vercel Serverless API Gateway
 * Consolidates all backend routes into 1 single function to comply with Vercel Hobby Plan (Max 12 Functions).
 */
module.exports = async (req, res) => {
  // CORS Headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse target path from req.url or req.headers
  const rawUrl = String(req.url || '').split('?')[0];

  try {
    if (rawUrl.includes('/auth/login') || rawUrl.includes('/login')) {
      return await loginHandler(req, res);
    }
    if (rawUrl.includes('/auth/session') || rawUrl.includes('/session')) {
      return await sessionHandler(req, res);
    }
    if (rawUrl.includes('/posts/detail') || rawUrl.includes('/detail')) {
      return await postDetailHandler(req, res);
    }
    if (rawUrl.includes('/posts')) {
      return await postsHandler(req, res);
    }
    if (rawUrl.includes('/upload')) {
      return await uploadHandler(req, res);
    }
    if (rawUrl.includes('/toeic/questions') || rawUrl.includes('/questions')) {
      return await toeicQuestionsHandler(req, res);
    }
    if (rawUrl.includes('/admin/metrics') || rawUrl.includes('/metrics')) {
      return await metricsHandler(req, res);
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
