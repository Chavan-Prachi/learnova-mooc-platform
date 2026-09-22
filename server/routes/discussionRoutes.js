const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const { protect } = require('../middleware/authMiddleware'); // ✅ Change this

// Get all discussions for a course
router.get('/:courseId', async (req, res) => {
  try {
    const discussions = await Discussion.find({ course: req.params.courseId })
      .populate('user', 'name email profilePicture')
      .populate('replies.user', 'name email profilePicture')
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new discussion thread
router.post('/:courseId', protect, async (req, res) => { // ✅ Uses protect
  try {
    const { title, content } = req.body;
    const discussion = new Discussion({
      course: req.params.courseId,
      user: req.user._id,
      title,
      content
    });
    await discussion.save();
    await discussion.populate('user', 'name email profilePicture');
    res.status(201).json(discussion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a reply to a thread
router.post('/:courseId/:discussionId/reply', protect, async (req, res) => { // ✅ Uses protect
  try {
    const { content } = req.body;
    const discussion = await Discussion.findById(req.params.discussionId);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    discussion.replies.push({
      user: req.user._id,
      content
    });
    
    await discussion.save();
    await discussion.populate('replies.user', 'name email profilePicture');
    
    res.json(discussion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Upvote a discussion
router.post('/:discussionId/upvote', protect, async (req, res) => { // ✅ Uses protect
  try {
    const discussion = await Discussion.findById(req.params.discussionId);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const alreadyUpvoted = discussion.upvotes.includes(req.user._id);
    
    if (alreadyUpvoted) {
      discussion.upvotes.pull(req.user._id);
    } else {
      discussion.upvotes.push(req.user._id);
    }
    
    await discussion.save();
    res.json({ upvotes: discussion.upvotes.length, upvoted: !alreadyUpvoted });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;