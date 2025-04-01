
import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ordersData } from '@/lib/data/mockData';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Filter, Plus } from 'lucide-react';
import OrderForm from '@/components/trading/OrderForm';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? ordersData 
    : ordersData.filter(order => {
        if (activeTab === 'open') return order.status === 'open';
        if (activeTab === 'filled') return order.status === 'filled';
        if (activeTab === 'canceled') return order.status === 'canceled' || order.status === 'rejected';
        return true;
      });
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <CardTitle className="text-lg font-medium">Orders</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                <Button size="sm" className="h-8 gap-1">
                  <Plus className="h-4 w-4" />
                  <span>New Order</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="filled">Filled</TabsTrigger>
                  <TabsTrigger value="canceled">Canceled</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <OrderForm />
        </div>
      </div>
    </AppShell>
  );
};

export default Orders;
