
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketSummaryData } from '@/lib/data/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketOverview = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Major Indices</h3>
            <div className="space-y-2">
              {marketSummaryData.indices.map((index) => (
                <div key={index.name} className="flex justify-between items-center">
                  <span className="font-medium">{index.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{index.value.toLocaleString()}</span>
                    <span 
                      className={`flex items-center text-xs ${
                        index.change >= 0 ? 'text-market-up' : 'text-market-down'
                      }`}
                    >
                      {index.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(index.change).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Sector Performance</h3>
            <div className="grid grid-cols-1 gap-2">
              {marketSummaryData.sectors.map((sector) => (
                <div key={sector.name} className="flex items-center">
                  <div className="w-24 truncate">{sector.name}</div>
                  <div className="flex-1 mx-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${sector.change >= 0 ? 'bg-market-up' : 'bg-market-down'}`}
                        style={{ width: `${Math.abs(sector.change) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className={`text-xs font-medium ${
                    sector.change >= 0 ? 'text-market-up' : 'text-market-down'
                  }`}>
                    {sector.change > 0 ? '+' : ''}{sector.change.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
