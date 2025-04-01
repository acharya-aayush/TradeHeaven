
import axios from 'axios';
import { ensureServerRunning } from '@/utils/serverManager';

// Base API URL
const API_URL = 'http://localhost:3001';

// Wallet interface
export interface WalletData {
  user_id: string;
  balance: number;
  collateral_locked: number;
}

// Transaction interface
export interface Transaction {
  transaction_id: number;
  user_id: string;
  type: 'load' | 'withdraw' | 'collateral_lock' | 'collateral_release';
  amount: number;
  description: string;
  timestamp: string;
}

// Response interface
export interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  wallet?: WalletData;
  availableBalance?: number;
  lockedCollateral?: number;
}

// Check if server is running
export const checkServerStatus = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_URL}/wallet`, { timeout: 3000 });
    return true;
  } catch (error) {
    console.error('Wallet server connection failed:', error);
    return false;
  }
};

// Get wallet balance
export const getWalletBalance = async (): Promise<WalletData> => {
  try {
    // Ensure server is running before making request
    const serverRunning = await ensureServerRunning();
    if (!serverRunning) {
      throw new Error('Wallet server is not running. Please start the server with "node start-wallet-server.js"');
    }
    
    const response = await axios.get(`${API_URL}/wallet`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};

// Load funds to wallet
export const loadFunds = async (amount: number): Promise<ApiResponse> => {
  try {
    // Ensure server is running before making request
    await ensureServerRunning();
    
    const response = await axios.post(`${API_URL}/wallet/load`, { amount });
    return response.data;
  } catch (error: any) {
    console.error('Error loading funds:', error);
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Withdraw funds from wallet
export const withdrawFunds = async (amount: number): Promise<ApiResponse> => {
  try {
    // Ensure server is running before making request
    await ensureServerRunning();
    
    const response = await axios.post(`${API_URL}/wallet/withdraw`, { amount });
    return response.data;
  } catch (error: any) {
    console.error('Error withdrawing funds:', error);
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Lock collateral for an order
export const lockCollateral = async (amount: number, orderId?: string): Promise<ApiResponse> => {
  try {
    // Ensure server is running before making request
    await ensureServerRunning();
    
    const response = await axios.post(`${API_URL}/wallet/collateral/lock`, { amount, orderId });
    return response.data;
  } catch (error: any) {
    console.error('Error locking collateral:', error);
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Release collateral
export const releaseCollateral = async (amount: number, orderId?: string): Promise<ApiResponse> => {
  try {
    // Ensure server is running before making request
    await ensureServerRunning();
    
    const response = await axios.post(`${API_URL}/wallet/collateral/release`, { amount, orderId });
    return response.data;
  } catch (error: any) {
    console.error('Error releasing collateral:', error);
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Get transaction history
export const getTransactionHistory = async (): Promise<Transaction[]> => {
  try {
    // Ensure server is running before making request
    await ensureServerRunning();
    
    const response = await axios.get(`${API_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};
