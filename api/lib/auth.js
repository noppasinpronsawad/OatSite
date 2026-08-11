const jwt = require('jsonwebtoken');
const connectToDatabase = require('./db');
const AdminSession = require('../models/AdminSession');
require('dotenv').config();

const DEFAULT_JWT_SECRET = 'antigravity_oatsite_jwt_secret_key_production_fallback';

async function verifyAuth(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Unauthorized: Missing or invalid Authorization header');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    const error = new Error('Unauthorized: Token missing or expired');
    error.statusCode = 401;
    throw error;
  }

  // Single Active Session Validation
  if (decoded && decoded.sessionId) {
    let currentActiveId = null;

    try {
      const db = await connectToDatabase();
      if (db) {
        const activeDoc = await AdminSession.findOne({ key: 'admin_active_session' });
        if (activeDoc && activeDoc.activeSessionId) {
          currentActiveId = activeDoc.activeSessionId;
          global.activeAdminSessionId = currentActiveId; // just keeping it for backwards compat, though not needed
        }
      }
    } catch (dbErr) {
      console.error('DB session lookup error:', dbErr);
    }

    if (currentActiveId && decoded.sessionId !== currentActiveId) {
      const error = new Error('Session Invalidated: Another login session was detected on another device or tab.');
      error.statusCode = 401;
      error.isSessionOverride = true;
      throw error;
    }
  }

  return decoded;
}

module.exports = { verifyAuth, DEFAULT_JWT_SECRET };
