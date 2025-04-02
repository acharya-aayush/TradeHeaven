// Main Express server file
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sqlite3 from 'sqlite3';

// Import modules
import { initDb } from './db/index.js';
import walletRoutes from './routes/walletRoutes.js';
import collateralRoutes from './routes/collateralRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.WALLET_SERVER_PORT || 3002;

// Configure CORS with specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://192.168.1.3:8080'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Add security headers but remove problematic ones
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Remove Permissions-Policy header that was causing issues
  next();
});

app.use(bodyParser.json());

// Initialize database
initDb();

// Register routes
app.use('/wallet', walletRoutes);
app.use('/wallet/collateral', collateralRoutes);
app.use('/transactions', transactionRoutes);
app.use('/orders', orderRoutes);
app.use('/watchlists', watchlistRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server with error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Wallet server running on port ${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
