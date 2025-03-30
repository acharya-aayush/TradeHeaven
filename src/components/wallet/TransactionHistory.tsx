
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Transaction } from '@/services/walletService';
import { formatDate, getTypeLabel, getTypeColor, formatCurrency } from './WalletUtils';

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View your recent account activity</CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Loading transactions...</TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">No transactions found</TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={transaction.type.includes('lock') ? 'bg-amber-100' : transaction.type === 'load' ? 'bg-green-100' : 'bg-red-100'}>
                        {getTypeLabel(transaction.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className={getTypeColor(transaction.type)}>
                      {transaction.type === 'load' ? '+' : transaction.type === 'withdraw' ? '-' : ''}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
