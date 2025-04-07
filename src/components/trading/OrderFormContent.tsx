
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { placeOrder } from '@/services/orderService';
import InsufficientFundsDialog from './InsufficientFundsDialog';
import { OrderFormContentProps } from './types';
import { tradingEvents } from '@/events/tradingEvents';

const OrderFormContent: React.FC<OrderFormContentProps> = ({ 
  side, 
  symbol, 
  currentPrice, 
  onOrderPlaced,
  onClose
}) => {
  const { toast } = useToast();
  const { wallet, availableBalance, lockCollateral, refreshWallet, isWalletSufficient } = useWallet();
  
  // Order state
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('limit');
  const [quantity, setQuantity] = useState<number>(5);
  const [price, setPrice] = useState<number>(currentPrice || 0);
  const [total, setTotal] = useState<number>((currentPrice || 0) * quantity);
  const [loading, setLoading] = useState<boolean>(false);
  const [useTicks, setUseTicks] = useState<boolean>(false);
  
  // Dialogs
  const [showInsufficientFundsDialog, setShowInsufficientFundsDialog] = useState<boolean>(false);
  
  // Update price when current price changes
  useEffect(() => {
    if (currentPrice && orderType !== 'market') {
      setPrice(currentPrice);
      updateTotal(quantity, currentPrice);
    }
  }, [currentPrice]);
  
  // Calculate total when quantity or price changes
  const updateTotal = (qty: number, prc: number) => {
    setTotal(qty * prc);
  };
  
  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = parseInt(e.target.value) || 0;
    setQuantity(qty);
    updateTotal(qty, price);
  };
  
  // Handle price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prc = parseFloat(e.target.value) || 0;
    setPrice(prc);
    updateTotal(quantity, prc);
  };
  
  // Handle quantity slider change
  const handleQuantitySlider = (value: number[]) => {
    const qty = value[0];
    setQuantity(qty);
    updateTotal(qty, price);
  };
  
  // Handle price slider change
  const handlePriceSlider = (value: number[]) => {
    const prc = value[0];
    setPrice(prc);
    updateTotal(quantity, prc);
  };
  
  // Place the order
  const handlePlaceOrder = async () => {
    try {
      // Validation
      if (quantity <= 0) {
        toast({
          title: 'Invalid Quantity',
          description: 'Quantity must be greater than 0',
          variant: 'destructive',
        });
        return;
      }
      
      if (orderType !== 'market' && price <= 0) {
        toast({
          title: 'Invalid Price',
          description: 'Price must be greater than 0',
          variant: 'destructive',
        });
        return;
      }
      
      // For buy orders, check if user has enough funds
      if (side === 'buy') {
        const orderValue = quantity * (orderType === 'market' ? currentPrice || 0 : price);
        
        if (!isWalletSufficient(orderValue)) {
          setShowInsufficientFundsDialog(true);
          return;
        }
        
        // Lock collateral for the order
        const collateralLocked = await lockCollateral(orderValue);
        if (!collateralLocked) {
          toast({
            title: 'Failed to Lock Funds',
            description: 'Unable to place order due to an error locking funds.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      setLoading(true);
      
      // Place the order
      const response = await placeOrder(
        symbol || 'NABIL',
        side,
        orderType,
        quantity,
        orderType === 'market' ? undefined : price
      );
      
      if (response.success) {
        // Refresh the wallet to show updated balance
        refreshWallet();
        
        toast({
          title: 'Order Placed',
          description: `Successfully placed a ${side} order for ${quantity} shares of ${symbol}`,
        });
        
        // Reset the form
        setQuantity(5);
        setPrice(currentPrice || 0);
        setTotal(5 * (currentPrice || 0));
        
        // Notify parent component
        if (onOrderPlaced) {
          onOrderPlaced();
        }
        
        // Close the form if requested
        if (onClose) {
          onClose();
        }
      } else {
        toast({
          title: 'Failed to Place Order',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      console.error('Error placing order:', err);
      toast({
        title: 'Error',
        description: err.message || 'An error occurred while placing your order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="orderType">Order Type</Label>
        <Select 
          value={orderType} 
          onValueChange={(value) => setOrderType(value as 'market' | 'limit' | 'stop')}
        >
          <SelectTrigger id="orderType">
            <SelectValue placeholder="Select Order Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market">Market</SelectItem>
            <SelectItem value="limit">Limit</SelectItem>
            <SelectItem value="stop">Stop</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center">
            <Label htmlFor="useTicks" className="mr-2 text-xs">Use slider</Label>
            <Switch id="useTicks" checked={useTicks} onCheckedChange={setUseTicks} />
          </div>
        </div>
        
        {useTicks ? (
          <div className="py-4">
            <Slider 
              value={[quantity]} 
              min={1} 
              max={100} 
              step={1} 
              onValueChange={handleQuantitySlider} 
            />
            <div className="text-right text-sm text-muted-foreground mt-1">
              {quantity} shares
            </div>
          </div>
        ) : (
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            className="mt-1"
          />
        )}
      </div>
      
      {orderType !== 'market' && (
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="price">Price (Rs.)</Label>
            {useTicks && (
              <div className="text-xs text-muted-foreground">
                +/- 10% of current price
              </div>
            )}
          </div>
          
          {useTicks ? (
            <div className="py-4">
              <Slider 
                value={[price]} 
                min={Math.max(1, (currentPrice || price) * 0.9)} 
                max={(currentPrice || price) * 1.1} 
                step={0.1} 
                onValueChange={handlePriceSlider} 
              />
              <div className="text-right text-sm text-muted-foreground mt-1">
                Rs. {price.toFixed(2)}
              </div>
            </div>
          ) : (
            <Input
              id="price"
              type="number"
              value={price}
              onChange={handlePriceChange}
              step={0.01}
              min={0.01}
              className="mt-1"
            />
          )}
        </div>
      )}
      
      <div className="py-2 px-3 bg-muted rounded-md">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price:</span>
          <span className="font-medium">
            {orderType === 'market' ? 'Market Price' : `Rs. ${price.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-muted-foreground">Total Value:</span>
          <span className="font-medium">Rs. {total.toFixed(2)}</span>
        </div>
      </div>
      
      {side === 'buy' && (
        <div>
          {total > (availableBalance || 0) && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Insufficient funds. You need Rs. {total.toFixed(2)} to place this order.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      <Button 
        className={`w-full ${side === 'buy' ? 'bg-market-up hover:bg-market-up/90' : 'bg-market-down hover:bg-market-down/90'}`} 
        onClick={handlePlaceOrder}
        disabled={loading || (side === 'buy' && total > (availableBalance || 0))}
      >
        {loading ? 'Processing...' : `Place ${side.toUpperCase()} Order`}
      </Button>
      
      <InsufficientFundsDialog
        open={showInsufficientFundsDialog}
        onOpenChange={setShowInsufficientFundsDialog}
        orderTotal={total}
        availableBalance={availableBalance || 0}
      />
    </div>
  );
};

export default OrderFormContent;
