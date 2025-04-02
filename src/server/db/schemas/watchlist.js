// Watchlist database schema definition
import { db } from '../index.js';

export const initWatchlistSchema = () => {
  // Create watchlists table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS watchlists (
      watchlist_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      is_default INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Create watchlist_items table to store individual stocks in watchlists
  db.prepare(`
    CREATE TABLE IF NOT EXISTS watchlist_items (
      item_id TEXT PRIMARY KEY,
      watchlist_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      custom_order INTEGER DEFAULT 0,
      notes TEXT,
      tags TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (watchlist_id) REFERENCES watchlists(watchlist_id) ON DELETE CASCADE
    )
  `).run();

  // Create price_alerts table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS price_alerts (
      alert_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      type TEXT CHECK(type IN ('price', 'percentage', 'volume', 'resistance', 'support')),
      condition TEXT CHECK(condition IN ('above', 'below', 'crosses')),
      threshold REAL NOT NULL,
      triggered INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Check if default watchlist exists, if not create one
  const defaultWatchlist = db.prepare('SELECT * FROM watchlists WHERE user_id = ? AND is_default = 1').get('user1');
  if (!defaultWatchlist) {
    const watchlistId = 'default';
    db.prepare('INSERT INTO watchlists (watchlist_id, user_id, name, is_default) VALUES (?, ?, ?, ?)').run(
      watchlistId, 'user1', 'Default Watchlist', 1
    );
    
    // Add some default stocks to the watchlist
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    symbols.forEach((symbol, index) => {
      db.prepare(
        'INSERT INTO watchlist_items (item_id, watchlist_id, symbol, custom_order) VALUES (?, ?, ?, ?)'
      ).run(`${watchlistId}_${symbol}`, watchlistId, symbol, index);
    });

    // Create a Tech watchlist
    const techWatchlistId = 'tech';
    db.prepare('INSERT INTO watchlists (watchlist_id, user_id, name) VALUES (?, ?, ?)').run(
      techWatchlistId, 'user1', 'Tech Stocks'
    );
    
    // Add tech stocks
    const techSymbols = ['AAPL', 'MSFT', 'GOOGL'];
    techSymbols.forEach((symbol, index) => {
      db.prepare(
        'INSERT INTO watchlist_items (item_id, watchlist_id, symbol, custom_order) VALUES (?, ?, ?, ?)'
      ).run(`${techWatchlistId}_${symbol}`, techWatchlistId, symbol, index);
    });

    // Create a Growth watchlist
    const growthWatchlistId = 'growth';
    db.prepare('INSERT INTO watchlists (watchlist_id, user_id, name) VALUES (?, ?, ?)').run(
      growthWatchlistId, 'user1', 'Growth Stocks'
    );
    
    // Add growth stocks
    const growthSymbols = ['TSLA', 'NVDA'];
    growthSymbols.forEach((symbol, index) => {
      db.prepare(
        'INSERT INTO watchlist_items (item_id, watchlist_id, symbol, custom_order) VALUES (?, ?, ?, ?)'
      ).run(`${growthWatchlistId}_${symbol}`, growthWatchlistId, symbol, index);
    });
  }
};
