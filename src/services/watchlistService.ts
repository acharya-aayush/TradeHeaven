
import axios from 'axios';
import { StockData } from '@/lib/data/mockData';

const API_URL = 'http://localhost:3001/watchlists';

export interface WatchlistItem {
  item_id: string;
  watchlist_id: string;
  symbol: string;
  custom_order: number;
  notes?: string;
  tags?: string;
  created_at: string;
}

export interface Watchlist {
  watchlist_id: string;
  user_id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  stocks?: string[];
  items?: WatchlistItem[];
}

export interface PriceAlert {
  alert_id: string;
  user_id: string;
  symbol: string;
  type: 'price' | 'percentage' | 'volume' | 'resistance' | 'support';
  condition: 'above' | 'below' | 'crosses';
  threshold: number;
  triggered: boolean;
  created_at: string;
}

// Get all watchlists
export const getWatchlists = async (): Promise<Watchlist[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    throw new Error('Failed to fetch watchlists');
  }
};

// Get a specific watchlist with items
export const getWatchlist = async (watchlistId: string): Promise<Watchlist> => {
  try {
    const response = await axios.get(`${API_URL}/${watchlistId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching watchlist ${watchlistId}:`, error);
    throw new Error('Failed to fetch watchlist');
  }
};

// Create a new watchlist
export const createWatchlist = async (name: string): Promise<Watchlist> => {
  try {
    const response = await axios.post(API_URL, { name });
    return response.data;
  } catch (error) {
    console.error('Error creating watchlist:', error);
    throw new Error('Failed to create watchlist');
  }
};

// Update a watchlist
export const updateWatchlist = async (watchlistId: string, name: string): Promise<Watchlist> => {
  try {
    const response = await axios.put(`${API_URL}/${watchlistId}`, { name });
    return response.data;
  } catch (error) {
    console.error(`Error updating watchlist ${watchlistId}:`, error);
    throw new Error('Failed to update watchlist');
  }
};

// Delete a watchlist
export const deleteWatchlist = async (watchlistId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${watchlistId}`);
  } catch (error) {
    console.error(`Error deleting watchlist ${watchlistId}:`, error);
    throw new Error('Failed to delete watchlist');
  }
};

// Add a stock to a watchlist
export const addStockToWatchlist = async (
  watchlistId: string, 
  symbol: string,
  notes?: string,
  tags?: string
): Promise<WatchlistItem> => {
  try {
    const response = await axios.post(`${API_URL}/${watchlistId}/items`, {
      symbol,
      notes,
      tags
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding stock to watchlist ${watchlistId}:`, error);
    throw new Error('Failed to add stock to watchlist');
  }
};

// Update a stock in a watchlist
export const updateWatchlistItem = async (
  watchlistId: string,
  symbol: string,
  updates: {
    notes?: string;
    tags?: string;
    custom_order?: number;
  }
): Promise<WatchlistItem> => {
  try {
    const response = await axios.put(`${API_URL}/${watchlistId}/items/${symbol}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating stock in watchlist ${watchlistId}:`, error);
    throw new Error('Failed to update stock in watchlist');
  }
};

// Remove a stock from a watchlist
export const removeStockFromWatchlist = async (watchlistId: string, symbol: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${watchlistId}/items/${symbol}`);
  } catch (error) {
    console.error(`Error removing stock from watchlist ${watchlistId}:`, error);
    throw new Error('Failed to remove stock from watchlist');
  }
};

// Reorder items in a watchlist
export const reorderWatchlist = async (watchlistId: string, symbols: string[]): Promise<WatchlistItem[]> => {
  try {
    const response = await axios.post(`${API_URL}/${watchlistId}/reorder`, { items: symbols });
    return response.data;
  } catch (error) {
    console.error(`Error reordering watchlist ${watchlistId}:`, error);
    throw new Error('Failed to reorder watchlist');
  }
};

// Get all price alerts
export const getPriceAlerts = async (): Promise<PriceAlert[]> => {
  try {
    const response = await axios.get(`${API_URL}/alerts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching price alerts:', error);
    throw new Error('Failed to fetch price alerts');
  }
};

// Create a new price alert
export const createPriceAlert = async (
  symbol: string,
  type: PriceAlert['type'],
  condition: PriceAlert['condition'],
  threshold: number
): Promise<PriceAlert> => {
  try {
    const response = await axios.post(`${API_URL}/alerts`, {
      symbol,
      type,
      condition,
      threshold
    });
    return response.data;
  } catch (error) {
    console.error('Error creating price alert:', error);
    throw new Error('Failed to create price alert');
  }
};

// Delete a price alert
export const deletePriceAlert = async (alertId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/alerts/${alertId}`);
  } catch (error) {
    console.error(`Error deleting price alert ${alertId}:`, error);
    throw new Error('Failed to delete price alert');
  }
};
