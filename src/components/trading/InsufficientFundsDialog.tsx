
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/contexts/WalletContext';

interface InsufficientFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderTotal: number;
  availableBalance: number;
}

const InsufficientFundsDialog: React.FC<InsufficientFundsDialogProps> = ({ 
  open, 
  onOpenChange, 
  orderTotal, 
  availableBalance 
}) => {
  const { wallet } = useWallet();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insufficient Funds</DialogTitle>
          <DialogDescription>
            You don't have enough available balance to place this order.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Required funds:</span>
              <span>Rs. {orderTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Available balance:</span>
              <span>Rs. {availableBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Locked collateral:</span>
              <span>Rs. {wallet?.collateral_locked.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>You need additional Rs. {(orderTotal - availableBalance).toFixed(2)} to place this order.</p>
            <p>Please add funds to your wallet or reduce the order size.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InsufficientFundsDialog;
