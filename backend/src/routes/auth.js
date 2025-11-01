const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

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

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db || req.db;

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    // Generate token
    const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET);

    res.status(201).json({
      token,
      user: {
        id: result.insertedId,
        email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db || req.db;

    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile || null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, dateOfBirth, healthConditions, allergies, dietaryPreferences, isProfileComplete } = req.body;
    const db = req.app.locals.db || req.db;

    const profileData = {
      name,
      phone,
      dateOfBirth,
      healthConditions: healthConditions || [],
      allergies: allergies || [],
      dietaryPreferences: dietaryPreferences || [],
      isProfileComplete: isProfileComplete || false,
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $set: { profile: profileData } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    res.json({
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        profile: updatedUser.profile
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;