import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from 'lucide-react';
import { OrderData } from '@/lib/data/mockData';
import OrdersTable from './OrdersTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  orders: OrderData[];
  loading: boolean;
  error: string | null;
  handleCancelOrder: (orderId: string) => Promise<void>;
  handleExecuteOrder: (orderId: string, executionPrice?: number) => Promise<any>;
  formatDate: (dateString: string) => string;
}

const OrderTabs: React.FC<OrderTabsProps> = ({
  activeTab,
  setActiveTab,
  orders,
  loading,
  error,
  handleCancelOrder,
  handleExecuteOrder,
  formatDate
}) => {
  const [showStatusInfo, setShowStatusInfo] = useState(false);

  // Calculate counts for order status types
  const openCount = orders.filter(order => order.status === 'open' || order.status === 'pending').length;
  const filledCount = orders.filter(order => order.status === 'filled' || order.status === 'executed').length;
  const canceledCount = orders.filter(order => order.status === 'canceled' || order.status === 'rejected').length;
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Log orders to help debugging
  React.useEffect(() => {
    console.log('Orders in OrderTabs:', orders);
  }, [orders]);

  return (
    <div className="space-y-4">
      {/* Status Info Card */}
      {showStatusInfo && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              Order Status Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2 pt-0">
            <div className="flex items-center justify-between">
              <span>Open Orders:</span>
              <Badge variant="outline">{openCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Filled/Executed Orders:</span>
              <Badge variant="default">{filledCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Canceled/Rejected Orders:</span>
              <Badge variant="destructive">{canceledCount}</Badge>
            </div>
            <p className="text-muted-foreground">
              Open orders lock collateral until they are filled, executed, or canceled.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Order Status</h3>
        <button 
          onClick={() => setShowStatusInfo(!showStatusInfo)} 
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {showStatusInfo ? 'Hide Info' : 'Show Info'}
        </button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-lg mb-4">
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
          <TabsTrigger value="filled">Filled ({filledCount})</TabsTrigger>
          <TabsTrigger value="canceled">Canceled ({canceledCount})</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {activeTab === 'debug' ? (
            <div className="p-4 border rounded-md bg-muted">
              <h3 className="font-medium mb-2">Order Status Debug Information</h3>
              <pre className="text-xs overflow-auto p-2 bg-card border rounded-md max-h-96">
                {JSON.stringify(orders, null, 2)}
              </pre>
            </div>
          ) : (
            <OrdersTable 
              orders={orders}
              loading={loading}
              activeTab={activeTab}
              handleCancelOrder={handleCancelOrder}
              handleExecuteOrder={handleExecuteOrder}
              formatDate={formatDate}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderTabs;
