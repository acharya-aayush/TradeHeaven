import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:3001/portfolio';

// Define types
export interface PortfolioHolding {
  id: string;
  symbol: string;
  quantity: number;
  avg_price: number;
  current_price?: number;
  timestamp: string;
  value?: number;
  profit_loss?: number;
  profit_loss_percent?: number;
}

export interface PortfolioResponse {
  success?: boolean;
  message?: string;
  holdings?: PortfolioHolding[];
  error?: string;
}

// Mock data for demo mode
const mockPortfolioHoldings: PortfolioHolding[] = [
  {
    id: 'demo-holding-1',
    symbol: 'NABIL',
    quantity: 50,
    avg_price: 950.75,
    current_price: 985.65,
    timestamp: new Date().toISOString(),
    value: 49282.5,
    profit_loss: 1745,
    profit_loss_percent: 3.67
  },
  {
    id: 'demo-holding-2',
    symbol: 'NHEC',
    quantity: 25,
    avg_price: 830.40,
    current_price: 845.20,
    timestamp: new Date().toISOString(),
    value: 21130.0,
    profit_loss: 370,
    profit_loss_percent: 1.78
  },
  {
    id: 'demo-holding-3',
    symbol: 'HTSL',
    quantity: 20,
    avg_price: 1080.60,
    current_price: 1120.75,
    timestamp: new Date().toISOString(),
    value: 22415.0,
    profit_loss: 803,
    profit_loss_percent: 3.72
  },
  {
    id: 'demo-holding-4',
    symbol: 'TPL',
    quantity: 30,
    avg_price: 520.40,
    current_price: 512.45,
    timestamp: new Date().toISOString(),
    value: 15373.5,
    profit_loss: -238.5,
    profit_loss_percent: -1.53
  }
];

// Check if user is in demo mode
const isDemoMode = (): boolean => {
  return localStorage.getItem('demoMode') === 'true';
};

// Get user's portfolio holdings
export const getPortfolioHoldings = async (): Promise<PortfolioResponse> => {
  // Always return mock data for now to avoid 403 errors
  console.log('Using mock portfolio data for development');
  return {
    success: true,
    holdings: mockPortfolioHoldings
  };
  
  /* Original API call code commented out
  // Return mock data for demo mode
  if (isDemoMode()) {
    return {
      success: true,
      holdings: mockPortfolioHoldings
    };
  }
  
  try {
    const token = getToken();
    
    if (!token) {
      return { error: 'Authentication required' };
    }
    
    const response = await axios.get(`${API_URL}/holdings`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Portfolio holdings error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return { error: 'Request timed out. Server may be unavailable.' };
    }
    
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return { error: 'Cannot connect to server. Please try again later.' };
    }
    
    if (error.response && error.response.data) {
      return { error: error.response.data.error || 'Failed to fetch portfolio' };
    }
    
    return { error: 'Network error. Please try again.' };
  }
  */
};

// Get portfolio summary
export const getPortfolioSummary = async (): Promise<{
  totalValue: number;
  totalProfit: number;
  totalProfitPercent: number;
  holdings: number;
  error?: string;
}> => {
  // Return mock summary for demo mode
  if (isDemoMode()) {
    const totalValue = mockPortfolioHoldings.reduce((sum, holding) => sum + (holding.value || 0), 0);
    const totalCost = mockPortfolioHoldings.reduce((sum, holding) => sum + (holding.quantity * holding.avg_price), 0);
    const totalProfit = totalValue - totalCost;
    const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    
    return {
      totalValue,
      totalProfit,
      totalProfitPercent,
      holdings: mockPortfolioHoldings.length
    };
  }
  
  try {
    const response = await getPortfolioHoldings();
    
    if (response.error) {
      return { 
        totalValue: 0, 
        totalProfit: 0, 
        totalProfitPercent: 0, 
        holdings: 0,
        error: response.error 
      };
    }
    
    if (!response.holdings || response.holdings.length === 0) {
      return { 
        totalValue: 0, 
        totalProfit: 0, 
        totalProfitPercent: 0, 
        holdings: 0 
      };
    }
    
    const holdings = response.holdings;
    
    let totalValue = 0;
    let totalCost = 0;
    
    holdings.forEach(holding => {
      const currentPrice = holding.current_price || 0;
      const value = holding.quantity * currentPrice;
      const cost = holding.quantity * holding.avg_price;
      
      totalValue += value;
      totalCost += cost;
    });
    
    const totalProfit = totalValue - totalCost;
    const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    
    return {
      totalValue,
      totalProfit,
      totalProfitPercent,
      holdings: holdings.length
    };
  } catch (error: any) {
    console.error('Portfolio summary error:', error);
    return { 
      totalValue: 0, 
      totalProfit: 0, 
      totalProfitPercent: 0, 
      holdings: 0,
      error: error.message || 'Failed to fetch portfolio summary' 
    };
  }
}; 