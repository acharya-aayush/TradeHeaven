
import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { stocksData, marketSummaryData } from '@/lib/data/mockData';
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import StockChart from '@/components/trading/StockChart';
import MarketOverview from '@/components/trading/MarketOverview';

const Markets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(stocksData[0]);
  const [filteredStocks, setFilteredStocks] = useState(stocksData);
  
  useEffect(() => {
    // Filter stocks based on search term
    const filtered = stocksData.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [searchTerm]);

  return (
    <AppShell>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <StockChart 
            symbol={selectedStock.symbol} 
            name={selectedStock.name} 
          />
        </div>
        <div>
          <MarketOverview />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle>Market Data</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search stocks..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <TableHead className="hidden md:table-cell">Volume</TableHead>
                  <TableHead className="hidden md:table-cell">Market Cap</TableHead>
                  <TableHead className="hidden lg:table-cell">Sector</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow 
                    key={stock.symbol}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setSelectedStock(stock)}
                  >
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell className="truncate max-w-32">{stock.name}</TableCell>
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
                    <TableCell className="hidden md:table-cell">{(stock.volume / 1000000).toFixed(1)}M</TableCell>
                    <TableCell className="hidden md:table-cell">${(stock.marketCap / 1000000000).toFixed(1)}B</TableCell>
                    <TableCell className="hidden lg:table-cell">{stock.sector}</TableCell>
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

export default Markets;
