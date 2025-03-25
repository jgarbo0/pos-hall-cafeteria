
import React from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface FinanceData {
  name: string;
  income: number;
  expense: number;
}

interface IncomeExpenseWidgetProps {
  data: FinanceData[];
  monthlyIncome: string;
  monthlyExpense: string;
}

const IncomeExpenseWidget: React.FC<IncomeExpenseWidgetProps> = ({ 
  data, monthlyIncome, monthlyExpense 
}) => {
  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Income vs Expenses</CardTitle>
          <Tabs defaultValue="monthly" onValueChange={(v) => console.log(v)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription>
          Compare income and expenses over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Fixed height container to prevent chart from expanding too much */}
        <div className="h-64">
          <ChartContainer
            config={{
              income: { color: "#22c55e" },
              expense: { color: "#ef4444" }
            }}
          >
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
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
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#22c55e"
                fill="#22c55e30"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stackId="2"
                stroke="#ef4444"
                fill="#ef444430"
              />
            </AreaChart>
          </ChartContainer>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center mr-2">
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Income</p>
              <p className="text-xs text-muted-foreground">{monthlyIncome} this month</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-500/10 rounded-full flex items-center justify-center mr-2">
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Expenses</p>
              <p className="text-xs text-muted-foreground">{monthlyExpense} this month</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseWidget;
