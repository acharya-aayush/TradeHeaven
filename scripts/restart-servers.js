/**
 * Helper script to restart all servers
 * 1. Kills all running server processes
 * 2. Starts the wallet server and Vite dev server
 */
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Restarting TradeHeaven servers...');

// First, kill all running server processes
console.log('Killing existing server processes...');
try {
  execSync('node scripts/killServerProcess.js', { stdio: 'inherit' });
  console.log('All existing server processes terminated.');
} catch (error) {
  console.error('Error killing existing processes:', error.message);
}

// Short delay to ensure ports are released
setTimeout(() => {
  console.log('\nStarting Wallet Server...');
  
  // Start the wallet server
  const walletServer = spawn('node', ['start-wallet-server.js'], {
    cwd: join(__dirname, '..'),
    stdio: 'inherit',
    detached: true
  });
  
  walletServer.on('error', (err) => {
    console.error('Failed to start wallet server:', err);
  });
  
  // Short delay before starting the Vite server
  setTimeout(() => {
    console.log('\nStarting Vite Development Server...');
    
    // Start the vite dev server
    const viteServer = spawn('npm', ['run', 'dev'], {
      cwd: join(__dirname, '..'),
      stdio: 'inherit',
      detached: true,
      shell: true
    });
    
    viteServer.on('error', (err) => {
      console.error('Failed to start Vite server:', err);
    });
    
    console.log('\nAll servers started. Press Ctrl+C to exit this script (servers will continue running).');
  }, 2000); // Wait 2 seconds before starting Vite server
}, 1000); // Wait 1 second after killing processes 