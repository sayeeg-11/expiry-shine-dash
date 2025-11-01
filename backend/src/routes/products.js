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

// Calculate product status and days until expiry
const calculateProductData = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let status = 'active';
  if (daysUntilExpiry < 0) status = 'expired';
  else if (daysUntilExpiry <= 7) status = 'soon-expiring';
  
  return { daysUntilExpiry, status };
};

// Get all products for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db || req.db;
    const products = await db.collection('products')
      .find({ userId: new ObjectId(req.user.userId) })
      .sort({ addedDate: -1 })
      .toArray();

    res.json(products.map(product => ({
      id: product._id,
      name: product.name,
      category: product.category,
      expiryDate: product.expiryDate,
      status: product.status,
      imageUrl: product.imageUrl,
      nutrients: product.nutrients,
      brand: product.brand,
      barcode: product.barcode,
      ingredients: product.ingredients,
      addedDate: product.addedDate,
      daysUntilExpiry: product.daysUntilExpiry
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new product
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, category, expiryDate, imageUrl, nutrients, brand, barcode, ingredients } = req.body;
    const db = req.app.locals.db || req.db;

    const { daysUntilExpiry, status } = calculateProductData(expiryDate);

    const product = {
      name,
      category,
      expiryDate,
      imageUrl,
      nutrients: nutrients || null,
      brand: brand || null,
      barcode: barcode || null,
      ingredients: ingredients || null,
      status,
      daysUntilExpiry,
      addedDate: new Date().toISOString(),
      userId: new ObjectId(req.user.userId)
    };

    const result = await db.collection('products').insertOne(product);

    res.status(201).json({
      id: result.insertedId,
      ...product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const db = req.app.locals.db || req.db;

    if (updates.expiryDate) {
      const { daysUntilExpiry, status } = calculateProductData(updates.expiryDate);
      updates.daysUntilExpiry = daysUntilExpiry;
      updates.status = status;
    }

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(req.user.userId) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = await db.collection('products').findOne({ _id: new ObjectId(id) });
    
    res.json({
      id: updatedProduct._id,
      name: updatedProduct.name,
      category: updatedProduct.category,
      expiryDate: updatedProduct.expiryDate,
      status: updatedProduct.status,
      imageUrl: updatedProduct.imageUrl,
      addedDate: updatedProduct.addedDate,
      daysUntilExpiry: updatedProduct.daysUntilExpiry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db || req.db;

    const result = await db.collection('products').deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.user.userId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;