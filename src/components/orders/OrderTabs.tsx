
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { OrderData } from '@/lib/data/mockData';
import OrdersTable from './OrdersTable';

interface OrderTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  orders: OrderData[];
  loading: boolean;
  error: string | null;
  handleCancelOrder: (orderId: string) => Promise<void>;
  formatDate: (dateString: string) => string;
}

const OrderTabs: React.FC<OrderTabsProps> = ({
  activeTab,
  setActiveTab,
  orders,
  loading,
  error,
  handleCancelOrder,
  formatDate
}) => {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="open">Open</TabsTrigger>
        <TabsTrigger value="filled">Filled</TabsTrigger>
        <TabsTrigger value="canceled">Canceled</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab} className="mt-0">
        <OrdersTable 
          orders={orders}
          loading={loading}
          activeTab={activeTab}
          handleCancelOrder={handleCancelOrder}
          formatDate={formatDate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default OrderTabs;
