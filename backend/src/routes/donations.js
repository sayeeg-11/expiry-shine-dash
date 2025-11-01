const express = require('express');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

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

// Get all available donations
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db || req.db;
    
    const donations = await db.collection('donations').aggregate([
      { $match: { isAvailable: true } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    res.json(donations.map(donation => ({
      id: donation._id,
      product: {
        id: donation.product._id,
        name: donation.product.name,
        category: donation.product.category,
        expiryDate: donation.product.expiryDate,
        status: donation.product.status,
        imageUrl: donation.product.imageUrl,
        addedDate: donation.product.addedDate,
        daysUntilExpiry: donation.product.daysUntilExpiry
      },
      donatedBy: donation.donatedBy,
      location: donation.location,
      contactInfo: donation.contactInfo,
      isAvailable: donation.isAvailable
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new donation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, donatedBy, location, contactInfo } = req.body;
    const db = req.app.locals.db || req.db;

    // Verify product exists and belongs to user
    const product = await db.collection('products').findOne({
      _id: new ObjectId(productId),
      userId: new ObjectId(req.user.userId)
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const donation = {
      productId: new ObjectId(productId),
      donatedBy,
      location,
      contactInfo,
      isAvailable: true,
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('donations').insertOne(donation);

    res.status(201).json({
      id: result.insertedId,
      product: {
        id: product._id,
        name: product.name,
        category: product.category,
        expiryDate: product.expiryDate,
        status: product.status,
        imageUrl: product.imageUrl,
        addedDate: product.addedDate,
        daysUntilExpiry: product.daysUntilExpiry
      },
      donatedBy,
      location,
      contactInfo,
      isAvailable: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update donation availability
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;
    const db = req.app.locals.db || req.db;

    const result = await db.collection('donations').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isAvailable } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.json({ message: 'Donation updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;