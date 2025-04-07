
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockData } from '@/lib/data/mockData';
import { Button } from "@/components/ui/button";
import AlertDialog from '@/components/watchlist/AlertDialog';
import OrderPlacementDialog from './OrderPlacementDialog';

interface StockDetailsProps {
  selectedStock: StockData | null;
  handleCreateAlert: (symbol: string, type: "price" | "percentage" | "volume" | "resistance" | "support", condition: "above" | "below" | "crosses", threshold: number) => Promise<void>;
}

const StockDetails: React.FC<StockDetailsProps> = ({ selectedStock, handleCreateAlert }) => {
  return (
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
              <span className="text-2xl font-mono">Rs. {selectedStock.price.toFixed(2)}</span>
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
                onCreateAlert={(symbol, type, condition, threshold) => handleCreateAlert(symbol, type, condition, threshold)}
              />
              
              <OrderPlacementDialog selectedStock={selectedStock} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a stock from your watchlist</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockDetails;
