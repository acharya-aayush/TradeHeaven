
import { useState, useEffect, useCallback } from 'react';
import { 
  getWatchlists, 
  getWatchlist,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  addStockToWatchlist,
  removeStockFromWatchlist,
  reorderWatchlist,
  Watchlist,
  WatchlistItem
} from '@/services/watchlistService';
import { StockData, watchlistData } from '@/lib/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const useWatchlists = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeWatchlist, setActiveWatchlist] = useState<Watchlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load watchlists
  const loadWatchlists = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWatchlists();
      setWatchlists(data);
      
      // Set active watchlist to default or first one in the list
      const defaultWatchlist = data.find(w => w.is_default) || data[0];
      if (defaultWatchlist) {
        setActiveWatchlist(defaultWatchlist);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Failed to load watchlists:', err);
      setError('Failed to load watchlists');
    } finally {
      setLoading(false);
    }
  }, []);

  // Set active watchlist by ID
  const setActiveWatchlistById = useCallback(async (watchlistId: string) => {
    try {
      const watchlist = watchlists.find(w => w.watchlist_id === watchlistId);
      if (watchlist) {
        // If we already have this watchlist loaded but need details
        if (!watchlist.items) {
          const detailedWatchlist = await getWatchlist(watchlistId);
          setActiveWatchlist(detailedWatchlist);
        } else {
          setActiveWatchlist(watchlist);
        }
      }
    } catch (err: any) {
      console.error(`Failed to set active watchlist ${watchlistId}:`, err);
      toast({
        title: "Error",
        description: "Failed to load watchlist details",
        variant: "destructive"
      });
    }
  }, [watchlists, toast]);

  // Create a new watchlist
  const handleCreateWatchlist = useCallback(async (name: string) => {
    try {
      const newWatchlist = await createWatchlist(name);
      setWatchlists(prev => [...prev, newWatchlist]);
      toast({
        title: "Watchlist Created",
        description: `${name} watchlist has been created successfully`
      });
      return newWatchlist;
    } catch (err: any) {
      console.error('Failed to create watchlist:', err);
      toast({
        title: "Error",
        description: "Failed to create watchlist",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // Update a watchlist
  const handleUpdateWatchlist = useCallback(async (watchlistId: string, name: string) => {
    try {
      const updatedWatchlist = await updateWatchlist(watchlistId, name);
      setWatchlists(prev => 
        prev.map(w => w.watchlist_id === watchlistId ? { ...w, name } : w)
      );
      
      if (activeWatchlist?.watchlist_id === watchlistId) {
        setActiveWatchlist(prev => prev ? { ...prev, name } : null);
      }
      
      toast({
        title: "Watchlist Updated",
        description: `Watchlist has been renamed to ${name}`
      });
      
      return updatedWatchlist;
    } catch (err: any) {
      console.error('Failed to update watchlist:', err);
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive"
      });
      throw err;
    }
  }, [activeWatchlist, toast]);

  // Delete a watchlist
  const handleDeleteWatchlist = useCallback(async (watchlistId: string) => {
    try {
      await deleteWatchlist(watchlistId);
      
      const updatedWatchlists = watchlists.filter(w => w.watchlist_id !== watchlistId);
      setWatchlists(updatedWatchlists);
      
      // If active watchlist was deleted, set to default or first one
      if (activeWatchlist?.watchlist_id === watchlistId) {
        const defaultWatchlist = updatedWatchlists.find(w => w.is_default) || updatedWatchlists[0];
        setActiveWatchlist(defaultWatchlist || null);
      }
      
      toast({
        title: "Watchlist Deleted",
        description: "Watchlist has been deleted successfully"
      });
    } catch (err: any) {
      console.error('Failed to delete watchlist:', err);
      toast({
        title: "Error",
        description: "Failed to delete watchlist",
        variant: "destructive"
      });
    }
  }, [watchlists, activeWatchlist, toast]);

  // Add a stock to watchlist
  const handleAddStock = useCallback(async (watchlistId: string, symbol: string) => {
    try {
      await addStockToWatchlist(watchlistId, symbol);
      
      // Update the watchlists in state
      setWatchlists(prev => 
        prev.map(w => {
          if (w.watchlist_id === watchlistId) {
            return {
              ...w,
              stocks: [...(w.stocks || []), symbol]
            };
          }
          return w;
        })
      );
      
      // Update the active watchlist if needed
      if (activeWatchlist?.watchlist_id === watchlistId) {
        // Refresh the active watchlist to get the updated items
        const refreshedWatchlist = await getWatchlist(watchlistId);
        setActiveWatchlist(refreshedWatchlist);
      }
      
      toast({
        title: "Stock Added",
        description: `${symbol} has been added to your watchlist`
      });
    } catch (err: any) {
      console.error('Failed to add stock to watchlist:', err);
      toast({
        title: "Error",
        description: "Failed to add stock to watchlist",
        variant: "destructive"
      });
    }
  }, [activeWatchlist, toast]);

  // Remove a stock from watchlist
  const handleRemoveStock = useCallback(async (watchlistId: string, symbol: string) => {
    try {
      await removeStockFromWatchlist(watchlistId, symbol);
      
      // Update the watchlists in state
      setWatchlists(prev => 
        prev.map(w => {
          if (w.watchlist_id === watchlistId) {
            return {
              ...w,
              stocks: (w.stocks || []).filter(s => s !== symbol)
            };
          }
          return w;
        })
      );
      
      // Update the active watchlist if needed
      if (activeWatchlist?.watchlist_id === watchlistId) {
        setActiveWatchlist(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            items: prev.items?.filter(item => item.symbol !== symbol),
            stocks: prev.stocks?.filter(s => s !== symbol)
          };
        });
      }
      
      toast({
        title: "Stock Removed",
        description: `${symbol} has been removed from your watchlist`
      });
    } catch (err: any) {
      console.error('Failed to remove stock from watchlist:', err);
      toast({
        title: "Error",
        description: "Failed to remove stock from watchlist",
        variant: "destructive"
      });
    }
  }, [activeWatchlist, toast]);

  // Reorder stocks in a watchlist
  const handleReorderWatchlist = useCallback(async (watchlistId: string, symbols: string[]) => {
    try {
      await reorderWatchlist(watchlistId, symbols);
      
      // Update the active watchlist if needed
      if (activeWatchlist?.watchlist_id === watchlistId) {
        // Refresh the active watchlist to get the updated order
        const refreshedWatchlist = await getWatchlist(watchlistId);
        setActiveWatchlist(refreshedWatchlist);
      }
      
      toast({
        title: "Watchlist Reordered",
        description: "Your watchlist has been reordered successfully"
      });
    } catch (err: any) {
      console.error('Failed to reorder watchlist:', err);
      toast({
        title: "Error",
        description: "Failed to reorder watchlist",
        variant: "destructive"
      });
    }
  }, [activeWatchlist, toast]);

  // Load watchlists on mount
  useEffect(() => {
    loadWatchlists();
  }, [loadWatchlists]);

  return {
    watchlists,
    activeWatchlist,
    loading,
    error,
    loadWatchlists,
    setActiveWatchlistById,
    handleCreateWatchlist,
    handleUpdateWatchlist,
    handleDeleteWatchlist,
    handleAddStock,
    handleRemoveStock,
    handleReorderWatchlist
  };
};
