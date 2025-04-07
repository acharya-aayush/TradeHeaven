import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import PortfolioSummary from '@/components/trading/PortfolioSummary';
import { TrendingUp, TrendingDown, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPortfolioHoldings, PortfolioHolding } from '@/services/portfolioService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

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
// Enhanced colors with better contrast and visibility
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Custom tooltip formatter for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border rounded-md shadow-md p-2 text-sm">
        <p className="font-medium">{data.name}</p>
        <p className="text-xs">{`${data.value}% of portfolio`}</p>
      </div>
    );
  }
  return null;
};

const Portfolio = () => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Calculate asset allocation based on holdings
  const calculateAssetAllocation = () => {
    // This is a simplified version - in a real app, you would categorize stocks by sector
    // For demo purposes, we'll use a mapping of symbols to sectors
    const sectorMap: {[key: string]: string} = {
      // Nepalese companies
      'NABIL': 'Financial',
      'ADBL': 'Financial',
      'SBI': 'Financial',
      'NRIC': 'Financial',
      'GBBL': 'Financial', 
      'NHEC': 'Energy',
      'CHCL': 'Hydropower',
      'AHPC': 'Energy',
      'API': 'Energy',
      'UPPER': 'Energy',
      'BPCL': 'Energy',
      'RHPC': 'Energy',
      'MLBL': 'Manufacturing',
      'SHIVM': 'Manufacturing',
      'HTSL': 'Tech',
      'TPPL': 'Manufacturing',
      'TPL': 'Energy',
      'SCPL': 'Healthcare',
      'DHL': 'Tech',
      'NMRL': 'Consumer',
      'EFCL': 'Financial',
      
      // Foreign companies (keep for reference)
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'GOOGL': 'Technology',
      'AMZN': 'Consumer',
      'META': 'Technology',
      'NFLX': 'Media',
      'TSLA': 'Automotive',
      'NVDA': 'Technology',
      'JPM': 'Financial',
      'BAC': 'Financial',
      'WMT': 'Retail',
      'JNJ': 'Healthcare',
      'PG': 'Consumer',
      'UNH': 'Healthcare',
      'HD': 'Retail'
    };
    
    // Group by sector
    const sectorValues: {[key: string]: number} = {};
    let totalValue = 0;
    
    holdings.forEach(holding => {
      const sector = sectorMap[holding.symbol] || 'Other';
      const value = (holding.value || 0);
      totalValue += value;
      
      if (sectorValues[sector]) {
        sectorValues[sector] += value;
      } else {
        sectorValues[sector] = value;
      }
    });
    
    // Convert to percentage and format for chart
    return Object.entries(sectorValues).map(([name, value]) => ({
      name,
      value: Math.round((value / totalValue) * 100)
    })).sort((a, b) => b.value - a.value);
  };
  
  const assetAllocation = calculateAssetAllocation();
  const totalValue = holdings.reduce((sum, holding) => sum + (holding.value || 0), 0);
  
  // Load portfolio data
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const response = await getPortfolioHoldings();
        
        if (response.error) {
          setError(response.error);
          toast({
            title: "Failed to load portfolio",
            description: response.error,
            variant: "destructive"
          });
        } else if (response.holdings) {
          setHoldings(response.holdings);
          setError(null);
        }
      } catch (err: any) {
        console.error('Failed to load portfolio:', err);
        setError(err.message || 'Failed to load portfolio data');
        toast({
          title: "Error",
          description: "Failed to load portfolio. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPortfolio();
    
    // Set up an interval to refresh the portfolio data every minute
    const interval = setInterval(loadPortfolio, 60000);
    
    return () => clearInterval(interval);
  }, [toast]);
  
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
                      tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`}
                      width={50}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`Rs. ${value.toFixed(2)}`, 'Value']}
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
              <CardDescription>Distribution by sector</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[220px] flex justify-center items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : assetAllocation.length === 0 ? (
                <div className="h-[220px] flex justify-center items-center text-muted-foreground">
                  No holdings to display
                </div>
              ) : (
                <>
                  <div className="h-[220px]">
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
                          labelLine={false}
                          // Remove in-chart labels to prevent overlapping
                        >
                          {assetAllocation.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                              stroke="rgba(255,255,255,0.3)"
                              strokeWidth={1}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          iconType="circle"
                          iconSize={8}
                          formatter={(value) => <span className="text-xs">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Add clear legend display below the chart */}
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {assetAllocation.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span 
                            className="inline-block w-3 h-3 mr-2 rounded-sm" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></span>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {loading ? (
                <div className="h-48 flex justify-center items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : holdings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No holdings in your portfolio.</p>
                  <p className="text-sm mt-2">Execute buy orders to add positions to your portfolio.</p>
                </div>
              ) : (
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
                      {holdings.map((holding) => (
                        <TableRow key={holding.id}>
                          <TableCell className="font-medium">{holding.symbol}</TableCell>
                          <TableCell>{holding.quantity}</TableCell>
                          <TableCell className="font-mono">Rs. {holding.avg_price.toFixed(2)}</TableCell>
                          <TableCell className="font-mono">Rs. {(holding.current_price || 0).toFixed(2)}</TableCell>
                          <TableCell className="font-mono">Rs. {(holding.value || 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <div className={`flex items-center ${
                              (holding.profit_loss || 0) >= 0 ? 'text-market-up' : 'text-market-down'
                            }`}>
                              {(holding.profit_loss || 0) >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              <span>
                                {(holding.profit_loss || 0) >= 0 ? '+' : ''}Rs. {Math.abs(holding.profit_loss || 0).toFixed(2)} ({(holding.profit_loss || 0) >= 0 ? '+' : ''}{(holding.profit_loss_percent || 0).toFixed(2)}%)
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default Portfolio;
