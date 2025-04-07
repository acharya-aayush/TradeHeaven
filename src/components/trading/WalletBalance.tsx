
import React from 'react';
import { Loader2 } from 'lucide-react';
import { WalletData } from '@/types/wallet';

interface WalletBalanceProps {
  wallet: WalletData | null;
  loading: boolean;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ wallet, loading }) => {
  return (
    <div className="mb-4 p-3 bg-muted rounded-md">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Available Balance:</span>
          <div className="font-medium">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin inline mr-1" />
            ) : (
              `Rs. ${wallet?.balance - (wallet?.collateral_locked || 0) || 0}.00`
            )}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Total Balance:</span>
          <div className="font-medium">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin inline mr-1" />
            ) : (
              `Rs. ${wallet?.balance.toFixed(2) || '0.00'}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
