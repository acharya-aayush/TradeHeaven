// Database configuration and initialization
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initWatchlistSchema } from './schemas/watchlist.js';
import { initUserSchema } from './schemas/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize SQLite database
const db = new Database('wallet.db', { verbose: console.log });

// Function to find a user by username - added to support auth routes
const findUserByUsername = (username) => {
  try {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  } catch (error) {
    console.error('Error finding user by username:', error);
    return null;
  }
};

// Create tables if they don't exist
const initDb = () => {
  // Create users table with additional profile fields
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      phone_number TEXT,
      date_of_birth TEXT,
      country TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login TEXT
    )
  `).run();

  // Add missing columns if they don't exist
  const columns = db.prepare('PRAGMA table_info(users)').all();
  const columnNames = columns.map(col => col.name);
  
  // Check and add phone_number column if missing
  if (!columnNames.includes('phone_number')) {
    try {
      console.log('Adding phone_number column to users table...');
      db.prepare('ALTER TABLE users ADD COLUMN phone_number TEXT').run();
    } catch (err) {
      console.error('Error adding phone_number column:', err);
    }
  }
  
  // Check and add date_of_birth column if missing
  if (!columnNames.includes('date_of_birth')) {
    try {
      console.log('Adding date_of_birth column to users table...');
      db.prepare('ALTER TABLE users ADD COLUMN date_of_birth TEXT').run();
    } catch (err) {
      console.error('Error adding date_of_birth column:', err);
    }
  }
  
  // Check and add country column if missing
  if (!columnNames.includes('country')) {
    try {
      console.log('Adding country column to users table...');
      db.prepare('ALTER TABLE users ADD COLUMN country TEXT').run();
    } catch (err) {
      console.error('Error adding country column:', err);
    }
  }

  // Create wallets table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS wallets (
      user_id TEXT PRIMARY KEY,
      balance REAL DEFAULT 0,
      collateral_locked REAL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
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

  // Create portfolio table to track user holdings
  db.prepare(`
    CREATE TABLE IF NOT EXISTS portfolio_holdings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      avg_price REAL DEFAULT 0,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();

  // Initialize user schema first - this creates the default users
  initUserSchema();

  // Now check if default user wallet exists, create if needed
  const user = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get('user1');
  if (!user) {
    db.prepare('INSERT INTO wallets (user_id, balance, collateral_locked) VALUES (?, ?, ?)').run('user1', 10000, 0);
  }

  // Initialize watchlist schema
  initWatchlistSchema();
};

export { db, initDb, findUserByUsername };
