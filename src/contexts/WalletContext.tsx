
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { WalletContextType } from '@/types/wallet';
import { useWalletOperations } from '@/hooks/useWalletOperations';
import { useWalletInit } from '@/hooks/useWalletInit';

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Provider component
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isDemoMode } = useAuth();
  
  // Get wallet operations
  const {
    wallet,
    setWallet,
    loading,
    setLoading,
    error,
    setError,
    availableBalance,
    lockedBalance,
    isWalletSufficient,
    refreshWallet,
    lockCollateral,
    releaseCollateral,
    addFunds,
    removeFunds
  } = useWalletOperations({
    isDemoMode,
    isAuthenticated
  });
  
  // Initialize wallet
  useWalletInit({
    isAuthenticated,
    isDemoMode,
    userId: user?.id,
    setWallet,
    setLoading,
    setError
  });

  // Context value
  const value: WalletContextType = {
    wallet,
    loading,
    error,
    availableBalance,
    lockedBalance,
    refreshWallet,
    lockCollateral,
    releaseCollateral,
    addFunds,
    removeFunds,
    isWalletSufficient
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

// Custom hook to use wallet context
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  return context;
};
