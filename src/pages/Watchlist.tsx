
import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { stocksData } from '@/lib/data/mockData';
import StockChart from '@/components/trading/StockChart';
import { useWatchlists } from '@/hooks/useWatchlists';
import { useAlerts } from '@/hooks/useAlerts';
import DraggableWatchlistTable from '@/components/watchlist/DraggableWatchlistTable';
import StockDetails from '@/components/watchlist/StockDetails';
import WatchlistHeader from '@/components/watchlist/WatchlistHeader';
import { useToast } from "@/hooks/use-toast";

const Watchlist = () => {
  const { 
    watchlists, 
    activeWatchlist, 
    loading: watchlistsLoading, 
    error: watchlistsError,
    setActiveWatchlistById,
    handleCreateWatchlist,
    handleUpdateWatchlist,
    handleDeleteWatchlist,
    handleAddStock,
    handleRemoveStock,
    handleReorderWatchlist
  } = useWatchlists();

  const {
    handleCreateAlert
  } = useAlerts();

  const [selectedStock, setSelectedStock] = useState(stocksData[0]);
  const { toast } = useToast();
  
  // Get the stocks data for the active watchlist
  const watchlistStocks = useMemo(() => {
    if (!activeWatchlist) return [];
    
    const symbols = activeWatchlist.stocks || 
                  (activeWatchlist.items?.map(item => item.symbol) || []);
    
    return stocksData.filter(stock => symbols.includes(stock.symbol));
  }, [activeWatchlist]);
  
  // Set the first stock as selected when watchlist changes
  useEffect(() => {
    if (watchlistStocks.length > 0 && (!selectedStock || !watchlistStocks.some(s => s.symbol === selectedStock.symbol))) {
      setSelectedStock(watchlistStocks[0]);
    }
  }, [watchlistStocks, selectedStock]);
  
  const handleAddAlert = (symbol: string) => {
    toast({
      title: "Alert Added",
      description: `Price alert for ${symbol} has been set`,
    });
  };
  
  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <StockChart 
            symbol={selectedStock?.symbol || ''} 
            name={selectedStock?.name || ''} 
          />
        </div>
        
        <div className="lg:col-span-1">
          <StockDetails 
            selectedStock={selectedStock} 
            handleCreateAlert={handleCreateAlert} 
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <WatchlistHeader
            watchlists={watchlists}
            activeWatchlist={activeWatchlist}
            setActiveWatchlistById={setActiveWatchlistById}
            handleCreateWatchlist={handleCreateWatchlist}
            handleUpdateWatchlist={handleUpdateWatchlist}
            handleDeleteWatchlist={handleDeleteWatchlist}
            handleAddStock={handleAddStock}
          />
        </CardHeader>
        <CardContent>
          {watchlistsLoading ? (
            <div className="flex items-center justify-center py-8">
              <p>Loading watchlists...</p>
            </div>
          ) : watchlistsError ? (
            <div className="flex items-center justify-center py-8 text-destructive">
              <p>{watchlistsError}</p>
            </div>
          ) : !activeWatchlist ? (
            <div className="flex items-center justify-center py-8">
              <p>No watchlist selected. Please select or create a watchlist.</p>
            </div>
          ) : (
            <DraggableWatchlistTable 
              stocks={watchlistStocks}
              onSelectStock={setSelectedStock}
              onReorderStocks={(symbols) => {
                if (activeWatchlist) {
                  handleReorderWatchlist(activeWatchlist.watchlist_id, symbols);
                }
              }}
              onAddAlert={(symbol) => {
                handleAddAlert(symbol);
              }}
              onRemoveStock={(symbol) => {
                if (activeWatchlist) {
                  handleRemoveStock(activeWatchlist.watchlist_id, symbol);
                }
              }}
              formatCurrency={(price: number) => `Rs. ${price.toFixed(2)}`}
            />
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
};

export default Watchlist;
