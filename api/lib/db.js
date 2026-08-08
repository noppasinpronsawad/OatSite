const mongoose = require('mongoose');
require('dotenv').config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  const MONGODB_URI = String(process.env.MONGODB_URI || '').trim();
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not set in Environment Variables. Operating in fallback mode.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB Atlas successfully');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB Connection Error:', e.message);
    return null;
  }

  return cached.conn;
}

module.exports = connectToDatabase;
