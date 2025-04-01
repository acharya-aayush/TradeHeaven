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
  status: 'open' | 'filled' | 'canceled' | 'rejected';
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
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 165.32,
    previousClose: 163.45,
    change: 1.87,
    changePercent: 1.14,
    volume: 76542000,
    marketCap: 2870000000000,
    sector: 'Technology'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 342.88,
    previousClose: 338.11,
    change: 4.77,
    changePercent: 1.41,
    volume: 25432000,
    marketCap: 2540000000000,
    sector: 'Technology'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.45,
    previousClose: 139.66,
    change: -1.21,
    changePercent: -0.87,
    volume: 18765000,
    marketCap: 1750000000000,
    sector: 'Technology'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.25,
    previousClose: 175.35,
    change: 2.9,
    changePercent: 1.65,
    volume: 32654000,
    marketCap: 1830000000000,
    sector: 'Consumer Cyclical'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.39,
    previousClose: 251.05,
    change: -2.66,
    changePercent: -1.06,
    volume: 85642000,
    marketCap: 785000000000,
    sector: 'Automotive'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 465.78,
    previousClose: 458.32,
    change: 7.46,
    changePercent: 1.63,
    volume: 15432000,
    marketCap: 1180000000000,
    sector: 'Technology'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 852.95,
    previousClose: 840.25,
    change: 12.7,
    changePercent: 1.51,
    volume: 43215000,
    marketCap: 2100000000000,
    sector: 'Technology'
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 183.25,
    previousClose: 184.47,
    change: -1.22,
    changePercent: -0.66,
    volume: 12654000,
    marketCap: 528000000000,
    sector: 'Financial Services'
  }
];

export const portfolioData: PortfolioPosition[] = [
  {
    symbol: 'AAPL',
    quantity: 50,
    averagePrice: 150.25,
    currentPrice: 165.32,
    value: 8266,
    gainLoss: 753.50,
    gainLossPercent: 10.03
  },
  {
    symbol: 'MSFT',
    quantity: 25,
    averagePrice: 320.45,
    currentPrice: 342.88,
    value: 8572,
    gainLoss: 560.75,
    gainLossPercent: 7.00
  },
  {
    symbol: 'NVDA',
    quantity: 15,
    averagePrice: 780.50,
    currentPrice: 852.95,
    value: 12794.25,
    gainLoss: 1086.75,
    gainLossPercent: 9.28
  },
  {
    symbol: 'GOOGL',
    quantity: 30,
    averagePrice: 140.25,
    currentPrice: 138.45,
    value: 4153.5,
    gainLoss: -54,
    gainLossPercent: -1.28
  }
];

export const ordersData: OrderData[] = [
  {
    id: 'ord-001',
    symbol: 'AAPL',
    type: 'market',
    side: 'buy',
    quantity: 10,
    status: 'filled',
    timestamp: '2023-09-15T10:23:45Z'
  },
  {
    id: 'ord-002',
    symbol: 'MSFT',
    type: 'limit',
    side: 'buy',
    quantity: 5,
    price: 330.50,
    status: 'filled',
    timestamp: '2023-09-14T14:12:30Z'
  },
  {
    id: 'ord-003',
    symbol: 'TSLA',
    type: 'limit',
    side: 'sell',
    quantity: 3,
    price: 250.00,
    status: 'open',
    timestamp: '2023-09-16T09:45:22Z'
  },
  {
    id: 'ord-004',
    symbol: 'GOOGL',
    type: 'stop',
    side: 'sell',
    quantity: 8,
    price: 135.75,
    status: 'open',
    timestamp: '2023-09-16T11:30:15Z'
  }
];

export const watchlistData: WatchlistItem[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 165.32,
    change: 1.87,
    changePercent: 1.14
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 342.88,
    change: 4.77,
    changePercent: 1.41
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 852.95,
    change: 12.7,
    changePercent: 1.51
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.39,
    change: -2.66,
    changePercent: -1.06
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 465.78,
    change: 7.46,
    changePercent: 1.63
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
  AAPL: generateHistoricalData(90, 0.015, 160),
  MSFT: generateHistoricalData(90, 0.012, 330),
  GOOGL: generateHistoricalData(90, 0.018, 140),
  TSLA: generateHistoricalData(90, 0.025, 250),
  NVDA: generateHistoricalData(90, 0.03, 800),
};

// Market summary data
export const marketSummaryData = {
  indices: [
    { name: 'S&P 500', value: 4532.12, change: 0.62 },
    { name: 'Nasdaq', value: 14215.45, change: 0.87 },
    { name: 'Dow Jones', value: 35426.33, change: 0.35 },
    { name: 'Russell 2000', value: 1976.22, change: -0.12 }
  ],
  sectors: [
    { name: 'Technology', change: 1.21 },
    { name: 'Healthcare', change: 0.54 },
    { name: 'Financial', change: -0.32 },
    { name: 'Consumer Cyclical', change: 0.87 },
    { name: 'Energy', change: -0.64 }
  ]
};
