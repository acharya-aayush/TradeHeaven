
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StockData } from '@/lib/data/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockCardProps {
  stock: StockData;
  onClick?: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = stock.change >= 0;
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="pt-6 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{stock.symbol}</h3>
            <p className="text-sm text-muted-foreground truncate max-w-[150px]">{stock.name}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-semibold">${stock.price.toFixed(2)}</p>
            <div className={`flex items-center justify-end text-sm ${
              isPositive ? 'text-market-up' : 'text-market-down'
            }`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <span className="block">Vol</span>
            <span className="font-medium text-foreground">{(stock.volume / 1000000).toFixed(1)}M</span>
          </div>
          <div>
            <span className="block">Mkt Cap</span>
            <span className="font-medium text-foreground">${(stock.marketCap / 1000000000).toFixed(1)}B</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
