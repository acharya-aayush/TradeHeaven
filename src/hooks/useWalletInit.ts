
import { useEffect } from 'react';
import { getWalletBalance } from '@/services/walletService';
import { loadWalletFromStorage, saveWalletToStorage } from '@/utils/walletStorage';
import { WalletData } from '@/types/wallet';
import { useToast } from '@/hooks/use-toast';

interface UseWalletInitProps {
  isAuthenticated: boolean;
  isDemoMode: boolean;
  userId: string | undefined;
  setWallet: (wallet: WalletData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWalletInit = ({
  isAuthenticated,
  isDemoMode,
  userId,
  setWallet,
  setLoading,
  setError
}: UseWalletInitProps) => {
  const { toast } = useToast();

  // Initialize wallet
  useEffect(() => {
    const initWallet = async () => {
      try {
        setLoading(true);
        
        // First try to load from localStorage
        const storedWallet = loadWalletFromStorage();
        
        if (storedWallet && (isDemoMode || isAuthenticated)) {
          console.log("Using wallet from localStorage:", storedWallet);
          setWallet(storedWallet);
          setLoading(false);
          return;
        }
        
        // If we're in demo mode or authenticated but no stored wallet, create default
        if ((isDemoMode || isAuthenticated) && userId) {
          console.log("Creating default wallet for user:", userId);
          const defaultWallet: WalletData = {
            user_id: userId,
            balance: 100000, // Default balance for demo/new users
            collateral_locked: 0
          };
          setWallet(defaultWallet);
          saveWalletToStorage(defaultWallet);
          setLoading(false);
          return;
        }
        
        // If authenticated but not in demo mode, get from server
        if (isAuthenticated && userId && !isDemoMode) {
          try {
            const response = await getWalletBalance();
            if (response) {
              setWallet(response);
              saveWalletToStorage(response);
            } else {
              setError('Failed to fetch wallet data');
              toast({
                title: 'Error',
                description: 'Failed to fetch wallet data. Using default values.',
                variant: 'destructive',
              });
            }
          } catch (err) {
            console.error('Error fetching wallet:', err);
            setError('Failed to fetch wallet data');
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing wallet:', err);
        setError('Failed to initialize wallet');
        setLoading(false);
      }
    };

    initWallet();
  }, [isAuthenticated, userId, isDemoMode]);
};
