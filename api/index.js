const rawLoginHandler = require('./_handlers/auth/login');
const rawSessionHandler = require('./_handlers/auth/session');
const rawPostsHandler = require('./_handlers/posts/index');
const rawPostDetailHandler = require('./_handlers/posts/detail');
const rawUploadHandler = require('./_handlers/upload/index');
const rawToeicQuestionsHandler = require('./_handlers/toeic/questions');
const rawMetricsHandler = require('./_handlers/admin/metrics');

function getHandler(mod) {
  if (typeof mod === 'function') return mod;
  if (mod && typeof mod.default === 'function') return mod.default;
  return mod;
}

const loginHandler = getHandler(rawLoginHandler);
const sessionHandler = getHandler(rawSessionHandler);
const postsHandler = getHandler(rawPostsHandler);
const postDetailHandler = getHandler(rawPostDetailHandler);
const uploadHandler = getHandler(rawUploadHandler);
const toeicQuestionsHandler = getHandler(rawToeicQuestionsHandler);
const metricsHandler = getHandler(rawMetricsHandler);

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
