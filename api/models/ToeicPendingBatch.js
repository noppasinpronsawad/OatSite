const mongoose = require('mongoose');

const ToeicPendingBatchSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.ToeicPendingBatch || mongoose.model('ToeicPendingBatch', ToeicPendingBatchSchema);
