
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShoppingBag, 
  Calendar, 
  TrendingUp,
  Search,
  Filter,
  Coffee,
  DollarSign,
  Clock,
  CreditCard,
  ReceiptText,
  ChevronRight 
} from 'lucide-react';
import { format, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CafeteriaFinanceTabProps {
  transactions: Transaction[];
  isLoadingTransactions: boolean;
  onViewDetails: (id: string, title: string) => void;
}

const CafeteriaFinanceTab: React.FC<CafeteriaFinanceTabProps> = ({
  transactions,
  isLoadingTransactions,
  onViewDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  
  const totalSales = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  const todayTransactions = transactions.filter(tx => isToday(new Date(tx.date)));
  const todaySales = todayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  // Estimate expenses as 40% of revenue
  const totalExpenses = totalSales * 0.4;
  const todayExpenses = todaySales * 0.4;
  
  const profit = totalSales - totalExpenses;
  
  // Filter transactions based on search and time period
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const txDate = new Date(tx.date);
    let matchesTime = true;
    
    if (timeFilter === 'today') {
      matchesTime = isToday(txDate);
    } else if (timeFilter === 'week') {
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      matchesTime = txDate >= weekStart && txDate <= weekEnd;
    }
    
    return matchesSearch && matchesTime;
  });

  // Generate data for the sales by day chart
  const generateSalesByDayData = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = daysOfWeek.map(day => {
      const dayIndex = daysOfWeek.indexOf(day);
      
      const dayTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getDay() === dayIndex;
      });
      
      const totalAmount = dayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      
      return {
        day,
        amount: totalAmount
      };
    });
    
    return data;
  };
  
  const salesByDayData = generateSalesByDayData();
  
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  // Mock popular items data
  const popularItems = [
    { name: 'Chicken Shawarma', quantity: getRandomInt(25, 40), amount: getRandomInt(150, 250) },
    { name: 'Beef Burger', quantity: getRandomInt(20, 35), amount: getRandomInt(120, 200) },
    { name: 'Cappuccino', quantity: getRandomInt(30, 50), amount: getRandomInt(90, 150) },
    { name: 'Chicken Biryani', quantity: getRandomInt(15, 30), amount: getRandomInt(100, 180) },
    { name: 'Milkshake', quantity: getRandomInt(20, 35), amount: getRandomInt(80, 120) },
  ];
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/40 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-300">Total Sales</p>
                <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-200 mt-1">
                  {formatCurrency(totalSales)}
                </h3>
                <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">All time cafeteria sales</p>
              </div>
              <div className="h-12 w-12 bg-amber-200 dark:bg-amber-700 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-amber-600 dark:text-amber-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/40 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-300">Today's Sales</p>
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-200 mt-1">
                  {formatCurrency(todaySales)}
                </h3>
                <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                  {todayTransactions.length} transactions today
                </p>
              </div>
              <div className="h-12 w-12 bg-green-200 dark:bg-green-700 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/40 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-300">Expenses</p>
                <h3 className="text-2xl font-bold text-red-700 dark:text-red-200 mt-1">
                  {formatCurrency(totalExpenses)}
                </h3>
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  Today: {formatCurrency(todayExpenses)}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-200 dark:bg-red-700 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesByDayData}
                  margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Sales']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Popular Items</CardTitle>
            <CardDescription>Top selling items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-amber-100 text-amber-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <Coffee className="h-4 w-4" />
                      </div>
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} items sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{formatCurrency(item.amount)}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span>+{getRandomInt(5, 15)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Recent Sales
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex items-center">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8 h-9 w-40 md:w-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={timeFilter}
                  onValueChange={setTimeFilter}
                >
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No sales transactions found matching your criteria
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead className="dark:text-gray-400">Date</TableHead>
                      <TableHead className="dark:text-gray-400">Description</TableHead>
                      <TableHead className="dark:text-gray-400 text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.slice(0, 5).map((tx) => (
                      <TableRow 
                        key={tx.id} 
                        className="dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => onViewDetails(tx.id, tx.description)}
                      >
                        <TableCell className="font-medium dark:text-gray-300">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            {format(new Date(tx.date), 'dd MMM yyyy')}
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-gray-300">{tx.description}</TableCell>
                        <TableCell className="dark:text-gray-300 text-right font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(tx.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredTransactions.length > 5 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" size="sm" onClick={() => onViewDetails('all', 'All Food Sales')}>
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Summary</CardTitle>
            <CardDescription>Food sales overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Total Revenue</span>
                </div>
                <span className="font-semibold">{formatCurrency(totalSales)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium">Expenses</span>
                </div>
                <span className="font-semibold text-red-600">{formatCurrency(totalExpenses)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <div className="flex items-center">
                  <ReceiptText className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">Profit</span>
                </div>
                <span className="font-semibold text-blue-600">{formatCurrency(profit)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm font-medium">Profit Margin</span>
                </div>
                <span className="font-semibold">{totalSales > 0 ? `${((profit / totalSales) * 100).toFixed(1)}%` : '0%'}</span>
              </div>
              
              <div className="mt-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Coffee className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <h4 className="font-medium text-green-800 dark:text-green-300">Quick Actions</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-9 text-xs">
                      Inventory Report
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 text-xs">
                      Menu Performance
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CafeteriaFinanceTab;
