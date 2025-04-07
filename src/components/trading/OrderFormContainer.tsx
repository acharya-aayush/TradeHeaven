
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWallet } from '@/contexts/WalletContext';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import OrderFormTabs from './OrderFormTabs';
import WalletBalance from './WalletBalance';
import { OrderFormProps } from './types';

const OrderFormContainer: React.FC<OrderFormProps> = ({
  symbol = 'NABIL',
  currentPrice = 985.65,
  onOrderPlaced,
  onClose
}) => {
  const { wallet, loading: walletLoading, error: walletError } = useWallet();
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Place Order</CardTitle>
        <CardDescription>Enter the order details below</CardDescription>
      </CardHeader>
      <CardContent>
        <WalletBalance wallet={wallet} loading={walletLoading} />
        
        {walletError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{walletError}</AlertDescription>
          </Alert>
        )}
        
        <OrderFormTabs 
          symbol={symbol}
          currentPrice={currentPrice}
          onOrderPlaced={onOrderPlaced}
          onClose={onClose}
        />
      </CardContent>
    </Card>
  );
};

export default OrderFormContainer;
