
import { useState } from 'react';
import { WalletData } from '@/types/wallet';
import { useToast } from '@/hooks/use-toast';
import { loadWalletFromStorage, saveWalletToStorage } from '@/utils/walletStorage';
import { 
  getWalletBalance, 
  lockCollateral as lockCollateralService, 
  releaseCollateral as releaseCollateralService, 
  loadFunds as loadFundsService, 
  withdrawFunds as withdrawFundsService 
} from '@/services/walletService';

interface UseWalletOperationsProps {
  isDemoMode: boolean;
  isAuthenticated: boolean;
}

export const useWalletOperations = ({ isDemoMode, isAuthenticated }: UseWalletOperationsProps) => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate available and locked balances
  const availableBalance = wallet ? wallet.balance - wallet.collateral_locked : 0;
  const lockedBalance = wallet ? wallet.collateral_locked : 0;

  // Check if wallet has sufficient funds for a given amount
  const isWalletSufficient = (amount: number): boolean => {
    return availableBalance >= amount;
  };
  
  // Refresh wallet data
  const refreshWallet = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // For demo mode or if we want to use local data
      const storedWallet = loadWalletFromStorage();
      if (storedWallet && (isDemoMode || !isAuthenticated)) {
        setWallet(storedWallet);
        setLoading(false);
        return;
      }
      
      // For authenticated users (production)
      if (isAuthenticated && !isDemoMode) {
        const response = await getWalletBalance();
        if (response) {
          setWallet(response);
          saveWalletToStorage(response);
        } else {
          // If server call fails, use cached data
          if (storedWallet) {
            setWallet(storedWallet);
          } else {
            setError('Failed to fetch wallet data');
          }
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing wallet:', err);
      setError('Failed to refresh wallet data');
      setLoading(false);
      
      // Try to use cached data on error
      const storedWallet = loadWalletFromStorage();
      if (storedWallet) {
        setWallet(storedWallet);
      }
    }
  };

  // Lock collateral for orders
  const lockCollateral = async (amount: number): Promise<boolean> => {
    try {
      console.log(`Locking collateral: ${amount}`);
      if (!wallet) return false;
      
      // Check if user has enough available balance
      if (wallet.balance - wallet.collateral_locked < amount) {
        toast({
          title: 'Insufficient Funds',
          description: `You need Rs.${amount.toFixed(2)} available to lock this collateral.`,
          variant: 'destructive',
        });
        return false;
      }
      
      // For demo or local mode
      if (isDemoMode || !isAuthenticated) {
        const updatedWallet = {
          ...wallet,
          collateral_locked: wallet.collateral_locked + amount
        };
        setWallet(updatedWallet);
        saveWalletToStorage(updatedWallet);
        return true;
      }
      
      // For production
      const response = await lockCollateralService(amount);
      
      // Fix null checking for response
      if (response && typeof response === 'object') {
        if ('success' in response && response.success === true) {
          const updatedWallet = await getWalletBalance();
          if (updatedWallet) {
            setWallet(updatedWallet);
            saveWalletToStorage(updatedWallet);
          }
          return true;
        } else if ('error' in response && response.error) {
          toast({
            title: 'Failed to Lock Collateral',
            description: response.error || 'An error occurred',
            variant: 'destructive',
          });
        }
      }
      return false;
    } catch (err) {
      console.error('Error locking collateral:', err);
      toast({
        title: 'Error',
        description: 'Failed to lock collateral',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Release collateral for orders
  const releaseCollateral = async (amount: number): Promise<boolean> => {
    try {
      console.log(`Releasing collateral: ${amount}`);
      if (!wallet) return false;
      
      // For demo or local mode
      if (isDemoMode || !isAuthenticated) {
        const updatedWallet = {
          ...wallet,
          collateral_locked: Math.max(0, wallet.collateral_locked - amount)
        };
        setWallet(updatedWallet);
        saveWalletToStorage(updatedWallet);
        return true;
      }
      
      // For production
      const response = await releaseCollateralService(amount);
      
      // Fix null checking for response
      if (response && typeof response === 'object') {
        if ('success' in response && response.success === true) {
          const updatedWallet = await getWalletBalance();
          if (updatedWallet) {
            setWallet(updatedWallet);
            saveWalletToStorage(updatedWallet);
          }
          return true;
        } else if ('error' in response && response.error) {
          toast({
            title: 'Failed to Release Collateral',
            description: response.error || 'An error occurred',
            variant: 'destructive',
          });
        }
      }
      return false;
    } catch (err) {
      console.error('Error releasing collateral:', err);
      toast({
        title: 'Error',
        description: 'Failed to release collateral',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Add funds to wallet
  const addFunds = async (amount: number): Promise<boolean> => {
    try {
      console.log(`Adding funds: ${amount}`);
      if (!wallet) return false;
      
      // For demo or local mode
      if (isDemoMode || !isAuthenticated) {
        const updatedWallet = {
          ...wallet,
          balance: wallet.balance + amount
        };
        setWallet(updatedWallet);
        saveWalletToStorage(updatedWallet);
        return true;
      }
      
      // For production
      const response = await loadFundsService(amount);
      if (response && typeof response === 'object' && 'success' in response && response.success === true) {
        const updatedWallet = await getWalletBalance();
        if (updatedWallet) {
          setWallet(updatedWallet);
          saveWalletToStorage(updatedWallet);
        }
        return true;
      } else if (response && typeof response === 'object' && 'error' in response && response.error) {
        toast({
          title: 'Failed to Add Funds',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        });
        return false;
      }
      return false;
    } catch (err) {
      console.error('Error adding funds:', err);
      toast({
        title: 'Error',
        description: 'Failed to add funds',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Remove funds from wallet
  const removeFunds = async (amount: number): Promise<boolean> => {
    try {
      console.log(`Removing funds: ${amount}`);
      if (!wallet) return false;
      
      // Check if user has enough available balance
      if (wallet.balance - wallet.collateral_locked < amount) {
        toast({
          title: 'Insufficient Funds',
          description: `You only have Rs.${(wallet.balance - wallet.collateral_locked).toFixed(2)} available.`,
          variant: 'destructive',
        });
        return false;
      }
      
      // For demo or local mode
      if (isDemoMode || !isAuthenticated) {
        const updatedWallet = {
          ...wallet,
          balance: wallet.balance - amount
        };
        setWallet(updatedWallet);
        saveWalletToStorage(updatedWallet);
        return true;
      }
      
      // For production
      const response = await withdrawFundsService(amount);
      if (response && typeof response === 'object' && 'success' in response && response.success === true) {
        const updatedWallet = await getWalletBalance();
        if (updatedWallet) {
          setWallet(updatedWallet);
          saveWalletToStorage(updatedWallet);
        }
        return true;
      } else if (response && typeof response === 'object' && 'error' in response && response.error) {
        toast({
          title: 'Failed to Remove Funds',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        });
        return false;
      }
      return false;
    } catch (err) {
      console.error('Error removing funds:', err);
      toast({
        title: 'Error',
        description: 'Failed to remove funds',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
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
  };
};
