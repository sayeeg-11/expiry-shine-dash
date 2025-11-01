const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Domain-specific prompt templates
const PROMPT_TEMPLATES = {
  food: `You are a food safety expert. Answer questions about consuming expired food products.
Guidelines:
- Be cautious and prioritize safety
- Explain risks clearly
- Suggest alternatives when appropriate
- Base answers on general food safety knowledge
- Always recommend checking for signs of spoilage (smell, appearance, texture)

Question: {question}
Answer as a helpful food safety advisor:`,

  cosmetic: `You are a cosmetic safety expert. Answer questions about using expired cosmetic products.
Guidelines:
- Explain potential risks to skin and health
- Discuss efficacy and safety concerns
- Be conservative about recommending use
- Suggest checking product condition
- Advise consulting professionals for sensitive skin

Question: {question}
Answer as a knowledgeable cosmetic safety advisor:`,

  general: `You are a product safety expert. Answer questions about expired products.
Guidelines:
- Provide balanced, evidence-based information
- Explain potential risks and benefits
- Recommend erring on the side of caution
- Suggest checking product-specific guidelines
- Advise professional consultation when appropriate

Question: {question}
Answer as a product safety expert:`
};

// Function to categorize the question
function categorizeQuestion(question) {
  const lowerQuestion = question.toLowerCase();

  // Food-related keywords
  const foodKeywords = ['eat', 'drink', 'consume', 'food', 'yogurt', 'milk', 'bread', 'meat', 'cheese', 'fruit', 'vegetable', 'meal', 'cook', 'bake'];
  if (foodKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    return 'food';
  }

  // Cosmetic-related keywords
  const cosmeticKeywords = ['shampoo', 'conditioner', 'lotion', 'cream', 'cosmetic', 'makeup', 'skincare', 'hair', 'skin', 'face', 'body', 'bath', 'soap'];
  if (cosmeticKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    return 'cosmetic';
  }

  return 'general';
}

async function getChatResponse(question) {
  try {
    const category = categorizeQuestion(question);
    const prompt = PROMPT_TEMPLATES[category].replace('{question}', question);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: question
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return {
      response: completion.choices[0].message.content.trim(),
      category: category,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to get response from AI service');
  }
}

module.exports = {
  getChatResponse,
  categorizeQuestion
};
