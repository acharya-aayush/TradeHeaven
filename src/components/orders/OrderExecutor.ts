import { OrderData } from '@/lib/data/mockData';

/**
 * A helper function to safely execute orders
 * This provides a workaround for issues with component render cycles
 */
export const executeOrder = async (
  order: OrderData,
  executionPrice: number | undefined,
  executeOrderFunction: (orderId: string, executionPrice?: number) => Promise<any>
): Promise<boolean> => {
  if (!order || !order.id) {
    console.error('Invalid order provided to executeOrder');
    return false;
  }
  
  try {
    console.log(`Preparing to execute order ${order.id} with price ${executionPrice || 'default'}`);
    await executeOrderFunction(order.id, executionPrice);
    console.log(`Successfully executed order ${order.id}`);
    return true;
  } catch (error) {
    console.error(`Failed to execute order ${order.id}:`, error);
    return false;
  }
}; 