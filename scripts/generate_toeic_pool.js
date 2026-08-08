/**
 * TOEIC 10,000 Questions Generator (Powered by Google Gemini API)
 * Batch generates Part 5, Part 6, Part 7 questions with Thai explanations into MongoDB Atlas.
 * Usage: node scripts/generate_toeic_pool.js
 */

const https = require('https');
const mongoose = require('mongoose');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

if (!GEMINI_API_KEY) {
  console.log('💡 Note: GEMINI_API_KEY environment variable is not set yet.');
  console.log('To run batch generation, set GEMINI_API_KEY in your Vercel Environment Variables.');
}

console.log('=== TOEIC 10,000 Questions AI Data Generator Initialized ===');
