
import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stocksData } from '@/lib/data/mockData';
import StockChart from '@/components/trading/StockChart';
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWatchlists } from '@/hooks/useWatchlists';
import { useAlerts } from '@/hooks/useAlerts';
import DraggableWatchlistTable from '@/components/watchlist/DraggableWatchlistTable';
import WatchlistSettings from '@/components/watchlist/WatchlistSettings';
import AlertDialog from '@/components/watchlist/AlertDialog';
import StockSearch from '@/components/watchlist/StockSearch';

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
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Stock Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStock ? (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStock.symbol}</h2>
                    <p className="text-muted-foreground">{selectedStock.name}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mono">${selectedStock.price.toFixed(2)}</span>
                    <span className={`flex items-center ${
                      selectedStock.change >= 0 ? 'text-market-up' : 'text-market-down'
                    }`}>
                      {selectedStock.change >= 0 ? (
                        <TrendingUp className="h-5 w-5 mr-1" />
                      ) : (
                        <TrendingDown className="h-5 w-5 mr-1" />
                      )}
                      <span>
                        {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                      </span>
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <AlertDialog 
                      symbol={selectedStock.symbol}
                      stockPrice={selectedStock.price}
                      onCreateAlert={handleCreateAlert}
                    />
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="gap-1">
                          <Plus className="h-4 w-4" />
                          Add Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Place Order for {selectedStock.symbol}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <Tabs defaultValue="buy">
                            <TabsList className="grid grid-cols-2 mb-4">
                              <TabsTrigger value="buy">Buy</TabsTrigger>
                              <TabsTrigger value="sell">Sell</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="buy">
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Quantity</label>
                                  <Input type="number" min="1" defaultValue="1" />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Order Type</label>
                                  <Input type="text" defaultValue="Market" readOnly />
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span>Estimated Cost:</span>
                                  <span className="font-mono">${selectedStock.price.toFixed(2)}</span>
                                </div>
                                <Button className="w-full" onClick={() => {
                                  toast({
                                    title: "Order Placed",
                                    description: `Buy order for ${selectedStock.symbol} has been submitted`,
                                  });
                                }}>
                                  Place Buy Order
                                </Button>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="sell">
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Quantity</label>
                                  <Input type="number" min="1" defaultValue="1" />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Order Type</label>
                                  <Input type="text" defaultValue="Market" readOnly />
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span>Estimated Proceeds:</span>
                                  <span className="font-mono">${selectedStock.price.toFixed(2)}</span>
                                </div>
                                <Button variant="destructive" className="w-full" onClick={() => {
                                  toast({
                                    title: "Order Placed",
                                    description: `Sell order for ${selectedStock.symbol} has been submitted`,
                                  });
                                }}>
                                  Place Sell Order
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select a stock from your watchlist</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-medium">Watchlists</CardTitle>
            <Tabs 
              value={activeWatchlist?.watchlist_id} 
              onValueChange={setActiveWatchlistById}
            >
              <TabsList>
                {watchlists.map(watchlist => (
                  <TabsTrigger key={watchlist.watchlist_id} value={watchlist.watchlist_id}>
                    {watchlist.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex gap-2">
            <WatchlistSettings 
              watchlists={watchlists}
              activeWatchlistId={activeWatchlist?.watchlist_id || ''}
              onCreateWatchlist={handleCreateWatchlist}
              onUpdateWatchlist={handleUpdateWatchlist}
              onDeleteWatchlist={handleDeleteWatchlist}
            />
            
            <StockSearch 
              onAddStock={(symbol) => {
                if (activeWatchlist) {
                  return handleAddStock(activeWatchlist.watchlist_id, symbol);
                }
                return Promise.reject('No active watchlist');
              }}
            />
          </div>
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
              <p>No watchlist selected</p>
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
            />
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
};

export default Watchlist;
