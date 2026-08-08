const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyAuth(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Unauthorized: Missing or invalid Authorization header');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'oatsite_jwt_secret_key_2026';

  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (err) {
    const error = new Error('Unauthorized: Token missing or expired');
    error.statusCode = 401;
    throw error;
  }
}

module.exports = { verifyAuth };
