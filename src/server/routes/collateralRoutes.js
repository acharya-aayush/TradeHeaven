
// Collateral management routes
import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

// Lock collateral for an order
router.post('/lock', (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get current wallet state
    const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
    
    // Calculate available balance
    const availableBalance = wallet.balance - wallet.collateral_locked;
    
    if (amount > availableBalance) {
      return res.status(400).json({ 
        error: 'Insufficient funds for collateral', 
        availableBalance 
      });
    }

    // Update wallet collateral
    const updateWallet = db.prepare('UPDATE wallets SET collateral_locked = collateral_locked + ? WHERE user_id = ?');
    updateWallet.run(amount, 'user1');

    // Log transaction
    const logTransaction = db.prepare(
      'INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)'
    );
    logTransaction.run('user1', 'collateral_lock', amount, `Collateral locked for order ${orderId || 'unknown'}`);

    // Get updated wallet
    const updatedWallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
    
    res.json({ 
      success: true, 
      message: `Successfully locked $${amount.toFixed(2)} as collateral`, 
      wallet: updatedWallet
    });
  } catch (error) {
    console.error('Error locking collateral:', error);
    res.status(500).json({ error: 'Failed to lock collateral' });
  }
});

// Release collateral
router.post('/release', (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get current wallet state
    const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
    
    if (amount > wallet.collateral_locked) {
      return res.status(400).json({ 
        error: 'Amount exceeds locked collateral', 
        lockedCollateral: wallet.collateral_locked 
      });
    }

    // Update wallet collateral
    const updateWallet = db.prepare('UPDATE wallets SET collateral_locked = collateral_locked - ? WHERE user_id = ?');
    updateWallet.run(amount, 'user1');

    // Log transaction
    const logTransaction = db.prepare(
      'INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)'
    );
    logTransaction.run('user1', 'collateral_release', -amount, `Collateral released from order ${orderId || 'unknown'}`);

    // Get updated wallet
    const updatedWallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
    
    res.json({ 
      success: true, 
      message: `Successfully released $${amount.toFixed(2)} from collateral`, 
      wallet: updatedWallet
    });
  } catch (error) {
    console.error('Error releasing collateral:', error);
    res.status(500).json({ error: 'Failed to release collateral' });
  }
});

export default router;
