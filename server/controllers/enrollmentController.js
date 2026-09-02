const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll a student in a course
// @route   POST /api/enrollments/:courseId
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: course._id
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Create new enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: course._id
    });

    res.status(201).json({ message: 'Successfully enrolled in course', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all courses a student is enrolled in
// @route   GET /api/enrollments/my-courses
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course')
      .sort({ createdAt: -1 });
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check if user is enrolled in a specific course
// @route   GET /api/enrollments/check/:courseId
const checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled' });
    }
    
    res.json({ message: 'Enrolled', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment
};