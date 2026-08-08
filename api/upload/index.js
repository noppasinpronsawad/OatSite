const cloudinary = require('cloudinary').v2;
const { verifyAuth } = require('../lib/auth');
require('dotenv').config();

// Helper to extract Cloudinary public_id from URL
function extractCloudinaryPublicId(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return null;
  }
  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    let pathAfterUpload = url.substring(uploadIndex + 8);
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
    const lastDotIndex = pathAfterUpload.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }
    return pathAfterUpload;
  } catch (err) {
    return null;
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'DELETE') {
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
      const missing = [];
      if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
      if (!apiKey) missing.push('CLOUDINARY_API_KEY');
      if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');
      return res.status(500).json({ error: `Cloudinary Configuration Error: Missing ${missing.join(', ')} in Vercel Environment Variables` });
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

    // Handle DELETE Request -> Destroy unused image from Cloudinary
    if (req.method === 'DELETE') {
      const publicId = body.public_id || (req.query ? req.query.public_id : null) || extractCloudinaryPublicId(body.url || (req.query ? req.query.url : null));
      if (!publicId) {
        return res.status(400).json({ error: 'public_id or url required to delete Cloudinary image' });
      }
      const destroyResult = await cloudinary.uploader.destroy(publicId);
      return res.status(200).json({ success: true, message: 'Cloudinary image destroyed successfully', result: destroyResult });
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
    const maskStr = (str) => str && str.length > 4 ? (str.substring(0, 3) + '***' + str.substring(str.length - 2)) : (str || 'EMPTY');
    const debugInfo = `[cloud_name="${maskStr(cloudName)}", api_key="${maskStr(apiKey)}"]`;
    return res.status(500).json({ error: `Cloudinary API Error: ${err.message || 'Image upload failed'} ${debugInfo}` });
  }
};
