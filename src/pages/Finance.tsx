import React, { useState, useEffect } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PiggyBank, Car, Home, Laptop, 
  Music, Youtube, Navigation,
  TrendingUp, TrendingDown, PieChart
} from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';

import FinanceHeader from '@/components/finance/FinanceHeader';
import FinanceSummaryCards from '@/components/finance/FinanceSummaryCards';
import TransactionsTable from '@/components/finance/TransactionsTable';
import AddTransactionModal from '@/components/finance/AddTransactionModal';
import DetailDialog from '@/components/finance/DetailDialog';
import HallBookingFinanceWidget from '@/components/finance/HallBookingFinanceWidget';
import HallBookingIncomesList from '@/components/finance/HallBookingIncomesList';

import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, ExpenseCategory, SavingGoal, Subscription } from '@/types/finance';

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
  { name: 'Grocery', value: 48, color: COLORS.purple, icon: PieChart },
  { name: 'Food & Drink', value: 32, color: COLORS.green, icon: PieChart },
  { name: 'Shopping', value: 13, color: COLORS.pink, icon: PieChart },
  { name: 'Dhaweeye', value: 7, color: COLORS.orange, icon: PieChart },
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

const fetchHallBookings = async () => {
  const { data, error } = await supabase
    .from('hall_bookings')
    .select('*')
    .order('date', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching hall bookings:', error);
    throw error;
  }

  return data || [];
};

const generateHallBookingFinanceData = (bookings: any[]) => {
  const today = new Date();
  const startDate = subDays(today, 6);
  
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: today
  });
  
  return dateRange.map(date => {
    const formattedDate = format(date, 'dd MMM');
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayBookings = bookings.filter(booking => 
      booking.date.substring(0, 10) === dateStr
    );
    
    const income = dayBookings.reduce((sum, booking) => sum + parseFloat(booking.total_amount || 0), 0);
    
    const expense = income * (Math.random() * 0.4 + 0.1);
    
    return {
      name: formattedDate,
      income: parseFloat(income.toFixed(2)),
      expense: parseFloat(expense.toFixed(2))
    };
  });
};

const formatBookingsForIncomeList = (bookings: any[]) => {
  return bookings.map(booking => ({
    id: booking.id,
    date: booking.date,
    customerName: booking.customer_name,
    purpose: booking.purpose,
    attendees: booking.attendees,
    amount: parseFloat(booking.total_amount || 0)
  }));
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
  const [hallBookings, setHallBookings] = useState<any[]>([]);
  const [hallBookingFinanceData, setHallBookingFinanceData] = useState<any[]>([]);
  const [hallBookingIncomes, setHallBookingIncomes] = useState<any[]>([]);
  const [hallDetailModalOpen, setHallDetailModalOpen] = useState(false);
  const [selectedHallBooking, setSelectedHallBooking] = useState<string | null>(null);
  const [isLoadingHallData, setIsLoadingHallData] = useState(true);

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

  const handleViewHallBookingDetails = (id: string) => {
    setSelectedHallBooking(id);
    setHallDetailModalOpen(true);
  };

  useEffect(() => {
    const loadHallBookingsData = async () => {
      try {
        setIsLoadingHallData(true);
        const bookingsData = await fetchHallBookings();
        setHallBookings(bookingsData);
        
        const financeData = generateHallBookingFinanceData(bookingsData);
        setHallBookingFinanceData(financeData);
        
        const formattedBookings = formatBookingsForIncomeList(bookingsData);
        setHallBookingIncomes(formattedBookings);
        
        setIsLoadingHallData(false);
      } catch (error) {
        console.error('Error loading hall bookings data:', error);
        toast.error('Failed to load hall bookings data');
        setIsLoadingHallData(false);
      }
    };
    
    loadHallBookingsData();
  }, []);

  const totalHallIncome = hallBookingIncomes.reduce((sum, booking) => sum + booking.amount, 0);
  const totalHallExpense = totalHallIncome * 0.3;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 overflow-auto p-6">
          <FinanceHeader 
            date={date}
            onDateChange={setDate}
            dateRange={dateRange}
            onDateRangeChange={setDateRange as any}
            onAddTransactionClick={() => setIsAddTransactionOpen(true)}
          />
          
          <FinanceSummaryCards 
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            chartData={weeklyChartData}
            onViewReport={openDetailDialog}
          />
          
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
                        <subscription.icon 
                          className="h-5 w-5"
                          style={{ color: subscription.color }} 
                        />
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
                        <goal.icon 
                          className="h-5 w-5"
                          style={{ color: goal.color }} 
                        />
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
                <HallBookingFinanceWidget 
                  data={hallBookingFinanceData}
                  totalIncome={totalHallIncome}
                  totalExpense={totalHallExpense}
                  onViewReport={() => handleViewHallBookingDetails('all')}
                  isLoading={isLoadingHallData}
                />
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsTable 
                  transactions={filteredTransactions}
                  transactionType={transactionType}
                  onTransactionTypeChange={setTransactionType}
                  onViewDetails={(id, title) => openDetailDialog('transaction-detail', title)}
                  onViewAll={() => openDetailDialog('transactions', 'All Transactions')}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6">
            <HallBookingIncomesList
              bookings={hallBookingIncomes}
              onViewDetails={handleViewHallBookingDetails}
            />
          </div>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        newTransaction={newTransaction}
        onNewTransactionChange={setNewTransaction}
        onAddTransaction={handleAddTransaction}
      />

      <DetailDialog 
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        detailType={detailType}
        detailTitle={detailTitle}
        transactions={transactions}
        weeklyChartData={weeklyChartData}
        dailyExpenseData={dailyExpenseData}
        hallBookingFinanceData={hallBookingFinanceData}
        selectedHallBooking={selectedHallBooking}
        hallBookingIncomes={hallBookingIncomes}
        isLoadingHallData={isLoadingHallData}
        expenseCategories={expenseCategories}
        hallDetailModalOpen={hallDetailModalOpen}
        setHallDetailModalOpen={setHallDetailModalOpen}
        totalHallIncome={totalHallIncome}
        totalHallExpense={totalHallExpense}
      />
    </div>
  );
};

export default Finance;
