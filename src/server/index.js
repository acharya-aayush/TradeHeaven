
// Simple Express server with SQLite for wallet management
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3001;

// Configure middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new Database('wallet.db', { verbose: console.log });

// Create tables if they don't exist
const initDb = () => {
  // Create wallets table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS wallets (
      user_id TEXT PRIMARY KEY,
      balance REAL DEFAULT 0,
      collateral_locked REAL DEFAULT 0
    )
  `).run();

  // Create transactions table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS transactions (
      transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      type TEXT,
      amount REAL,
      description TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES wallets(user_id)
    )
  `).run();

  // Check if default user exists, if not create one
  const user = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
  if (!user) {
    db.prepare('INSERT INTO wallets (user_id, balance, collateral_locked) VALUES (?, ?, ?)').run('user1', 10000, 0);
  }
};

// Initialize database
initDb();

// API Routes

// Get wallet balance
app.get('/wallet', (req, res) => {
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
app.post('/wallet/load', (req, res) => {
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
app.post('/wallet/withdraw', (req, res) => {
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

// Lock collateral for an order
app.post('/wallet/collateral/lock', (req, res) => {
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
app.post('/wallet/collateral/release', (req, res) => {
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

// Get transaction history
app.get('/transactions', (req, res) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`Wallet API server running on port ${PORT}`);
});
