const express = require('express');
const router = express.Router();
// ✅ FIX: Destructure 'protect' from the middleware object
const { protect } = require('../middleware/authMiddleware'); 

// 1. Safely initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-api-key-here') {
    try {
        const OpenAI = require('openai');
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        console.log("✅ OpenAI API Connected Successfully");
    } catch (error) {
        console.error("❌ OpenAI Initialization Error:", error.message);
    }
} else {
    console.warn("⚠️ OPENAI_API_KEY is missing or invalid in .env. Using fallback responses.");
}

// 2. Fallback responses if API fails
const FALLBACK_RESPONSES = {
    "hey": "Hey there! 👋 How can I help you with your courses today?",
    "hi": "Hi!  Welcome to Learnova. What can I do for you?",
    "hello": "Hello! 🎓 Ready to learn something new?",
    "help": "I can help you with: \n1. Downloading resources\n2. Finding certificates\n3. Course enrollment\nWhat do you need?",
    "default": "I'm having a little trouble connecting to my brain right now 🧠. Please try again in a moment, or email support@learnova.com!"
};

// ✅ FIX: Use 'protect' instead of 'authMiddleware'
router.post('/', protect, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        // If OpenAI is not connected, use fallback
        if (!openai) {
            const lowerMsg = message.toLowerCase();
            let reply = FALLBACK_RESPONSES["default"];
            
            if (lowerMsg.includes("hey") || lowerMsg.includes("hi") || lowerMsg.includes("hello")) {
                reply = FALLBACK_RESPONSES["hey"];
            } else if (lowerMsg.includes("help")) {
                reply = FALLBACK_RESPONSES["help"];
            }

            // Simulate typing delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.json({ success: true, response: reply });
        }

        // 3. Real OpenAI Call
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are Learnova Assistant, a helpful AI for an online learning platform. Be concise and friendly.' },
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
        res.status(500).json({ 
            success: false,
            response: "Sorry, I'm having trouble connecting right now. Please try again! " 
        });
    }
});

module.exports = router;