const cloudinary = require('cloudinary').v2;
const { verifyAuth } = require('./lib/auth');
require('dotenv').config();

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // JWT Verification (Protected Route)
    try {
      verifyAuth(req);
    } catch (authErr) {
      return res.status(authErr.statusCode || 401).json({ error: authErr.message });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: 'Cloudinary credentials missing in environment variables' });
    }

    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { image } = body || {};

    if (!image) {
      return res.status(400).json({ error: 'No image data provided in request body' });
    }

    // Upload base64 or Data URI directly to Cloudinary with automatic resizing & optimization
    const result = await cloudinary.uploader.upload(image, {
      folder: 'oatsite_blog',
      transformation: [
        { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
      ]
    });

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ error: err.message || 'Image upload failed' });
  }
};
