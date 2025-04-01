
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from 'lucide-react';
import OrderForm from '@/components/trading/OrderForm';
import OrderTabs from '@/components/orders/OrderTabs';
import { useOrders } from '@/hooks/useOrders';

const Orders = () => {
  const {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleCancelOrder,
    formatDate
  } = useOrders();
  
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
              <OrderTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                orders={orders}
                loading={loading}
                error={error}
                handleCancelOrder={handleCancelOrder}
                formatDate={formatDate}
              />
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
