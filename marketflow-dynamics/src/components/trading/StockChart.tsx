
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Button } from "@/components/ui/button";
import { stockChartData } from '@/lib/data/mockData';

interface StockChartProps {
  symbol: string;
  name?: string;
  timeRange?: '1D' | '1W' | '1M' | '3M' | '1Y' | 'All';
}

const StockChart: React.FC<StockChartProps> = ({ 
  symbol, 
  name,
  timeRange = '3M' 
}) => {
  const [selectedRange, setSelectedRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'All'>(timeRange);
  
  // Get chart data for the selected symbol (default to AAPL if not found)
  const chartData = stockChartData[symbol as keyof typeof stockChartData] || stockChartData.AAPL;
  
  // Filter data based on selected time range
  const getFilteredData = () => {
    switch (selectedRange) {
      case '1D':
        return chartData.slice(-1);
      case '1W':
        return chartData.slice(-7);
      case '1M':
        return chartData.slice(-30);
      case '3M':
        return chartData;
      case '1Y':
        return chartData;
      case 'All':
        return chartData;
      default:
        return chartData;
    }
  };
  
  const data = getFilteredData();
  
  // Calculate price change
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const change = lastPrice - firstPrice;
  const changePercent = (change / firstPrice) * 100;
  const isPositive = change >= 0;
  
  // Find min and max prices for chart Y-axis domain
  const prices = data.map(item => item.price);
  const minPrice = Math.min(...prices) * 0.99;
  const maxPrice = Math.max(...prices) * 1.01;
  
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-medium">
            {symbol} {name ? `- ${name}` : ''}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-mono">${lastPrice.toFixed(2)}</span>
            <span className={`text-sm ${isPositive ? 'text-market-up' : 'text-market-down'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={isPositive ? '#10B981' : '#EF4444'} 
                    stopOpacity={0.8}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={isPositive ? '#10B981' : '#EF4444'} 
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  if (selectedRange === '1D') return value;
                  return value.split('-').slice(1).join('/'); // Format as MM/DD
                }}
              />
              <YAxis 
                domain={[minPrice, maxPrice]} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                width={50}
              />
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
                wrapperStyle={{ zIndex: 5 }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? '#10B981' : '#EF4444'} 
                fillOpacity={1}
                fill="url(#colorPrice)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex gap-2 mt-4 justify-center">
          {(['1D', '1W', '1M', '3M', '1Y', 'All'] as const).map((range) => (
            <Button 
              key={range}
              variant={selectedRange === range ? "default" : "outline"}
              className="text-xs h-7 px-2.5"
              onClick={() => setSelectedRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
