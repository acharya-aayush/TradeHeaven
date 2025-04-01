
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { getWalletBalance, WalletData } from "@/services/walletService";
import { placeOrder } from "@/services/orderService";

interface OrderFormProps {
  symbol?: string;
  currentPrice?: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ 
  symbol = 'AAPL', 
  currentPrice = 165.32 
}) => {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<string>('1');
  const [price, setPrice] = useState<string>(currentPrice.toFixed(2));
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load wallet data when component mounts
  useEffect(() => {
    const loadWallet = async () => {
      try {
        const walletData = await getWalletBalance();
        setWallet(walletData);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load wallet:', err);
        setError('Failed to load wallet information. Please check if the wallet server is running.');
      }
    };

    loadWallet();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate order
      if (parseInt(quantity) <= 0) {
        toast({
          title: "Invalid quantity",
          description: "Quantity must be greater than 0",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      if (orderType !== 'market' && (isNaN(parseFloat(price)) || parseFloat(price) <= 0)) {
        toast({
          title: "Invalid price",
          description: "Please enter a valid price",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Check available balance for buy orders
      if (side === 'buy' && wallet) {
        const orderValue = parseInt(quantity) * (orderType === 'market' ? currentPrice : parseFloat(price));
        const availableBalance = wallet.balance - wallet.collateral_locked;
        
        if (orderValue > availableBalance) {
          toast({
            title: "Insufficient funds",
            description: `You need ${formatCurrency(orderValue)} but only have ${formatCurrency(availableBalance)} available.`,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }
      
      // Place order
      const response = await placeOrder(
        symbol,
        side,
        orderType,
        parseInt(quantity),
        orderType !== 'market' ? parseFloat(price) : undefined
      );
      
      // Handle response
      if (response.success) {
        toast({
          title: "Order placed successfully",
          description: `${side.toUpperCase()} ${quantity} shares of ${symbol} at ${
            orderType === 'market' ? 'market price' : `$${price}`
          }`,
        });
        
        // Reload wallet to get updated balance
        const walletData = await getWalletBalance();
        setWallet(walletData);
        
        // Reset form for next order
        setQuantity('1');
        if (orderType !== 'market') {
          setPrice(currentPrice.toFixed(2));
        }
      } else {
        toast({
          title: "Failed to place order",
          description: response.error || "An unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      toast({
        title: "Order submission failed",
        description: err.message || "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate estimated cost/proceeds
  const calculateTotal = () => {
    const qty = parseInt(quantity) || 0;
    const priceValue = orderType === 'market' ? currentPrice : (parseFloat(price) || 0);
    return (qty * priceValue).toFixed(2);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {wallet && (
          <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle>Wallet Balance</AlertTitle>
            <AlertDescription>
              Available: {formatCurrency(wallet.balance - wallet.collateral_locked)}
              <br />
              Locked as Collateral: {formatCurrency(wallet.collateral_locked)}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="buy" onClick={() => setSide('buy')}>Buy</TabsTrigger>
            <TabsTrigger value="sell" onClick={() => setSide('sell')}>Sell</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Symbol</span>
                <span className="font-mono">{symbol}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Price</span>
                <span className="font-mono">${currentPrice.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Order Type</label>
                <Select 
                  defaultValue={orderType} 
                  onValueChange={(value) => setOrderType(value as 'market' | 'limit' | 'stop')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Order Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                    <SelectItem value="stop">Stop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Quantity</label>
                <Input 
                  type="number" 
                  min="1" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="font-mono"
                />
              </div>
              
              {orderType !== 'market' && (
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {orderType === 'limit' ? 'Limit Price' : 'Stop Price'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0.01" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-7 font-mono"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium">Estimated {side === 'buy' ? 'Cost' : 'Proceeds'}</span>
                <span className="font-mono">${calculateTotal()}</span>
              </div>
              
              <Button 
                type="submit"
                className="w-full"
                variant={side === 'buy' ? 'default' : 'destructive'}
                disabled={loading || !wallet}
              >
                {loading ? 'Processing...' : side === 'buy' ? 'Buy' : 'Sell'} {symbol}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
