const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, thumbnail } = req.body;
    const course = await Course.create({
      title,
      description,
      category,
      price: price || 0,
      thumbnail,
      instructor: req.user._id
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.category = req.body.category || course.category;
    course.price = req.body.price !== undefined ? req.body.price : course.price;
    course.thumbnail = req.body.thumbnail || course.thumbnail;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
const addLessonToCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const newLesson = {
      title: req.body.title,
      type: req.body.type || 'video',
      videoUrl: req.body.videoUrl || '',
      content: req.body.content || '',
      duration: req.body.duration || 0,
      fileUrl: req.body.fileUrl || '',
      quizData: req.body.quizData || { questions: [], passingScore: 70 },
      labConfig: req.body.labConfig || { environment: '', instructions: '', resources: [] }
    };

    // SAFETY CHECK: Ensure lessons array exists before pushing
    if (!course.lessons) {
      course.lessons = [];
    }
    
    course.lessons.push(newLesson);
    await course.save();
    
    res.status(201).json(course);
  } catch (error) {
    console.error("ADD LESSON ERROR:", error); // This will print the exact error to your terminal!
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update lesson
// @route   PUT /api/courses/:courseId/lessons/:lessonId

const updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // Update fields
    lesson.title = req.body.title || lesson.title;
    lesson.module = req.body.module || lesson.module; // <-- THIS SAVES THE DAY!
    lesson.type = req.body.type || lesson.type;
    lesson.videoUrl = req.body.videoUrl || lesson.videoUrl;
    lesson.content = req.body.content || lesson.content;
    lesson.duration = req.body.duration !== undefined ? req.body.duration : lesson.duration;
    lesson.fileUrl = req.body.fileUrl || lesson.fileUrl;
    
    if (req.body.quizData) lesson.quizData = req.body.quizData;
    if (req.body.labConfig) lesson.labConfig = req.body.labConfig;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/courses/:id/lessons/:lessonId
const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id); // Changed from courseId to id
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Authorization check
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete lessons' });
    }

    // Filter out the lesson to delete
    course.lessons = course.lessons.filter(
      lesson => lesson._id.toString() !== req.params.lessonId
    );

    await course.save();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/courses/:courseId/lessons/:lessonId/quiz-submit
const submitQuiz = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const lesson = course.lessons.id(req.params.lessonId);
    
    if (!lesson || lesson.type !== 'quiz') {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const answers = req.body.answers; // Array of selected option indices
    let correct = 0;
    let total = lesson.quizData.questions.length;

    lesson.quizData.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / total) * 100);
    const passed = score >= lesson.quizData.passingScore;

    res.json({
      score,
      passed,
      correct,
      total,
      passingScore: lesson.quizData.passingScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLessonToCourse,
  updateLesson,
  deleteLesson,
  submitQuiz
};