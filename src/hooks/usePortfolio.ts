import { useState, useEffect } from 'react';
import { portfolioData, PortfolioPosition, stocksData } from '@/lib/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { tradingEvents, TradeExecutedEvent } from '@/events/tradingEvents';

// Key for localStorage
const PORTFOLIO_STORAGE_KEY = 'tradeheaven_portfolio';

// Interface for portfolio updates
export interface PortfolioUpdate {
  symbol: string;
  quantity: number;
  price: number;
  type: 'buy' | 'sell';
}

export const usePortfolio = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try to load portfolio from localStorage first
  const loadPortfolioFromStorage = (): PortfolioPosition[] => {
    try {
      const savedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (savedPortfolio) {
        return JSON.parse(savedPortfolio);
      }
    } catch (err) {
      console.error('Failed to load portfolio from localStorage:', err);
    }
    return portfolioData;
  };

  const [holdings, setHoldings] = useState<PortfolioPosition[]>(loadPortfolioFromStorage());

  // Save portfolio to localStorage
  const savePortfolioToStorage = (portfolioData: PortfolioPosition[]) => {
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolioData));
    } catch (err) {
      console.error('Failed to save portfolio to localStorage:', err);
    }
  };

  // Refresh portfolio data
  const refreshPortfolio = async () => {
    try {
      setLoading(true);
      // For production, you would fetch from API
      // const response = await getPortfolioHoldings();
      
      // For now, just use the stored data
      const portfolioData = loadPortfolioFromStorage();
      setHoldings(portfolioData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching portfolio:', err);
      setError('Failed to fetch portfolio data');
      toast({
        title: 'Error',
        description: 'Failed to fetch portfolio data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate total portfolio value
  const calculateTotalValue = (): number => {
    return holdings.reduce((total, position) => total + position.value, 0);
  };

  // Calculate total gain/loss
  const calculateTotalGainLoss = (): number => {
    return holdings.reduce((total, position) => total + position.gainLoss, 0);
  };

  // Calculate total gain/loss percentage
  const calculateTotalGainLossPercent = (): number => {
    const totalValue = calculateTotalValue();
    const totalCost = holdings.reduce((total, position) => 
      total + (position.quantity * position.averagePrice), 0);
    
    if (totalCost === 0) return 0;
    return ((totalValue - totalCost) / totalCost) * 100;
  };

  // Handle incoming trade executed events
  const handleTradeExecuted = (event: TradeExecutedEvent) => {
    console.log('Portfolio received trade executed event:', event);
    
    // Update portfolio based on the trade event
    updatePortfolio({
      symbol: event.symbol,
      quantity: event.quantity,
      price: event.price,
      type: event.side
    });
  };

  // Add to portfolio when buying or update when selling
  const updatePortfolio = (update: PortfolioUpdate): boolean => {
    try {
      console.log(`Updating portfolio: ${update.type} ${update.quantity} ${update.symbol} at ${update.price}`);
      
      // Create a copy of holdings to work with
      const updatedHoldings = [...holdings];
      
      // Find the existing position for this symbol
      const existingPositionIndex = updatedHoldings.findIndex(
        position => position.symbol === update.symbol
      );
      
      if (update.type === 'buy') {
        if (existingPositionIndex >= 0) {
          // Update existing position
          const existingPosition = updatedHoldings[existingPositionIndex];
          const newQuantity = existingPosition.quantity + update.quantity;
          const newTotalCost = existingPosition.quantity * existingPosition.averagePrice + 
                              update.quantity * update.price;
          const newAveragePrice = newTotalCost / newQuantity;
          
          // Update the position
          updatedHoldings[existingPositionIndex] = {
            ...existingPosition,
            quantity: newQuantity,
            averagePrice: newAveragePrice,
            value: newQuantity * existingPosition.currentPrice,
            gainLoss: (existingPosition.currentPrice - newAveragePrice) * newQuantity,
            gainLossPercent: ((existingPosition.currentPrice - newAveragePrice) / newAveragePrice) * 100
          };
        } else {
          // Create a new position
          const stock = stocksData.find(s => s.symbol === update.symbol);
          if (!stock) {
            console.error(`Stock not found: ${update.symbol}`);
            return false;
          }
          
          // Create new position
          const newPosition: PortfolioPosition = {
            symbol: update.symbol,
            quantity: update.quantity,
            averagePrice: update.price,
            currentPrice: stock.price,
            value: update.quantity * stock.price,
            gainLoss: (stock.price - update.price) * update.quantity,
            gainLossPercent: ((stock.price - update.price) / update.price) * 100
          };
          
          updatedHoldings.push(newPosition);
        }
        
        // Save updated holdings
        setHoldings(updatedHoldings);
        savePortfolioToStorage(updatedHoldings);
        
        toast({
          title: 'Portfolio Updated',
          description: `Successfully added ${update.quantity} shares of ${update.symbol} to your portfolio`,
          variant: 'default',
        });
        
        return true;
      } else if (update.type === 'sell') {
        // Selling shares
        if (existingPositionIndex < 0) {
          // Can't sell what you don't have
          toast({
            title: 'Error',
            description: `You don't have any shares of ${update.symbol} to sell`,
            variant: 'destructive',
          });
          return false;
        }
        
        const existingPosition = updatedHoldings[existingPositionIndex];
        
        if (existingPosition.quantity < update.quantity) {
          // Not enough shares to sell
          toast({
            title: 'Error',
            description: `You only have ${existingPosition.quantity} shares of ${update.symbol}, but tried to sell ${update.quantity}`,
            variant: 'destructive',
          });
          return false;
        }
        
        // Calculate new quantity
        const newQuantity = existingPosition.quantity - update.quantity;
        
        if (newQuantity === 0) {
          // Remove the position entirely
          updatedHoldings.splice(existingPositionIndex, 1);
        } else {
          // Update the position with reduced quantity, but keep the same average price
          updatedHoldings[existingPositionIndex] = {
            ...existingPosition,
            quantity: newQuantity,
            value: newQuantity * existingPosition.currentPrice,
            gainLoss: (existingPosition.currentPrice - existingPosition.averagePrice) * newQuantity,
            gainLossPercent: ((existingPosition.currentPrice - existingPosition.averagePrice) / existingPosition.averagePrice) * 100
          };
        }
        
        // Save updated holdings
        setHoldings(updatedHoldings);
        savePortfolioToStorage(updatedHoldings);
        
        toast({
          title: 'Portfolio Updated',
          description: `Successfully sold ${update.quantity} shares of ${update.symbol} from your portfolio`,
          variant: 'default',
        });
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating portfolio:', err);
      toast({
        title: 'Error',
        description: 'Failed to update your portfolio. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Subscribe to trade executed events
  useEffect(() => {
    const subscription = tradingEvents.tradeExecuted.subscribe(handleTradeExecuted);
    
    return () => {
      subscription.unsubscribe();
    };
  }, [holdings]);

  // Load initial data
  useEffect(() => {
    refreshPortfolio();
  }, []);

  return {
    holdings,
    loading,
    error,
    refreshPortfolio,
    updatePortfolio,
    totalValue: calculateTotalValue(),
    totalGainLoss: calculateTotalGainLoss(),
    totalGainLossPercent: calculateTotalGainLossPercent()
  };
};
