
// Transaction routes
import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

// Get transaction history
router.get('/', (req, res) => {
  try {
    const transactions = db.prepare(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50'
    ).all('user1');
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
});

export default router;
