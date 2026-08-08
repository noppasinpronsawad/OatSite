const connectToDatabase = require('../../lib/db');
const Post = require('../../models/Post');
const { verifyAuth } = require('../../lib/auth');
const initialBlogPosts = require('../../../blog-data');

// Helper to format date as "07 Aug 2026"
function formatFullDate(dateObj) {
  const d = dateObj || new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await connectToDatabase();

    // GET /api/posts (Public filters publishAt <= NOW, Admin ?admin=true returns all)
    if (req.method === 'GET') {
      const isAdminQuery = req.query.admin === 'true';
      const now = new Date();

      let posts = [];

      if (db) {
        let query = {};
        if (!isAdminQuery) {
          query = {
            $or: [
              { publishAt: { $lte: now } },
              { publishAt: { $exists: false } }
            ]
          };
        }

        posts = await Post.find(query).sort({ publishAt: -1, createdAt: -1 });

        // Auto-seed if database is completely empty or ?seed=true
        const isSeedRequested = req.query.seed === 'true';
        if (isSeedRequested) {
          try {
            await verifyAuth(req);
          } catch (authErr) {
            return res.status(401).json({ error: 'Unauthorized: Admin authentication required to re-seed database' });
          }
        }

        if ((posts.length === 0 || isSeedRequested) && Array.isArray(initialBlogPosts)) {
          console.log('Seeding initial blog posts into MongoDB Atlas...');
          const postsToInsert = initialBlogPosts.map(p => ({
            title: p.title,
            category: p.category,
            summary: p.summary,
            content: p.content,
            image: p.image || '',
            date: p.date.length <= 8 ? `01 ${p.date}` : p.date,
            readTime: p.readTime,
            publishAt: new Date()
          }));
          
          if (isSeedRequested) {
            await Post.deleteMany({});
          }
          posts = await Post.insertMany(postsToInsert);
        }

        // Map Mongo _id to id string for clean client compatibility
        posts = posts.map(p => {
          const obj = typeof p.toObject === 'function' ? p.toObject() : p;
          obj.id = (obj._id || obj.id || '').toString();
          return obj;
        });
      } else {
        // Fallback to in-memory initialBlogPosts if MongoDB is offline
        console.warn('Serving in-memory blog posts fallback');
        posts = initialBlogPosts.map((p, idx) => ({
          ...p,
          id: p.id || `post_${idx + 1}`
        }));
      }

      return res.status(200).json(posts);
    }

    // POST /api/posts (Protected by JWT)
    if (req.method === 'POST') {
      try {
        await verifyAuth(req);
      } catch (authErr) {
        return res.status(authErr.statusCode || 401).json({ error: authErr.message });
      }

      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const { title, category, summary, content, image, date, readTime, publishAt } = body || {};

      if (!title || !category || !summary || !content) {
        return res.status(400).json({ error: 'Title, category, summary, and content are required fields' });
      }

      const publishAtDate = publishAt ? new Date(publishAt) : new Date();
      const formattedDate = date || formatFullDate(publishAtDate);

      if (db) {
        const newPost = await Post.create({
          title,
          category,
          summary,
          content,
          image: image || '',
          date: formattedDate,
          readTime: readTime || '5 min read',
          publishAt: publishAtDate
        });

        const obj = newPost.toObject();
        obj.id = obj._id.toString();
        return res.status(201).json(obj);
      } else {
        return res.status(500).json({ error: 'MongoDB connection unavailable. Cannot save new post.' });
      }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('API /api/posts error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
