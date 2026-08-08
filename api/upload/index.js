const cloudinary = require('cloudinary').v2;
const { verifyAuth } = require('../lib/auth');
require('dotenv').config();

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

    // Configure Cloudinary SDK dynamically per request with trimmed credentials
    const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || '').trim();
    const apiKey = String(process.env.CLOUDINARY_API_KEY || '').trim();
    const apiSecret = String(process.env.CLOUDINARY_API_SECRET || '').trim();

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({ error: 'Cloudinary credentials missing in Vercel Environment Variables' });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

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
