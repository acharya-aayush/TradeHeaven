
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { DollarSign, AlertCircle } from 'lucide-react';
import { WalletData } from '@/services/walletService';
import { formatCurrency } from './WalletUtils';

interface WithdrawFormProps {
  wallet: WalletData | null;
  onWithdraw: (amount: number) => Promise<void>;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ wallet, onWithdraw }) => {
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!isNaN(amount) && amount > 0) {
      onWithdraw(amount);
    }
  };

  const availableBalance = (wallet?.balance || 0) - (wallet?.collateral_locked || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>Transfer money to your bank account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="withdrawAmount">Amount to Withdraw</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="withdrawAmount" 
                className="pl-9" 
                placeholder="0.00" 
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Available Balance: {formatCurrency(availableBalance)}
            </p>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between text-sm mb-2">
              <span>Withdrawal Amount</span>
              <span>{withdrawAmount ? formatCurrency(parseFloat(withdrawAmount) || 0) : '$0.00'}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Fee</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>{withdrawAmount ? formatCurrency(parseFloat(withdrawAmount) || 0) : '$0.00'}</span>
            </div>
          </div>
        </div>
        
        <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <AlertTitle>Demo Mode</AlertTitle>
          <AlertDescription>
            This is a demonstration wallet. In a real application, you would select a bank account for withdrawal.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex-col space-y-2 items-start">
        <p className="text-sm text-muted-foreground pb-2">By proceeding, you agree to our withdrawal terms and conditions.</p>
        <div className="flex gap-3 w-full">
          <Button className="flex-1" variant="outline" onClick={() => setWithdrawAmount('')}>Cancel</Button>
          <Button 
            className="flex-1" 
            onClick={handleWithdraw}
            disabled={
              !withdrawAmount || 
              parseFloat(withdrawAmount) <= 0 || 
              parseFloat(withdrawAmount) > availableBalance
            }
          >
            Confirm Withdrawal
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
