
import React from 'react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface HallBookingFinanceWidgetProps {
  financeData: any[];
  totalIncome: number;
  totalExpense: number;
  isLoading: boolean;
  onViewDetails: () => void;
}

const HallBookingFinanceWidget: React.FC<HallBookingFinanceWidgetProps> = ({
  financeData,
  totalIncome,
  totalExpense,
  isLoading,
  onViewDetails
}) => {
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
          <p className="text-xs text-green-600 dark:text-green-400">Income</p>
          <p className="text-lg font-semibold text-green-700 dark:text-green-400">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
          <p className="text-xs text-red-600 dark:text-red-400">Expense</p>
          <p className="text-lg font-semibold text-red-700 dark:text-red-400">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3">
          <p className="text-xs text-blue-600 dark:text-blue-400">Profit</p>
          <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">{formatCurrency(netProfit)}</p>
        </div>
      </div>

      <div className="h-[200px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={financeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#4ade80" name="Income" />
            <Line type="monotone" dataKey="expense" stroke="#f87171" name="Expense" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground dark:text-gray-400">
          Profit Margin: <span className="text-green-500 dark:text-green-400 font-medium">{profitMargin}%</span>
        </div>
        <Button size="sm" variant="outline" onClick={onViewDetails}>
          View Details
        </Button>
      </div>
    </div>
  );
};

export default HallBookingFinanceWidget;
