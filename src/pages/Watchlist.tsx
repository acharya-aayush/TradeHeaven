
import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { watchlistData, stocksData } from '@/lib/data/mockData';
import StockChart from '@/components/trading/StockChart';
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Bell, Edit, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Simulate multiple watchlists
const watchlists = [
  { id: 'default', name: 'Default Watchlist', stocks: watchlistData },
  { id: 'tech', name: 'Tech Stocks', stocks: watchlistData.filter(item => ['AAPL', 'MSFT', 'GOOGL'].includes(item.symbol)) },
  { id: 'growth', name: 'Growth Stocks', stocks: watchlistData.filter(item => ['TSLA', 'NVDA'].includes(item.symbol)) }
];

const Watchlist = () => {
  const [selectedStock, setSelectedStock] = useState(watchlistData[0]);
  const [activeWatchlist, setActiveWatchlist] = useState(watchlists[0]);
  const { toast } = useToast();
  
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
            symbol={selectedStock.symbol} 
            name={selectedStock.name} 
          />
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Stock Details</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <Button onClick={() => handleAddAlert(selectedStock.symbol)} variant="outline" className="gap-1">
                    <Bell className="h-4 w-4" />
                    Set Alert
                  </Button>
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
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-medium">Watchlists</CardTitle>
            <Tabs value={activeWatchlist.id} onValueChange={(value) => {
              const watchlist = watchlists.find(w => w.id === value);
              if (watchlist) setActiveWatchlist(watchlist);
            }}>
              <TabsList>
                {watchlists.map(watchlist => (
                  <TabsTrigger key={watchlist.id} value={watchlist.id}>
                    {watchlist.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button variant="default" size="sm" className="h-8 gap-1">
              <Plus className="h-4 w-4" />
              <span>New Watchlist</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeWatchlist.stocks.map((stock) => (
                  <TableRow 
                    key={stock.symbol}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setSelectedStock(stock)}
                  >
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell className="max-w-40 truncate">{stock.name}</TableCell>
                    <TableCell className="font-mono">${stock.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center ${
                        stock.change >= 0 ? 'text-market-up' : 'text-market-down'
                      }`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        <span>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddAlert(stock.symbol);
                          }}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Stock Removed",
                              description: `${stock.symbol} has been removed from your watchlist`,
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
};

export default Watchlist;
