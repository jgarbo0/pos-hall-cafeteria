
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface FinanceSummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  chartData: any[];
  onViewReport: (type: string, title: string) => void;
}

const FinanceSummaryCards: React.FC<FinanceSummaryCardsProps> = ({
  totalIncome,
  totalExpense,
  chartData,
  onViewReport
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
            Total Revenue
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            onClick={() => onViewReport('revenue', 'Revenue Details')}
          >
            View Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
            All income (Sales + Hall Bookings)
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            ${totalIncome.toFixed(2)}
          </div>
          <div className="flex items-center text-xs text-green-500 dark:text-green-400 mt-1">
            <TrendingUp className="mr-1 h-3 w-3" />
            <span>Combines all income sources</span>
          </div>
          <div className="h-[120px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1F2937", 
                    color: "#F9FAFB", 
                    borderColor: "#374151",
                    fontSize: "12px",
                    padding: "8px"
                  }} 
                  formatter={(value) => [`$${value}`, '']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Bar dataKey="income" fill="#4ade80" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#9b87f5" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
            Weekly Expense
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            onClick={() => onViewReport('weekly-expense', 'Weekly Expense Breakdown')}
          >
            View Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
            From last 7 days
          </div>
          <div className="text-2xl font-bold dark:text-white mt-2">
            ${totalExpense.toFixed(2)}
          </div>
          <div className="flex items-center text-xs text-red-500 dark:text-red-400 mt-1">
            <TrendingDown className="mr-1 h-3 w-3" />
            <span>All expenses combined</span>
          </div>
          <div className="h-[120px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1F2937", 
                    color: "#F9FAFB", 
                    borderColor: "#374151",
                    fontSize: "12px",
                    padding: "8px"
                  }} 
                  formatter={(value) => [`$${value}`, '']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Bar dataKey="expense" fill="#f87171" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
            Net Income
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            onClick={() => onViewReport('net-income', 'Net Income Details')}
          >
            View Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
            Total Income - Total Expenses
          </div>
          <div className="flex flex-col items-center justify-center mt-4">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-40 h-40">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="64"
                  cx="80"
                  cy="80"
                />
                <circle
                  className="text-green-500 dark:text-green-400"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="64"
                  cx="80"
                  cy="80"
                  strokeDasharray={`${(2 * Math.PI * 64) * (totalIncome - totalExpense) / Math.max(1200, totalIncome)} ${2 * Math.PI * 64}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 80 80)"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-bold dark:text-white">${(totalIncome - totalExpense).toFixed(2)}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Net Profit</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceSummaryCards;
