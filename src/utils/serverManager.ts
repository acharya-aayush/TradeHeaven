import axios from 'axios';

// Configuration
const SERVER_URL = 'http://localhost:3001';

/**
 * Check if the wallet server is running
 */
export const checkServerStatus = async (): Promise<boolean> => {
  try {
    await axios.get(`${SERVER_URL}/wallet`, { timeout: 3000 });
    console.log('Server connection successful');
    return true;
  } catch (error) {
    console.error('Server connection failed:', error);
    return false;
  }
};

/**
 * Start the wallet server if it's not already running
 */
export const ensureServerRunning = async (): Promise<boolean> => {
  try {
    // Check if server is running
    const isRunning = await checkServerStatus();
    
    if (isRunning) {
      console.log('Server is running');
      return true;
    }
    
    console.error('Server is not running. Please start the server with "npm run start"');
    return false;
  } catch (error) {
    console.error('Error checking server status:', error);
    return false;
  }
};

/**
 * Stop the wallet server if it was started by this application
 */
export const stopServer = () => {
  // No-op as we're no longer starting the server
};
