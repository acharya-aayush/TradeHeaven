export interface StockData {
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
}

export interface OrderData {
  id: string;
  symbol: string;
  type: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  status: 'open' | 'filled' | 'canceled' | 'rejected' | 'executed' | 'pending';
  timestamp: string;
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const stocksData: StockData[] = [
  {
    symbol: 'NABIL',
    name: 'Nabil Bank Limited',
    price: 985.65,
    previousClose: 980.25,
    change: 5.40,
    changePercent: 0.55,
    volume: 125430,
    marketCap: 156500000000,
    sector: 'Financial'
  },
  {
    symbol: 'NHEC',
    name: 'Nepal HydroEnergy Company',
    price: 845.20,
    previousClose: 830.50,
    change: 14.70,
    changePercent: 1.77,
    volume: 98450,
    marketCap: 134000000000,
    sector: 'Energy'
  },
  {
    symbol: 'HTSL',
    name: 'HimTech Solutions Limited',
    price: 1120.75,
    previousClose: 1143.25,
    change: -22.50,
    changePercent: -1.97,
    volume: 56780,
    marketCap: 87500000000,
    sector: 'Tech'
  },
  {
    symbol: 'SCPL',
    name: 'SwasthaCare Pharmaceuticals Ltd.',
    price: 645.30,
    previousClose: 635.15,
    change: 10.15,
    changePercent: 1.60,
    volume: 78900,
    marketCap: 42000000000,
    sector: 'Healthcare'
  },
  {
    symbol: 'TPL',
    name: 'Trishakti Power Ltd.',
    price: 512.45,
    previousClose: 518.70,
    change: -6.25,
    changePercent: -1.20,
    volume: 103450,
    marketCap: 38600000000,
    sector: 'Energy'
  },
  {
    symbol: 'DHL',
    name: 'Digital Himalaya Ltd.',
    price: 950.25,
    previousClose: 935.40,
    change: 14.85,
    changePercent: 1.59,
    volume: 45680,
    marketCap: 67800000000,
    sector: 'Tech'
  },
  {
    symbol: 'NMRL',
    name: 'Namaste Motors and Retail Ltd.',
    price: 525.85,
    previousClose: 520.30,
    change: 5.55,
    changePercent: 1.07,
    volume: 86750,
    marketCap: 29500000000,
    sector: 'Consumer'
  },
  {
    symbol: 'EFCL',
    name: 'Everest Finance Company Ltd.',
    price: 678.50,
    previousClose: 682.25,
    change: -3.75,
    changePercent: -0.55,
    volume: 39560,
    marketCap: 32700000000,
    sector: 'Financial'
  }
];

export const portfolioData: PortfolioPosition[] = [
  {
    symbol: 'NABIL',
    quantity: 50,
    averagePrice: 950.75,
    currentPrice: 985.65,
    value: 49282.5,
    gainLoss: 1745,
    gainLossPercent: 3.67
  },
  {
    symbol: 'NHEC',
    quantity: 25,
    averagePrice: 830.40,
    currentPrice: 845.20,
    value: 21130.0,
    gainLoss: 370,
    gainLossPercent: 1.78
  },
  {
    symbol: 'HTSL',
    quantity: 20,
    averagePrice: 1080.60,
    currentPrice: 1120.75,
    value: 22415.0,
    gainLoss: 803.0,
    gainLossPercent: 3.72
  },
  {
    symbol: 'TPL',
    quantity: 30,
    averagePrice: 520.40,
    currentPrice: 512.45,
    value: 15373.5,
    gainLoss: -238.5,
    gainLossPercent: -1.53
  }
];

export const ordersData: OrderData[] = [
  {
    id: 'ord-001',
    symbol: 'NABIL',
    type: 'market',
    side: 'buy',
    quantity: 10,
    status: 'filled',
    timestamp: '2023-09-15T10:23:45Z'
  },
  {
    id: 'ord-002',
    symbol: 'HTSL',
    type: 'limit',
    side: 'buy',
    quantity: 5,
    price: 1100.50,
    status: 'filled',
    timestamp: '2023-09-14T14:12:30Z'
  },
  {
    id: 'ord-003',
    symbol: 'TPL',
    type: 'limit',
    side: 'sell',
    quantity: 3,
    price: 520.00,
    status: 'open',
    timestamp: '2023-09-16T09:45:22Z'
  },
  {
    id: 'ord-004',
    symbol: 'SCPL',
    type: 'stop',
    side: 'sell',
    quantity: 8,
    price: 640.75,
    status: 'open',
    timestamp: '2023-09-16T11:30:15Z'
  }
];

export const watchlistData: WatchlistItem[] = [
  {
    symbol: 'NABIL',
    name: 'Nabil Bank Limited',
    price: 985.65,
    change: 5.40,
    changePercent: 0.55
  },
  {
    symbol: 'HTSL',
    name: 'HimTech Solutions Limited',
    price: 1120.75,
    change: -22.50,
    changePercent: -1.97
  },
  {
    symbol: 'DHL',
    name: 'Digital Himalaya Ltd.',
    price: 950.25,
    change: 14.85,
    changePercent: 1.59
  },
  {
    symbol: 'TPL',
    name: 'Trishakti Power Ltd.',
    price: 512.45,
    change: -6.25,
    changePercent: -1.20
  },
  {
    symbol: 'NMRL',
    name: 'Namaste Motors and Retail Ltd.',
    price: 525.85,
    change: 5.55,
    changePercent: 1.07
  }
];

// Mock orders for testing with varied statuses
export const MOCK_ORDERS: OrderData[] = [
  {
    id: 'ord-001',
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
    symbol: 'DHL',
    type: 'market',
    side: 'sell',
    quantity: 10,
    status: 'pending',
    timestamp: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
  },
  {
    id: 'ord-006',
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
    symbol: 'NABIL',
    type: 'limit',
    side: 'buy',
    quantity: 10,
    price: 983.50,
    status: 'open',
    timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  }
];

// Historical price data for charts (simplified)
export const generateHistoricalData = (days = 30, volatility = 0.02, startPrice = 100) => {
  const data = [];
  let currentPrice = startPrice;
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random price movement with some volatility
    const change = currentPrice * (Math.random() * volatility * 2 - volatility);
    currentPrice += change;
    currentPrice = Math.max(currentPrice, 5); // Prevent price going too low
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }
  
  return data;
};

export const stockChartData = {
  NABIL: generateHistoricalData(90, 0.015, 970),
  HTSL: generateHistoricalData(90, 0.012, 1100),
  SCPL: generateHistoricalData(90, 0.018, 640),
  TPL: generateHistoricalData(90, 0.025, 510),
  DHL: generateHistoricalData(90, 0.03, 920),
};

// Market summary data
export const marketSummaryData = {
  indices: [
    { name: 'NEPSE Index', value: 2432.56, change: 0.62 },
    { name: 'Float Index', value: 1215.45, change: 0.87 },
    { name: 'Sensitive Index', value: 426.33, change: 0.35 },
    { name: 'Banking Index', value: 1576.22, change: -0.12 }
  ],
  sectors: [
    { name: 'Tech', change: 1.21 },
    { name: 'Healthcare', change: 0.54 },
    { name: 'Financial', change: -0.32 },
    { name: 'Consumer', change: 0.87 },
    { name: 'Energy', change: -0.64 }
  ]
};
