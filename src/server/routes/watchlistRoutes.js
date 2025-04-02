
// Watchlist route handlers
import express from 'express';
import { db } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all watchlists for a user
router.get('/', (req, res) => {
  try {
    const userId = req.query.userId || 'user1'; // Default to user1 for demo
    const watchlists = db.prepare('SELECT * FROM watchlists WHERE user_id = ? ORDER BY created_at').all(userId);
    
    // For each watchlist, get its items
    const watchlistsWithItems = watchlists.map(watchlist => {
      const items = db.prepare(
        'SELECT * FROM watchlist_items WHERE watchlist_id = ? ORDER BY custom_order'
      ).all(watchlist.watchlist_id);
      
      return {
        ...watchlist,
        stocks: items.map(item => item.symbol)
      };
    });
    
    res.json(watchlistsWithItems);
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    res.status(500).json({ error: 'Failed to fetch watchlists' });
  }
});

// Get a specific watchlist with its items
router.get('/:watchlistId', (req, res) => {
  try {
    const { watchlistId } = req.params;
    const userId = req.query.userId || 'user1'; // Default to user1 for demo
    
    const watchlist = db.prepare(
      'SELECT * FROM watchlists WHERE watchlist_id = ? AND user_id = ?'
    ).get(watchlistId, userId);
    
    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }
    
    const items = db.prepare(
      'SELECT * FROM watchlist_items WHERE watchlist_id = ? ORDER BY custom_order'
    ).all(watchlistId);
    
    res.json({
      ...watchlist,
      items
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Create a new watchlist
router.post('/', (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.body.userId || 'user1'; // Default to user1 for demo
    
    if (!name) {
      return res.status(400).json({ error: 'Watchlist name is required' });
    }
    
    const watchlistId = uuidv4();
    
    db.prepare(
      'INSERT INTO watchlists (watchlist_id, user_id, name) VALUES (?, ?, ?)'
    ).run(watchlistId, userId, name);
    
    const newWatchlist = db.prepare('SELECT * FROM watchlists WHERE watchlist_id = ?').get(watchlistId);
    
    res.status(201).json(newWatchlist);
  } catch (error) {
    console.error('Error creating watchlist:', error);
    res.status(500).json({ error: 'Failed to create watchlist' });
  }
});

// Update a watchlist
router.put('/:watchlistId', (req, res) => {
  try {
    const { watchlistId } = req.params;
    const { name } = req.body;
    const userId = req.body.userId || 'user1'; // Default to user1 for demo
    
    if (!name) {
      return res.status(400).json({ error: 'Watchlist name is required' });
    }
    
    const result = db.prepare(
      'UPDATE watchlists SET name = ? WHERE watchlist_id = ? AND user_id = ?'
    ).run(name, watchlistId, userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }
    
    const updatedWatchlist = db.prepare('SELECT * FROM watchlists WHERE watchlist_id = ?').get(watchlistId);
    
    res.json(updatedWatchlist);
  } catch (error) {
    console.error('Error updating watchlist:', error);
    res.status(500).json({ error: 'Failed to update watchlist' });
  }
});

// Delete a watchlist
router.delete('/:watchlistId', (req, res) => {
  try {
    const { watchlistId } = req.params;
    const userId = req.query.userId || 'user1'; // Default to user1 for demo
    
    // Check if it's the default watchlist
    const watchlist = db.prepare(
      'SELECT is_default FROM watchlists WHERE watchlist_id = ? AND user_id = ?'
    ).get(watchlistId, userId);
    
    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }
    
    if (watchlist.is_default) {
      return res.status(400).json({ error: 'Cannot delete the default watchlist' });
    }
    
    db.prepare('DELETE FROM watchlists WHERE watchlist_id = ? AND user_id = ?').run(watchlistId, userId);
    
    res.json({ success: true, message: 'Watchlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting watchlist:', error);
    res.status(500).json({ error: 'Failed to delete watchlist' });
  }
});

// Add a stock to a watchlist
router.post('/:watchlistId/items', (req, res) => {
  try {
    const { watchlistId } = req.params;
    const { symbol, notes, tags } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }
    
    // Check if watchlist exists
    const watchlist = db.prepare('SELECT * FROM watchlists WHERE watchlist_id = ?').get(watchlistId);
    
    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }
    
    // Check if stock already exists in this watchlist
    const existingItem = db.prepare(
      'SELECT * FROM watchlist_items WHERE watchlist_id = ? AND symbol = ?'
    ).get(watchlistId, symbol);
    
    if (existingItem) {
      return res.status(400).json({ error: 'Stock already exists in this watchlist' });
    }
    
    // Get the highest custom_order value
    const maxOrderResult = db.prepare(
      'SELECT MAX(custom_order) as max_order FROM watchlist_items WHERE watchlist_id = ?'
    ).get(watchlistId);
    
    const nextOrder = maxOrderResult.max_order !== null ? maxOrderResult.max_order + 1 : 0;
    const itemId = `${watchlistId}_${symbol}`;
    
    db.prepare(
      'INSERT INTO watchlist_items (item_id, watchlist_id, symbol, custom_order, notes, tags) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(itemId, watchlistId, symbol, nextOrder, notes || null, tags || null);
    
    const newItem = db.prepare('SELECT * FROM watchlist_items WHERE item_id = ?').get(itemId);
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding stock to watchlist:', error);
    res.status(500).json({ error: 'Failed to add stock to watchlist' });
  }
});

// Update a stock in a watchlist (notes, tags, order)
router.put('/:watchlistId/items/:symbol', (req, res) => {
  try {
    const { watchlistId, symbol } = req.params;
    const { notes, tags, custom_order } = req.body;
    
    // Check if item exists
    const existingItem = db.prepare(
      'SELECT * FROM watchlist_items WHERE watchlist_id = ? AND symbol = ?'
    ).get(watchlistId, symbol);
    
    if (!existingItem) {
      return res.status(404).json({ error: 'Stock not found in this watchlist' });
    }
    
    // Build the update query dynamically based on provided fields
    let updateFields = [];
    let updateValues = [];
    
    if (notes !== undefined) {
      updateFields.push('notes = ?');
      updateValues.push(notes);
    }
    
    if (tags !== undefined) {
      updateFields.push('tags = ?');
      updateValues.push(tags);
    }
    
    if (custom_order !== undefined) {
      updateFields.push('custom_order = ?');
      updateValues.push(custom_order);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    // Add the WHERE clause parameters
    updateValues.push(watchlistId, symbol);
    
    db.prepare(
      `UPDATE watchlist_items SET ${updateFields.join(', ')} WHERE watchlist_id = ? AND symbol = ?`
    ).run(...updateValues);
    
    const updatedItem = db.prepare(
      'SELECT * FROM watchlist_items WHERE watchlist_id = ? AND symbol = ?'
    ).get(watchlistId, symbol);
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating stock in watchlist:', error);
    res.status(500).json({ error: 'Failed to update stock in watchlist' });
  }
});

// Remove a stock from a watchlist
router.delete('/:watchlistId/items/:symbol', (req, res) => {
  try {
    const { watchlistId, symbol } = req.params;
    
    // Check if item exists
    const existingItem = db.prepare(
      'SELECT * FROM watchlist_items WHERE watchlist_id = ? AND symbol = ?'
    ).get(watchlistId, symbol);
    
    if (!existingItem) {
      return res.status(404).json({ error: 'Stock not found in this watchlist' });
    }
    
    db.prepare(
      'DELETE FROM watchlist_items WHERE watchlist_id = ? AND symbol = ?'
    ).run(watchlistId, symbol);
    
    res.json({ success: true, message: 'Stock removed from watchlist successfully' });
  } catch (error) {
    console.error('Error removing stock from watchlist:', error);
    res.status(500).json({ error: 'Failed to remove stock from watchlist' });
  }
});

// Reorder items in a watchlist
router.post('/:watchlistId/reorder', (req, res) => {
  try {
    const { watchlistId } = req.params;
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array of symbols' });
    }
    
    // Start a transaction
    db.prepare('BEGIN TRANSACTION').run();
    
    try {
      // Update the order of each item
      items.forEach((symbol, index) => {
        db.prepare(
          'UPDATE watchlist_items SET custom_order = ? WHERE watchlist_id = ? AND symbol = ?'
        ).run(index, watchlistId, symbol);
      });
      
      // Commit the transaction
      db.prepare('COMMIT').run();
      
      // Get the updated items
      const updatedItems = db.prepare(
        'SELECT * FROM watchlist_items WHERE watchlist_id = ? ORDER BY custom_order'
      ).all(watchlistId);
      
      res.json(updatedItems);
    } catch (error) {
      // Rollback the transaction in case of error
      db.prepare('ROLLBACK').run();
      throw error;
    }
  } catch (error) {
    console.error('Error reordering watchlist items:', error);
    res.status(500).json({ error: 'Failed to reorder watchlist items' });
  }
});

// Get all price alerts for a user
router.get('/alerts', (req, res) => {
  try {
    const userId = req.query.userId || 'user1'; // Default to user1 for demo
    
    const alerts = db.prepare('SELECT * FROM price_alerts WHERE user_id = ?').all(userId);
    
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Create a new price alert
router.post('/alerts', (req, res) => {
  try {
    const { symbol, type, condition, threshold } = req.body;
    const userId = req.body.userId || 'user1'; // Default to user1 for demo
    
    if (!symbol || !type || !condition || threshold === undefined) {
      return res.status(400).json({ error: 'Symbol, type, condition, and threshold are required' });
    }
    
    // Validate the alert type
    const validTypes = ['price', 'percentage', 'volume', 'resistance', 'support'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid alert type' });
    }
    
    // Validate the condition
    const validConditions = ['above', 'below', 'crosses'];
    if (!validConditions.includes(condition)) {
      return res.status(400).json({ error: 'Invalid condition' });
    }
    
    const alertId = uuidv4();
    
    db.prepare(
      'INSERT INTO price_alerts (alert_id, user_id, symbol, type, condition, threshold) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(alertId, userId, symbol, type, condition, threshold);
    
    const newAlert = db.prepare('SELECT * FROM price_alerts WHERE alert_id = ?').get(alertId);
    
    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Delete a price alert
router.delete('/alerts/:alertId', (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.query.userId || 'user1'; // Default to user1 for demo
    
    const result = db.prepare(
      'DELETE FROM price_alerts WHERE alert_id = ? AND user_id = ?'
    ).run(alertId, userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json({ success: true, message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

export default router;
