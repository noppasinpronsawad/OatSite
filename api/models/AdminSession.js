const mongoose = require('mongoose');

const AdminSessionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'admin_active_session',
      unique: true
    },
    activeSessionId: {
      type: String,
      required: true
    },
    lastLoginAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.AdminSession || mongoose.model('AdminSession', AdminSessionSchema);
