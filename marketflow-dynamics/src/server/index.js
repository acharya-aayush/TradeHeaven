// Simple Express server with SQLite for wallet management
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  // Create portfolio table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS portfolio (
      portfolio_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      symbol TEXT,
      quantity REAL DEFAULT 0,
      average_price REAL DEFAULT 0,
      total_investment REAL DEFAULT 0,
      last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES wallets(user_id),
      UNIQUE(user_id, symbol)
    )
  `).run();

  // Create orders table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      user_id TEXT,
      symbol TEXT,
      type TEXT CHECK(type IN ('buy', 'sell')),
      side TEXT CHECK(side IN ('market', 'limit')),
      quantity REAL,
      price REAL,
      status TEXT CHECK(status IN ('pending', 'executed', 'cancelled', 'rejected')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      executed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES wallets(user_id)
    )
  `).run();

  // Create order history table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS order_history (
      history_id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      user_id TEXT,
      symbol TEXT,
      type TEXT,
      quantity REAL,
      price REAL,
      executed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(order_id),
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

// Order Execution and Matching Logic
const executeOrder = async (order) => {
  const { order_id, user_id, symbol, type, quantity, price } = order;
  
  try {
    // Start transaction
    db.prepare('BEGIN TRANSACTION').run();

    if (type === 'buy') {
      // For buy orders, update wallet and portfolio
      const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(user_id);
      const total_cost = quantity * price;
      
      // Update wallet balance and release collateral
      db.prepare(`
        UPDATE wallets 
        SET balance = balance - ?, 
            collateral_locked = collateral_locked - ?
        WHERE user_id = ?
      `).run(total_cost, total_cost, user_id);

      // Update portfolio
      updatePortfolio(user_id, symbol, quantity, price, 'buy');

      // Record transaction
      db.prepare(`
        INSERT INTO transactions (user_id, type, amount, description)
        VALUES (?, 'buy', ?, ?)
      `).run(user_id, -total_cost, `Buy order executed: ${quantity} ${symbol} @ ${price}`);
    } else if (type === 'sell') {
      // For sell orders, update portfolio and wallet
      const portfolio = db.prepare('SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?').get(user_id, symbol);
      const total_proceeds = quantity * price;
      
      // Update portfolio
      updatePortfolio(user_id, symbol, quantity, price, 'sell');

      // Update wallet balance
      db.prepare(`
        UPDATE wallets 
        SET balance = balance + ?
        WHERE user_id = ?
      `).run(total_proceeds, user_id);

      // Record transaction
      db.prepare(`
        INSERT INTO transactions (user_id, type, amount, description)
        VALUES (?, 'sell', ?, ?)
      `).run(user_id, total_proceeds, `Sell order executed: ${quantity} ${symbol} @ ${price}`);
    }

    // Update order status
    db.prepare(`
      UPDATE orders 
      SET status = 'executed', 
          executed_at = CURRENT_TIMESTAMP
      WHERE order_id = ?
    `).run(order_id);

    // Record in order history
    db.prepare(`
      INSERT INTO order_history (order_id, user_id, symbol, type, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(order_id, user_id, symbol, type, quantity, price);

    // Commit transaction
    db.prepare('COMMIT').run();
    return true;
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run();
    console.error('Order execution error:', error);
    return false;
  }
};

// Order matching function
const matchOrders = async () => {
  try {
    // Get pending orders
    const pendingOrders = db.prepare(`
      SELECT * FROM orders 
      WHERE status = 'pending' 
      ORDER BY created_at ASC
    `).all();

    for (const order of pendingOrders) {
      if (order.side === 'market') {
        // Execute market orders immediately
        await executeOrder(order);
      } else if (order.side === 'limit') {
        // For limit orders, find matching orders
        const matchingOrders = db.prepare(`
          SELECT * FROM orders 
          WHERE status = 'pending' 
          AND symbol = ? 
          AND type = ? 
          AND side = 'limit'
          AND price <= ?
          ORDER BY created_at ASC
        `).all(order.symbol, order.type === 'buy' ? 'sell' : 'buy', order.price);

        if (matchingOrders.length > 0) {
          // Execute with the best matching order
          await executeOrder(order);
          await executeOrder(matchingOrders[0]);
        }
      }
    }
  } catch (error) {
    console.error('Order matching error:', error);
  }
};

// Start order matching process
setInterval(matchOrders, 5000); // Check for matches every 5 seconds

// Update the order creation endpoint to trigger matching
app.post('/api/orders', async (req, res) => {
  const { user_id, symbol, type, side, quantity, price } = req.body;
  
  try {
    // Validate user has sufficient funds/collateral
    const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(user_id);
    if (!wallet) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order_id = `ORD-${Date.now()}`;
    const required_amount = quantity * price;

    if (type === 'buy') {
      if (wallet.balance < required_amount) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }
      // Lock funds as collateral
      db.prepare('UPDATE wallets SET balance = balance - ?, collateral_locked = collateral_locked + ? WHERE user_id = ?')
        .run(required_amount, required_amount, user_id);
    } else if (type === 'sell') {
      // Check if user has sufficient quantity in portfolio
      const portfolio = db.prepare('SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?').get(user_id, symbol);
      if (!portfolio || portfolio.quantity < quantity) {
        return res.status(400).json({ error: 'Insufficient quantity in portfolio' });
      }
    }

    // Create order
    db.prepare(`
      INSERT INTO orders (order_id, user_id, symbol, type, side, quantity, price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(order_id, user_id, symbol, type, side, quantity, price);

    // Trigger order matching
    await matchOrders();

    res.json({ order_id, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's orders
app.get('/api/orders/:user_id', (req, res) => {
  const { user_id } = req.params;
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(user_id);
  res.json(orders);
});

// Cancel order
app.post('/api/orders/:order_id/cancel', (req, res) => {
  const { order_id } = req.params;
  const order = db.prepare('SELECT * FROM orders WHERE order_id = ?').get(order_id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status !== 'pending') {
    return res.status(400).json({ error: 'Order cannot be cancelled' });
  }

  // Release collateral if it was a buy order
  if (order.type === 'buy') {
    const required_amount = order.quantity * order.price;
    db.prepare('UPDATE wallets SET balance = balance + ?, collateral_locked = collateral_locked - ? WHERE user_id = ?')
      .run(required_amount, required_amount, order.user_id);
  }

  db.prepare('UPDATE orders SET status = ? WHERE order_id = ?').run('cancelled', order_id);
  res.json({ message: 'Order cancelled successfully' });
});

// Portfolio Management Endpoints
app.get('/api/portfolio/:user_id', (req, res) => {
  const { user_id } = req.params;
  const portfolio = db.prepare('SELECT * FROM portfolio WHERE user_id = ?').all(user_id);
  res.json(portfolio);
});

// Update portfolio after order execution
const updatePortfolio = (user_id, symbol, quantity, price, type) => {
  const portfolio = db.prepare('SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?').get(user_id, symbol);
  
  if (type === 'buy') {
    if (portfolio) {
      // Update existing position
      const new_quantity = portfolio.quantity + quantity;
      const new_total = portfolio.total_investment + (quantity * price);
      const new_avg_price = new_total / new_quantity;
      
      db.prepare(`
        UPDATE portfolio 
        SET quantity = ?, average_price = ?, total_investment = ?, last_updated = CURRENT_TIMESTAMP
        WHERE user_id = ? AND symbol = ?
      `).run(new_quantity, new_avg_price, new_total, user_id, symbol);
    } else {
      // Create new position
      db.prepare(`
        INSERT INTO portfolio (user_id, symbol, quantity, average_price, total_investment)
        VALUES (?, ?, ?, ?, ?)
      `).run(user_id, symbol, quantity, price, quantity * price);
    }
  } else if (type === 'sell') {
    if (portfolio && portfolio.quantity >= quantity) {
      const new_quantity = portfolio.quantity - quantity;
      if (new_quantity === 0) {
        db.prepare('DELETE FROM portfolio WHERE user_id = ? AND symbol = ?').run(user_id, symbol);
      } else {
        db.prepare(`
          UPDATE portfolio 
          SET quantity = ?, total_investment = total_investment - (quantity * average_price), last_updated = CURRENT_TIMESTAMP
          WHERE user_id = ? AND symbol = ?
        `).run(new_quantity, user_id, symbol);
      }
    }
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Wallet API server running on port ${PORT}`);
});
