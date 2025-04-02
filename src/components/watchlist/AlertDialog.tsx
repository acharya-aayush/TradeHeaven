
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceAlert } from '@/services/watchlistService';

interface AlertDialogProps {
  symbol: string;
  stockPrice: number;
  onCreateAlert: (
    symbol: string, 
    type: PriceAlert['type'], 
    condition: PriceAlert['condition'], 
    threshold: number
  ) => Promise<void>;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  symbol,
  stockPrice,
  onCreateAlert
}) => {
  const [alertType, setAlertType] = useState<PriceAlert['type']>('price');
  const [condition, setCondition] = useState<PriceAlert['condition']>('above');
  const [threshold, setThreshold] = useState<string>(stockPrice.toFixed(2));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onCreateAlert(
        symbol,
        alertType,
        condition,
        parseFloat(threshold)
      );
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1">
          <Bell className="h-4 w-4" />
          Set Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Price Alert for {symbol}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="alert-type">Alert Type</Label>
            <Select 
              value={alertType} 
              onValueChange={(value) => setAlertType(value as PriceAlert['type'])}
            >
              <SelectTrigger id="alert-type">
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="percentage">Percentage Change</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="support">Support Level</SelectItem>
                <SelectItem value="resistance">Resistance Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select 
              value={condition} 
              onValueChange={(value) => setCondition(value as PriceAlert['condition'])}
            >
              <SelectTrigger id="condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
                <SelectItem value="crosses">Crosses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">
              {alertType === 'price' && 'Price Threshold ($)'}
              {alertType === 'percentage' && 'Percentage Change (%)'}
              {alertType === 'volume' && 'Volume Threshold'}
              {alertType === 'support' && 'Support Level ($)'}
              {alertType === 'resistance' && 'Resistance Level ($)'}
            </Label>
            <Input
              id="threshold"
              type="number"
              step={alertType === 'percentage' ? '0.1' : '0.01'}
              min={alertType === 'percentage' ? '-100' : '0'}
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !threshold}>
              Create Alert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
