
import React from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Smartphone, DollarSign, Wallet } from 'lucide-react';

interface PaymentMethod {
  name: string;
  value: number;
  percentage: number;
  icon: React.ReactNode;
  bgColorClass: string;
  textColorClass: string;
}

interface PaymentMethodsChartProps {
  data: { name: string; value: number }[];
  methods: PaymentMethod[];
}

const PaymentMethodsChart: React.FC<PaymentMethodsChartProps> = ({ data, methods }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Distribution of payment methods used
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-4">
          {methods.map((method, index) => (
            <div key={index} className="flex items-center">
              <div className={`h-8 w-8 ${method.bgColorClass} rounded-full flex items-center justify-center mr-2`}>
                {method.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{method.name}</p>
                <p className="text-xs text-muted-foreground">{method.percentage}% of payments</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsChart;
