
import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { portfolioData } from '@/lib/data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import PortfolioSummary from '@/components/trading/PortfolioSummary';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Generate some dummy asset allocation data
const assetAllocation = [
  { name: 'Technology', value: 45 },
  { name: 'Financial', value: 20 },
  { name: 'Healthcare', value: 15 },
  { name: 'Consumer', value: 10 },
  { name: 'Energy', value: 10 },
];

// Generate dummy performance data
const generatePerformanceData = () => {
  const data = [];
  const now = new Date();
  let value = 10000;
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random daily change with slight upward bias
    const change = value * (Math.random() * 0.03 - 0.01);
    value += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2))
    });
  }
  
  return data;
};

const performanceData = generatePerformanceData();
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Portfolio = () => {
  const totalValue = portfolioData.reduce((sum, position) => sum + position.value, 0);
  
  return (
    <AppShell>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => value.split('-').slice(1).join('/')}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      width={50}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <PortfolioSummary />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Allocation']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Holdings</CardTitle>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Position</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Avg. Price</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>P/L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolioData.map((position) => (
                      <TableRow key={position.symbol}>
                        <TableCell className="font-medium">{position.symbol}</TableCell>
                        <TableCell>{position.quantity}</TableCell>
                        <TableCell className="font-mono">${position.averagePrice.toFixed(2)}</TableCell>
                        <TableCell className="font-mono">${position.currentPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-mono">${position.value.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className={`flex items-center ${
                            position.gainLoss >= 0 ? 'text-market-up' : 'text-market-down'
                          }`}>
                            {position.gainLoss >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            <span>
                              {position.gainLoss >= 0 ? '+' : ''}${Math.abs(position.gainLoss).toFixed(2)} ({position.gainLoss >= 0 ? '+' : ''}{position.gainLossPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default Portfolio;
