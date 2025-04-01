
// Main Express server file
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import modules
import { initDb } from './db/index.js';
import walletRoutes from './routes/walletRoutes.js';
import collateralRoutes from './routes/collateralRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Configure middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database
initDb();

// Register routes
app.use('/wallet', walletRoutes);
app.use('/wallet/collateral', collateralRoutes);
app.use('/transactions', transactionRoutes);
app.use('/orders', orderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Wallet API server running on port ${PORT}`);
});
