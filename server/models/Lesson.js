const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
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
  fileUrl: String, // For PDFs, PPTs, etc.
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
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);