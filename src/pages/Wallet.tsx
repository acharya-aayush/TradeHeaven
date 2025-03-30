
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, ClockIcon, CreditCard, PlusCircle, Wallet as WalletIcon, Building, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for transactions
const recentTransactions = [
  {
    id: 'tx-1',
    date: '2023-09-15',
    type: 'Deposit',
    amount: 5000,
    status: 'completed',
    description: 'Bank Transfer'
  },
  {
    id: 'tx-2',
    date: '2023-09-10',
    type: 'Withdrawal',
    amount: -1200,
    status: 'completed',
    description: 'To Bank Account'
  },
  {
    id: 'tx-3',
    date: '2023-09-05',
    type: 'Deposit',
    amount: 2500,
    status: 'completed',
    description: 'Bank Transfer'
  },
  {
    id: 'tx-4',
    date: '2023-09-01',
    type: 'Withdrawal',
    amount: -800,
    status: 'completed',
    description: 'To Bank Account'
  },
  {
    id: 'tx-5',
    date: '2023-08-28',
    type: 'Deposit',
    amount: 3000,
    status: 'completed',
    description: 'Bank Transfer'
  }
];

// Mock data for balance history
const balanceHistory = [
  { date: '2023-03-01', balance: 10000 },
  { date: '2023-04-01', balance: 12500 },
  { date: '2023-05-01', balance: 11800 },
  { date: '2023-06-01', balance: 14300 },
  { date: '2023-07-01', balance: 16700 },
  { date: '2023-08-01', balance: 15900 },
  { date: '2023-09-01', balance: 18500 },
];

const Wallet = () => {
  const { toast } = useToast();

  const handleDeposit = () => {
    toast({
      title: "Deposit initiated",
      description: "Your funds will be available in 1-3 business days."
    });
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal requested",
      description: "Your withdrawal request has been submitted for processing."
    });
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Wallet</h1>
          <div className="flex gap-2">
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Total Balance</CardTitle>
              <CardDescription>Your available trading funds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <span className="text-4xl font-bold">$18,500.00</span>
                <span className="text-sm text-market-up flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" /> +$1,250.00 (7.25%) this month
                </span>
              </div>
              
              <div className="h-[200px] mt-6 w-full overflow-hidden">
                <ChartContainer
                  config={{
                    balance: { theme: { light: '#3b82f6', dark: '#3b82f6' } }
                  }}
                >
                  <AreaChart data={balanceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      name="balance" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#balanceGradient)" 
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your funds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" onClick={() => document.getElementById('deposit-tab')?.click()}>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Deposit Funds
              </Button>
              
              <Button className="w-full justify-start" variant="outline" onClick={() => document.getElementById('withdraw-tab')?.click()}>
                <ArrowDownRight className="mr-2 h-4 w-4" />
                Withdraw Funds
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <ClockIcon className="mr-2 h-4 w-4" />
                View Transaction History
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Building className="mr-2 h-4 w-4" />
                Manage Bank Accounts
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="deposit" id="deposit-tab">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw" id="withdraw-tab">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>View your recent account activity</CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <div className="max-h-[400px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell className={transaction.amount > 0 ? 'text-market-up' : 'text-market-down'}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                              {transaction.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="outline">View All Transactions</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="deposit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
                <CardDescription>Add money to your trading account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4 bg-muted/30 space-y-2">
                  <h4 className="font-medium">Select Deposit Method</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    <div className="border rounded-md p-3 bg-background flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition">
                      <Building className="h-6 w-6" />
                      <span className="text-sm font-medium">Bank Transfer (ACH)</span>
                      <span className="text-xs text-muted-foreground">1-3 business days</span>
                    </div>
                    
                    <div className="border rounded-md p-3 bg-background flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition">
                      <CreditCard className="h-6 w-6" />
                      <span className="text-sm font-medium">Debit Card</span>
                      <span className="text-xs text-muted-foreground">Instant</span>
                    </div>
                    
                    <div className="border rounded-md p-3 bg-background flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition">
                      <WalletIcon className="h-6 w-6" />
                      <span className="text-sm font-medium">Wire Transfer</span>
                      <span className="text-xs text-muted-foreground">1-2 business days</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="depositAmount">Amount to Deposit</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="depositAmount" className="pl-9" placeholder="0.00" />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 flex-wrap">
                    <Button className="flex-1" variant="outline">$100</Button>
                    <Button className="flex-1" variant="outline">$500</Button>
                    <Button className="flex-1" variant="outline">$1,000</Button>
                    <Button className="flex-1" variant="outline">$5,000</Button>
                  </div>
                </div>
                
                <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <AlertTitle>Deposit Processing Times</AlertTitle>
                  <AlertDescription>
                    ACH transfers typically take 1-3 business days to process. Funds will be available for trading once the transfer clears.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex-col space-y-2 items-start">
                <p className="text-sm text-muted-foreground pb-2">By proceeding, you agree to our deposit terms and conditions.</p>
                <div className="flex gap-3 w-full">
                  <Button className="flex-1" variant="outline">Cancel</Button>
                  <Button className="flex-1" onClick={handleDeposit}>Confirm Deposit</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>Transfer money to your bank account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4 bg-muted/30 space-y-2">
                  <h4 className="font-medium">Select Destination</h4>
                  
                  <div className="space-y-3 mt-2 max-h-[200px] overflow-auto">
                    <div className="border rounded-md p-3 bg-background flex items-center justify-between cursor-pointer hover:border-primary transition">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5" />
                        <div>
                          <span className="font-medium">Chase Bank ****4567</span>
                          <p className="text-xs text-muted-foreground">Checking Account</p>
                        </div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Default</span>
                    </div>
                    
                    <div className="border rounded-md p-3 bg-background flex items-center justify-between cursor-pointer hover:border-primary transition">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5" />
                        <div>
                          <span className="font-medium">Bank of America ****1234</span>
                          <p className="text-xs text-muted-foreground">Savings Account</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Bank Account
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawAmount">Amount to Withdraw</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="withdrawAmount" className="pl-9" placeholder="0.00" />
                    </div>
                    <p className="text-xs text-muted-foreground">Available Balance: $18,500.00</p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Withdrawal Amount</span>
                      <span>$1,000.00</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Fee</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total</span>
                      <span>$1,000.00</span>
                    </div>
                  </div>
                </div>
                
                <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <AlertTitle>Withdrawal Processing Times</AlertTitle>
                  <AlertDescription>
                    Standard withdrawals typically take 1-3 business days to process and appear in your bank account.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex-col space-y-2 items-start">
                <p className="text-sm text-muted-foreground pb-2">By proceeding, you agree to our withdrawal terms and conditions.</p>
                <div className="flex gap-3 w-full">
                  <Button className="flex-1" variant="outline">Cancel</Button>
                  <Button className="flex-1" onClick={handleWithdraw}>Confirm Withdrawal</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default Wallet;
