
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { StockData } from '@/lib/data/mockData';
import { useToast } from "@/hooks/use-toast";

interface OrderPlacementDialogProps {
  selectedStock: StockData;
}

const OrderPlacementDialog: React.FC<OrderPlacementDialogProps> = ({ selectedStock }) => {
  const { toast } = useToast();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place Order for {selectedStock.symbol}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Tabs defaultValue="buy">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="sell">Sell</TabsTrigger>
            </TabsList>
            
            <TabsContent value="buy">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantity</label>
                  <Input type="number" min="1" defaultValue="1" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Order Type</label>
                  <Input type="text" defaultValue="Market" readOnly />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span>Estimated Cost:</span>
                  <span className="font-mono">Rs. {selectedStock.price.toFixed(2)}</span>
                </div>
                <Button className="w-full" onClick={() => {
                  toast({
                    title: "Order Placed",
                    description: `Buy order for ${selectedStock.symbol} has been submitted`,
                  });
                }}>
                  Place Buy Order
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="sell">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantity</label>
                  <Input type="number" min="1" defaultValue="1" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Order Type</label>
                  <Input type="text" defaultValue="Market" readOnly />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span>Estimated Proceeds:</span>
                  <span className="font-mono">Rs. {selectedStock.price.toFixed(2)}</span>
                </div>
                <Button variant="destructive" className="w-full" onClick={() => {
                  toast({
                    title: "Order Placed",
                    description: `Sell order for ${selectedStock.symbol} has been submitted`,
                  });
                }}>
                  Place Sell Order
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderPlacementDialog;
