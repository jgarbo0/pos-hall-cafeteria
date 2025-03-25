
import React from 'react';
import { format } from 'date-fns';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction } from '@/types';

interface TransactionsTableProps {
  transactions: Transaction[];
  transactionType: 'all' | 'income' | 'expense';
  onTransactionTypeChange: (value: 'all' | 'income' | 'expense') => void;
  onViewDetails: (id: string, title: string) => void;
  onViewAll: () => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  transactionType,
  onTransactionTypeChange,
  onViewDetails,
  onViewAll,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-muted-foreground dark:text-gray-400">
          Showing {transactions.length} transactions
        </div>
        <div className="flex items-center gap-2">
          <Select 
            value={transactionType} 
            onValueChange={(value: any) => onTransactionTypeChange(value)}
          >
            <SelectTrigger className="h-8 text-xs w-[120px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            onClick={onViewAll}
          >
            View All
          </Button>
        </div>
      </div>
      <div className="overflow-auto max-h-[360px]">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-400">Date</TableHead>
              <TableHead className="dark:text-gray-400">Description</TableHead>
              <TableHead className="dark:text-gray-400">Category</TableHead>
              <TableHead className="text-right dark:text-gray-400">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  className="dark:border-gray-700 dark:hover:bg-gray-800/50 cursor-pointer"
                  onClick={() => onViewDetails(transaction.id, `Transaction: ${transaction.description}`)}
                >
                  <TableCell className="font-medium dark:text-gray-300">
                    {format(new Date(transaction.date), 'dd MMM')}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">{transaction.description}</TableCell>
                  <TableCell className="dark:text-gray-300">{transaction.category}</TableCell>
                  <TableCell 
                    className={cn(
                      "text-right",
                      transaction.type === 'income' 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsTable;
