import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertCircle, Percent, TrendingUp, TrendingDown } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';

const OrderWalletSummary = () => {
  const { 
    wallet, 
    loading, 
    availableBalance, 
    lockedBalance, 
    refreshWallet,
    addFunds 
  } = useWallet();
  
  const { toast } = useToast();
  
  // Refresh wallet on component mount
  useEffect(() => {
    refreshWallet();
  }, []);

  // Format a currency value
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 2,
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('NPR', 'Rs.');
  };

  // Handle the add funds button
  const handleAddFunds = async () => {
    console.log('Add funds clicked');
    // Add a fixed amount for testing
    const amount = 10000;
    
    const success = await addFunds(amount);
    if (success) {
      toast({
        title: 'Funds Added',
        description: `Rs.${amount.toFixed(2)} has been added to your wallet.`
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <svg 
              viewBox="0 0 24 24" 
              className="h-5 w-5 mr-2 fill-current"
            >
              <path d="M4.5 3C3.67157 3 3 3.67157 3 4.5V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V4.5C21 3.67157 20.3284 3 19.5 3H4.5ZM8.79289 4.79289C8.40237 4.40237 7.77921 4.40237 7.38868 4.79289C6.99816 5.18342 6.99816 5.80658 7.38868 6.19711L9.59158 8.4H7.75C7.19772 8.4 6.75 8.84772 6.75 9.4C6.75 9.95228 7.19772 10.4 7.75 10.4H12.25C12.8023 10.4 13.25 9.95228 13.25 9.4C13.25 8.84772 12.8023 8.4 12.25 8.4H10.4084L12.6113 6.19711C13.0018 5.80658 13.0018 5.18342 12.6113 4.79289C12.2208 4.40237 11.5976 4.40237 11.2071 4.79289L9 7L8.79289 4.79289ZM6.75 14.6C6.75 14.0477 7.19772 13.6 7.75 13.6H12.25C12.8023 13.6 13.25 14.0477 13.25 14.6C13.25 15.1523 12.8023 15.6 12.25 15.6H10.4084L12.6113 17.8029C13.0018 18.1934 13.0018 18.8166 12.6113 19.2071C12.2208 19.5976 11.5976 19.5976 11.2071 19.2071L9 17L6.79289 19.2071C6.40237 19.5976 5.77921 19.5976 5.38868 19.2071C4.99816 18.8166 4.99816 18.1934 5.38868 17.8029L7.59158 15.6H7.75C7.19772 15.6 6.75 15.1523 6.75 14.6ZM15.25 8.4C14.6977 8.4 14.25 8.84772 14.25 9.4C14.25 9.95228 14.6977 10.4 15.25 10.4H16.25C16.8023 10.4 17.25 9.95228 17.25 9.4C17.25 8.84772 16.8023 8.4 16.25 8.4H15.25ZM14.25 14.6C14.25 14.0477 14.6977 13.6 15.25 13.6H16.25C16.8023 13.6 17.25 14.0477 17.25 14.6C17.25 15.1523 16.8023 15.6 16.25 15.6H15.25C14.6977 15.6 14.25 15.1523 14.25 14.6Z" />
            </svg>
            Trading Wallet
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddFunds}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Funds
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-4">
          <h3 className="text-3xl font-bold">
            {loading ? 'Loading...' : formatNumber(wallet?.balance || 0)}
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              Available
            </div>
            <div className="font-medium">
              {formatNumber(availableBalance)}
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full" 
              style={{ 
                width: `${wallet && wallet.balance > 0 
                  ? Math.max(10, (availableBalance / wallet.balance) * 100) 
                  : 0}%` 
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              Locked in Orders
            </div>
            <div className="font-medium">
              {formatNumber(lockedBalance)}
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-amber-500 h-full" 
              style={{ 
                width: `${wallet && wallet.balance > 0 
                  ? Math.max(5, (lockedBalance / wallet.balance) * 100) 
                  : 0}%` 
              }}
            ></div>
          </div>
        </div>

        {lockedBalance > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              You have funds locked in pending orders.
              They will be released when orders are fulfilled or canceled.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderWalletSummary; 