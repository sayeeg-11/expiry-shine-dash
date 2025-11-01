const express = require('express');
const { getChatResponse } = require('../services/chatService');

const router = express.Router();

// POST /api/chat - Get AI response for product expiry questions
router.post('/', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Question is required and must be a non-empty string'
      });
    }

    const result = await getChatResponse(question.trim());

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process chat request'
    });
  }
});

module.exports = router;
