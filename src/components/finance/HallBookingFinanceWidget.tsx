import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpCircle, Building } from 'lucide-react';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils';

interface HallBookingFinanceData {
  name: string;
  income: number;
  expense: number;
}

interface HallBookingFinanceWidgetProps {
  data: HallBookingFinanceData[];
  totalIncome: number;
  totalExpense: number;
  onViewReport: () => void;
  isLoading?: boolean;
}

const HallBookingFinanceWidget: React.FC<HallBookingFinanceWidgetProps> = ({
  data,
  totalIncome,
  totalExpense,
  onViewReport,
  isLoading = false
}) => {
  const profit = totalIncome - totalExpense;
  
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
              Hall Booking Revenue
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
              Loading data...
            </CardDescription>
          </div>
          <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Building className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
            Hall Booking Revenue
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
            Last 7 days booking data
          </CardDescription>
        </div>
        <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
          <Building className="h-4 w-4 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
          {formatCurrency(totalIncome)}
        </div>
        <div className="flex items-center text-xs text-green-500 dark:text-green-400 mt-1">
          <ArrowUpCircle className="mr-1 h-3 w-3" />
          <span>{profit > 0 ? 'Profit' : 'Loss'}: {formatCurrency(profit)}</span>
        </div>
        <div className="h-[180px] mt-4">
          <ChartContainer
            config={{
              income: { color: "#4ade80" },
              expense: { color: "#f87171" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 20,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis 
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Income
                              </span>
                              <span className="font-bold text-green-500">
                                ${payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Expense
                              </span>
                              <span className="font-bold text-red-500">
                                ${payload[1].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HallBookingFinanceWidget;
