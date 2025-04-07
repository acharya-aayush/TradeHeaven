import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getPortfolioHoldings, getPortfolioSummary, PortfolioHolding } from '@/services/portfolioService';

const PortfolioSummary = () => {
  const { toast } = useToast();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [totalProfitPercent, setTotalProfitPercent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        
        // Get portfolio summary
        const summary = await getPortfolioSummary();
        
        if (summary.error) {
          setError(summary.error);
        } else {
          setTotalValue(summary.totalValue);
          setTotalProfit(summary.totalProfit);
          setTotalProfitPercent(summary.totalProfitPercent);
          setError(null);
        }
        
        // Get holdings data for top positions
        const response = await getPortfolioHoldings();
        if (response.holdings) {
          // Sort by value to get top holdings
          const sortedHoldings = [...response.holdings].sort((a, b) => 
            (b.value || 0) - (a.value || 0)
          );
          setHoldings(sortedHoldings);
        }
      } catch (err: any) {
        console.error('Failed to load portfolio summary:', err);
        setError(err.message || 'Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolioData();
    
    // Refresh data every minute
    const interval = setInterval(fetchPortfolioData, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSettingsClick = () => {
    toast({
      title: "Portfolio settings",
      description: "Your portfolio settings have been saved."
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">
            <p>Failed to load portfolio data.</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-2xl font-semibold">Rs. {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <div className={`flex items-center ${totalProfit >= 0 ? 'text-market-up' : 'text-market-down'}`}>
                {totalProfit >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>
                  Rs. {Math.abs(totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                  ({totalProfit >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Top Positions</h3>
            {holdings.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No holdings in your portfolio.
              </div>
            ) : (
              <div className="space-y-2">
                {holdings.slice(0, 4).map((holding) => (
                  <div key={holding.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{holding.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {holding.quantity} shares
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">Rs. {(holding.value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className={`text-xs ${(holding.profit_loss_percent || 0) >= 0 ? 'text-market-up' : 'text-market-down'}`}>
                        {(holding.profit_loss_percent || 0) >= 0 ? '+' : ''}{(holding.profit_loss_percent || 0).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;
