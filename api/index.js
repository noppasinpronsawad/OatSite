const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Require Internal Route Handlers from _handlers directory
const loginHandler = require('./_handlers/auth/login');
const sessionHandler = require('./_handlers/auth/session');
const postsHandler = require('./_handlers/posts/index');
const postDetailHandler = require('./_handlers/posts/detail');
const uploadHandler = require('./_handlers/upload/index');
const toeicQuestionsHandler = require('./_handlers/toeic/questions');
const metricsHandler = require('./_handlers/admin/metrics');

// CORS Headers Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Async Route Dispatcher Wrapper (Catch all unhandled errors cleanly)
const wrapHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error('Route handler error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: `API Handler Error: ${err.message || String(err)}` });
    }
  }
};

// API Routes Routing (Matches full /api/ path, route alias, and sub-path)
app.all(['/api/auth/login', '/auth/login', '/login'], wrapHandler(loginHandler));
app.all(['/api/auth/session', '/auth/session', '/session'], wrapHandler(sessionHandler));
app.all(['/api/posts/detail', '/posts/detail', '/detail'], wrapHandler(postDetailHandler));
app.all(['/api/posts', '/posts'], wrapHandler(postsHandler));
app.all(['/api/upload', '/upload'], wrapHandler(uploadHandler));
app.all(['/api/toeic/questions', '/toeic/questions', '/questions'], wrapHandler(toeicQuestionsHandler));
app.all(['/api/admin/metrics', '/admin/metrics', '/metrics'], wrapHandler(metricsHandler));

// Health check endpoint
app.get(['/api', '/'], (req, res) => {
  res.status(200).json({ status: 'OK', message: 'OatSite Unified API Gateway is running' });
});

// Express Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Exception:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: `Server Error: ${err.message || String(err)}` });
  }
});

// Export single Express app serverless function for Vercel
module.exports = app;
