const express = require('express');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const sentimentService = require('../services/sentimentService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Optional auth for app feedback (allow anonymous)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
};

// Submit feedback for a product or app
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { productId, feedbackText, brand, feedbackType = 'product' } = req.body;

    if (!feedbackText) {
      return res.status(400).json({ error: 'Feedback text is required' });
    }

    if (feedbackType === 'product' && (!productId || !brand)) {
      return res.status(400).json({ error: 'Product ID and brand are required for product feedback' });
    }

    const db = req.app.locals.db || req.db;

    // Analyze sentiment
    const sentimentAnalysis = sentimentService.analyzeSentiment(feedbackText);

    const feedback = {
      feedbackType, // 'product' or 'app'
      feedbackText,
      sentimentScore: sentimentAnalysis.score,
      sentimentLabel: sentimentAnalysis.label,
      submittedAt: new Date().toISOString()
    };

    // Add user-specific fields if authenticated
    if (req.user) {
      feedback.userId = new ObjectId(req.user.userId);
    }

    // Add product-specific fields for product feedback
    if (feedbackType === 'product') {
      feedback.productId = new ObjectId(productId);
      feedback.brand = brand.toLowerCase().trim();
    }

    const result = await db.collection('feedbacks').insertOne(feedback);

    res.status(201).json({
      id: result.insertedId,
      ...feedback,
      sentimentAnalysis
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get feedback for user's products and app feedback
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db || req.db;

    // Get user's products first to filter product feedback
    const userProducts = await db.collection('products')
      .find({ userId: new ObjectId(req.user.userId) })
      .project({ _id: 1 })
      .toArray();

    const productIds = userProducts.map(p => p._id);

    // Get both product and app feedback for the user
    const feedbacks = await db.collection('feedbacks')
      .find({
        $or: [
          { productId: { $in: productIds } },
          { userId: new ObjectId(req.user.userId) }
        ]
      })
      .sort({ submittedAt: -1 })
      .toArray();

    res.json(feedbacks.map(feedback => ({
      id: feedback._id,
      feedbackType: feedback.feedbackType || 'product',
      productId: feedback.productId,
      brand: feedback.brand,
      feedbackText: feedback.feedbackText,
      sentimentScore: feedback.sentimentScore,
      sentimentLabel: feedback.sentimentLabel,
      submittedAt: feedback.submittedAt
    })));
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get app feedback (public endpoint)
router.get('/app', async (req, res) => {
  try {
    const db = req.app.locals.db || req.db;

    const feedbacks = await db.collection('feedbacks')
      .find({ feedbackType: 'app' })
      .sort({ submittedAt: -1 })
      .limit(50)
      .toArray();

    res.json(feedbacks.map(feedback => ({
      id: feedback._id,
      feedbackText: feedback.feedbackText,
      sentimentScore: feedback.sentimentScore,
      sentimentLabel: feedback.sentimentLabel,
      submittedAt: feedback.submittedAt
    })));
  } catch (error) {
    console.error('Error fetching app feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get brand sentiment trends (aggregated data)
router.get('/trends', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db || req.db;

    // Get all feedbacks grouped by brand
    const feedbacks = await db.collection('feedbacks')
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();

    // Group by brand and aggregate sentiment
    const brandTrends = {};

    feedbacks.forEach(feedback => {
      const brand = feedback.brand;
      if (!brandTrends[brand]) {
        brandTrends[brand] = [];
      }
      brandTrends[brand].push({
        sentimentScore: feedback.sentimentScore,
        sentimentLabel: feedback.sentimentLabel,
        submittedAt: feedback.submittedAt
      });
    });

    // Calculate aggregated sentiment for each brand
    const trends = Object.keys(brandTrends).map(brand => {
      const brandFeedbacks = brandTrends[brand];
      const aggregated = sentimentService.aggregateBrandSentiment(brandFeedbacks);

      return {
        brand,
        ...aggregated,
        recentFeedbacks: brandFeedbacks.slice(0, 5) // Last 5 feedbacks
      };
    });

    // Sort by negative percentage (most negative first)
    trends.sort((a, b) => b.negativePercentage - a.negativePercentage);

    res.json(trends);
  } catch (error) {
    console.error('Error fetching brand trends:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get feedback for a specific brand
router.get('/brand/:brand', authenticateToken, async (req, res) => {
  try {
    const { brand } = req.params;
    const db = req.app.locals.db || req.db;

    const feedbacks = await db.collection('feedbacks')
      .find({ brand: brand.toLowerCase().trim() })
      .sort({ submittedAt: -1 })
      .limit(50) // Limit to prevent too much data
      .toArray();

    const aggregated = sentimentService.aggregateBrandSentiment(feedbacks);

    res.json({
      brand,
      feedbacks: feedbacks.map(f => ({
        id: f._id,
        feedbackText: f.feedbackText,
        sentimentScore: f.sentimentScore,
        sentimentLabel: f.sentimentLabel,
        submittedAt: f.submittedAt
      })),
      aggregated
    });
  } catch (error) {
    console.error('Error fetching brand feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
