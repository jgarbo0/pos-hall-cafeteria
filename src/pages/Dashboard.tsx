
import React, { useState } from 'react';
import { 
  DollarSign, ShoppingBag, Users, Calendar as CalendarIcon, 
  Smartphone, DollarSign as DollarSignIcon, Wallet 
} from 'lucide-react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { bookings, generateOrderNumber } from '@/data/mockData';
import { addDays } from 'date-fns';

// Import our new dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import FinanceStatsCards from '@/components/dashboard/FinanceStatsCards';
import SalesOverviewChart from '@/components/dashboard/SalesOverviewChart';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import IncomeExpenseWidget from '@/components/dashboard/IncomeExpenseWidget';
import PopularItemsList from '@/components/dashboard/PopularItemsList';
import RecentOrdersList from '@/components/dashboard/RecentOrdersList';
import UpcomingBookings from '@/components/dashboard/UpcomingBookings';
import PaymentMethodsChart from '@/components/dashboard/PaymentMethodsChart';

// Sample data for charts
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

// Sample data for income vs expense chart
const financeData = [
  { name: 'Jan', income: 9800, expense: 7500 },
  { name: 'Feb', income: 8900, expense: 6500 },
  { name: 'Mar', income: 11500, expense: 8800 },
  { name: 'Apr', income: 10200, expense: 7900 },
  { name: 'May', income: 9100, expense: 6200 },
  { name: 'Jun', income: 12600, expense: 9100 },
  { name: 'Jul', income: 13800, expense: 10200 },
];

const categoryData = [
  { name: 'Main Dishes', value: 45 },
  { name: 'Beverages', value: 25 },
  { name: 'Desserts', value: 20 },
  { name: 'Appetizers', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const popularItems = [
  { id: 1, name: 'Somali Beef Suqaar', category: 'Main Dishes', sales: 256, growth: 12.5 },
  { id: 2, name: 'Sambusa', category: 'Appetizers', sales: 204, growth: 8.3 },
  { id: 3, name: 'Somali Rice (Bariis)', category: 'Main Dishes', sales: 198, growth: 5.7 },
  { id: 4, name: 'Shaah (Somali Tea)', category: 'Beverages', sales: 187, growth: 3.2 },
];

const recentOrders = [
  { id: generateOrderNumber(), customerName: 'Ahmed Hassan', items: 3, total: 28.55, status: 'completed', time: '15 min ago' },
  { id: generateOrderNumber(), customerName: 'Fatima Omar', items: 2, total: 15.99, status: 'processing', time: '30 min ago' },
  { id: generateOrderNumber(), customerName: 'Mohammed Ali', items: 5, total: 42.80, status: 'completed', time: '1 hour ago' },
  { id: generateOrderNumber(), customerName: 'Aisha Abdi', items: 1, total: 9.99, status: 'processing', time: '2 hours ago' },
];

const upcomingBookings = [
  { id: 'b1', customerName: 'Amin Farah', purpose: 'Birthday Party', date: addDays(new Date(), 1), time: '14:00 - 16:00', guests: 25 },
  { id: 'b2', customerName: 'Sara Hassan', purpose: 'Business Meeting', date: addDays(new Date(), 2), time: '10:00 - 12:00', guests: 12 },
  { id: 'b3', customerName: 'Omar Ali', purpose: 'Wedding Reception', date: addDays(new Date(), 3), time: '18:00 - 22:00', guests: 50 },
];

const paymentMethodsData = [
  { name: 'Zaad', value: 45 },
  { name: 'Cash', value: 30 },
  { name: 'Edahb', value: 25 }
];

const paymentMethods = [
  { 
    name: 'Zaad', 
    percentage: 45, 
    icon: <Smartphone className="h-4 w-4 text-blue-500" />,
    bgColorClass: 'bg-blue-500/10',
    textColorClass: 'text-blue-500'
  },
  { 
    name: 'Cash', 
    percentage: 30, 
    icon: <DollarSignIcon className="h-4 w-4 text-green-500" />,
    bgColorClass: 'bg-green-500/10',
    textColorClass: 'text-green-500'
  },
  { 
    name: 'Edahb', 
    percentage: 25, 
    icon: <Wallet className="h-4 w-4 text-orange-500" />,
    bgColorClass: 'bg-orange-500/10',
    textColorClass: 'text-orange-500'
  }
];

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  
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
              value="$12,426"
              change="12.5%"
              changeText="vs last month"
              icon={<DollarSign className="h-6 w-6 text-blue-500" />}
            />
            <StatsCard
              title="Total Orders"
              value="843"
              change="8.2%"
              changeText="vs last month"
              icon={<ShoppingBag className="h-6 w-6 text-orange-500" />}
            />
            <StatsCard
              title="Customers"
              value="1,245"
              change="5.3%"
              changeText="vs last month"
              icon={<Users className="h-6 w-6 text-purple-500" />}
            />
            <StatsCard
              title="Bookings"
              value="96"
              change="3.8%"
              changeText="vs last month"
              icon={<CalendarIcon className="h-6 w-6 text-green-500" />}
            />
          </div>
          
          {/* Income vs Expense cards */}
          <FinanceStatsCards 
            income={{ value: "$65,890", change: "8.3%" }}
            expense={{ value: "$48,230", change: "4.1%" }}
          />
          
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <SalesOverviewChart 
              data={salesData} 
              timeRange={timeRange} 
              onTimeRangeChange={setTimeRange} 
            />
            <CategoryPieChart data={categoryData} colors={COLORS} />
          </div>
          
          {/* Income vs Expense Chart */}
          <IncomeExpenseWidget 
            data={financeData} 
            monthlyIncome="$65,890" 
            monthlyExpense="$48,230" 
          />
          
          {/* Popular items and recent orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PopularItemsList items={popularItems} />
            <RecentOrdersList orders={recentOrders} />
          </div>
          
          {/* Upcoming bookings */}
          <UpcomingBookings bookings={upcomingBookings} />
          
          {/* Payment methods */}
          <PaymentMethodsChart 
            data={paymentMethodsData} 
            methods={paymentMethods} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
