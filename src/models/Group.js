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

<<<<<<< HEAD
const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
=======
module.exports = mongoose.model('Group', GroupSchema);

>>>>>>> 81484a76e55cfdc217284d20dd005a8025c068bf
