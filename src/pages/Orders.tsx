import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Plus, X } from 'lucide-react';
import OrderTabs from "@/components/orders/OrderTabs";
import OrderForm from '@/components/trading/OrderForm';
import OrderWalletSummary from '@/components/trading/OrderWalletSummary';
import { useOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from '@/contexts/WalletContext';

const Orders = () => {
  const { 
    orders, 
    loading, 
    error, 
    activeTab, 
    setActiveTab, 
    cancelOrder,
    executeOrder,
    loadOrders,
    formatDate
  } = useOrders();
  
  const { wallet, lockedBalance } = useWallet();
  const [showForm, setShowForm] = useState(false);

  // Log wallet and orders data for debugging
  useEffect(() => {
    console.log("Orders page - Wallet data:", wallet);
    console.log("Orders page - Locked balance:", lockedBalance);
    console.log("Orders page - Orders:", orders);
  }, [wallet, lockedBalance, orders]);

  const handleOrderPlaced = () => {
    loadOrders();
    setShowForm(false);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6 md:gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              View and manage your order history
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Close Form
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Debug alert for locked collateral */}
        {lockedBalance > 0 && (
          <Alert>
            <AlertDescription className="text-sm">
              You currently have <span className="font-semibold">Rs. {lockedBalance.toFixed(2)}</span> locked as collateral for your open orders.
              This amount is reserved until your orders are filled or canceled.
            </AlertDescription>
          </Alert>
        )}

        {/* Responsive layout for desktop and mobile */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Left column for order history */}
          <div className="xl:col-span-3 space-y-4">
            {showForm && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Place Order</CardTitle>
                    <CardDescription>
                      Enter the details to place a new order
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <OrderForm onOrderPlaced={handleOrderPlaced} onClose={() => setShowForm(false)} />
                </CardContent>
              </Card>
            )}

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View all your orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-6 overflow-hidden">
                <OrderTabs 
                  orders={orders}
                  loading={loading}
                  error={error}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  handleCancelOrder={cancelOrder}
                  handleExecuteOrder={executeOrder}
                  formatDate={formatDate}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Right column for wallet summary */}
          <div className="xl:col-span-1">
            <OrderWalletSummary />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Orders;
