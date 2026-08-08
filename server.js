const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import Single Unified API Gateway App
const apiApp = require('./api/index');

// Mount API Gateway
app.use(apiApp);

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
