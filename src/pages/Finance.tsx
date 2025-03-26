import React, { useState, useEffect } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PiggyBank, Car, Home, Laptop, 
  Music, Youtube, Navigation,
  TrendingUp, TrendingDown, PieChart,
  LucideIcon, Building
} from 'lucide-react';
import { format, subDays, eachDayOfInterval, isToday, isThisWeek, isThisMonth } from 'date-fns';
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
import { Transaction, ExpenseCategory, SavingGoal, Subscription, HallBookingIncome } from '@/types/finance';
import { getTransactions, addTransaction, getHallBookingIncomes, getPaymentMethods, getHallBookingsByHallId } from '@/services/FinanceService';

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

interface ExpenseCategoryWithIcon extends ExpenseCategory {
  icon: LucideIcon;
}

interface SavingGoalWithIcon extends SavingGoal {
  icon: LucideIcon;
}

interface SubscriptionWithIcon extends Subscription {
  icon: LucideIcon;
}

const Finance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('week');
  const [newTransaction, setNewTransaction] = useState<{
    description: string;
    amount: string;
    type: 'income' | 'expense';
    category: string;
    date: Date;
    paymentMethod?: string;
  }>({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Grocery',
    date: new Date(),
    paymentMethod: 'Cash'
  });
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailType, setDetailType] = useState('');
  const [detailTitle, setDetailTitle] = useState('');
  const [hallBookings, setHallBookings] = useState<any[]>([]);
  const [hallBookingFinanceData, setHallBookingFinanceData] = useState<any[]>([]);
  const [hallBookingIncomes, setHallBookingIncomes] = useState<HallBookingIncome[]>([]);
  const [hallDetailModalOpen, setHallDetailModalOpen] = useState(false);
  const [selectedHallBooking, setSelectedHallBooking] = useState<string | null>(null);
  const [isLoadingHallData, setIsLoadingHallData] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoryWithIcon[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<{id: string, name: string}[]>([]);
  const [hall1Bookings, setHall1Bookings] = useState<HallBookingIncome[]>([]);
  const [hall2Bookings, setHall2Bookings] = useState<HallBookingIncome[]>([]);
  
  const generateDailyExpenseData = (transactionsData: Transaction[]) => {
    const today = new Date();
    const startDate = subDays(today, 6);
    
    const dateRange = eachDayOfInterval({
      start: startDate,
      end: today
    });
    
    const categories = [...new Set(transactionsData
      .filter(t => t.type === 'expense')
      .map(t => t.category))];
    
    return dateRange.map(date => {
      const formattedDate = format(date, 'dd');
      const dayName = format(date, 'EEE');
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayTransactions = transactionsData.filter(
        t => t.date === dateStr && t.type === 'expense'
      );
      
      const result: any = {
        name: formattedDate,
        day: dayName,
      };
      
      categories.forEach(category => {
        const amount = dayTransactions
          .filter(t => t.category === category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        result[category] = amount;
      });
      
      return result;
    });
  };

  const generateWeeklyData = (transactionsData: Transaction[]) => {
    const today = new Date();
    const startDate = subDays(today, 6);
    
    const dateRange = eachDayOfInterval({
      start: startDate,
      end: today
    });
    
    return dateRange.map(date => {
      const formattedDate = format(date, 'dd');
      const dayName = format(date, 'EEE');
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const income = transactionsData
        .filter(t => t.date === dateStr && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = transactionsData
        .filter(t => t.date === dateStr && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: formattedDate,
        day: dayName,
        income,
        expense,
      };
    });
  };

  const generateHallBookingFinanceData = (bookings: HallBookingIncome[]) => {
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
        booking.date.toString().substring(0, 10) === dateStr
      );
      
      const income = dayBookings.reduce((sum, booking) => sum + Number(booking.amount), 0);
      
      const expense = income * 0.3;
      
      return {
        name: formattedDate,
        income: parseFloat(income.toFixed(2)),
        expense: parseFloat(expense.toFixed(2))
      };
    });
  };

  const calculateExpenseCategories = (transactionsData: Transaction[]) => {
    const categories = [...new Set(transactionsData
      .filter(t => t.type === 'expense')
      .map(t => t.category))];
    
    const iconMap: Record<string, LucideIcon> = {
      'Grocery': PieChart,
      'Food & Drink': PieChart,
      'Shopping': PieChart,
      'Dhaweeye': PieChart,
      'Transportation': PieChart,
      'Utilities': PieChart,
      'Rent': PieChart,
      'Entertainment': PieChart,
      'Other': PieChart,
    };

    const colorIndex = (index: number) => {
      const colors = [COLORS.purple, COLORS.green, COLORS.pink, COLORS.orange, COLORS.blue, COLORS.yellow, COLORS.red, COLORS.teal];
      return colors[index % colors.length];
    };
    
    return categories.map((category, index) => {
      const total = transactionsData
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category,
        value: total,
        color: colorIndex(index),
        icon: iconMap[category] || PieChart,
      };
    }).sort((a, b) => b.value - a.value);
  };

  const fetchTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      console.log('Fetching transactions...');
      const transactionsData = await getTransactions();
      console.log('Transactions fetched:', transactionsData);
      setTransactions(transactionsData);
      
      const categories = calculateExpenseCategories(transactionsData);
      setExpenseCategories(categories);
      
      setIsLoadingTransactions(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transaction data');
      setIsLoadingTransactions(false);
    }
  };

  const fetchHallBookings = async () => {
    try {
      setIsLoadingHallData(true);
      console.log('Fetching hall bookings...');
      const bookingsData = await getHallBookingIncomes();
      console.log('Hall bookings fetched:', bookingsData);
      setHallBookings(bookingsData);
      
      const financeData = generateHallBookingFinanceData(bookingsData);
      setHallBookingFinanceData(financeData);
      setHallBookingIncomes(bookingsData);
      
      setIsLoadingHallData(false);
    } catch (error) {
      console.error('Error loading hall bookings data:', error);
      toast.error('Failed to load hall bookings data');
      setIsLoadingHallData(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };

  const fetchHallBookingsById = async () => {
    try {
      // Hall 1 data
      const hall1Data = await getHallBookingsByHallId(1);
      setHall1Bookings(hall1Data);
      
      // Hall 2 data
      const hall2Data = await getHallBookingsByHallId(2);
      setHall2Bookings(hall2Data);
      
    } catch (error) {
      console.error('Error loading hall bookings by id:', error);
      toast.error('Failed to load hall data by id');
    }
  };

  const refreshData = () => {
    fetchTransactions();
    fetchHallBookings();
    fetchHallBookingsById();
    fetchPaymentMethods();
  };

  useEffect(() => {
    refreshData();
    
    const intervalId = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const weeklyData = generateWeeklyData(transactions);
      const dailyExpenseData = generateDailyExpenseData(transactions);
    }
  }, [transactions]);

  const dailyExpenseData = React.useMemo(() => {
    return generateDailyExpenseData(transactions);
  }, [transactions]);

  const weeklyChartData = React.useMemo(() => {
    return generateWeeklyData(transactions);
  }, [transactions]);

  const filteredTransactions = transactions.filter(transaction => {
    if (transactionType === 'all') return true;
    return transaction.type === transactionType;
  });

  const calculateTotalIncome = () => {
    const transactionsIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    console.log('Total income from transactions:', transactionsIncome);
    
    return transactionsIncome;
  };

  const totalIncome = calculateTotalIncome();
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netProfit = totalIncome - totalExpense;

  const handleAddTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const transaction = {
        date: format(newTransaction.date, 'yyyy-MM-dd'),
        description: newTransaction.description,
        amount: amount,
        type: newTransaction.type,
        category: newTransaction.category,
        paymentMethod: newTransaction.paymentMethod
      };

      const addedTransaction = await addTransaction(transaction);
      setTransactions([addedTransaction, ...transactions]);
      setIsAddTransactionOpen(false);
      
      setNewTransaction({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Grocery',
        date: new Date(),
        paymentMethod: 'Cash'
      });

      toast.success(`${newTransaction.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
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

  const calculateHallTotalIncomes = () => {
    const hall1Total = hall1Bookings.reduce((sum, booking) => sum + Number(booking.amount), 0);
    const hall2Total = hall2Bookings.reduce((sum, booking) => sum + Number(booking.amount), 0);
    
    return {
      hall1: hall1Total,
      hall2: hall2Total
    };
  };

  const { hall1: hall1TotalIncome, hall2: hall2TotalIncome } = React.useMemo(() => {
    return calculateHallTotalIncomes();
  }, [hall1Bookings, hall2Bookings]);

  const totalHallIncome = hallBookingIncomes.reduce((sum, booking) => sum + Number(booking.amount), 0);
  const totalHallExpense = totalHallIncome * 0.3;

  const calculateMonthlyFinancials = () => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const thisMonthExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        isThisMonth(new Date(t.date))
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthExpenses = transactions
      .filter(t => {
        const txDate = new Date(t.date);
        return t.type === 'expense' && 
               txDate.getMonth() === oneMonthAgo.getMonth() && 
               txDate.getFullYear() === oneMonthAgo.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      percentChange: lastMonthExpenses ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0
    };
  };

  const monthlyFinancials = calculateMonthlyFinancials();

  const calculateTodayFinancials = () => {
    const todayIncome = transactions
      .filter(t => t.type === 'income' && isToday(new Date(t.date)))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const todayExpenses = transactions
      .filter(t => t.type === 'expense' && isToday(new Date(t.date)))
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      income: todayIncome,
      expense: todayExpenses,
      net: todayIncome - todayExpenses
    };
  };

  const todayFinancials = calculateTodayFinancials();

  const calculateTopIncomeCategories = () => {
    const incomeByCategory = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        const category = t.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    const categoryTotals = Object.entries(incomeByCategory).map(([name, total]) => ({
      name,
      total
    }));
    
    return categoryTotals.sort((a, b) => b.total - a.total).slice(0, 2);
  };

  const topIncomeCategories = calculateTopIncomeCategories();
  
  const subscriptions: SubscriptionWithIcon[] = [
    { 
      id: '1', 
      name: 'Hall 1 Revenue', 
      amount: hall1TotalIncome, 
      date: format(new Date(), 'MMM dd, yyyy'), 
      icon: Music, 
      color: '#1DB954' 
    },
    { 
      id: '2', 
      name: 'Hall 2 Revenue', 
      amount: hall2TotalIncome, 
      date: format(new Date(), 'MMM dd, yyyy'), 
      icon: Youtube, 
      color: '#FF0000' 
    },
  ];

  const calculateInsights = () => {
    const netIncome = {
      id: '1',
      name: 'Net Income',
      currentAmount: totalIncome - totalExpense,
      targetAmount: 1200,
      color: COLORS.green,
      icon: PiggyBank
    };
    
    const hall2Revenue = {
      id: '2',
      name: 'Hall 2 Revenue',
      currentAmount: hall2TotalIncome,
      targetAmount: 83000,
      color: COLORS.purple,
      icon: Building
    };
    
    const mostRecurringExpense = {
      id: '3',
      name: 'Most Recurring Expense',
      currentAmount: expenseCategories.length > 0 ? expenseCategories[0].value : 0,
      targetAmount: 325000,
      color: COLORS.orange,
      icon: Home
    };
    
    const hall1Revenue = {
      id: '4',
      name: 'Hall 1 Revenue',
      currentAmount: hall1TotalIncome,
      targetAmount: 325000,
      color: COLORS.pink,
      icon: Building
    };
    
    const dhaweeye = {
      id: '5',
      name: 'Dhaweeye',
      currentAmount: transactions
        .filter(t => t.type === 'expense' && t.category === 'Dhaweeye')
        .reduce((sum, t) => sum + t.amount, 0),
      targetAmount: 25000,
      color: COLORS.blue,
      icon: Navigation
    };
    
    return [netIncome, hall2Revenue, mostRecurringExpense, hall1Revenue, dhaweeye];
  };

  const savingGoals: SavingGoalWithIcon[] = calculateInsights();

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
                  ${monthlyFinancials.thisMonth.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ${monthlyFinancials.lastMonth.toFixed(2)} last month
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-4 dark:bg-gray-700">
                  <div 
                    className="h-full bg-green-500 rounded-full dark:bg-green-400"
                    style={{ width: `${monthlyFinancials.lastMonth ? (monthlyFinancials.thisMonth/monthlyFinancials.lastMonth)*100 : 0}%` }}
                  ></div>
                </div>
                <div className="flex items-center text-xs text-green-500 dark:text-green-400 mt-2">
                  {monthlyFinancials.percentChange < 0 ? (
                    <>
                      <TrendingDown size={12} className="mr-1" />
                      <span>{Math.abs(monthlyFinancials.percentChange).toFixed(1)}% decrease from last month</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp size={12} className="mr-1" />
                      <span>{monthlyFinancials.percentChange.toFixed(1)}% increase from last month</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-3 space-y-4">
              {subscriptions.map(subscription => {
                const SubscriptionIcon = subscription.icon;
                return (
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
                          <SubscriptionIcon 
                            size={20}
                            color={subscription.color}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium dark:text-white">{subscription.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{subscription.date}</div>
                        </div>
                        <div className="text-sm font-medium dark:text-white">
                          ${subscription.amount.toFixed(2)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              {savingGoals.slice(1).map(goal => {
                const GoalIcon = goal.icon;
                return (
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
                          <GoalIcon 
                            size={20}
                            color={goal.color}
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
                );
              })}
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
                  isLoading={isLoadingTransactions}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6">
            <HallBookingIncomesList
              bookings={hallBookingIncomes}
              onViewDetails={handleViewHallBookingDetails}
              isLoading={isLoadingHallData}
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
        paymentMethods={paymentMethods}
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

