import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { portfolioData } from '@/lib/data/mockData';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

// Calculate allocation data from portfolio
const getPortfolioAllocation = () => {
  const sectors: Record<string, number> = {};
  
  // Group by sectors (simplified for demo)
  const sectorMapping: Record<string, string> = {
    'AAPL': 'Technology',
    'MSFT': 'Technology',
    'GOOGL': 'Technology',
    'AMZN': 'Consumer Cyclical',
    'TSLA': 'Automotive',
    'META': 'Technology',
    'NVDA': 'Technology',
    'JPM': 'Financial Services'
  };
  
  portfolioData.forEach(position => {
    const sector = sectorMapping[position.symbol] || 'Other';
    if (sectors[sector]) {
      sectors[sector] += position.value;
    } else {
      sectors[sector] = position.value;
    }
  });
  
  // Convert to array format needed for pie chart
  return Object.entries(sectors).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value); // Sort by value descending
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

// For a good visual balance, aim for a height that's proportional but not overwhelming
const CHART_HEIGHT = 280;

const PortfolioChart = () => {
  const allocationData = getPortfolioAllocation();
  const totalValue = allocationData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Portfolio Allocation</CardTitle>
        <CardDescription>Breakdown by sector</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: CHART_HEIGHT }}>
          <ChartContainer
            config={{
              allocation: { 
                theme: { 
                  light: '#3b82f6',
                  dark: '#3b82f6' 
                }
              }
            }}
          >
            <PieChart margin={{ top: 0, right: 20, bottom: 20, left: 20 }}>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  // Only show label for segments with enough space (more than 5%)
                  if (percent < 0.05) return null;
                  
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                  
                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill="white" 
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                      className="text-xs font-medium"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend 
                content={<ChartLegendContent />}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ChartContainer>
        </div>
        
        <div className="mt-4 space-y-2 max-h-40 overflow-auto">
          {allocationData.map((item, index) => (
            <div key={item.name} className="flex justify-between text-sm">
              <div className="flex items-center">
                <span 
                  className="inline-block w-3 h-3 mr-2 rounded-sm" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span>{item.name}</span>
              </div>
              <div className="font-medium">
                {((item.value / totalValue) * 100).toFixed(1)}% 
                <span className="text-muted-foreground ml-2">
                  (Rs. {item.value.toLocaleString()})
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioChart;
