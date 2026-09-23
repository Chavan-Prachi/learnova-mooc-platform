const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Course = require('../models/Course');

let aiClient = null;

// Initialize Groq (Free)
if (process.env.GROQ_API_KEY) {
    try {
        const OpenAI = require('openai');
        aiClient = new OpenAI({ 
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1"
        });
        console.log("✅ Groq AI Connected (Free!)");
    } catch (error) {
        console.error("❌ AI Initialization Error:", error.message);
    }
} else {
    console.warn("⚠️ GROQ_API_KEY missing!");
}

router.post('/', async (req, res) => {
    console.log(" Chat request received:", req.body.message); // Force log
    
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        if (!aiClient) {
            return res.json({ success: true, response: "AI is not connected. Please check GROQ_API_KEY." });
        }

        // Fetch some real data to make the AI smart
        const courseCount = await Course.countDocuments();

        const completion = await aiClient.chat.completions.create({
            model: 'llama-3.3-70b-versatile', // ✅ Use this stable model
            messages: [
                { 
                    role: 'system', 
                    content: `You are Learnova AI. We have ${courseCount} courses. Be helpful and friendly.` 
                },
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
        console.error('❌ CHAT ERROR CAUGHT:', error.message);
        
        // 🔍 DEBUG MODE: Send the actual error to the frontend so we can see it!
        return res.json({ 
            success: true, 
            response: `DEBUG ERROR: ${error.message}` 
        });
    }
});

module.exports = router;