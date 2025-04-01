
// Wallet routes
import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

// Get wallet balance
router.get('/', (req, res) => {
  try {
    const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ error: 'Failed to fetch wallet information' });
  }
});

// Load funds to wallet
router.post('/load', (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Update wallet balance
    const updateWallet = db.prepare('UPDATE wallets SET balance = balance + ? WHERE user_id = ?');
    updateWallet.run(amount, 'user1');

    // Log transaction
    const logTransaction = db.prepare(
      'INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)'
    );
    logTransaction.run('user1', 'load', amount, 'Funds loaded to wallet');

    // Get updated wallet
    const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
    
    res.json({ 
      success: true, 
      message: `Successfully loaded $${amount.toFixed(2)}`, 
      wallet
    });
  } catch (error) {
    console.error('Error loading funds:', error);
    res.status(500).json({ error: 'Failed to load funds' });
  }
});

// Withdraw funds
router.post('/withdraw', (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get current wallet state
    const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
    
    // Calculate available balance
    const availableBalance = wallet.balance - wallet.collateral_locked;
    
    if (amount > availableBalance) {
      return res.status(400).json({ 
        error: 'Insufficient funds', 
        availableBalance 
      });
    }

    // Update wallet balance
    const updateWallet = db.prepare('UPDATE wallets SET balance = balance - ? WHERE user_id = ?');
    updateWallet.run(amount, 'user1');

    // Log transaction
    const logTransaction = db.prepare(
      'INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)'
    );
    logTransaction.run('user1', 'withdraw', -amount, 'Funds withdrawn from wallet');

    // Get updated wallet
    const updatedWallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
    
    res.json({ 
      success: true, 
      message: `Successfully withdrew $${amount.toFixed(2)}`, 
      wallet: updatedWallet
    });
  } catch (error) {
    console.error('Error withdrawing funds:', error);
    res.status(500).json({ error: 'Failed to withdraw funds' });
  }
});

export default router;
