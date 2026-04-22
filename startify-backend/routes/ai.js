const express = require("express");
const router = express.Router();
const axios = require("axios");
const Chat = require("../models/Chat");


// Ask AI
router.post("/ask", async (req, res) => {

  try {

    const { prompt, userId } = req.body;

    // Save user message
    await Chat.create({
      userId,
      role: "user",
      content: prompt
    });

    const aiPrompt = `Answer in EXACTLY 5 bullet points using markdown list format (-). Keep answers short.

Question: ${prompt}`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        max_tokens: 150,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: aiPrompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Startify Connect"
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // Save AI reply
    await Chat.create({
      userId,
      role: "ai",
      content: aiReply
    });

    res.json({ content: aiReply });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "AI request failed"
    });

  }

});


// Load chat history
router.get("/history/:userId", async (req, res) => {

  try {

    const chats = await Chat.find({
      userId: req.params.userId
    }).sort({ createdAt: 1 });

    res.json(chats);

  } catch (error) {

    res.status(500).json({
      error: "Failed to load chat history"
    });

  }

});

module.exports = router;