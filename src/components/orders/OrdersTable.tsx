
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { OrderData } from '@/lib/data/mockData';

interface OrdersTableProps {
  orders: OrderData[];
  loading: boolean;
  activeTab: string;
  handleCancelOrder: (orderId: string) => Promise<void>;
  formatDate: (dateString: string) => string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  loading, 
  activeTab,
  handleCancelOrder,
  formatDate
}) => {
  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => {
        if (activeTab === 'open') return order.status === 'open';
        if (activeTab === 'filled') return order.status === 'filled';
        if (activeTab === 'canceled') return order.status === 'canceled' || order.status === 'rejected';
        return true;
      });

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
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
              <TableCell colSpan={8} className="text-center py-8">Loading orders...</TableCell>
            </TableRow>
          ) : filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">No orders found</TableCell>
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
                <TableCell className="font-mono">
                  {order.price ? `$${order.price.toFixed(2)}` : 'Market'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {order.status === 'open' && <Clock className="h-4 w-4 text-yellow-500" />}
                    {order.status === 'filled' && <CheckCircle className="h-4 w-4 text-market-up" />}
                    {(order.status === 'canceled' || order.status === 'rejected') && 
                      <XCircle className="h-4 w-4 text-market-down" />}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {order.status === 'open' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
