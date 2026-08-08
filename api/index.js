const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Require Internal Route Handlers from underscored _handlers directory (ignored by Vercel function auto-builder)
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

// API Routes Routing
app.all('/api/auth/login', (req, res) => loginHandler(req, res));
app.all('/api/auth/session', (req, res) => sessionHandler(req, res));
app.all('/api/posts/detail', (req, res) => postDetailHandler(req, res));
app.all('/api/posts', (req, res) => postsHandler(req, res));
app.all('/api/upload', (req, res) => uploadHandler(req, res));
app.all('/api/toeic/questions', (req, res) => toeicQuestionsHandler(req, res));
app.all('/api/admin/metrics', (req, res) => metricsHandler(req, res));

// Health check endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'OatSite Unified API Gateway is running' });
});

// Export single Express app serverless function for Vercel
module.exports = app;
