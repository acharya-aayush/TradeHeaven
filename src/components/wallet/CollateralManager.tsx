import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { WalletData } from '@/services/walletService';
import { formatCurrency } from './WalletUtils';

interface CollateralManagerProps {
  wallet: WalletData | null;
  orderId: string;
  onLockCollateral: (amount: number) => Promise<void>;
  onReleaseCollateral: (amount: number) => Promise<void>;
}

export const CollateralManager: React.FC<CollateralManagerProps> = ({ 
  wallet, 
  orderId, 
  onLockCollateral, 
  onReleaseCollateral 
}) => {
  const [collateralAmount, setCollateralAmount] = useState<string>('');
  const [releaseAmount, setReleaseAmount] = useState<string>('');

  const handleLockCollateral = () => {
    const amount = parseFloat(collateralAmount);
    if (!isNaN(amount) && amount > 0) {
      onLockCollateral(amount);
      setCollateralAmount('');
    }
  };

  const handleReleaseCollateral = () => {
    const amount = parseFloat(releaseAmount);
    if (!isNaN(amount) && amount > 0 && wallet && amount <= wallet.collateral_locked) {
      onReleaseCollateral(amount);
      setReleaseAmount('');
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Manage Collateral</DialogTitle>
        <DialogDescription>
          Lock or release funds for order collateral.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="orderId">Current Order ID</Label>
          <Input id="orderId" value={orderId} disabled className="bg-muted" />
        </div>
        
        <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <AlertTitle>Current Collateral Status</AlertTitle>
          <AlertDescription>
            Locked Collateral: {formatCurrency(wallet?.collateral_locked || 0)}
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-2">
          <Label htmlFor="lockAmount">Lock Amount</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">Rs.</div>
            <Input 
              id="lockAmount" 
              className="pl-9" 
              placeholder="0.00" 
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleLockCollateral}
            disabled={!collateralAmount || parseFloat(collateralAmount) <= 0}
          >
            Lock Funds as Collateral
          </Button>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="releaseAmount">Release Amount</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">Rs.</div>
            <Input 
              id="releaseAmount" 
              className="pl-9" 
              placeholder="0.00" 
              value={releaseAmount}
              onChange={(e) => setReleaseAmount(e.target.value)}
            />
          </div>
          <Button 
            variant="outline"
            onClick={handleReleaseCollateral}
            disabled={!releaseAmount || parseFloat(releaseAmount) <= 0 || parseFloat(releaseAmount) > (wallet?.collateral_locked || 0)}
          >
            Release Collateral
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
