
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, ShoppingBag, Users, Calendar as CalendarIcon, 
  Smartphone, DollarSign as DollarSignIcon, Wallet 
} from 'lucide-react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { addDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Import our dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import FinanceStatsCards from '@/components/dashboard/FinanceStatsCards';
import SalesOverviewChart from '@/components/dashboard/SalesOverviewChart';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import PopularItemsList from '@/components/dashboard/PopularItemsList';
import RecentOrdersList from '@/components/dashboard/RecentOrdersList';
import UpcomingBookings from '@/components/dashboard/UpcomingBookings';
import PaymentMethodsChart from '@/components/dashboard/PaymentMethodsChart';
import { toast } from 'sonner';

// Function to fetch orders from Supabase
const fetchOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return data || [];
};

// Function to fetch popular menu items
const fetchPopularItems = async () => {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      id, 
      title,
      price,
      category_id,
      popular,
      categories (name)
    `)
    .eq('popular', true)
    .limit(5);

  if (error) {
    console.error('Error fetching popular items:', error);
    throw error;
  }

  // Transform the data to match the expected format
  return (data || []).map(item => ({
    id: item.id,
    name: item.title,
    category: item.categories?.name || 'Unknown',
    sales: Math.floor(Math.random() * 200) + 50,  // Random sales data as a placeholder
    growth: +(Math.random() * 15).toFixed(1),     // Random growth data as a placeholder
  }));
};

// Function to fetch upcoming bookings
const fetchBookings = async () => {
  const { data, error } = await supabase
    .from('hall_bookings')
    .select('*')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(3);

  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }

  // Transform the data to match the expected format
  return (data || []).map(booking => ({
    id: booking.id,
    customerName: booking.customer_name,
    purpose: booking.purpose,
    date: new Date(booking.date),
    time: `${booking.start_time} - ${booking.end_time}`,
    guests: booking.attendees,
  }));
};

// Function to fetch transactions
const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return data || [];
};

// Function to fetch payment methods
const fetchPaymentMethods = async () => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*');

  if (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }

  return data || [];
};

// Function to fetch sales data by category
const fetchCategorySales = async () => {
  // For simplicity, we'll generate random data here
  // In a real app, you would aggregate data from orders and order_items
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  // Transform categories into sales data with random values
  return (data || []).map(category => ({
    name: category.name,
    value: Math.floor(Math.random() * 45) + 5, // Random percentage between 5 and 50
  }));
};

// Sample data for charts - these would ideally come from aggregated database data
const generateSalesData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  return months.map(name => ({
    name,
    sales: Math.floor(Math.random() * 5000) + 1000, // Random sales between 1000 and 6000
  }));
};

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  
  // Fetch orders using React Query
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  // Fetch popular items using React Query
  const { data: popularItems = [], isLoading: itemsLoading, error: itemsError } = useQuery({
    queryKey: ['popularItems'],
    queryFn: fetchPopularItems,
  });

  // Fetch upcoming bookings using React Query
  const { data: upcomingBookings = [], isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['upcomingBookings'],
    queryFn: fetchBookings,
  });

  // Fetch transactions using React Query
  const { data: transactions = [], isLoading: transactionsLoading, error: transactionsError } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  // Fetch category sales data using React Query
  const { data: categorySales = [], isLoading: categorySalesLoading, error: categorySalesError } = useQuery({
    queryKey: ['categorySales'],
    queryFn: fetchCategorySales,
  });

  // Fetch payment methods and transform into required format
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await fetchPaymentMethods();
        
        // Generate random percentages that add up to 100%
        const total = methods.length;
        let remaining = 100;
        const methodsWithValues = methods.map((method, index) => {
          // For the last item, just use the remaining percentage
          const percentage = index === total - 1 
            ? remaining 
            : Math.floor(Math.random() * (remaining - (total - index - 1))) + 1;
          
          remaining -= percentage;
          
          return {
            name: method.name,
            value: percentage,
            percentage,
            icon: getPaymentIcon(method.name),
            bgColorClass: getPaymentBgColor(method.name),
            textColorClass: getPaymentTextColor(method.name)
          };
        });

        setPaymentMethods(methodsWithValues);
        setPaymentMethodData(methodsWithValues.map(m => ({ name: m.name, value: m.value })));
      } catch (error) {
        console.error('Error loading payment methods:', error);
        toast.error('Failed to load payment methods');
      }
    };

    loadPaymentMethods();
  }, []);

  // Get payment method icon based on name
  const getPaymentIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'zaad':
        return <Smartphone className="h-4 w-4 text-blue-500" />;
      case 'cash':
        return <DollarSignIcon className="h-4 w-4 text-green-500" />;
      case 'edahb':
        return <Wallet className="h-4 w-4 text-orange-500" />;
      default:
        return <DollarSignIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get payment method background color based on name
  const getPaymentBgColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'zaad':
        return 'bg-blue-500/10';
      case 'cash':
        return 'bg-green-500/10';
      case 'edahb':
        return 'bg-orange-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  // Get payment method text color based on name
  const getPaymentTextColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'zaad':
        return 'text-blue-500';
      case 'cash':
        return 'text-green-500';
      case 'edahb':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Calculate some statistics from the data
  const stats = {
    totalOrders: orders.length,
    totalSales: orders.reduce((acc, order) => acc + parseFloat(order.total.toString()), 0).toFixed(2),
    totalCustomers: new Set(orders.map(order => order.customer_name)).size,
    totalBookings: upcomingBookings.length,
  };

  // Calculate total income and expenses
  const income = transactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + parseFloat(tx.amount.toString()), 0);
  
  const expense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + parseFloat(tx.amount.toString()), 0);

  // Transform recent orders for display
  const recentOrders = orders
    .slice(0, 4)
    .map(order => ({
      id: order.order_number,
      customerName: order.customer_name || 'Anonymous',
      items: Math.floor(Math.random() * 5) + 1, // This would come from a join with order_items
      total: parseFloat(order.total.toString()),
      status: order.status,
      time: new Date(order.timestamp).toLocaleTimeString(),
    }));

  // Set COLORS array for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Generate sales data based on time range
  const salesData = generateSalesData();

  // Show error states
  if (ordersError || itemsError || bookingsError || transactionsError || categorySalesError) {
    toast.error('Failed to load some dashboard data');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <DashboardHeader />
          
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Sales"
              value={`$${stats.totalSales}`}
              change="12.5%"
              changeText="vs last month"
              icon={<DollarSign className="h-6 w-6 text-blue-500" />}
            />
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders.toString()}
              change="8.2%"
              changeText="vs last month"
              icon={<ShoppingBag className="h-6 w-6 text-orange-500" />}
            />
            <StatsCard
              title="Customers"
              value={stats.totalCustomers.toString()}
              change="5.3%"
              changeText="vs last month"
              icon={<Users className="h-6 w-6 text-purple-500" />}
            />
            <StatsCard
              title="Bookings"
              value={stats.totalBookings.toString()}
              change="3.8%"
              changeText="vs last month"
              icon={<CalendarIcon className="h-6 w-6 text-green-500" />}
            />
          </div>
          
          {/* Income vs Expense cards */}
          <FinanceStatsCards 
            income={{ value: `$${income.toFixed(2)}`, change: "8.3%" }}
            expense={{ value: `$${expense.toFixed(2)}`, change: "4.1%" }}
          />
          
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <SalesOverviewChart 
              data={salesData} 
              timeRange={timeRange} 
              onTimeRangeChange={setTimeRange} 
            />
            <CategoryPieChart data={categorySales} colors={COLORS} />
          </div>
          
          {/* Popular items and recent orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PopularItemsList items={popularItems} />
            <RecentOrdersList orders={recentOrders} />
          </div>
          
          {/* Upcoming bookings */}
          <UpcomingBookings bookings={upcomingBookings} />
          
          {/* Payment methods */}
          <PaymentMethodsChart 
            data={paymentMethodData} 
            methods={paymentMethods} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
