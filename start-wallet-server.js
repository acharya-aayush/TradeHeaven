import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting TradeHeaven Wallet Server...');

// Set environment variable for the port
process.env.WALLET_SERVER_PORT = 3002;

// Use absolute path to ensure server starts correctly regardless of current directory
const serverPath = join(__dirname, 'src', 'server', 'index.js');
const server = spawn('node', [serverPath]);

server.stdout.on('data', (data) => {
  console.log(`${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`Server error: ${data}`);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

console.log('Server starting! Press Ctrl+C to stop.');

// Handle process termination to properly shut down the server
process.on('SIGINT', () => {
  console.log('Stopping wallet server...');
  server.kill();
  process.exit();
});
