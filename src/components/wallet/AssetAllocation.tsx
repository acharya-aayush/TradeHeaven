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
  // Custom pie chart colors - improved contrast colors
  const COLORS = ['#3b82f6', '#f97316'];
  
  // Calculate total for percentage display
  const data = getAssetAllocation(wallet?.balance, wallet?.collateral_locked);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip formatter
  const customTooltipFormatter = (value: number) => {
    return [
      formatCurrency(value),
      `${((value / total) * 100).toFixed(1)}%`
    ].join(' - ');
  };

  // Ensure we have data to display
  const hasValidData = data.length > 0 && total > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Distribution of your funds</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="h-[220px] w-full">
          {hasValidData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                    // Only show label if segment is big enough
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
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={customTooltipFormatter} />
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={10}
                  formatter={(value, entry, index) => (
                    <span className="text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No allocation data available
            </div>
          )}
        </div>
        
        {hasValidData && (
          <div className="w-full mt-4 grid grid-cols-2 gap-4 text-center">
            {data.map((item, index) => (
              <div 
                key={item.name} 
                className="p-2 rounded-md"
                style={{ backgroundColor: `${COLORS[index % COLORS.length]}15` }}
              >
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-lg font-bold">{formatCurrency(item.value)}</div>
                <div className="text-xs text-muted-foreground">
                  {((item.value / total) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}
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
