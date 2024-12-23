const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  fileUrl: {
    type: String,
    required: true
  },
  driveUrl: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileSize: {
    type: Number
  },
  duration: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  }
});

// Add index for faster queries
videoSchema.index({ userId: 1, createdAt: -1 });

// Virtual populate to get user details
videoSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Method to check if a user owns this video
videoSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

module.exports = mongoose.model('Video', videoSchema);
