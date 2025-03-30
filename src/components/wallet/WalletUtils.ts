
import { Transaction } from '@/services/walletService';

// Format currency for display
export const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

// Format date for display
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Get transaction type label
export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'load':
      return 'Deposit';
    case 'withdraw':
      return 'Withdrawal';
    case 'collateral_lock':
      return 'Collateral Lock';
    case 'collateral_release':
      return 'Collateral Release';
    default:
      return type;
  }
};

// Get transaction type color class
export const getTypeColor = (type: string) => {
  switch (type) {
    case 'load':
    case 'collateral_release':
      return 'text-green-600';
    case 'withdraw':
    case 'collateral_lock':
      return 'text-red-600';
    default:
      return '';
  }
};

// Generate balance history from transactions
export const generateBalanceHistory = (transactions: Transaction[], currentBalance: number) => {
  // Start with current balance and work backwards
  const history: { date: string; balance: number }[] = [];
  let runningBalance = currentBalance || 0;
  
  // Use last 10 transactions to create a history
  const recentTransactions = [...transactions].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  recentTransactions.forEach((tx, index) => {
    if (index < 10) {
      // For each transaction, adjust balance based on transaction type and amount
      const date = new Date(tx.timestamp).toLocaleDateString();
      
      // Add transaction impact to running balance
      let balanceImpact = 0;
      if (tx.type === 'load') {
        balanceImpact = -tx.amount; // Reverse since we're going backwards
      } else if (tx.type === 'withdraw') {
        balanceImpact = Math.abs(tx.amount); // Reverse since we're going backwards
      }
      
      if (index > 0) {
        runningBalance = runningBalance - balanceImpact;
      }
      
      history.push({
        date,
        balance: runningBalance
      });
    }
  });

  return history.slice(-7); // Return last 7 data points
};

// Get asset allocation data for pie chart
export const getAssetAllocation = (balance?: number, collateralLocked?: number) => {
  if (balance === undefined || collateralLocked === undefined) return [];
  
  const availableBalance = balance - collateralLocked;
  
  return [
    { name: 'Available Balance', value: availableBalance },
    { name: 'Locked Collateral', value: collateralLocked }
  ];
};
