import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CardTitle, Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Download, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Filter,
  PiggyBank,
  Target,
  Car,
  Home,
  Laptop,
  Music,
  Youtube,
  ShoppingBag,
  Utensils,
  Navigation,
  Package
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod?: string;
};

type ExpenseCategory = {
  name: string;
  value: number;
  color: string;
  icon: React.ComponentType;
};

type SavingGoal = {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  color: string;
  icon: React.ComponentType;
};

type Subscription = {
  id: string;
  name: string;
  amount: number;
  date: string;
  icon: React.ComponentType;
  color: string;
};

const COLORS = {
  purple: '#9b87f5',
  green: '#4ade80',
  red: '#f87171',
  blue: '#60a5fa',
  yellow: '#fcd34d',
  orange: '#fb923c',
  pink: '#f472b6',
  teal: '#2dd4bf',
};

const dummyTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-06-10',
    description: 'Daily Sales',
    amount: 1250.99,
    type: 'income',
    category: 'Sales'
  },
  {
    id: '2',
    date: '2023-06-09',
    description: 'Cleaning Materials',
    amount: 258.20,
    type: 'expense',
    category: 'Grocery'
  },
  {
    id: '3',
    date: '2023-06-08',
    description: 'Doob Venue Booking',
    amount: 850.00,
    type: 'income',
    category: 'Services'
  },
  {
    id: '4',
    date: '2023-06-07',
    description: 'Restaurant Supplies',
    amount: 758.20,
    type: 'expense',
    category: 'Shopping'
  },
  {
    id: '5',
    date: '2023-06-06',
    description: 'Dhaweeye Transportation',
    amount: 758.20,
    type: 'expense',
    category: 'Transportation'
  },
  {
    id: '6',
    date: '2023-06-05',
    description: 'Staff Meals',
    amount: 758.20,
    type: 'expense',
    category: 'Food & Drink'
  }
];

const expenseCategories: ExpenseCategory[] = [
  { name: 'Grocery', value: 48, color: COLORS.purple, icon: Package },
  { name: 'Food & Drink', value: 32, color: COLORS.green, icon: Utensils },
  { name: 'Shopping', value: 13, color: COLORS.pink, icon: ShoppingBag },
  { name: 'Dhaweeye', value: 7, color: COLORS.orange, icon: Navigation },
];

const savingGoals: SavingGoal[] = [
  { id: '1', name: 'Net Income', currentAmount: 1052.98, targetAmount: 1200, color: COLORS.green, icon: PiggyBank },
  { id: '2', name: 'Least Selling Item', currentAmount: 17567, targetAmount: 83000, color: COLORS.purple, icon: Car },
  { id: '3', name: 'Most Recurring Expense', currentAmount: 12367, targetAmount: 325000, color: COLORS.orange, icon: Home },
  { id: '4', name: 'Favorite Item', currentAmount: 11567, targetAmount: 325000, color: COLORS.pink, icon: Laptop },
  { id: '5', name: 'Dhaweeye', currentAmount: 12367, targetAmount: 25000, color: COLORS.blue, icon: Navigation },
];

const subscriptions: Subscription[] = [
  { id: '1', name: 'Most Sales Item', amount: 5.99, date: 'Apr 03, 2024', icon: Music, color: '#1DB954' },
  { id: '2', name: 'Most Rented Hall', amount: 13.99, date: 'Apr 03, 2024', icon: Youtube, color: '#FF0000' },
];

const generateDailyExpenseData = () => {
  const today = new Date();
  const startDate = subDays(today, 6);
  
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: today
  });
  
  return dateRange.map(date => {
    const formattedDate = format(date, 'dd');
    const dayName = format(date, 'EEE');
    
    return {
      name: formattedDate,
      day: dayName,
      'Food & Drink': Math.floor(Math.random() * 100) + 50,
      'Grocery': Math.floor(Math.random() * 80) + 40,
      'Shopping': Math.floor(Math.random() * 60) + 30,
      'Dhaweeye': Math.floor(Math.random() * 40) + 20,
    };
  });
};

const generateWeeklyData = () => {
  const today = new Date();
  const startDate = subDays(today, 6);
  
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: today
  });
  
  return dateRange.map(date => {
    const formattedDate = format(date, 'dd');
    const dayName = format(date, 'EEE');
    
    return {
      name: formattedDate,
      day: dayName,
      income: Math.floor(Math.random() * 300) + 150,
      expense: Math.floor(Math.random() * 200) + 100,
    };
  });
};

const Finance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(dummyTransactions);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('week');
  const [newTransaction, setNewTransaction] = useState<{
    description: string;
    amount: string;
    type: 'income' | 'expense';
    category: string;
    date: Date;
  }>({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Grocery',
    date: new Date(),
  });
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailType, setDetailType] = useState('');
  const [detailTitle, setDetailTitle] = useState('');

  const dailyExpenseData = generateDailyExpenseData();
  const weeklyChartData = generateWeeklyData();

  const filteredTransactions = transactions.filter(transaction => {
    if (transactionType === 'all') return true;
    return transaction.type === transactionType;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netProfit = totalIncome - totalExpense;

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    
    const transaction: Transaction = {
      id: newId,
      date: format(newTransaction.date, 'yyyy-MM-dd'),
      description: newTransaction.description,
      amount: amount,
      type: newTransaction.type,
      category: newTransaction.category
    };

    setTransactions([transaction, ...transactions]);
    setIsAddTransactionOpen(false);
    
    setNewTransaction({
      description: '',
      amount: '',
      type: 'expense',
      category: 'Grocery',
      date: new Date(),
    });

    toast.success(`${newTransaction.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
  };

  const openDetailDialog = (type: string, title: string) => {
    setDetailType(type);
    setDetailTitle(title);
    setShowDetailModal(true);
  };

  const renderIcon = (IconComponent: React.ComponentType<any>, color: string) => {
    return <IconComponent color={color} size={20} />;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Finance Dashboard</h1>
            
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <CalendarIcon className="h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>

              <Select 
                value={dateRange} 
                onValueChange={(value: any) => setDateRange(value)}
              >
                <SelectTrigger className="w-[150px] dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <Button variant="outline" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
                <DialogTrigger asChild>
                  <Button className="dark:bg-blue-600 dark:text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="transaction-type" className="dark:text-gray-300">Transaction Type</Label>
                      <Select
                        value={newTransaction.type}
                        onValueChange={(value: 'income' | 'expense') => 
                          setNewTransaction({...newTransaction, type: value})
                        }
                      >
                        <SelectTrigger id="transaction-type" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description" className="dark:text-gray-300">Description</Label>
                      <Input 
                        id="description" 
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="amount" className="dark:text-gray-300">Amount</Label>
                      <Input 
                        id="amount" 
                        type="number" 
                        step="0.01" 
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="category" className="dark:text-gray-300">Category</Label>
                      <Select 
                        value={newTransaction.category}
                        onValueChange={(value) => 
                          setNewTransaction({...newTransaction, category: value})
                        }
                      >
                        <SelectTrigger id="category" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          {newTransaction.type === 'expense' ? (
                            <>
                              <SelectItem value="Grocery">Grocery</SelectItem>
                              <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                              <SelectItem value="Shopping">Shopping</SelectItem>
                              <SelectItem value="Dhaweeye">Dhaweeye</SelectItem>
                              <SelectItem value="Utilities">Utilities</SelectItem>
                              <SelectItem value="Rent">Rent</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="Services">Services</SelectItem>
                              <SelectItem value="Venue Booking">Venue Booking</SelectItem>
                              <SelectItem value="Catering">Catering</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="date" className="dark:text-gray-300">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex justify-start dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newTransaction.date ? format(newTransaction.date, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                          <Calendar
                            mode="single"
                            selected={newTransaction.date}
                            onSelect={(date) => date && setNewTransaction({...newTransaction, date})}
                            initialFocus
                            className="dark:bg-gray-800"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTransactionOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTransaction}>
                      Save Transaction
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Revenue
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  onClick={() => openDetailDialog('revenue', 'Revenue Details')}
                >
                  View Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                  Sales from 1-10 Apr, 2024
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                  ${totalIncome.toFixed(2)}
                </div>
                <div className="flex items-center text-xs text-green-500 dark:text-green-400 mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>2.5% vs last week</span>
                </div>
                <div className="h-[120px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyChartData}>
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
                      <Bar dataKey="income" fill={COLORS.green} name="Income" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" fill={COLORS.purple} name="Expense" radius={[4, 4, 0, 0]} />
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
                  onClick={() => openDetailDialog('weekly-expense', 'Weekly Expense Breakdown')}
                >
                  View Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                  From 1 - 8 Apr, 2024
                </div>
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1F2937", 
                          color: "#F9FAFB", 
                          borderColor: "#374151",
                          fontSize: "12px",
                          padding: "8px"
                        }}
                        formatter={(value) => [`${value}%`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {expenseCategories.map((category, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-shrink-0 h-3 w-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium dark:text-gray-300">{category.name}</span>
                        <span className="text-xs dark:text-gray-400">${'758.20'}</span>
                      </div>
                    </div>
                  ))}
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
                  onClick={() => openDetailDialog('net-income', 'Net Income Details')}
                >
                  View Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                  Data from 1-12 Apr, 2024
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
                        strokeDasharray={`${(2 * Math.PI * 64) * (1052.98 / 1200)} ${2 * Math.PI * 64}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 80 80)"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold dark:text-white">$1,052.98</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">of $1,200</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            <Card className="md:col-span-3 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Monthly Expense
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  onClick={() => openDetailDialog('monthly-expense', 'Monthly Expense vs Previous Month')}
                >
                  View Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                  vs Previous Month
                </div>
                <div className="text-2xl font-bold dark:text-white mt-4">
                  $252.98
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  $1,200 last month
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-4 dark:bg-gray-700">
                  <div 
                    className="h-full bg-green-500 rounded-full dark:bg-green-400"
                    style={{ width: `${(252.98/1200)*100}%` }}
                  ></div>
                </div>
                <div className="flex items-center text-xs text-green-500 dark:text-green-400 mt-2">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  <span>21.1% decrease from last month</span>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-3 space-y-4">
              {subscriptions.map(subscription => (
                <Card 
                  key={subscription.id} 
                  className="dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => openDetailDialog(
                    subscription.id === '1' ? 'most-sales' : 'most-rented', 
                    subscription.name
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="p-2 rounded-full" 
                        style={{ backgroundColor: `${subscription.color}20` }}
                      >
                        {renderIcon(subscription.icon, subscription.color)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium dark:text-white">{subscription.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{subscription.date}</div>
                      </div>
                      <div className="text-sm font-medium dark:text-white">
                        ${subscription.amount}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              {savingGoals.slice(1).map(goal => (
                <Card 
                  key={goal.id} 
                  className="dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => openDetailDialog(goal.name.toLowerCase().replace(/\s+/g, '-'), goal.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4 mb-3">
                      <div 
                        className="p-2 rounded-full" 
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        {renderIcon(goal.icon, goal.color)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium dark:text-white">{goal.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${(goal.currentAmount/goal.targetAmount)*100}%`,
                          backgroundColor: goal.color 
                        }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Daily Expense
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  onClick={() => openDetailDialog('daily-expense', 'Daily Expense Breakdown')}
                >
                  View Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                  Data from 1-10 Apr, 2024
                </div>
                <div className="h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyExpenseData} stackOffset="sign">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
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
                      <Bar dataKey="Food & Drink" stackId="a" fill={COLORS.green} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Grocery" stackId="a" fill={COLORS.purple} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Shopping" stackId="a" fill={COLORS.pink} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Dhaweeye" stackId="a" fill={COLORS.orange} radius={[0, 0, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center space-x-4 mt-2">
                  {['Food & Drink', 'Grocery', 'Shopping', 'Dhaweeye'].map((category, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ 
                          backgroundColor: 
                            index === 0 ? COLORS.green : 
                            index === 1 ? COLORS.purple : 
                            index === 2 ? COLORS.pink : COLORS.orange
                        }}
                      ></div>
                      <span className="text-xs dark:text-gray-300">{category}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Recent Transactions
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select 
                    value={transactionType} 
                    onValueChange={(value: any) => setTransactionType(value)}
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
                    onClick={() => openDetailDialog('transactions', 'All Transactions')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1 mb-4">
                  Showing {filteredTransactions.length} transactions
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
                      {filteredTransactions.map((transaction) => (
                        <TableRow 
                          key={transaction.id}
                          className="dark:border-gray-700 dark:hover:bg-gray-800/50 cursor-pointer"
                          onClick={() => openDetailDialog('transaction-detail', `Transaction: ${transaction.description}`)}
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
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{detailTitle}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {detailType === 'revenue' && (
              <div className="space-y-4">
                <p>Detailed revenue breakdown by channel and time period.</p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="income" stroke="#4ade80" name="Income" />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Food Sales</p>
                    <p className="text-lg font-bold">$834.50</p>
                  </div>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Venue Bookings</p>
                    <p className="text-lg font-bold">$416.49</p>
                  </div>
                </div>
              </div>
            )}

            {detailType === 'weekly-expense' && (
              <div className="space-y-4">
                <p>Breakdown of expenses by category for the current week.</p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {(detailType === 'most-sales' || detailType === 'most-rented' || 
              detailType === 'least-selling-item' || detailType === 'favorite-item' || 
              detailType === 'most-recurring-expense' || detailType === 'dhaweeye') && (
              <div className="space-y-4">
                <p>Detailed metrics and historical performance.</p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Array.from({length: 12}, (_, i) => ({
                      month: `Month ${i+1}`,
                      value: Math.floor(Math.random() * 1000) + 500
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Total Units</p>
                    <p className="text-lg font-bold">1,245</p>
                  </div>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Average Price</p>
                    <p className="text-lg font-bold">$24.99</p>
                  </div>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Growth</p>
                    <p className="text-lg font-bold text-green-500">+12.4%</p>
                  </div>
                </div>
              </div>
            )}

            {detailType === 'monthly-expense' && (
              <div className="space-y-4">
                <p>Compare current month expenses with previous month.</p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      {name: 'Food & Drink', current: 450, previous: 520},
                      {name: 'Grocery', current: 300, previous: 380},
                      {name: 'Shopping', current: 280, previous: 320},
                      {name: 'Dhaweeye', current: 200, previous: 270},
                      {name: 'Utilities', current: 180, previous: 190},
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="current" fill="#4ade80" name="Current Month" />
                      <Bar dataKey="previous" fill="#9ca3af" name="Previous Month" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {detailType === 'daily-expense' && (
              <div className="space-y-4">
                <p>Daily breakdown of expenses by category.</p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyExpenseData} stackOffset="sign">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Food & Drink" stackId="a" fill={COLORS.green} />
                      <Bar dataKey="Grocery" stackId="a" fill={COLORS.purple} />
                      <Bar dataKey="Shopping" stackId="a" fill={COLORS.pink} />
                      <Bar dataKey="Dhaweeye" stackId="a" fill={COLORS.orange} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {detailType === 'transactions' && (
              <div className="space-y-4">
                <p>Complete list of all transactions with advanced filtering.</p>
                <div className="flex gap-2 mb-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="food">Food & Drink</SelectItem>
                      <SelectItem value="grocery">Grocery</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="transportation">Dhaweeye</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-[400px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.concat(filteredTransactions).map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{format(new Date(transaction.date), 'dd MMM yyyy')}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell className="text-right">
                            <span className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {detailType === 'transaction-detail' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-lg font-bold">Apr 10, 2024</p>
                  </div>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Amount</p>
                    <p className="text-lg font-bold">$425.99</p>
                  </div>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-lg font-bold">Food & Drink</p>
                  </div>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-lg font-bold">Card</p>
                  </div>
                </div>
                <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3 mt-4">
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-md">Restaurant supplies for this week's special menu. Includes specialty ingredients and packaging materials.</p>
                </div>
              </div>
            )}

            {detailType === 'net-income' && (
              <div className="space-y-4">
                <p>Net income analysis over time with income/expense breakdown.</p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Array.from({length: 12}, (_, i) => ({
                      month: `Month ${i+1}`,
                      income: Math.floor(Math.random() * 2000) + 1000,
                      expense: Math.floor(Math.random() * 1000) + 500,
                      net: Math.floor(Math.random() * 1000) + 200,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#4ade80" name="Income" />
                      <Line type="monotone" dataKey="expense" stroke="#f87171" name="Expense" />
                      <Line type="monotone" dataKey="net" stroke="#60a5fa" name="Net Income" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Total Income</p>
                    <p className="text-lg font-bold text-green-500">$12,450.75</p>
                  </div>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Total Expenses</p>
                    <p className="text-lg font-bold text-red-500">$7,235.60</p>
                  </div>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                    <p className="text-sm font-medium">Net Profit</p>
                    <p className="text-lg font-bold text-blue-500">$5,215.15</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;
