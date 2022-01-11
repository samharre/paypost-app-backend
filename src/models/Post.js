const database = require('../config/database');

const PostSchema = new database.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: database.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    required: true
  },
  idPostPlatform: {
    type: String,
    required: true
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  totalComments: {
    type: Number,
    default: 0
  },
  totalShares: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = database.model('Post', PostSchema);
module.exports = Post;