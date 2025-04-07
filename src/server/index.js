// Main Express server file
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';

// Import modules
import { initDb, db } from './db/index.js';
import walletRoutes from './routes/walletRoutes.js';
import collateralRoutes from './routes/collateralRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import { attachUser } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Create HTTP server
const server = http.createServer(app);

// Configure middleware
app.use(cors());
app.use(bodyParser.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Attach user to request if token is valid
app.use(attachUser);

// Initialize database
initDb();

// Register routes
app.use('/auth', authRoutes);
app.use('/wallet', walletRoutes);
app.use('/wallet/collateral', collateralRoutes);
app.use('/transactions', transactionRoutes);
app.use('/orders', orderRoutes);
app.use('/watchlists', watchlistRoutes);
app.use('/portfolio', portfolioRoutes);

// Implement graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal, closing connections...');
  
  // Close server to stop accepting new connections
  server.close(() => {
    console.log('Server closed, closing database...');
    
    // Close database connection
    if (db) {
      try {
        db.close();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing database:', err);
      }
    }
    
    console.log('Graceful shutdown complete');
    process.exit(0);
  });
  
  // Force close after timeout
  setTimeout(() => {
    console.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000); // 10 second timeout
};

// Register shutdown handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
server.listen(PORT, () => {
  console.log(`Wallet API server running on port ${PORT}`);
});
