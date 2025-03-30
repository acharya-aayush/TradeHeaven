
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting TradeHeaven Wallet Server...');

// Use absolute path to ensure server starts correctly regardless of current directory
const serverPath = path.join(__dirname, 'src', 'server', 'index.js');
const server = spawn('node', [serverPath]);

server.stdout.on('data', (data) => {
  console.log(`${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`${data}`);
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
