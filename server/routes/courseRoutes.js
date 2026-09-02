const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  addLessonToCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateLesson,
  deleteLesson,
  submitQuiz
} = require('../controllers/courseController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, instructorOnly, createCourse);
router.put('/:id', protect, instructorOnly, updateCourse);
router.delete('/:id', protect, instructorOnly, deleteCourse);
router.post('/:id/lessons', protect, instructorOnly, addLessonToCourse);
router.put('/:id/lessons/:lessonId', protect, instructorOnly, updateLesson);
router.delete('/:id/lessons/:lessonId', protect, instructorOnly, deleteLesson);
router.post('/:id/lessons/:lessonId/quiz-submit', protect, submitQuiz);

module.exports = router;