
// Wallet storage utilities

import { WalletData } from '@/types/wallet';

// Wallet local storage key
export const WALLET_STORAGE_KEY = 'tradeheaven_wallet';

// Load wallet from localStorage
export const loadWalletFromStorage = (): WalletData | null => {
  try {
    const savedWallet = localStorage.getItem(WALLET_STORAGE_KEY);
    if (savedWallet) {
      return JSON.parse(savedWallet);
    }
  } catch (err) {
    console.error('Failed to load wallet from localStorage:', err);
  }
  return null;
};

// Save wallet to localStorage
export const saveWalletToStorage = (wallet: WalletData): void => {
  try {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
  } catch (err) {
    console.error('Failed to save wallet to localStorage:', err);
  }
};
