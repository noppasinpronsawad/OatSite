const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON and URL-encoded parsing for standard API endpoints
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Require API Route Handlers
const loginHandler = require('./api/auth/login');
const postsHandler = require('./api/posts/index');
const postDetailHandler = require('./api/posts/detail');
const uploadHandler = require('./api/upload');

// API Routes
app.all('/api/auth/login', (req, res) => loginHandler(req, res));
app.all('/api/posts/detail', (req, res) => postDetailHandler(req, res));
app.all('/api/posts', (req, res) => postsHandler(req, res));
app.all('/api/upload', (req, res) => uploadHandler(req, res));

// Serve Static Frontend Files
app.use(express.static(__dirname));

// Fallback route for SPA or Admin UI
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Start Local Test Server
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 OatSite Local Server running at http://localhost:${PORT}`);
  console.log(`🏠 Main Website:  http://localhost:${PORT}/`);
  console.log(`🔑 Admin Panel:   http://localhost:${PORT}/admin/index.html`);
  console.log(`📡 API Endpoints: http://localhost:${PORT}/api/posts`);
  console.log(`====================================================`);

  // Verify DB connection on server startup
  try {
    const connectToDatabase = require('./api/lib/db');
    await connectToDatabase();
    console.log('✅ MongoDB Atlas connected successfully on local startup!');
  } catch (err) {
    console.error('❌ MongoDB Atlas connection error on local startup:', err.message);
  }
});
