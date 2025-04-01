
// Order management routes
import express from 'express';
import { db } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all orders
router.get('/', (req, res) => {
  try {
    const orders = db.prepare(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY timestamp DESC'
    ).all('user1');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Place a new order
router.post('/place', (req, res) => {
  try {
    const { symbol, side, type, quantity, price } = req.body;
    
    if (!symbol || !side || !type || !quantity) {
      return res.status(400).json({ error: 'Missing required order parameters' });
    }
    
    // Generate a unique order ID
    const orderId = uuidv4();
    
    // Calculate order value (for collateral validation)
    const orderValue = quantity * (price || 0);
    
    // For buy orders, validate against available balance
    if (side === 'buy') {
      const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
      const availableBalance = wallet.balance - wallet.collateral_locked;
      
      if (orderValue > availableBalance) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient funds for order',
          error: 'Your available balance is insufficient for this order'
        });
      }
    }

    // Create orders table if it doesn't exist
    db.prepare(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        symbol TEXT,
        type TEXT,
        side TEXT,
        quantity INTEGER,
        price REAL,
        status TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES wallets(user_id)
      )
    `).run();
    
    // Insert the order
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, user_id, symbol, type, side, quantity, price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertOrder.run(
      orderId,
      'user1',
      symbol,
      type,
      side,
      quantity,
      price || null,
      'open'
    );
    
    // Get the created order
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    
    res.json({
      success: true,
      message: `Order placed successfully`,
      order
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
});

// Cancel an order
router.post('/cancel', (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    // Get the order to check if it can be canceled
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        error: 'The specified order does not exist'
      });
    }
    
    if (order.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order',
        error: `Order is already in ${order.status} status`
      });
    }
    
    // Update the order status
    const updateOrder = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    updateOrder.run('canceled', orderId);
    
    // Get the updated order
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    
    res.json({
      success: true,
      message: 'Order canceled successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

export default router;
