const mongoose = require('mongoose');

const ToeicQuestionSchema = new mongoose.Schema(
  {
    question_id: {
      type: String,
      required: true,
      unique: true
    },
    part: {
      type: Number,
      enum: [5, 6, 7],
      required: true
    },
    passage_id: {
      type: String,
      default: null
    },
    passage_title: {
      type: String,
      default: ''
    },
    passage_content: {
      type: String,
      default: '' // HTML / Markdown formatted text, email, memo, notice, etc.
    },
    question_text: {
      type: String,
      required: true
    },
    choices: {
      A: { type: String, required: true },
      B: { type: String, required: true },
      C: { type: String, required: true },
      D: { type: String, required: true }
    },
    correct_answer: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true
    },
    detailed_explanation: {
      correct_reason: { type: String, required: true },
      incorrect_reasons: { type: String, default: '' }
    },
    tags: {
      type: [String],
      default: ['General']
    },
    cefr_level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
      default: 'B1'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.ToeicQuestion || mongoose.model('ToeicQuestion', ToeicQuestionSchema);
