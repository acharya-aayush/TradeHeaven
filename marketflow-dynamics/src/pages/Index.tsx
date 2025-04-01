
import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { stocksData } from '@/lib/data/mockData';

// Import trading components
import MarketOverview from '@/components/trading/MarketOverview';
import StockCard from '@/components/trading/StockCard';
import PortfolioSummary from '@/components/trading/PortfolioSummary';
import StockChart from '@/components/trading/StockChart';
import Watchlist from '@/components/trading/Watchlist';
import RecentOrders from '@/components/trading/RecentOrders';
import OrderForm from '@/components/trading/OrderForm';

const Index = () => {
  const [selectedStock, setSelectedStock] = useState(stocksData[0]);

  const handleSelectStock = (symbol: string) => {
    const stock = stocksData.find(s => s.symbol === symbol);
    if (stock) {
      setSelectedStock(stock);
    }
  };

  return (
    <AppShell>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Top row */}
        <div className="md:col-span-2 lg:col-span-3">
          <StockChart 
            symbol={selectedStock.symbol} 
            name={selectedStock.name} 
          />
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <PortfolioSummary />
        </div>
        
        {/* Bottom row */}
        <div className="md:col-span-1">
          <MarketOverview />
        </div>
        <div className="md:col-span-1">
          <div className="grid grid-cols-1 gap-4">
            <RecentOrders />
          </div>
        </div>
        <div className="md:col-span-1">
          <Watchlist onSelectStock={handleSelectStock} />
        </div>
        <div className="md:col-span-1">
          <OrderForm 
            symbol={selectedStock.symbol}
            currentPrice={selectedStock.price}
          />
        </div>
      </div>
      
      {/* Featured stocks */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-3">Featured Stocks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stocksData.slice(0, 4).map((stock) => (
            <StockCard 
              key={stock.symbol} 
              stock={stock} 
              onClick={() => setSelectedStock(stock)}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Index;
