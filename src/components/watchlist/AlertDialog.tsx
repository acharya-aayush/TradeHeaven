
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
import { Bell, BarChart3, Volume2, Calendar, Percent } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceAlert } from '@/services/watchlistService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [alertType, setAlertType] = useState<PriceAlert['type']>('price');
  const [condition, setCondition] = useState<PriceAlert['condition']>('above');
  const [threshold, setThreshold] = useState<string>(stockPrice.toFixed(2));
  const [selectedTab, setSelectedTab] = useState<string>('price');
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
      toast({
        title: "Alert created",
        description: `A new alert has been set for ${symbol}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to create alert",
        description: "An error occurred while creating your alert.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setAlertType(value as PriceAlert['type']);
    
    // Reset threshold based on tab
    if (value === 'price') {
      setThreshold(stockPrice.toFixed(2));
    } else if (value === 'percentage') {
      setThreshold('5.0');
    } else if (value === 'volume') {
      setThreshold('1000');
    } else {
      setThreshold('0');
    }
  }

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
        
        <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="price" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Price</span>
            </TabsTrigger>
            <TabsTrigger value="percentage" className="flex items-center gap-1">
              <Percent className="h-4 w-4" />
              <span className="hidden sm:inline">Percent</span>
            </TabsTrigger>
            <TabsTrigger value="volume" className="flex items-center gap-1">
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Volume</span>
            </TabsTrigger>
            <TabsTrigger value="event" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="price">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
                <Label htmlFor="threshold">Price Threshold (Rs.)</Label>
                <Input
                  id="threshold"
                  type="number"
                  step="0.01"
                  min="0"
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
          </TabsContent>

          <TabsContent value="percentage">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="percentage-condition">Change Direction</Label>
                <Select 
                  value={condition} 
                  onValueChange={(value) => setCondition(value as PriceAlert['condition'])}
                >
                  <SelectTrigger id="percentage-condition">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Increases by</SelectItem>
                    <SelectItem value="below">Decreases by</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentage-threshold">Percentage Change (%)</Label>
                <Input
                  id="percentage-threshold"
                  type="number"
                  step="0.1"
                  min="0"
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
          </TabsContent>

          <TabsContent value="volume">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="volume-condition">Volume Condition</Label>
                <Select 
                  value={condition} 
                  onValueChange={(value) => setCondition(value as PriceAlert['condition'])}
                >
                  <SelectTrigger id="volume-condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Exceeds</SelectItem>
                    <SelectItem value="below">Falls below</SelectItem>
                    <SelectItem value="crosses">Changes by</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume-threshold">Volume (shares)</Label>
                <Input
                  id="volume-threshold"
                  type="number"
                  min="0"
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
          </TabsContent>

          <TabsContent value="event">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select 
                  defaultValue="dividend"
                  onValueChange={(value) => setAlertType(value as PriceAlert['type'])}
                >
                  <SelectTrigger id="event-type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dividend">Dividend Announcement</SelectItem>
                    <SelectItem value="earnings">Earnings Report</SelectItem>
                    <SelectItem value="agm">Annual General Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  Create Alert
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
