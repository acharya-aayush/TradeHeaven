
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioData } from '@/lib/data/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PortfolioSummary = () => {
  // Calculate portfolio totals
  const totalValue = portfolioData.reduce((sum, position) => sum + position.value, 0);
  const totalGainLoss = portfolioData.reduce((sum, position) => sum + position.gainLoss, 0);
  const totalGainLossPercent = (totalGainLoss / (totalValue - totalGainLoss)) * 100;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-2xl font-semibold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <div className={`flex items-center ${totalGainLoss >= 0 ? 'text-market-up' : 'text-market-down'}`}>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span>
              ${Math.abs(totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
              ({totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <h3 className="font-medium text-sm text-muted-foreground mb-2">Top Positions</h3>
        <div className="space-y-2">
          {portfolioData.slice(0, 4).map((position) => (
            <div key={position.symbol} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{position.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  {position.quantity} shares
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono">${position.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`text-xs ${position.gainLoss >= 0 ? 'text-market-up' : 'text-market-down'}`}>
                  {position.gainLoss >= 0 ? '+' : ''}{position.gainLossPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;
