// server/models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Number, default: 0 }, // Percentage 0 to 100
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }], // Array of lesson IDs
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure a student can only enroll in a specific course once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);