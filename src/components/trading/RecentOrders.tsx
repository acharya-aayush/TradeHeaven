
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersData } from '@/lib/data/mockData';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const RecentOrders = () => {
  const { toast } = useToast();
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ordersData.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={order.side === 'buy' ? 'default' : 'destructive'}
                    className="capitalize"
                  >
                    {order.side}
                  </Badge>
                  <span className="font-medium">{order.symbol}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {order.quantity} shares @ {order.price ? `Rs. ${order.price.toFixed(2)}` : 'Market'} ({order.type})
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={
                    order.status === 'filled' ? 'outline' :
                    order.status === 'open' ? 'secondary' :
                    'destructive'
                  }
                  className="capitalize"
                >
                  {order.status}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDate(order.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
