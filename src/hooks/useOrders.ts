
import { useState, useEffect } from 'react';
import { getOrders, cancelOrder } from '@/services/orderService';
import { OrderData } from '@/lib/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

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

  // Load orders when component mounts
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrders();
      setOrders(ordersData);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      setError('Failed to load orders. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await cancelOrder(orderId);
      
      if (response.success) {
        toast({
          title: "Order canceled",
          description: "Your order has been successfully canceled."
        });
        
        // Refresh orders list
        await loadOrders();
      } else {
        toast({
          title: "Failed to cancel order",
          description: response.error || "An unknown error occurred",
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
    }
  };

  return {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleCancelOrder,
    formatDate
  };
};
