// Order management routes
import express from 'express';
import { db } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';
import mockOrders from '../mockOrderData.js';

const router = express.Router();

// Get all orders
router.get('/', (req, res) => {
  try {
    console.log('Returning mock order data');
    return res.json(mockOrders);

    /* 
    // Original database query (commented out)
    const userId = 'user123'; // In a real app, this would come from authentication
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE user_id = ? 
      ORDER BY timestamp DESC
    `).all(userId);
    
    res.json(orders);
    */
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve orders',
      error: error.message 
    });
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

// Execute an order (buy or sell)
router.post('/execute', (req, res) => {
  try {
    const { orderId, executionPrice } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order ID is required' 
      });
    }
    
    // Begin transaction for atomic operations
    db.prepare('BEGIN TRANSACTION').run();
    
    try {
      // Get the order
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
      
      if (!order) {
        db.prepare('ROLLBACK').run();
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          error: 'The specified order does not exist'
        });
      }
      
      if (order.status !== 'open') {
        db.prepare('ROLLBACK').run();
        return res.status(400).json({
          success: false,
          message: 'Cannot execute order',
          error: `Order is already in ${order.status} status`
        });
      }
      
      const userId = order.user_id;
      const symbol = order.symbol;
      const quantity = Number(order.quantity);
      const side = order.side;
      
      // Use specified execution price or the order price
      const price = executionPrice || order.price;
      
      if (!price) {
        db.prepare('ROLLBACK').run();
        return res.status(400).json({
          success: false,
          message: 'Execution price required',
          error: 'An execution price is required for this order'
        });
      }
      
      const orderValue = quantity * price;
      
      // Get user's wallet
      const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(userId);
      
      if (!wallet) {
        db.prepare('ROLLBACK').run();
        return res.status(404).json({
          success: false,
          message: 'Wallet not found',
          error: 'User wallet does not exist'
        });
      }
      
      if (side === 'buy') {
        // For buy orders: 
        // 1. Release any locked collateral for this order
        // 2. Deduct the actual execution amount from wallet
        // 3. Add to portfolio holdings
        
        // Check if we have enough funds
        if (wallet.balance < orderValue) {
          db.prepare('ROLLBACK').run();
          return res.status(400).json({
            success: false,
            message: 'Insufficient funds',
            error: 'Not enough balance to execute this buy order'
          });
        }
        
        // Update wallet (deduct funds)
        db.prepare('UPDATE wallets SET balance = balance - ? WHERE user_id = ?')
          .run(orderValue, userId);
        
        // Add transaction record
        db.prepare(`
          INSERT INTO transactions (user_id, type, amount, description)
          VALUES (?, ?, ?, ?)
        `).run(
          userId, 
          'trade', 
          -orderValue, 
          `Bought ${quantity} ${symbol} @ ${price}`
        );
        
        // Update portfolio - Check if user already has this stock
        const existingHolding = db.prepare(
          'SELECT * FROM portfolio_holdings WHERE user_id = ? AND symbol = ?'
        ).get(userId, symbol);
        
        if (existingHolding) {
          // Update existing holding with new average price
          const newQuantity = Number(existingHolding.quantity) + quantity;
          const newAvgPrice = (
            (Number(existingHolding.quantity) * Number(existingHolding.avg_price)) + 
            (quantity * price)
          ) / newQuantity;
          
          db.prepare(`
            UPDATE portfolio_holdings 
            SET quantity = ?, avg_price = ?
            WHERE id = ?
          `).run(newQuantity, newAvgPrice, existingHolding.id);
        } else {
          // Create new holding
          const holdingId = uuidv4();
          db.prepare(`
            INSERT INTO portfolio_holdings (id, user_id, symbol, quantity, avg_price)
            VALUES (?, ?, ?, ?, ?)
          `).run(holdingId, userId, symbol, quantity, price);
        }
      } else if (side === 'sell') {
        // For sell orders:
        // 1. Check if user has enough shares
        // 2. Remove from portfolio
        // 3. Add proceeds to wallet
        
        // Check if user has the shares to sell
        const holding = db.prepare(
          'SELECT * FROM portfolio_holdings WHERE user_id = ? AND symbol = ?'
        ).get(userId, symbol);
        
        if (!holding || Number(holding.quantity) < quantity) {
          db.prepare('ROLLBACK').run();
          return res.status(400).json({
            success: false,
            message: 'Insufficient shares',
            error: 'Not enough shares to execute this sell order'
          });
        }
        
        // Update wallet (add proceeds)
        db.prepare('UPDATE wallets SET balance = balance + ? WHERE user_id = ?')
          .run(orderValue, userId);
        
        // Add transaction record
        db.prepare(`
          INSERT INTO transactions (user_id, type, amount, description)
          VALUES (?, ?, ?, ?)
        `).run(
          userId, 
          'trade', 
          orderValue, 
          `Sold ${quantity} ${symbol} @ ${price}`
        );
        
        // Update portfolio
        const remainingQuantity = Number(holding.quantity) - quantity;
        
        if (remainingQuantity > 0) {
          // Just reduce the quantity
          db.prepare(`
            UPDATE portfolio_holdings 
            SET quantity = ?
            WHERE id = ?
          `).run(remainingQuantity, holding.id);
        } else {
          // Remove the holding completely
          db.prepare('DELETE FROM portfolio_holdings WHERE id = ?')
            .run(holding.id);
        }
      }
      
      // Update order status
      db.prepare('UPDATE orders SET status = ?, price = ? WHERE id = ?')
        .run('executed', price, orderId);
      
      // Commit transaction
      db.prepare('COMMIT').run();
      
      // Get the updated order
      const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
      
      // Get the updated portfolio holding
      const updatedHolding = db.prepare(
        'SELECT * FROM portfolio_holdings WHERE user_id = ? AND symbol = ?'
      ).get(userId, symbol);
      
      // Get the updated wallet
      const updatedWallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(userId);
      
      res.json({
        success: true,
        message: `Order executed successfully`,
        order: updatedOrder,
        holding: updatedHolding || null,
        wallet: updatedWallet
      });
    } catch (error) {
      // If any error occurs during transaction, roll back
      db.prepare('ROLLBACK').run();
      throw error;
    }
  } catch (error) {
    console.error('Error executing order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute order',
      error: error.message
    });
  }
});

export default router;
