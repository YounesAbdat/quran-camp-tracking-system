import express from 'express';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working!' });
});

// Login route (placeholder)
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - needs implementation' });
});

export default router;
