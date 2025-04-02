
import { useState, useEffect, useCallback } from 'react';
import { 
  getPriceAlerts, 
  createPriceAlert, 
  deletePriceAlert,
  PriceAlert
} from '@/services/watchlistService';
import { useToast } from '@/hooks/use-toast';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load alerts
  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPriceAlerts();
      setAlerts(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load alerts:', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new alert
  const handleCreateAlert = useCallback(async (
    symbol: string,
    type: PriceAlert['type'],
    condition: PriceAlert['condition'],
    threshold: number
  ) => {
    try {
      const newAlert = await createPriceAlert(symbol, type, condition, threshold);
      setAlerts(prev => [...prev, newAlert]);
      
      toast({
        title: "Alert Created",
        description: `Price alert for ${symbol} has been set`
      });
    } catch (err: any) {
      console.error('Failed to create alert:', err);
      toast({
        title: "Error",
        description: "Failed to create price alert",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // Delete an alert
  const handleDeleteAlert = useCallback(async (alertId: string) => {
    try {
      await deletePriceAlert(alertId);
      setAlerts(prev => prev.filter(alert => alert.alert_id !== alertId));
      
      toast({
        title: "Alert Deleted",
        description: "Price alert has been deleted successfully"
      });
    } catch (err: any) {
      console.error('Failed to delete alert:', err);
      toast({
        title: "Error",
        description: "Failed to delete price alert",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Load alerts on mount
  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  return {
    alerts,
    loading,
    error,
    loadAlerts,
    handleCreateAlert,
    handleDeleteAlert
  };
};
