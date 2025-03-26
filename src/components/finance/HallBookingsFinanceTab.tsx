
import React, { useState } from 'react';
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
import { HallBookingIncome } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';
import { 
  Building, 
  Calendar, 
  TrendingUp,
  Search,
  Filter,
  DollarSign,
  Users 
} from 'lucide-react';
import { format, isToday } from 'date-fns';
import HallBookingFinanceWidget from './HallBookingFinanceWidget';
import HallBookingIncomesList from './HallBookingIncomesList';

interface HallBookingsFinanceTabProps {
  hallBookings: HallBookingIncome[];
  hall1Bookings: HallBookingIncome[];
  hall2Bookings: HallBookingIncome[];
  isLoadingHallData: boolean;
  onViewDetails: (id: string) => void;
  onSearch?: (term: string) => void;
}

const HallBookingsFinanceTab: React.FC<HallBookingsFinanceTabProps> = ({
  hallBookings = [],
  hall1Bookings = [],
  hall2Bookings = [],
  isLoadingHallData = false,
  onViewDetails,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hallFilter, setHallFilter] = useState<string>('all');
  
  const totalHallRevenue = hallBookings.reduce((sum, booking) => sum + Number(booking.amount), 0);
  const hall1Revenue = hall1Bookings.reduce((sum, booking) => sum + Number(booking.amount), 0);
  const hall2Revenue = hall2Bookings.reduce((sum, booking) => sum + Number(booking.amount), 0);
  
  const todayBookings = hallBookings.filter(booking => isToday(new Date(booking.date)));
  const todayRevenue = todayBookings.reduce((sum, booking) => sum + Number(booking.amount), 0);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
  };
  
  const filteredBookings = hallBookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHall = 
      hallFilter === 'all' || 
      (hallFilter === 'hall1' && booking.hallId === 1) ||
      (hallFilter === 'hall2' && booking.hallId === 2);
    
    return matchesSearch && matchesHall;
  });

  // Generate data for the chart (using the last 7 days of bookings)
  const generateChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayBookings = hallBookings.filter(booking => 
        booking.date.toString().substring(0, 10) === dateStr
      );
      
      const income = dayBookings.reduce((sum, booking) => sum + Number(booking.amount), 0);
      const expense = income * 0.3; // Assuming expenses are 30% of income
      
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/40 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Total Revenue</p>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mt-1">
                  {formatCurrency(totalHallRevenue)}
                </h3>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">All time hall bookings</p>
              </div>
              <div className="h-12 w-12 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600 dark:text-blue-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/40 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-300">Today's Revenue</p>
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-200 mt-1">
                  {formatCurrency(todayRevenue)}
                </h3>
                <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                  {todayBookings.length} bookings today
                </p>
              </div>
              <div className="h-12 w-12 bg-green-200 dark:bg-green-700 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/40 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Hall Comparison</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-xs text-purple-500 dark:text-purple-400">Hall 1</p>
                    <p className="text-sm font-bold text-purple-700 dark:text-purple-200">
                      {formatCurrency(hall1Revenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-500 dark:text-purple-400">Hall 2</p>
                    <p className="text-sm font-bold text-purple-700 dark:text-purple-200">
                      {formatCurrency(hall2Revenue)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-200 dark:bg-purple-700 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layout changed to flex side-by-side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex flex-col h-full justify-between">
                <HallBookingFinanceWidget 
                  data={chartData}
                  totalIncome={totalHallRevenue}
                  totalExpense={totalHallRevenue * 0.3}
                  onViewReport={() => {}}
                  isLoading={isLoadingHallData}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Hall Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hall 1 Performance</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-semibold">{formatCurrency(hall1Revenue)}</span>
                    <span className="text-sm text-gray-500">
                      {hall1Bookings.length} bookings
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(hall1Revenue / (hall1Revenue + hall2Revenue || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hall 2 Performance</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-semibold">{formatCurrency(hall2Revenue)}</span>
                    <span className="text-sm text-gray-500">
                      {hall2Bookings.length} bookings
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(hall2Revenue / (hall1Revenue + hall2Revenue || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Booking Value</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      {formatCurrency(hallBookings.length > 0 
                        ? totalHallRevenue / hallBookings.length 
                        : 0
                      )}
                    </span>
                    <span className="text-sm text-gray-500">per booking</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center">
                  <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Highest Booking</p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(hallBookings.length > 0 
                        ? Math.max(...hallBookings.map(b => Number(b.amount))) 
                        : 0
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Attendees</p>
                    <p className="text-sm font-semibold">
                      {hallBookings.reduce((sum, booking) => sum + booking.attendees, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking incomes section with fixed height and scrollable */}
      <div className="mt-12">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Hall Booking Incomes</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex items-center">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  className="pl-8 h-9"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={hallFilter}
                  onValueChange={setHallFilter}
                >
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue placeholder="All Halls" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Halls</SelectItem>
                    <SelectItem value="hall1">Hall 1</SelectItem>
                    <SelectItem value="hall2">Hall 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden max-h-[500px] overflow-y-auto">
              <HallBookingIncomesList
                bookings={filteredBookings}
                onViewDetails={onViewDetails}
                isLoading={isLoadingHallData}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HallBookingsFinanceTab;
