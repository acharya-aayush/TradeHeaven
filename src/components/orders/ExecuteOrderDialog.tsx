import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from 'lucide-react';
import { OrderData } from '@/lib/data/mockData';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExecuteOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderData | null;
  onExecute: (orderId: string, executionPrice?: number) => Promise<any>;
}

const ExecuteOrderDialog: React.FC<ExecuteOrderDialogProps> = ({
  open,
  onOpenChange,
  order,
  onExecute
}) => {
  const [executionPrice, setExecutionPrice] = useState<string>(
    order?.price ? order.price.toString() : ''
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset price and error when order changes or dialog opens
  React.useEffect(() => {
    if (order?.price) {
      setExecutionPrice(order.price.toString());
    } else {
      setExecutionPrice('');
    }
    setError(null);
  }, [order, open]);

  const handleExecute = async () => {
    if (!order) return;
    
    try {
      setError(null);
      setIsExecuting(true);
      
      // Validate the price
      const price = executionPrice ? parseFloat(executionPrice) : undefined;
      if (executionPrice && (isNaN(price!) || price! <= 0)) {
        setError('Please enter a valid price greater than 0');
        setIsExecuting(false);
        return;
      }
      
      console.log(`Executing order directly: ${order.id} with price: ${price}`);
      
      // Call the execute function directly
      try {
        const result = await onExecute(order.id, price);
        console.log("Order execution result:", result);
        
        // Close the dialog on successful execution
        onOpenChange(false);
      } catch (executeError: any) {
        console.error("Error in execute function:", executeError);
        setError(executeError?.message || 'Failed to execute order');
      }
    } catch (error: any) {
      console.error('General execution error:', error);
      setError(error?.message || 'Failed to execute order. Please try again.');
    } finally {
      setIsExecuting(false);
    }
  };

  // Calculate the total value of the order
  const calculateTotalValue = (): number => {
    if (!order) return 0;
    
    const price = executionPrice ? parseFloat(executionPrice) : order.price || 0;
    return order.quantity * price;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Execute Order</DialogTitle>
          <DialogDescription>
            You are about to execute this order. This will update your portfolio and wallet balance.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="my-2">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {order && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Symbol</Label>
                <div className="font-medium mt-1">{order.symbol}</div>
              </div>
              <div>
                <Label>Side</Label>
                <div className="font-medium mt-1 capitalize">{order.side}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity</Label>
                <div className="font-medium mt-1">{order.quantity}</div>
              </div>
              <div>
                <Label htmlFor="executionPrice">Execution Price</Label>
                <Input
                  id="executionPrice"
                  value={executionPrice}
                  onChange={(e) => setExecutionPrice(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter execution price"
                />
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm font-medium mb-1">Order Details</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Order Type:</div>
                <div className="font-medium capitalize">{order.type}</div>
                <div>Original Price:</div>
                <div className="font-medium">
                  {order.price ? `Rs. ${order.price.toFixed(2)}` : 'Market Price'}
                </div>
                <div>Total Value:</div>
                <div className="font-medium">
                  Rs. {calculateTotalValue().toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExecute} 
            disabled={isExecuting}
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : 'Execute Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExecuteOrderDialog; 