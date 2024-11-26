const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Group Schema
const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mentorIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model for mentors
      },
    ],
    studentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model for students
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
