
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { spawn } from 'child_process';

// Configuration
const SERVER_URL = 'http://localhost:3001';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

let serverProcess: any = null;
let isStarting = false;
let retryCount = 0;

/**
 * Check if the wallet server is running
 */
export const checkServerStatus = async (): Promise<boolean> => {
  try {
    await axios.get(`${SERVER_URL}/wallet`, { timeout: 3000 });
    console.log('Wallet server is running');
    return true;
  } catch (error) {
    console.error('Wallet server connection failed');
    return false;
  }
};

/**
 * Start the wallet server if it's not already running
 */
export const ensureServerRunning = async (): Promise<boolean> => {
  // If server is already starting, wait for it
  if (isStarting) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(async () => {
        const status = await checkServerStatus();
        if (status) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 1000);
    });
  }

  // Check if server is already running
  const isRunning = await checkServerStatus();
  if (isRunning) {
    return true;
  }

  // Prevent multiple start attempts
  if (isStarting) return false;
  isStarting = true;

  try {
    // In the browser environment, we can't directly spawn a process
    // Instead, show instructions to the user
    toast({
      title: "Wallet Server Not Running",
      description: "Please run 'node start-wallet-server.js' in your terminal to start the wallet server.",
      variant: "destructive",
      duration: 10000,
    });
    
    // We'll retry checking a few times after showing the message
    return new Promise((resolve) => {
      retryCount = 0;
      const retryCheck = async () => {
        if (retryCount >= MAX_RETRIES) {
          isStarting = false;
          resolve(false);
          return;
        }
        
        retryCount++;
        const status = await checkServerStatus();
        if (status) {
          isStarting = false;
          resolve(true);
        } else {
          setTimeout(retryCheck, RETRY_DELAY);
        }
      };
      
      // Start checking after a delay to give user time to start the server
      setTimeout(retryCheck, RETRY_DELAY);
    });
    
  } catch (error) {
    console.error('Failed to start wallet server:', error);
    isStarting = false;
    return false;
  }
};

/**
 * Stop the wallet server if it was started by this application
 */
export const stopServer = () => {
  if (serverProcess) {
    console.log('Stopping wallet server...');
    serverProcess.kill();
    serverProcess = null;
  }
};

// Ensure the server is stopped when the application exits
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', stopServer);
}
