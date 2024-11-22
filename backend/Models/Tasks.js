const mongoose = require('mongoose');
const { Schema } = mongoose;

const Tasks = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      default: 'open',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('tasks', Tasks);
