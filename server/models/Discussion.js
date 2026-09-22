const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  replies: [
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      content: { 
        type: String, 
        required: true 
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      }
    }
  ],
  upvotes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);