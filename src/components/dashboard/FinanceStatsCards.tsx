
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FinanceStatsCardsProps {
  income: {
    value: string;
    change: string;
  };
  expense: {
    value: string;
    change: string;
  };
}

const FinanceStatsCards: React.FC<FinanceStatsCardsProps> = ({ income, expense }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Income</p>
            <h3 className="text-2xl font-bold">{income.value}</h3>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-green-500 flex items-center">
                <ArrowUpCircle className="h-3 w-3 mr-1" />
                {income.change}
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </div>
          <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
            <ArrowUpCircle className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
            <h3 className="text-2xl font-bold">{expense.value}</h3>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-red-500 flex items-center">
                <ArrowUpCircle className="h-3 w-3 mr-1" />
                {expense.change}
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </div>
          <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <ArrowDownCircle className="h-6 w-6 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceStatsCards;
