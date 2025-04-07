import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Play, AlertCircle, Loader2 } from 'lucide-react';
import { OrderData } from '@/lib/data/mockData';
import { Alert, AlertDescription } from "@/components/ui/alert";
import ExecuteOrderDialog from './ExecuteOrderDialog';

interface OrdersTableProps {
  orders: OrderData[];
  loading: boolean;
  activeTab: string;
  handleCancelOrder: (orderId: string) => Promise<void>;
  handleExecuteOrder: (orderId: string, executionPrice?: number) => Promise<any>; 
  formatDate: (dateString: string) => string;
}

// Update OrderData interface to include 'executed' and 'pending' status types
type OrderStatus = 'open' | 'filled' | 'canceled' | 'rejected' | 'executed' | 'pending';

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  loading, 
  activeTab,
  handleCancelOrder,
  handleExecuteOrder,
  formatDate
}) => {
  const [isExecuteDialogOpen, setIsExecuteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);

  // Log orders received to help debug
  useEffect(() => {
    console.log("All orders received:", orders);
    
    // Handle case where orders is undefined or null
    if (!orders || orders.length === 0) {
      console.log("No orders available - possibly still loading or empty array");
      return;
    }
    
    // Create a count of orders by status
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log("Order status count:", statusCounts);
  }, [orders]);

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : (orders || []).filter(order => {
        if (!order) return false;
        
        console.log(`Filtering order ${order.id}, status: ${order.status}, tab: ${activeTab}`);
        if (activeTab === 'open') return order.status === 'open' || order.status === 'pending';
        if (activeTab === 'filled') return order.status === 'filled' || order.status === 'executed';
        if (activeTab === 'canceled') return order.status === 'canceled' || order.status === 'rejected';
        return true;
      });
      
  // Log filtered orders
  useEffect(() => {
    console.log(`Filtered orders for tab ${activeTab}:`, filteredOrders);
  }, [filteredOrders, activeTab]);

  // Open execution dialog for an order
  const openExecuteDialog = (order: OrderData) => {
    setSelectedOrder(order);
    setIsExecuteDialogOpen(true);
  };

  // Handle cancel order with loading state
  const handleCancel = async (orderId: string) => {
    try {
      setCancelLoading(orderId);
      await handleCancelOrder(orderId);
    } finally {
      setCancelLoading(null);
    }
  };

  // Debug info if no orders
  if (orders.length === 0 && !loading) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No orders found. The server might be offline or there are no orders in the database.
        </AlertDescription>
      </Alert>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No orders found for this filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{formatDate(order.timestamp)}</TableCell>
                    <TableCell className="font-medium">{order.symbol}</TableCell>
                    <TableCell className="capitalize">{order.type}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.side === 'buy' ? 'default' : 'destructive'}
                        className="capitalize"
                      >
                        {order.side}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      {order.price ? `Rs. ${order.price.toFixed(2)}` : 'Market Price'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {order.status === 'open' && <Clock className="h-4 w-4 text-yellow-500 mr-1" />}
                        {order.status === 'filled' && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
                        {order.status === 'executed' && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
                        {order.status === 'canceled' && <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                        {order.status === 'rejected' && <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                        {order.status === 'pending' && <Clock className="h-4 w-4 text-blue-500 mr-1" />}
                        <Badge 
                          variant={
                            order.status === 'filled' || order.status === 'executed' ? 'default' :
                            order.status === 'canceled' || order.status === 'rejected' ? 'destructive' :
                            order.status === 'open' ? 'secondary' : 'outline'
                          }
                          className="capitalize"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {(order.status === 'open' || order.status === 'pending') && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCancel(order.id)}
                              disabled={cancelLoading === order.id}
                            >
                              {cancelLoading === order.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : 'Cancel'}
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => openExecuteDialog(order)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Execute
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order execution dialog */}
      <ExecuteOrderDialog
        open={isExecuteDialogOpen}
        onOpenChange={setIsExecuteDialogOpen}
        order={selectedOrder}
        onExecute={handleExecuteOrder}
      />
    </>
  );
};

export default OrdersTable;
