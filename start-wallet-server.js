#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting TradeHeaven Wallet Server...');

// Create HTTP server for socket connections
const httpServer = http.createServer();
const io = new SocketServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Track connected clients
let connectedClients = 0;
let autoShutdownTimer = null;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Socket.io setup for client tracking
io.on('connection', (socket) => {
  console.log('Client connected. Active clients:', ++connectedClients);
  
  // Clear any pending shutdown
  if (autoShutdownTimer) {
    console.log('Cancelling scheduled shutdown due to new connection');
    clearTimeout(autoShutdownTimer);
    autoShutdownTimer = null;
  }
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected. Remaining clients:', --connectedClients);
    
    // Schedule server shutdown if no clients remain
    if (connectedClients === 0) {
      console.log(`No clients connected. Scheduling shutdown in ${INACTIVITY_TIMEOUT/60000} minutes if no new connections...`);
      autoShutdownTimer = setTimeout(() => {
        console.log('Auto-shutdown triggered due to inactivity');
        server.kill();
        process.exit(0);
      }, INACTIVITY_TIMEOUT);
    }
  });
  
  // Heartbeat to keep track of active users
  socket.on('heartbeat', () => {
    // Reset shutdown timer on activity
    if (autoShutdownTimer) {
      clearTimeout(autoShutdownTimer);
      autoShutdownTimer = setTimeout(() => {
        console.log('Auto-shutdown triggered due to inactivity');
        server.kill();
        process.exit(0);
      }, INACTIVITY_TIMEOUT);
    }
  });
});

// Start Socket.io server on port 3002
httpServer.listen(3002, () => {
  console.log('Client tracking server running on port 3002');
});

// Check if our improved server script exists
const serverScriptPath = join(__dirname, 'scripts', 'start-server.js');
if (!existsSync(serverScriptPath)) {
  console.error(`ERROR: Server script not found at ${serverScriptPath}`);
  console.error('Running with original server startup method as fallback.');
  
  // Use original method as fallback
  const originalServerPath = join(__dirname, 'src', 'server', 'index.js');
  const server = spawn('node', [originalServerPath], {
    stdio: 'inherit'
  });
  
  server.on('error', (err) => {
    console.error('Failed to start server:', err);
  });
} else {
  // Use our improved server script
  console.log('Using improved server startup script');
  const server = spawn('node', [serverScriptPath], {
    stdio: 'inherit'
  });
  
  server.on('error', (err) => {
    console.error('Failed to start server:', err);
  });
}

console.log('Server starting! Press Ctrl+C to stop.');

// Handle process termination to properly shut down the server
process.on('SIGINT', () => {
  console.log('Stopping wallet server...');
  httpServer.close();
  process.exit(0);
});

// Handle other termination signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  httpServer.close();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  httpServer.close();
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
