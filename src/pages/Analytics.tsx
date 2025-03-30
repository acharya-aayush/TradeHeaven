import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { portfolioData, generateHistoricalData } from '@/lib/data/mockData';

// Mock data for analytics charts
const performanceData = generateHistoricalData(90, 0.03, 10000);
const tradingActivityData = [
  { month: 'Jan', buys: 45, sells: 32 },
  { month: 'Feb', buys: 38, sells: 41 },
  { month: 'Mar', buys: 52, sells: 35 },
  { month: 'Apr', buys: 35, sells: 29 },
  { month: 'May', buys: 41, sells: 38 },
  { month: 'Jun', buys: 47, sells: 43 },
  { month: 'Jul', buys: 53, sells: 50 },
  { month: 'Aug', buys: 49, sells: 45 },
];

const sectorDistributionData = [
  { name: 'Technology', value: 45 },
  { name: 'Healthcare', value: 20 },
  { name: 'Finance', value: 15 },
  { name: 'Consumer', value: 10 },
  { name: 'Energy', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>
        
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 mb-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="w-full">
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full overflow-hidden">
                    <ChartContainer 
                      config={{
                        performance: { theme: { light: '#3b82f6', dark: '#3b82f6' } }
                      }}
                    >
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line type="monotone" dataKey="price" name="performance" stroke="#3b82f6" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Return</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-market-up">+24.8%</div>
                    <div className="text-sm text-muted-foreground">vs. S&P 500 +18.2%</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Annualized Return</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-market-up">+16.5%</div>
                    <div className="text-sm text-muted-foreground">Last 3 years</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sharpe Ratio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1.75</div>
                    <div className="text-sm text-muted-foreground">Above average</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trading Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full overflow-hidden">
                    <ChartContainer 
                      config={{
                        buys: { theme: { light: '#4ade80', dark: '#4ade80' } },
                        sells: { theme: { light: '#f87171', dark: '#f87171' } }
                      }}
                    >
                      <BarChart data={tradingActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="buys" name="buys" fill="#4ade80" />
                        <Bar dataKey="sells" name="sells" fill="#f87171" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Trades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">532</div>
                    <div className="text-sm text-muted-foreground">Last 12 months</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Win Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">67.8%</div>
                    <div className="text-sm text-muted-foreground">Above target</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Avg. Hold Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">24 days</div>
                    <div className="text-sm text-muted-foreground">Decreasing</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="allocation" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sector Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full overflow-hidden">
                      <ChartContainer 
                        config={{
                          sectors: { label: "Sectors" }
                        }}
                      >
                        <PieChart>
                          <Pie
                            data={sectorDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={140}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {sectorDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[350px]">
                      <div className="flex flex-col justify-between">
                        {portfolioData.map((position) => (
                          <div key={position.symbol} className="flex items-center justify-between py-2">
                            <div>
                              <div className="font-medium">{position.symbol}</div>
                              <div className="text-sm text-muted-foreground">${position.value.toLocaleString()}</div>
                            </div>
                            <div className="w-1/2">
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${(position.value / portfolioData.reduce((acc, pos) => acc + pos.value, 0) * 100).toFixed(1)}%` }}
                                />
                              </div>
                              <div className="text-right text-xs mt-1">
                                {(position.value / portfolioData.reduce((acc, pos) => acc + pos.value, 0) * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="risk" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Beta (vs S&P 500)</span>
                          <span className="font-medium">1.15</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '75%' }} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Higher volatility than market</div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Alpha (Annualized)</span>
                          <span className="font-medium text-market-up">+3.8%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '65%' }} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Outperforming benchmark</div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Maximum Drawdown</span>
                          <span className="font-medium text-market-down">-14.2%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '40%' }} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Within acceptable range</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Volatility (Annualized)</span>
                          <span className="font-medium">18.5%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '60%' }} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Moderate volatility</div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Sortino Ratio</span>
                          <span className="font-medium">1.89</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '70%' }} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Good downside risk management</div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Value at Risk (95%)</span>
                          <span className="font-medium text-market-down">-$2,450</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '45%' }} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Daily potential loss</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default Analytics;
