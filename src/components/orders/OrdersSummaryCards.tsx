
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt, CheckCircle, AlertTriangle, DollarSign, CreditCard } from 'lucide-react';

interface OrderSummary {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  totalSales: number;
  todaySales: number;
}

interface OrdersSummaryCardsProps {
  summary: OrderSummary;
}

const OrdersSummaryCards: React.FC<OrdersSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex flex-col justify-center items-center">
          <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900">
            <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="text-xl font-bold dark:text-white">{summary.totalOrders}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col justify-center items-center">
          <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
          </div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">{summary.paidOrders}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Paid Orders</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col justify-center items-center">
          <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
          </div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{summary.pendingOrders}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Payments</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col justify-center items-center">
          <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900">
            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-300" />
          </div>
          <div className="text-xl font-bold dark:text-white">${summary.totalSales.toFixed(2)}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col justify-center items-center">
          <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900">
            <CreditCard className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div className="text-xl font-bold dark:text-white">${summary.todaySales.toFixed(2)}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Today's Sales</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersSummaryCards;
