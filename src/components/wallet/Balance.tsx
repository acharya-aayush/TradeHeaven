import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { WalletData } from '@/services/walletService';
import { formatCurrency } from './WalletUtils';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BalanceProps {
  wallet: WalletData | null;
  balanceHistory: any[];
  loading: boolean;
}

export const Balance: React.FC<BalanceProps> = ({ wallet, balanceHistory, loading }) => {
  const navigate = useNavigate();
  const isZeroBalance = wallet && wallet.balance === 0;

  const handleDepositClick = () => {
    navigate('/wallet', { state: { activeTab: 'deposit' } });
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle>Total Balance</CardTitle>
        <CardDescription>Your available trading funds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {loading ? (
            <span className="text-4xl font-bold">Loading...</span>
          ) : (
            <>
              <span className="text-4xl font-bold">
                {formatCurrency(wallet?.balance || 0)}
              </span>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="text-sm flex items-center">
                  <Badge variant="outline" className="mr-2 bg-blue-100">Available</Badge>
                  {formatCurrency((wallet?.balance || 0) - (wallet?.collateral_locked || 0))}
                </span>
                <span className="text-sm flex items-center">
                  <Badge variant="outline" className="mr-2 bg-red-100">Locked</Badge>
                  {formatCurrency(wallet?.collateral_locked || 0)}
                </span>
              </div>
            </>
          )}
        </div>
        
        {isZeroBalance && (
          <Alert variant="default" className="mt-4 bg-yellow-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Funds Available</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>You currently have no funds in your account. Deposit funds to start trading.</p>
              <Button onClick={handleDepositClick} variant="outline" size="sm">
                Deposit Now
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="h-[200px] mt-6 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
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
              <Tooltip formatter={(value) => [`Rs. ${value}`, 'Balance']} />
              <Area 
                type="monotone" 
                dataKey="balance" 
                name="Balance" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#balanceGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
