import { useState, useEffect } from 'react';
import { getOrders, cancelOrder, executeOrder } from '@/services/orderService';
import { OrderData, MOCK_ORDERS } from '@/lib/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { usePortfolio } from './usePortfolio';
import { emitTradeExecuted } from '@/events/tradingEvents';

// Key for localStorage
const ORDERS_STORAGE_KEY = 'tradeheaven_orders';

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { releaseCollateral, addFunds, removeFunds, refreshWallet } = useWallet();
  const { updatePortfolio } = usePortfolio();

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  // Load orders from localStorage
  const loadOrdersFromStorage = (): OrderData[] => {
    try {
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        return JSON.parse(savedOrders);
      }
    } catch (err) {
      console.error('Failed to load orders from localStorage:', err);
    }
    return [];
  };

  // Save orders to localStorage
  const saveOrdersToStorage = (orders: OrderData[]) => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.error('Failed to save orders to localStorage:', err);
    }
  };

  // Load orders from API or localStorage
  const loadOrders = async () => {
    try {
      console.log("Loading orders from localStorage or mock data");
      
      // First try to load from localStorage
      const storedOrders = loadOrdersFromStorage();
      
      // If we have stored orders, use them
      if (storedOrders && storedOrders.length > 0) {
        setOrders(storedOrders);
        setLoading(false);
        return;
      }
      
      // Otherwise, load mock orders
      console.log("Setting mock orders directly");
      setOrders(MOCK_ORDERS);
      saveOrdersToStorage(MOCK_ORDERS);
      setLoading(false);
      setError(null);
      
      // This commented section would be used in production
      /* 
      const response = await getOrders();
      if (response.success) {
        setOrders(response.orders);
        saveOrdersToStorage(response.orders);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch orders');
        toast({
          title: "Error",
          description: response.error || "Failed to fetch orders",
          variant: "destructive"
        });
      }
      */
    } catch (err: any) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders');
      toast({
        title: "Error",
        description: err.message || "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancel an order
  const handleCancelOrder = async (orderId: string) => {
    try {
      setLoading(true);
      
      // Find the order to be canceled
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      // For buy orders, release the locked collateral
      if (order.side === 'buy' && order.status === 'open') {
        const collateralAmount = order.quantity * (order.price || 0);
        await releaseCollateral(collateralAmount);
      }
      
      const response = await cancelOrder(orderId);
      
      if (response.success) {
        // Update the order status locally
        const updatedOrders = orders.map(o => 
          o.id === orderId ? { ...o, status: 'canceled' as const } : o
        );
        
        setOrders(updatedOrders);
        saveOrdersToStorage(updatedOrders);
        
        toast({
          title: "Order Canceled",
          description: `Order #${orderId.slice(0, 8)} has been canceled`,
        });
        
        // Refresh wallet to update available/locked balances
        await refreshWallet();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to cancel order",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      console.error('Error canceling order:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to cancel order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Execute an order
  const handleExecuteOrder = async (orderId: string, executionPrice?: number) => {
    try {
      setLoading(true);
      
      // Find the order to be executed
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      console.log(`Starting order execution for ${order.id} (${order.symbol}) at price ${executionPrice || order.price}`);
      console.log(`Order side: ${order.side}`);
      
      // Execute the order with the service
      const response = await executeOrder(orderId, executionPrice);
      console.log("Order execution response:", response);
      
      if (response.success) {
        // Get the final execution price, falling back to the original price if not provided
        const finalPrice = executionPrice || order.price || 0;
        const totalValue = order.quantity * finalPrice;
        
        console.log(`Successfully executed order: ${order.side} ${order.quantity} ${order.symbol} at ${finalPrice} - Total: ${totalValue}`);
        
        try {
          // For buy orders
          if (order.side === 'buy') {
            console.log(`Processing buy order execution`);
            
            // 1. Release any locked collateral if this was an open order
            if (order.status === 'open') {
              const collateralAmount = order.quantity * (order.price || 0);
              console.log(`Releasing collateral: ${collateralAmount}`);
              await releaseCollateral(collateralAmount);
            }
            
            // 2. Remove the funds for the purchase
            console.log(`Removing funds for purchase: ${totalValue}`);
            await removeFunds(totalValue);
            
            // 3. Update the portfolio with the new position
            console.log(`Updating portfolio for buy: ${order.quantity} shares of ${order.symbol} at ${finalPrice}`);
            const portfolioUpdated = updatePortfolio({
              symbol: order.symbol,
              quantity: order.quantity,
              price: finalPrice,
              type: 'buy'
            });
            
            if (!portfolioUpdated) {
              console.error("Failed to update portfolio for buy order");
            }
            
            // 4. Emit trade executed event
            emitTradeExecuted({
              symbol: order.symbol,
              quantity: order.quantity,
              price: finalPrice,
              side: 'buy',
              timestamp: new Date().toISOString(),
              orderId: order.id,
              total: totalValue
            });
          } 
          // For sell orders
          else if (order.side === 'sell') {
            console.log(`Processing sell order execution`);
            
            // 1. Add the funds from the sale
            console.log(`Adding funds from sale: ${totalValue}`);
            await addFunds(totalValue);
            
            // 2. Update the portfolio to reduce position
            console.log(`Updating portfolio for sell: ${order.quantity} shares of ${order.symbol} at ${finalPrice}`);
            const portfolioUpdated = updatePortfolio({
              symbol: order.symbol,
              quantity: order.quantity,
              price: finalPrice,
              type: 'sell'
            });
            
            if (!portfolioUpdated) {
              console.error("Failed to update portfolio for sell order");
            }
            
            // 3. Emit trade executed event
            emitTradeExecuted({
              symbol: order.symbol,
              quantity: order.quantity,
              price: finalPrice,
              side: 'sell',
              timestamp: new Date().toISOString(),
              orderId: order.id,
              total: totalValue
            });
          }
        } catch (err) {
          console.error("Error during wallet/portfolio updates:", err);
          // Even if there's an error in the wallet/portfolio updates, we still want to update the order status
        }
        
        // Update the order status locally
        const updatedOrders = orders.map(o => 
          o.id === orderId ? { 
            ...o, 
            status: 'executed' as const, 
            price: finalPrice 
          } : o
        );
        
        // Save to state and local storage
        setOrders(updatedOrders);
        saveOrdersToStorage(updatedOrders);
        
        // Show toast notification
        toast({
          title: "Order Executed",
          description: `${order.side === 'buy' ? 'Bought' : 'Sold'} ${order.quantity} shares of ${order.symbol} at Rs.${finalPrice.toFixed(2)}`,
        });
        
        // Refresh wallet to show updated balances
        await refreshWallet();
        
        // Return true to indicate success
        return true;
      } else {
        console.error("Order execution failed:", response.error);
        toast({
          title: "Error",
          description: response.error || "Failed to execute order",
          variant: "destructive"
        });
        return false;
      }
    } catch (err: any) {
      console.error('Error executing order:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to execute order",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    loadOrders,
    cancelOrder: handleCancelOrder,
    executeOrder: handleExecuteOrder,
    formatDate
  };
};
