const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const Discussion = require('../models/Discussion');

let aiClient = null;

// Use Groq (free) or OpenAI
if (process.env.GROQ_API_KEY) {
    try {
        const OpenAI = require('openai');
        aiClient = new OpenAI({ 
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1"
        });
        console.log("✅ Groq AI Connected (Free!)");
    } catch (error) {
        console.error("❌ AI Error:", error.message);
    }
}

router.post('/', protect, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        // Fetch real data from your database
        const courses = await Course.find().select('title category description price').limit(10);
        const courseCount = await Course.countDocuments();
        const discussionCount = await Discussion.countDocuments();

        // Build a smart system prompt with REAL data
        const systemPrompt = `You are Learnova AI Assistant, a helpful chatbot for an online learning platform.

PLATFORM INFO:
- Total courses available: ${courseCount}
- Active discussions: ${discussionCount}

AVAILABLE COURSES:
${courses.map(c => `- ${c.title} (${c.category}) - $${c.price}`).join('\n')}

FEATURES:
- Students can enroll in courses for free or paid
- Resources include: PPTs, Videos, Ebooks, Notes
- Discussion forums for each course
- Certificates upon completion
- Progress tracking

HOW TO USE:
- Catalog page: Browse all courses
- My Learning: View enrolled courses
- Resources: Download PPTs, videos, PDFs
- Discussion Forum: Ask questions per course

Be friendly, concise, and use emojis. If asked about specific courses, mention the ones listed above.`;

        if (!aiClient) {
            // Fallback without AI
            return res.json({ 
                success: true, 
                response: `Hi! We have ${courseCount} courses available. How can I help you?` 
            });
        }

        const completion = await aiClient.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        res.json({ 
            success: true, 
            response: completion.choices[0].message.content 
        });

    } catch (error) {
        console.error('Chat Error:', error);
        
        // Smart fallback
        const fallback = "I'm having trouble right now, but I can tell you we have lots of courses! Try checking the Catalog page. 📚";
        res.json({ success: true, response: fallback });
    }
});

module.exports = router;