import axios from 'axios';
import { OrderData } from '@/lib/data/mockData';
import { lockCollateral, releaseCollateral } from './walletService';
import { ensureServerRunning } from '@/utils/serverManager';

// Base API URL
const API_URL = 'http://localhost:3001';

// Order placement response interface
export interface OrderResponse {
  success: boolean;
  message: string;
  error?: string;
  order?: OrderData;
  holding?: any;
  wallet?: any;
}

// Place a new order
export const placeOrder = async (
  symbol: string,
  side: 'buy' | 'sell',
  type: 'market' | 'limit' | 'stop',
  quantity: number,
  price?: number
): Promise<OrderResponse> => {
  try {
    // Ensure server is running before making request
    const serverRunning = await ensureServerRunning();
    if (!serverRunning) {
      return {
        success: false,
        message: 'Failed to place order',
        error: 'Wallet server is not running. Please start the server with "node start-wallet-server.js"'
      };
    }

    // For buy orders, lock the required collateral
    if (side === 'buy') {
      const orderValue = quantity * (price || 0);
      const collateralResponse = await lockCollateral(orderValue, `${symbol}-${Date.now()}`);
      
      if (collateralResponse.error) {
        return {
          success: false,
          message: 'Failed to place order',
          error: collateralResponse.error
        };
      }
    }

    // In a real system, we would save the order to the database here
    // For now, we'll simulate a successful order creation
    const orderResponse = await axios.post(`${API_URL}/orders/place`, {
      symbol,
      side,
      type,
      quantity,
      price
    });
    
    return orderResponse.data;
  } catch (error: any) {
    console.error('Error placing order:', error);
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      message: 'Failed to place order',
      error: error.message
    };
  }
};

// Get all orders
export const getOrders = async (): Promise<OrderData[]> => {
  try {
    // Ensure server is running before making request
    const serverRunning = await ensureServerRunning();
    if (!serverRunning) {
      throw new Error('Wallet server is not running. Please start the server with "node start-wallet-server.js"');
    }
    
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (orderId: string): Promise<OrderResponse> => {
  try {
    // Ensure server is running before making request
    const serverRunning = await ensureServerRunning();
    if (!serverRunning) {
      return {
        success: false,
        message: 'Failed to cancel order',
        error: 'Wallet server is not running. Please start the server with "node start-wallet-server.js"'
      };
    }
    
    const response = await axios.post(`${API_URL}/orders/cancel`, { orderId });
    
    // If cancellation was successful and it was a buy order, release the collateral
    if (response.data.success && response.data.order?.side === 'buy') {
      const orderValue = response.data.order.quantity * (response.data.order.price || 0);
      await releaseCollateral(orderValue, orderId);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error canceling order:', error);
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    };
  }
};

// Execute an order
export const executeOrder = async (orderId: string, executionPrice?: number): Promise<OrderResponse> => {
  try {
    // Ensure server is running before making request
    const serverRunning = await ensureServerRunning();
    
    // For testing in offline/demo mode - provide mock response
    if (!serverRunning) {
      console.log(`[MOCK] Executing order ${orderId} with price ${executionPrice}`);
      
      // Return a successful mock response
      return {
        success: true,
        message: 'Order executed successfully',
        order: {
          id: orderId,
          status: 'executed',
          price: executionPrice, 
          // Other fields will be filled in by the component
          symbol: '',  // Will be filled from the original order in useOrders
          type: 'limit',
          side: 'buy',
          quantity: 0,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    // Production code - make the actual API call
    const response = await axios.post(`${API_URL}/orders/execute`, { 
      orderId,
      executionPrice
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error executing order:', error);
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      message: 'Failed to execute order',
      error: error.message
    };
  }
};
