
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';
import { 
  Coffee, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  DollarSign,
  Users,
  ShoppingBag
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, isToday, isThisMonth } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface CafeteriaFinanceTabProps {
  transactions: Transaction[];
  isLoadingTransactions: boolean;
  onViewDetails: (id: string, title: string) => void;
  onSearch: (term: string) => void; // Add missing prop
}

interface PopularMenuItem {
  name: string;
  quantity: number;
  amount: number;
  trend: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  total: number;
  paymentStatus: string;
}

const CafeteriaFinanceTab: React.FC<CafeteriaFinanceTabProps> = ({
  transactions,
  isLoadingTransactions,
  onViewDetails,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  
  // Get cafeteria-related transactions (expense only)
  const cafeteriaExpenses = transactions.filter(
    transaction => transaction.type === 'expense' && 
    (transaction.category === 'Cafeteria' || transaction.category === 'Food & Beverage')
  );
  
  useEffect(() => {
    // Fetch orders for income data
    const fetchOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('timestamp', { ascending: false });
        
        if (error) throw error;
        
        const formattedOrders = data.map(order => ({
          id: order.id,
          orderNumber: order.order_number,
          date: order.timestamp,
          customerName: order.customer_name || 'Walk-in Customer',
          total: order.total,
          paymentStatus: order.payment_status
        }));
        
        setOrders(formattedOrders);
        setIsLoadingOrders(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        setIsLoadingOrders(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Calculate financial data
  const totalOrderRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalExpenses = cafeteriaExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);
  const netProfit = totalOrderRevenue - totalExpenses;
  
  const todayOrders = orders.filter(order => isToday(new Date(order.date)));
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const todayExpenses = cafeteriaExpenses.filter(transaction => isToday(new Date(transaction.date)))
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const averageOrderValue = orders.length > 0 ? totalOrderRevenue / orders.length : 0;
  
  const popularItems: PopularMenuItem[] = [
    { name: "Spicy Chicken Burger", quantity: 145, amount: 1740, trend: 15 },
    { name: "Creamy Pasta", quantity: 120, amount: 1320, trend: 8 },
    { name: "Cappuccino", quantity: 180, amount: 900, trend: 12 },
    { name: "Chocolate Cake", quantity: 90, amount: 990, trend: -5 }
  ];
  
  // Combined income (orders) and expenses (transactions) for display
  const combinedFinancialData = [
    ...orders.map(order => ({
      id: order.id,
      date: order.date,
      description: `Order #${order.orderNumber} - ${order.customerName}`,
      amount: order.total,
      type: 'income' as const,
      category: 'Food Sales',
      paymentMethod: order.paymentStatus === 'paid' ? 'Cash' : 'Pending'
    })),
    ...cafeteriaExpenses
  ];
  
  const filteredFinancialData = combinedFinancialData.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    const itemDate = new Date(item.date);
    
    if (dateFilter === 'today') {
      matchesDate = isToday(itemDate);
    } else if (dateFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      matchesDate = itemDate >= oneWeekAgo;
    } else if (dateFilter === 'month') {
      matchesDate = isThisMonth(itemDate);
    }
    
    return matchesSearch && matchesDate;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const generateChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayOrders = orders.filter(order => 
        order.date.toString().substring(0, 10) === dateStr
      );
      
      const dayExpenses = cafeteriaExpenses.filter(transaction => 
        transaction.date.toString().substring(0, 10) === dateStr
      );
      
      const income = dayOrders.reduce((sum, order) => sum + order.total, 0);
      const expense = dayExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);
      
      data.push({
        name: format(date, 'dd MMM'),
        income: parseFloat(income.toFixed(2)),
        expense: parseFloat(expense.toFixed(2))
      });
    }
    return data;
  };
  
  const chartData = generateChartData();
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/40 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-300">Total Revenue</p>
                <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-200 mt-1">
                  {formatCurrency(totalOrderRevenue)}
                </h3>
                <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">All time cafeteria sales</p>
              </div>
              <div className="h-12 w-12 bg-amber-200 dark:bg-amber-700 rounded-full flex items-center justify-center">
                <Coffee className="h-6 w-6 text-amber-600 dark:text-amber-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/40 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-300">Net Profit</p>
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-200 mt-1">
                  {formatCurrency(netProfit)}
                </h3>
                <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                  Revenue minus expenses
                </p>
              </div>
              <div className="h-12 w-12 bg-green-200 dark:bg-green-700 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/40 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Average Sale</p>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mt-1">
                  {formatCurrency(averageOrderValue)}
                </h3>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  Per order
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Revenue & Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Cafeteria Sales & Expenses Chart
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Popular Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {popularItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} sold - {formatCurrency(item.amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${item.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.trend > 0 ? '+' : ''}{item.trend}%
                    </p>
                    {item.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Cafeteria Financial Activity</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 h-9"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={dateFilter}
                onValueChange={setDateFilter}
              >
                <SelectTrigger className="w-40 h-9">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingOrders || isLoadingTransactions ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredFinancialData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No financial activity found matching your criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="dark:text-gray-400">Date</TableHead>
                    <TableHead className="dark:text-gray-400">Description</TableHead>
                    <TableHead className="dark:text-gray-400">Type</TableHead>
                    <TableHead className="dark:text-gray-400">Payment Method</TableHead>
                    <TableHead className="dark:text-gray-400 text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFinancialData.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => onViewDetails(item.id, item.description)}
                    >
                      <TableCell className="font-medium dark:text-gray-300">
                        {format(new Date(item.date), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{item.description}</TableCell>
                      <TableCell className="dark:text-gray-300">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.type === 'income' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {item.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{item.paymentMethod || 'Cash'}</TableCell>
                      <TableCell className={`dark:text-gray-300 text-right font-medium ${
                        item.type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sales Revenue</span>
                <span className="text-sm font-medium text-green-600">{formatCurrency(todayRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <span className="text-sm font-medium text-red-600">{formatCurrency(todayExpenses)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm font-medium">Net Profit</span>
                <span className="text-sm font-bold">{formatCurrency(todayRevenue - todayExpenses)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Orders</span>
                <span className="text-sm font-medium">{orders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Today's Orders</span>
                <span className="text-sm font-medium">{todayOrders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Order Value</span>
                <span className="text-sm font-medium">{formatCurrency(averageOrderValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CafeteriaFinanceTab;
