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
  Line
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
  Bike,
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
import { Progress } from '@/components/ui/progress';
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
    description: 'Grocery Shopping',
    amount: 258.20,
    type: 'expense',
    category: 'Grocery'
  },
  {
    id: '3',
    date: '2023-06-08',
    description: 'Catering Service',
    amount: 850.00,
    type: 'income',
    category: 'Services'
  },
  {
    id: '4',
    date: '2023-06-07',
    description: 'Shopping Mall',
    amount: 758.20,
    type: 'expense',
    category: 'Shopping'
  },
  {
    id: '5',
    date: '2023-06-06',
    description: 'Uber Rides',
    amount: 758.20,
    type: 'expense',
    category: 'Transportation'
  },
  {
    id: '6',
    date: '2023-06-05',
    description: 'Restaurant Dinner',
    amount: 758.20,
    type: 'expense',
    category: 'Food & Drink'
  }
];

const expenseCategories: ExpenseCategory[] = [
  { name: 'Grocery', value: 48, color: COLORS.purple, icon: Package },
  { name: 'Food & Drink', value: 32, color: COLORS.green, icon: Utensils },
  { name: 'Shopping', value: 13, color: COLORS.pink, icon: ShoppingBag },
  { name: 'Transportation', value: 7, color: COLORS.orange, icon: Navigation },
];

const savingGoals: SavingGoal[] = [
  { id: '1', name: 'Saving Goal', currentAmount: 1052.98, targetAmount: 1200, color: COLORS.green, icon: PiggyBank },
  { id: '2', name: 'Dream Car', currentAmount: 17567, targetAmount: 83000, color: COLORS.purple, icon: Car },
  { id: '3', name: 'House Saving', currentAmount: 12367, targetAmount: 325000, color: COLORS.orange, icon: Home },
  { id: '4', name: 'Laptop', currentAmount: 11567, targetAmount: 325000, color: COLORS.pink, icon: Laptop },
  { id: '5', name: 'Motorcycle', currentAmount: 12367, targetAmount: 25000, color: COLORS.blue, icon: Bike },
];

const subscriptions: Subscription[] = [
  { id: '1', name: 'Spotify Subscription', amount: 5.99, date: 'Apr 03, 2024', icon: Music, color: '#1DB954' },
  { id: '2', name: 'YouTube Membership', amount: 13.99, date: 'Apr 03, 2024', icon: Youtube, color: '#FF0000' },
];

// Generate daily expense data
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
      'Transport': Math.floor(Math.random() * 40) + 20,
    };
  });
};

// Generate weekly income vs expense data
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
    
    // Reset form
    setNewTransaction({
      description: '',
      amount: '',
      type: 'expense',
      category: 'Grocery',
      date: new Date(),
    });

    toast.success(`${newTransaction.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
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
                              <SelectItem value="Transportation">Transportation</SelectItem>
                              <SelectItem value="Utilities">Utilities</SelectItem>
                              <SelectItem value="Rent">Rent</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="Services">Services</SelectItem>
                              <SelectItem value="Investment">Investment</SelectItem>
                              <SelectItem value="Salary">Salary</SelectItem>
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
            {/* Revenue Card */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Revenue
                </CardTitle>
                <Button variant="outline" size="sm" className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
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

            {/* Weekly Expense Card */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Weekly Expense
                </CardTitle>
                <Button variant="outline" size="sm" className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
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
                        labelLine={false}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
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

            {/* Saving Goal Card */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Saving Goal
                </CardTitle>
                <Button variant="outline" size="sm" className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
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
            {/* Spending Limit Card */}
            <Card className="md:col-span-3 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Spending Limit
                </CardTitle>
                <Button variant="outline" size="sm" className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                  View Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                  Data from 1-12 Apr, 2024
                </div>
                <div className="text-2xl font-bold dark:text-white mt-4">
                  $252.98
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  of $1,200
                </div>
                <Progress 
                  value={(252.98/1200)*100} 
                  className="h-2 mt-4 bg-gray-200 dark:bg-gray-700" 
                />
              </CardContent>
            </Card>

            {/* Subscriptions Cards */}
            <div className="md:col-span-3 space-y-4">
              {subscriptions.map(subscription => (
                <Card key={subscription.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full" style={{ backgroundColor: subscription.color + '20' }}>
                        <subscription.icon className="h-5 w-5" style={{ color: subscription.color }} />
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

            {/* Saving Goals */}
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              {savingGoals.slice(1).map(goal => (
                <Card key={goal.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="p-2 rounded-full" style={{ backgroundColor: goal.color + '20' }}>
                        <goal.icon className="h-5 w-5" style={{ color: goal.color }} />
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
            {/* Daily Expense Chart */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Daily Expense
                </CardTitle>
                <Button variant="outline" size="sm" className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
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
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                      <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
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
                      <Bar dataKey="Transport" stackId="a" fill={COLORS.orange} radius={[0, 0, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center space-x-4 mt-2">
                  {['Food & Drink', 'Grocery', 'Shopping', 'Transport'].map((category, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ 
                          backgroundColor: index === 0 ? COLORS
