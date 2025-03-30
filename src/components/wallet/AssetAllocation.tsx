
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { WalletData } from '@/services/walletService';
import { getAssetAllocation, formatCurrency } from './WalletUtils';
import { CollateralManager } from './CollateralManager';

interface AssetAllocationProps {
  wallet: WalletData | null;
  orderId: string;
  onLockCollateral: (amount: number) => Promise<void>;
  onReleaseCollateral: (amount: number) => Promise<void>;
}

export const AssetAllocation: React.FC<AssetAllocationProps> = ({ 
  wallet, 
  orderId,
  onLockCollateral,
  onReleaseCollateral
}) => {
  // Custom pie chart colors
  const COLORS = ['#3b82f6', '#ef4444'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Distribution of your funds</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getAssetAllocation(wallet?.balance, wallet?.collateral_locked)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getAssetAllocation(wallet?.balance, wallet?.collateral_locked).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Manage Collateral
            </Button>
          </DialogTrigger>
          <CollateralManager 
            wallet={wallet} 
            orderId={orderId}
            onLockCollateral={onLockCollateral}
            onReleaseCollateral={onReleaseCollateral}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};
