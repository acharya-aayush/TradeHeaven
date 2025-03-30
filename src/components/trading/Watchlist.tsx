
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { watchlistData } from '@/lib/data/mockData';
import { Button } from "@/components/ui/button";
import { Plus, Eye, TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface WatchlistProps {
  onSelectStock?: (symbol: string) => void;
  enableAddToWatchlist?: boolean;
}

const Watchlist: React.FC<WatchlistProps> = ({ 
  onSelectStock,
  enableAddToWatchlist = true
}) => {
  const { toast } = useToast();
  
  const handleAddAlert = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    toast({
      title: "Alert Added",
      description: `Price alert for ${symbol} has been set`,
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Watchlist</CardTitle>
        {enableAddToWatchlist && (
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {watchlistData.map((item) => (
            <div 
              key={item.symbol}
              className="flex items-center justify-between py-2 px-1 hover:bg-accent rounded-md cursor-pointer"
              onClick={() => onSelectStock?.(item.symbol)}
            >
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{item.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[120px]">{item.name}</div>
                </div>
              </div>
              <div className="text-right flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={(e) => handleAddAlert(e, item.symbol)}
                >
                  <Bell className="h-3 w-3" />
                </Button>
                <div>
                  <div className="font-mono">${item.price.toFixed(2)}</div>
                  <div className={`flex items-center justify-end text-xs ${
                    item.change >= 0 ? 'text-market-up' : 'text-market-down'
                  }`}>
                    {item.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    <span>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Watchlist;
