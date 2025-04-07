import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { 
  getWalletBalance, 
  loadFunds, 
  withdrawFunds,
  lockCollateral,
  releaseCollateral,
  getTransactionHistory,
  WalletData,
  Transaction
} from '@/services/walletService';
import {
  Balance,
  AssetAllocation,
  TransactionHistory,
  DepositForm,
  WithdrawForm
} from '@/components/wallet';
import { generateBalanceHistory } from '@/components/wallet/WalletUtils';

interface LocationState {
  activeTab?: string;
}

const Wallet = () => {
  const { toast } = useToast();
  const location = useLocation();
  const locationState = location.state as LocationState;
  
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(locationState?.activeTab || 'transactions');
  const [orderId, setOrderId] = useState<string>('ORD-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
  const [balanceHistory, setBalanceHistory] = useState<any[]>([]);

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const walletData = await getWalletBalance();
      const transactionData = await getTransactionHistory();
      
      setWallet(walletData);
      setTransactions(transactionData);

      // Generate balance history from transactions
      const history = generateBalanceHistory(transactionData, walletData.balance);
      setBalanceHistory(history);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  // Handle deposit funds
  const handleDeposit = async (amount: number) => {
    try {
      const response = await loadFunds(amount);
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.message
        });
        fetchWalletData();
        setActiveTab('transactions');
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to deposit funds.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in deposit:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle withdraw funds
  const handleWithdraw = async (amount: number) => {
    try {
      const response = await withdrawFunds(amount);
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.message
        });
        fetchWalletData();
        setActiveTab('transactions');
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to withdraw funds.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in withdrawal:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle lock collateral
  const handleLockCollateral = async (amount: number) => {
    try {
      // Generate a random order ID
      setOrderId('ORD-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
      
      const response = await lockCollateral(amount, orderId);
      
      if (response.success) {
        toast({
          title: "Collateral Locked",
          description: `${response.message} for Order ${orderId}`
        });
        fetchWalletData();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to lock collateral.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error locking collateral:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle release collateral
  const handleReleaseCollateral = async (amount: number) => {
    try {
      if (!wallet || amount > wallet.collateral_locked) {
        toast({
          title: "Invalid Amount",
          description: "Amount exceeds locked collateral.",
          variant: "destructive"
        });
        return;
      }
      
      const response = await releaseCollateral(amount, orderId);
      
      if (response.success) {
        toast({
          title: "Collateral Released",
          description: `${response.message} for Order ${orderId}`
        });
        fetchWalletData();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to release collateral.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error releasing collateral:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Refresh wallet data
  const handleRefresh = () => {
    fetchWalletData();
    toast({
      title: "Refreshed",
      description: "Wallet data has been refreshed."
    });
  };

  // Use effect to set active tab from location state
  useEffect(() => {
    if (locationState?.activeTab) {
      setActiveTab(locationState.activeTab);
    }
  }, [location]);

  // Load wallet data on mount
  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Wallet</h1>
          <div className="flex gap-2">
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Balance 
            wallet={wallet} 
            balanceHistory={balanceHistory} 
            loading={loading} 
          />
          
          <AssetAllocation 
            wallet={wallet} 
            orderId={orderId}
            onLockCollateral={handleLockCollateral}
            onReleaseCollateral={handleReleaseCollateral}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-6">
            <TransactionHistory 
              transactions={transactions}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="deposit" className="space-y-6">
            <DepositForm onDeposit={handleDeposit} wallet={wallet} />
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-6">
            <WithdrawForm 
              wallet={wallet}
              onWithdraw={handleWithdraw}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default Wallet;
