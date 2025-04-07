// Portfolio routes
import express from 'express';
import { db } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Middleware to protect all portfolio routes
router.use(authenticateToken);

// Get user's portfolio holdings
router.get('/holdings', (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's holdings from the database
    const holdings = db.prepare('SELECT * FROM portfolio_holdings WHERE user_id = ?').all(userId);
    
    // Add current price and calculated values (in a real app, this would fetch from market data API)
    const holdingsWithValues = holdings.map(holding => {
      // Mock current price for demo purposes (in reality, you'd fetch this from a market data API)
      const currentPrice = Number(holding.avg_price) * (0.8 + Math.random() * 0.4); // Random price ±20% of purchase price
      
      const value = Number(holding.quantity) * currentPrice;
      const cost = Number(holding.quantity) * Number(holding.avg_price);
      const profitLoss = value - cost;
      const profitLossPercent = cost > 0 ? (profitLoss / cost) * 100 : 0;
      
      return {
        ...holding,
        current_price: currentPrice,
        value: value,
        profit_loss: profitLoss,
        profit_loss_percent: profitLossPercent
      };
    });
    
    res.json({
      success: true,
      holdings: holdingsWithValues
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

// Add new holding to portfolio (for demonstration and testing)
router.post('/holdings', (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol, quantity, avg_price } = req.body;
    
    if (!symbol || !quantity || !avg_price) {
      return res.status(400).json({ error: 'Symbol, quantity, and average price are required' });
    }
    
    // Check if user already has this symbol in portfolio
    const existingHolding = db.prepare(
      'SELECT * FROM portfolio_holdings WHERE user_id = ? AND symbol = ?'
    ).get(userId, symbol);
    
    if (existingHolding) {
      // Update existing holding
      const newQuantity = Number(existingHolding.quantity) + Number(quantity);
      const newAvgPrice = (
        (Number(existingHolding.quantity) * Number(existingHolding.avg_price)) + 
        (Number(quantity) * Number(avg_price))
      ) / newQuantity;
      
      db.prepare(`
        UPDATE portfolio_holdings 
        SET quantity = ?, avg_price = ?
        WHERE id = ?
      `).run(newQuantity, newAvgPrice, existingHolding.id);
      
      const updatedHolding = db.prepare('SELECT * FROM portfolio_holdings WHERE id = ?').get(existingHolding.id);
      
      return res.json({
        success: true,
        message: 'Portfolio holding updated',
        holding: updatedHolding
      });
    }
    
    // Create new holding
    const holdingId = uuidv4();
    
    db.prepare(`
      INSERT INTO portfolio_holdings (id, user_id, symbol, quantity, avg_price)
      VALUES (?, ?, ?, ?, ?)
    `).run(holdingId, userId, symbol, quantity, avg_price);
    
    const newHolding = db.prepare('SELECT * FROM portfolio_holdings WHERE id = ?').get(holdingId);
    
    res.json({
      success: true,
      message: 'Portfolio holding added',
      holding: newHolding
    });
  } catch (error) {
    console.error('Error adding portfolio holding:', error);
    res.status(500).json({ error: 'Failed to add portfolio holding' });
  }
});

// Update portfolio holding
router.put('/holdings/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const holdingId = req.params.id;
    const { quantity, avg_price } = req.body;
    
    // Check if holding exists and belongs to user
    const existingHolding = db.prepare(
      'SELECT * FROM portfolio_holdings WHERE id = ? AND user_id = ?'
    ).get(holdingId, userId);
    
    if (!existingHolding) {
      return res.status(404).json({ error: 'Portfolio holding not found' });
    }
    
    // Update holding
    db.prepare(`
      UPDATE portfolio_holdings 
      SET quantity = ?, avg_price = ?
      WHERE id = ?
    `).run(
      quantity || existingHolding.quantity, 
      avg_price || existingHolding.avg_price, 
      holdingId
    );
    
    const updatedHolding = db.prepare('SELECT * FROM portfolio_holdings WHERE id = ?').get(holdingId);
    
    res.json({
      success: true,
      message: 'Portfolio holding updated',
      holding: updatedHolding
    });
  } catch (error) {
    console.error('Error updating portfolio holding:', error);
    res.status(500).json({ error: 'Failed to update portfolio holding' });
  }
});

// Delete portfolio holding
router.delete('/holdings/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const holdingId = req.params.id;
    
    // Check if holding exists and belongs to user
    const existingHolding = db.prepare(
      'SELECT * FROM portfolio_holdings WHERE id = ? AND user_id = ?'
    ).get(holdingId, userId);
    
    if (!existingHolding) {
      return res.status(404).json({ error: 'Portfolio holding not found' });
    }
    
    // Delete holding
    db.prepare('DELETE FROM portfolio_holdings WHERE id = ?').run(holdingId);
    
    res.json({
      success: true,
      message: 'Portfolio holding deleted'
    });
  } catch (error) {
    console.error('Error deleting portfolio holding:', error);
    res.status(500).json({ error: 'Failed to delete portfolio holding' });
  }
});

export default router; 