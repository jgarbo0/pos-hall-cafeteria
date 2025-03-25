
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Calendar, ArrowUpRight, TrendingUp, Users, ShoppingBag, DollarSign, 
  CreditCard, Calendar as CalendarIcon, Clock, CreditCard as CreditCardIcon,
  Utensils, Coffee
} from 'lucide-react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { bookings, generateOrderNumber } from '@/data/mockData';
import { format, addDays, startOfDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('weekly');
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="default" size="sm">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <h3 className="text-2xl font-bold">$12,426</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      12.5%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <h3 className="text-2xl font-bold">843</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      8.2%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customers</p>
                  <h3 className="text-2xl font-bold">1,245</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      5.3%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bookings</p>
                  <h3 className="text-2xl font-bold">96</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      3.8%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="shadow-sm lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Sales Overview</CardTitle>
                  <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="weekly">Weekly</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <CardDescription>
                  Compare sales performance over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#3B82F6" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Distribution of sales across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Popular items and recent orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Popular Items</CardTitle>
                <CardDescription>
                  Top selling menu items this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                          {item.category === 'Main Dishes' ? 
                            <Utensils className="h-4 w-4 text-blue-600 dark:text-blue-400" /> : 
                            item.category === 'Beverages' ? 
                              <Coffee className="h-4 w-4 text-blue-600 dark:text-blue-400" /> :
                              <Coffee className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.sales} sold</p>
                        <p className="text-xs text-green-500">+{item.growth}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest incoming orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{order.customerName}</p>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex text-xs text-muted-foreground mt-1">
                          <p>Order #{order.id}</p>
                          <span className="mx-1">•</span>
                          <p>{order.items} items</p>
                          <span className="mx-1">•</span>
                          <p>{order.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => navigate('/orders')}
                  >
                    View All Orders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming bookings */}
          <Card className="shadow-sm mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>
                Scheduled hall and venue bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingBookings.map(booking => (
                  <Card key={booking.id} className="bg-gray-50 shadow-none dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {booking.purpose}
                        </Badge>
                        <div className="text-sm">{booking.guests} guests</div>
                      </div>
                      <h4 className="font-semibold">{booking.customerName}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                        <span>{format(booking.date, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{booking.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/hall')}
              >
                View All Bookings
              </Button>
            </CardContent>
          </Card>
          
          {/* Payment methods */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Distribution of payment methods used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Credit Card', value: 65 },
                      { name: 'Cash', value: 20 },
                      { name: 'Mobile Money', value: 15 }
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center mr-2">
                    <CreditCardIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Credit Card</p>
                    <p className="text-xs text-muted-foreground">65% of payments</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center mr-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cash</p>
                    <p className="text-xs text-muted-foreground">20% of payments</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-orange-500/10 rounded-full flex items-center justify-center mr-2">
                    <CreditCard className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mobile Money</p>
                    <p className="text-xs text-muted-foreground">15% of payments</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
