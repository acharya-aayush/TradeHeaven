#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('Starting TradeHeaven Server with Verbose Logging...');

// Check if wallet.db exists, if not provide clear guidance
const dbPath = join(rootDir, 'wallet.db');
if (!existsSync(dbPath)) {
  console.log('Database file not found. This is normal for first run.');
  console.log('A new database will be created when the server starts.');
}

// Use absolute path to ensure server starts correctly regardless of current directory
const serverPath = join(rootDir, 'src', 'server', 'index.js');

// Check if server file exists
if (!existsSync(serverPath)) {
  console.error(`ERROR: Server file not found at ${serverPath}`);
  console.error(`Current directory: ${process.cwd()}`);
  console.error('Please ensure your project structure is correct.');
  process.exit(1);
}

console.log(`Starting server from: ${serverPath}`);

// Start the server process with explicit --experimental-modules flag
const server = spawn('node', ['--trace-warnings', serverPath], {
  cwd: rootDir,
  env: { ...process.env, NODE_ENV: 'development' }
});

// Debug logging
console.log('Server process started with PID:', server.pid);

server.stdout.on('data', (data) => {
  console.log(`[SERVER]: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`[SERVER ERROR]: ${data}`);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  
  if (code !== 0) {
    console.error('Server exited with error. Please check the logs above for details.');
  }
  
  process.exit(code || 0);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

console.log('Server starting! Waiting for database initialization...');
console.log('Press Ctrl+C to stop the server.');

// Handle process termination to properly shut down the server
process.on('SIGINT', () => {
  console.log('\nStopping server...');
  server.kill();
  process.exit(0);
}); 