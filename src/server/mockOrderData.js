/**
 * Mock order data for the server
 */

const mockOrders = [
  {
    id: 'ord-001',
    user_id: 'user1',
    symbol: 'NABIL',
    type: 'limit',
    side: 'buy',
    quantity: 20,
    price: 985.65,
    status: 'open',
    timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
  },
  {
    id: 'ord-002',
    user_id: 'user1',
    symbol: 'HTSL',
    type: 'limit',
    side: 'buy',
    quantity: 5,
    price: 1100.50,
    status: 'filled',
    timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  },
  {
    id: 'ord-003',
    user_id: 'user1',
    symbol: 'TPL',
    type: 'limit',
    side: 'sell',
    quantity: 3,
    price: 520.00,
    status: 'canceled',
    timestamp: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
  },
  {
    id: 'ord-004',
    user_id: 'user1',
    symbol: 'NABIL',
    type: 'limit',
    side: 'buy',
    quantity: 15,
    price: 980.75,
    status: 'executed',
    timestamp: new Date(Date.now() - 14400000).toISOString() // 4 hours ago
  },
  {
    id: 'ord-005',
    user_id: 'user1',
    symbol: 'DHL',
    type: 'market',
    side: 'sell',
    quantity: 10,
    price: null,
    status: 'pending',
    timestamp: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
  },
  {
    id: 'ord-006',
    user_id: 'user1',
    symbol: 'SCPL',
    type: 'limit',
    side: 'buy',
    quantity: 8,
    price: 645.30,
    status: 'rejected',
    timestamp: new Date(Date.now() - 21600000).toISOString() // 6 hours ago
  },
  {
    id: 'ord-007',
    user_id: 'user1',
    symbol: 'NHEC',
    type: 'limit',
    side: 'buy',
    quantity: 12,
    price: 845.20,
    status: 'open',
    timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  }
];

// Use either ES Module or CommonJS exports depending on the environment
export default mockOrders; 