const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Category',
    // },
    image: {
      type: String,
    },
    publishedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
