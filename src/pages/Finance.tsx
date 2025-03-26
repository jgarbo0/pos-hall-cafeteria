import React, { useState, useEffect } from 'react';
import { 
  subDays, 
  format, 
  isToday, 
  isThisMonth, 
  eachDayOfInterval 
} from 'date-fns';
import { 
  Building, 
  Coffee, 
  LineChart, 
  PieChart as PieChartIcon,
  Music,
  Youtube,
  Home,
  Navigation,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  type LucideIcon
} from 'lucide-react';

import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

import FinanceHeader from '@/components/finance/FinanceHeader';
import FinanceSummaryCards from '@/components/finance/FinanceSummaryCards';
import TransactionsTable from '@/components/finance/TransactionsTable';
import AddTransactionModal from '@/components/finance/AddTransactionModal';
import DetailDialog from '@/components/finance/DetailDialog';
import HallBookingFinanceWidget from '@/components/finance/HallBookingFinanceWidget';
import HallBookingIncomesList from '@/components/finance/HallBookingIncomesList';
import HallBookingsFinanceTab from '@/components/finance/HallBookingsFinanceTab';
import CafeteriaFinanceTab from '@/components/finance/CafeteriaFinanceTab';

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
  const { toast: showToast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [detailDialogTitle, setDetailDialogTitle] = useState("");
  const [detailDialogId, setDetailDialogId] = useState("");
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('week');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hallBookingIncomes, setHallBookingIncomes] = useState<HallBookingIncome[]>([]);
  const [hall1Bookings, setHall1Bookings] = useState<HallBookingIncome[]>([]);
  const [hall2Bookings, setHall2Bookings] = useState<HallBookingIncome[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isLoadingHallData, setIsLoadingHallData] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoadingTransactions(true);
        const data = await getTransactions();
        setTransactions(data || []);
        setIsLoadingTransactions(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load transactions');
        setIsLoadingTransactions(false);
      }
    };

    const fetchHallBookingIncomes = async () => {
      try {
        setIsLoadingHallData(true);
        const data = await getHallBookingIncomes();
        setHallBookingIncomes(data || []);
        
        const hall1 = await getHallBookingsByHallId(1);
        setHall1Bookings(hall1 || []);
        
        const hall2 = await getHallBookingsByHallId(2);
        setHall2Bookings(hall2 || []);
        
        setIsLoadingHallData(false);
      } catch (error) {
        console.error('Error fetching hall booking incomes:', error);
        toast.error('Failed to load hall booking data');
        setIsLoadingHallData(false);
      }
    };

    fetchTransactions();
    fetchHallBookingIncomes();
  }, []);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await addTransaction(transaction);
      if (newTransaction) {
        setTransactions((prev) => [newTransaction, ...prev]);
        toast.success('Transaction added successfully');
        setIsAddTransactionModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleDateRangeChange = (range: 'day' | 'week' | 'month') => {
    setDateRange(range);
  };

  const handleViewReport = (type: string, title: string) => {
    setDetailDialogTitle(`${title} Report`);
    setDetailDialogId(type);
    setIsDetailDialogOpen(true);
  };

  const handleViewTransactionDetails = (id: string, title: string) => {
    setDetailDialogTitle(title);
    setDetailDialogId(id);
    setIsDetailDialogOpen(true);
  };

  const handleViewHallBookingDetails = (id: string) => {
    const booking = hallBookingIncomes.find(b => b.id === id);
    if (booking) {
      setDetailDialogTitle(`Hall Booking: ${booking.purpose}`);
      setDetailDialogId(id);
      setIsDetailDialogOpen(true);
    } else {
      toast.error('Booking details not found');
    }
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setDetailDialogTitle("");
    setDetailDialogId("");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    
    if (dateRange === 'day' && selectedDate) {
      return format(transactionDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    } else if (dateRange === 'week' && selectedDate) {
      const oneWeekAgo = subDays(selectedDate, 7);
      return transactionDate >= oneWeekAgo && transactionDate <= selectedDate;
    } else if (dateRange === 'month') {
      return isThisMonth(transactionDate);
    }
    
    return true;
  });

  const typeFilteredTransactions = filteredTransactions.filter(transaction => {
    if (transactionType === 'all') return true;
    return transaction.type === transactionType;
  });

  const recentTransactions = typeFilteredTransactions.slice(0, 5);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const generateChartData = () => {
    const data = [];
    const endDate = selectedDate || new Date();
    const startDate = subDays(endDate, 6);
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    for (const date of dateRange) {
      const dayTransactions = filteredTransactions.filter(
        t => format(new Date(t.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        name: format(date, 'dd MMM'),
        income,
        expense
      });
    }
    
    return data;
  };
  
  const chartData = generateChartData();

  const cafeteriaTransactions = transactions.filter(
    transaction => transaction.category === 'Cafeteria' || transaction.category === 'Food & Beverage'
  );

  const bookingTransactions = transactions.filter(
    transaction => isToday(new Date(transaction.date)) && transaction.type === 'income'
  );

  const todayCafeteriaRevenue = cafeteriaTransactions
    .filter(t => isToday(new Date(t.date)))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <FinanceHeader 
            date={selectedDate}
            onDateChange={handleDateChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onAddTransactionClick={() => setIsAddTransactionModalOpen(true)}
          />
          
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="hall-bookings">Hall Bookings</TabsTrigger>
              <TabsTrigger value="cafeteria">Cafeteria</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <FinanceSummaryCards 
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                chartData={chartData}
                onViewReport={handleViewReport}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">
                        Recent Transactions
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        onClick={() => handleViewReport('all-transactions', 'All Transactions')}
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <TransactionsTable
                        transactions={recentTransactions}
                        transactionType={transactionType}
                        onTransactionTypeChange={setTransactionType}
                        onViewDetails={handleViewTransactionDetails}
                        onViewAll={() => handleViewReport('all-transactions', 'All Transactions')}
                        isLoading={isLoadingTransactions}
                        onSearch={handleSearch}
                      />
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="shadow-sm mb-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                        Today's Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Revenue</p>
                              <p className="text-xs text-muted-foreground dark:text-gray-400">Today's income</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(todayCafeteriaRevenue)}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
                              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Expenses</p>
                              <p className="text-xs text-muted-foreground dark:text-gray-400">Today's expenses</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-red-600 dark:text-red-400">
                            {formatCurrency(
                              filteredTransactions
                                .filter(t => t.type === 'expense' && isToday(new Date(t.date)))
                                .reduce((sum, t) => sum + t.amount, 0)
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                        Upcoming Payments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                              <Music className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Spotify</p>
                              <p className="text-xs text-muted-foreground dark:text-gray-400">{format(new Date(), 'dd MMM yyyy')}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">$9.99</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
                              <Youtube className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">YouTube Premium</p>
                              <p className="text-xs text-muted-foreground dark:text-gray-400">{format(new Date(), 'dd MMM yyyy')}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">$11.99</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3">
                              <PiggyBank className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Savings</p>
                              <p className="text-xs text-muted-foreground dark:text-gray-400">Automatic transfer</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">$250.00</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                              <Home className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Rent</p>
                              <p className="text-xs text-muted-foreground dark:text-gray-400">Monthly payment</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">$1,200.00</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mr-3">
                              <Navigation className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Car Insurance</p>
                              <p className="text-xs text-muted-foreground dark:text-gray-400">Quarterly payment</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">$189.00</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hall-bookings">
              <HallBookingsFinanceTab
                hallBookings={hallBookingIncomes}
                hall1Bookings={hall1Bookings}
                hall2Bookings={hall2Bookings}
                isLoadingHallData={isLoadingHallData}
                onViewDetails={handleViewHallBookingDetails}
              />
            </TabsContent>
            
            <TabsContent value="cafeteria">
              <CafeteriaFinanceTab
                transactions={cafeteriaTransactions}
                isLoadingTransactions={isLoadingTransactions}
                onViewDetails={handleViewTransactionDetails}
                onSearch={handleSearch}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <AddTransactionModal 
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
      
      <DetailDialog
        showDetailModal={isDetailDialogOpen}
        setShowDetailModal={setIsDetailDialogOpen}
        detailType={detailDialogId}
        detailTitle={detailDialogTitle}
        transactions={transactions}
        weeklyChartData={chartData}
        dailyExpenseData={[]}
        hallBookingFinanceData={chartData}
        selectedHallBooking={null}
        hallBookingIncomes={hallBookingIncomes}
        isLoadingHallData={isLoadingHallData}
        expenseCategories={[]}
        hallDetailModalOpen={false}
        setHallDetailModalOpen={() => {}}
        totalHallIncome={0}
        totalHallExpense={0}
      />
    </div>
  );
};

export default Finance;
