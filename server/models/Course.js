const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    default: 0 
  },
  thumbnail: { 
    type: String 
  },
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Your lessons schema - PERFECT! ✅
  lessons: [{
    module: { 
      type: String, 
      default: "Day 1" 
    },
    title: String,
    type: { 
      type: String, 
      enum: ['video', 'ebook', 'quiz', 'lab', 'notes', 'ppt'], 
      default: 'video' 
    },
    videoUrl: String,
    content: String,
    duration: { 
      type: Number, 
      default: 0 
    },
    fileUrl: String,
    quizData: {
      questions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        points: { type: Number, default: 1 }
      }],
      passingScore: { type: Number, default: 70 }
    },
    labConfig: {
      environment: String,
      instructions: String,
      resources: [String]
    }
  }]
}, { 
  timestamps: true // This adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Course', courseSchema);