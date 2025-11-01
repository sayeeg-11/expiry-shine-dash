const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data storage
let users = [];
let products = [];
let donations = [];

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  const user = { id: Date.now().toString(), email };
  users.push({ ...user, password });
  res.json({ token: 'mock-token', user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ token: 'mock-token', user: { id: user.id, email: user.email } });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// Products routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const product = {
    id: Date.now().toString(),
    ...req.body,
    addedDate: new Date().toISOString(),
    daysUntilExpiry: Math.ceil((new Date(req.body.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)),
    status: 'active'
  };
  products.push(product);
  res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ message: 'Product deleted' });
});

// Donations routes
app.get('/api/donations', (req, res) => {
  res.json(donations);
});

app.post('/api/donations', (req, res) => {
  const donation = {
    id: Date.now().toString(),
    ...req.body,
    isAvailable: true
  };
  donations.push(donation);
  res.json(donation);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server running' });
});

app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});