
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderFormContentProps, OrderFormProps } from './types';
import OrderFormContent from './OrderFormContent';

const OrderFormTabs: React.FC<OrderFormProps> = ({ 
  symbol = 'NABIL', 
  currentPrice = 985.65,
  onOrderPlaced,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  
  return (
    <Tabs defaultValue="buy" className="w-full" onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')}>
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="buy" className="data-[state=active]:bg-market-up data-[state=active]:text-white">Buy</TabsTrigger>
        <TabsTrigger value="sell" className="data-[state=active]:bg-market-down data-[state=active]:text-white">Sell</TabsTrigger>
      </TabsList>
      <TabsContent value="buy">
        <OrderFormContent 
          side="buy" 
          symbol={symbol} 
          currentPrice={currentPrice} 
          onOrderPlaced={onOrderPlaced}
          onClose={onClose}
        />
      </TabsContent>
      <TabsContent value="sell">
        <OrderFormContent 
          side="sell" 
          symbol={symbol} 
          currentPrice={currentPrice} 
          onOrderPlaced={onOrderPlaced}
          onClose={onClose}
        />
      </TabsContent>
    </Tabs>
  );
};

export default OrderFormTabs;
