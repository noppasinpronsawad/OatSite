const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const connectToDatabase = require('../../lib/db');
const Post = require('../../models/Post');
const { verifyAuth } = require('../../lib/auth');
require('dotenv').config();

// Helper to format date as "07 Aug 2026"
function formatFullDate(dateObj) {
  const d = dateObj || new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Helper to extract Cloudinary public_id from image URL
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
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // JWT Verification (Protected Route)
    try {
      await verifyAuth(req);
    } catch (authErr) {
      return res.status(authErr.statusCode || 401).json({ 
        error: authErr.message, 
        isSessionOverride: !!authErr.isSessionOverride 
      });
    }

    // Configure Cloudinary SDK dynamically per request with trimmed credentials
    const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || '').trim();
    const apiKey = String(process.env.CLOUDINARY_API_KEY || '').trim();
    const apiSecret = String(process.env.CLOUDINARY_API_SECRET || '').trim();

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
      });
    }

    await connectToDatabase();

    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { id } = req.query;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Valid Post ID is required' });
    }

    // PUT /api/posts/detail?id=:id -> Update Post
    if (req.method === 'PUT') {
      const { title, category, summary, content, image, date, readTime, publishAt } = body;

      // If updating image, find existing post to delete old Cloudinary image if replaced
      if (image !== undefined) {
        const existingPost = await Post.findById(id);
        if (existingPost && existingPost.image && existingPost.image !== image) {
          const oldPublicId = extractCloudinaryPublicId(existingPost.image);
          if (oldPublicId) {
            cloudinary.uploader.destroy(oldPublicId).catch(err => console.error('Cloudinary old image delete error:', err));
          }
        }
      }

      const updateFields = {
        ...(title && { title }),
        ...(category && { category }),
        ...(summary && { summary }),
        ...(content && { content }),
        ...(image !== undefined && { image }),
        ...(readTime && { readTime })
      };

      if (publishAt) {
        const publishAtDate = new Date(publishAt);
        updateFields.publishAt = publishAtDate;
        updateFields.date = date || formatFullDate(publishAtDate);
      } else if (date) {
        updateFields.date = date;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const obj = updatedPost.toObject();
      obj.id = obj._id.toString();

      return res.status(200).json(obj);
    }

    // DELETE /api/posts/detail?id=:id -> Delete Post
    if (req.method === 'DELETE') {
      const deletedPost = await Post.findByIdAndDelete(id);

      if (!deletedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Automatically delete image from Cloudinary to keep Free Tier clean!
      if (deletedPost.image) {
        const publicId = extractCloudinaryPublicId(deletedPost.image);
        if (publicId) {
          console.log(`Deleting image from Cloudinary: ${publicId}`);
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cErr) {
            console.error('Cloudinary delete error:', cErr);
          }
        }
      }

      return res.status(200).json({ success: true, message: 'Post and associated image deleted successfully', id });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('API /api/posts/detail error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
