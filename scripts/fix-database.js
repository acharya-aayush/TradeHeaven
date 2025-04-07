#!/usr/bin/env node

/**
 * Database repair tool for TradeHeaven
 * This script will:
 * 1. Check if the database file exists
 * 2. If it doesn't exist or is corrupted, create a fresh one
 * 3. Initialize the database with schema and default data
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('TradeHeaven Database Repair Tool');
console.log('--------------------------------');

// Database path
const dbPath = join(rootDir, 'wallet.db');
console.log(`Database path: ${dbPath}`);

// Check if database exists
if (existsSync(dbPath)) {
  console.log('Database file found. Checking if it can be opened...');
  
  let shouldRecreate = false;
  
  try {
    // Try to open the database
    const testDb = new Database(dbPath);
    
    // Try a simple query to check integrity
    try {
      testDb.prepare('SELECT 1').get();
      console.log('Database is valid and working properly.');
      testDb.close();
    } catch (queryError) {
      console.error('Database file is corrupted. It will be recreated.');
      testDb.close();
      shouldRecreate = true;
    }
  } catch (openError) {
    console.error('Error opening database:', openError.message);
    console.log('Database file appears to be corrupted. It will be recreated.');
    shouldRecreate = true;
  }
  
  // Recreate if needed
  if (shouldRecreate) {
    console.log('Removing corrupted database file...');
    try {
      unlinkSync(dbPath);
      console.log('Old database file removed successfully.');
    } catch (unlinkError) {
      console.error('Failed to remove database file:', unlinkError.message);
      console.error('Please manually delete the file and try again.');
      process.exit(1);
    }
  } else {
    console.log('No issues found with the database.');
    process.exit(0);
  }
} else {
  console.log('Database file does not exist. A new one will be created.');
}

// Create a fresh database
console.log('\nCreating and initializing new database...');

try {
  // Create database
  const db = new Database(dbPath, { verbose: console.log });
  
  // Create users table
  console.log('Creating users table...');
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
  
  // Create wallets table
  console.log('Creating wallets table...');
  db.prepare(`
    CREATE TABLE IF NOT EXISTS wallets (
      user_id TEXT PRIMARY KEY,
      balance REAL DEFAULT 0,
      collateral_locked REAL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();
  
  // Create transactions table
  console.log('Creating transactions table...');
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
  console.log('Creating orders table...');
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
  
  // Create portfolio table
  console.log('Creating portfolio table...');
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
  
  // Create watchlists table
  console.log('Creating watchlists table...');
  db.prepare(`
    CREATE TABLE IF NOT EXISTS watchlists (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      symbols TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();
  
  // Create default test user
  console.log('Creating default test user...');
  const passwordHash = bcrypt.hashSync('password123', 10);
  const userId = 'user1';
  
  try {
    db.prepare(
      'INSERT INTO users (id, username, email, password_hash, full_name) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, 'user1', 'user1@tradeheaven.com', passwordHash, 'Test User');
  } catch (userError) {
    console.log('User already exists or error creating user:', userError.message);
  }
  
  // Create wallet for test user
  console.log('Creating wallet for test user...');
  try {
    db.prepare('INSERT INTO wallets (user_id, balance, collateral_locked) VALUES (?, ?, ?)')
      .run(userId, 10000, 0);
  } catch (walletError) {
    console.log('Wallet already exists or error creating wallet:', walletError.message);
  }
  
  // Create admin user
  console.log('Creating admin user...');
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const adminId = uuidv4();
  
  try {
    db.prepare(
      'INSERT INTO users (id, username, email, password_hash, full_name) VALUES (?, ?, ?, ?, ?)'
    ).run(adminId, 'admin', 'admin@tradeheaven.com', adminPasswordHash, 'Admin User');
  } catch (adminError) {
    console.log('Admin user already exists or error creating admin:', adminError.message);
  }
  
  // Create wallet for admin
  console.log('Creating wallet for admin user...');
  try {
    db.prepare('INSERT INTO wallets (user_id, balance, collateral_locked) VALUES (?, ?, ?)')
      .run(adminId, 10000, 0);
  } catch (adminWalletError) {
    console.log('Admin wallet already exists or error creating wallet:', adminWalletError.message);
  }
  
  // Close database
  db.close();
  
  console.log('\nDatabase created and initialized successfully!');
  console.log('You can now start the application with:');
  console.log('  npm run start');
  
} catch (dbError) {
  console.error('Error creating database:', dbError.message);
  console.error('Please make sure you have write permissions in this directory.');
  process.exit(1);
} 