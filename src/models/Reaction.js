const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reactionType: {
      type: String,
      enum: ['Like', 'Dislike'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reaction', ReactionSchema);
