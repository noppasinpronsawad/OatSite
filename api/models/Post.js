const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Daily Life', 'Science', 'Technology', 'Finance'],
      trim: true
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    image: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${months[now.getMonth()]} ${now.getFullYear()}`;
      }
    },
    readTime: {
      type: String,
      default: '5 min read'
    },
    publishAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
