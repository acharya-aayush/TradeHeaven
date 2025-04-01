
// Database configuration and initialization
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  // Create orders table
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

  // Check if default user exists, if not create one
  const user = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
  if (!user) {
    db.prepare('INSERT INTO wallets (user_id, balance, collateral_locked) VALUES (?, ?, ?)').run('user1', 10000, 0);
  }
};

export { db, initDb };
