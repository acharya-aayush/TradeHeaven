import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from 'lucide-react';
import { WalletData } from '@/services/walletService';

interface DepositFormProps {
  onDeposit: (amount: number) => Promise<void>;
  wallet?: WalletData | null;
}

export const DepositForm: React.FC<DepositFormProps> = ({ onDeposit, wallet }) => {
  const [depositAmount, setDepositAmount] = useState<string>('');
  const isNewUser = wallet && wallet.balance === 0;

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      onDeposit(amount);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit Funds</CardTitle>
        <CardDescription>Add money to your trading account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isNewUser && (
          <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
            <InfoIcon className="h-5 w-5 text-blue-500" />
            <AlertTitle>Welcome to TradeHeaven!</AlertTitle>
            <AlertDescription>
              As a new user, you'll need to deposit funds to start trading. Use the form below to add money to your account.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="depositAmount">Amount to Deposit</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">Rs.</div>
              <Input 
                id="depositAmount" 
                className="pl-9" 
                placeholder="0.00" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <Button className="flex-1" variant="outline" onClick={() => setDepositAmount('100')}>Rs. 100</Button>
            <Button className="flex-1" variant="outline" onClick={() => setDepositAmount('500')}>Rs. 500</Button>
            <Button className="flex-1" variant="outline" onClick={() => setDepositAmount('1000')}>Rs. 1,000</Button>
            <Button className="flex-1" variant="outline" onClick={() => setDepositAmount('5000')}>Rs. 5,000</Button>
          </div>
        </div>
        
        <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <AlertTitle>Demo Mode</AlertTitle>
          <AlertDescription>
            This is a demonstration wallet. In a real application, this would connect to a payment processor.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex-col space-y-2 items-start">
        <p className="text-sm text-muted-foreground pb-2">By proceeding, you agree to our deposit terms and conditions.</p>
        <div className="flex gap-3 w-full">
          <Button className="flex-1" variant="outline" onClick={() => setDepositAmount('')}>Cancel</Button>
          <Button 
            className="flex-1" 
            onClick={handleDeposit}
            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
          >
            Confirm Deposit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
