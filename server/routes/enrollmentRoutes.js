const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  enrollInCourse, 
  getMyEnrollments, 
  checkEnrollment 
} = require('../controllers/enrollmentController');

// Enroll in a course
router.post('/:courseId', protect, enrollInCourse);

// Get all courses the current user is enrolled in
router.get('/my-courses', protect, getMyEnrollments);

// Check if the current user is enrolled in a specific course
router.get('/check/:courseId', protect, checkEnrollment);

module.exports = router;