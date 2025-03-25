
import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Download, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt?: string;
  address?: string;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  method: string;
  description: string;
}

interface Order {
  id: string;
  date: string;
  items: number;
  total: number;
  status: 'completed' | 'processing' | 'cancelled';
}

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Mock data - in a real app this would come from an API
  const customers: Record<string, Customer> = {
    c1: { id: 'c1', name: 'Ahmed Mohamed', email: 'ahmed@example.com', phone: '+971 55 123 4567', totalOrders: 24, totalSpent: 845.50, createdAt: '2023-01-15', address: 'Building 5, Apartment 204, Dubai Marina, Dubai, UAE' },
    c2: { id: 'c2', name: 'Fatima Hussein', email: 'fatima@example.com', phone: '+971 50 987 6543', totalOrders: 18, totalSpent: 620.75, createdAt: '2023-03-22', address: 'Villa 12, Street 14, Jumeirah, Dubai, UAE' },
    c3: { id: 'c3', name: 'Omar Jama', email: 'omar@example.com', phone: '+971 54 456 7890', totalOrders: 9, totalSpent: 312.25, createdAt: '2023-05-08', address: 'Apartment 503, Tower A, Sheikh Zayed Road, Dubai, UAE' },
    c4: { id: 'c4', name: 'Amina Abdi', email: 'amina@example.com', phone: '+971 56 789 0123', totalOrders: 15, totalSpent: 490.00, createdAt: '2023-02-17', address: 'Unit 7, Al Wasl Road, Dubai, UAE' },
  };
  
  const customer = customers[id || 'c1'];
  
  // Mock payment history
  const payments: Payment[] = [
    { id: 'p1', date: '2023-09-15', amount: 45.75, status: 'paid', method: 'Credit Card', description: 'Order #12458' },
    { id: 'p2', date: '2023-08-22', amount: 125.00, status: 'paid', method: 'PayPal', description: 'Order #12356' },
    { id: 'p3', date: '2023-07-30', amount: 28.50, status: 'pending', method: 'Bank Transfer', description: 'Order #12301' },
    { id: 'p4', date: '2023-07-18', amount: 76.25, status: 'paid', method: 'Credit Card', description: 'Order #12278' },
    { id: 'p5', date: '2023-06-05', amount: 32.15, status: 'failed', method: 'Credit Card', description: 'Order #12189' },
    { id: 'p6', date: '2023-06-01', amount: 32.15, status: 'paid', method: 'Cash', description: 'Order #12188' },
  ];
  
  // Mock order history
  const orders: Order[] = [
    { id: 'ord-12458', date: '2023-09-15', items: 3, total: 45.75, status: 'completed' },
    { id: 'ord-12356', date: '2023-08-22', items: 7, total: 125.00, status: 'completed' },
    { id: 'ord-12301', date: '2023-07-30', items: 2, total: 28.50, status: 'processing' },
    { id: 'ord-12278', date: '2023-07-18', items: 4, total: 76.25, status: 'completed' },
    { id: 'ord-12189', date: '2023-06-05', items: 1, total: 32.15, status: 'cancelled' },
    { id: 'ord-12188', date: '2023-06-01', items: 1, total: 32.15, status: 'completed' },
  ];
  
  if (!customer) {
    return <div>Customer not found</div>;
  }
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(-1)}
              className="dark:text-gray-300 dark:border-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold dark:text-white">{customer.name}</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center dark:text-white">
                    <User className="h-5 w-5 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                    <p className="dark:text-white">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="dark:text-white">{customer.email}</p>
                  </div>
                  {customer.phone && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="dark:text-white">{customer.phone}</p>
                    </div>
                  )}
                  {customer.address && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                      <p className="dark:text-white">{customer.address}</p>
                    </div>
                  )}
                  {customer.createdAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Since</p>
                      <p className="dark:text-white">{customer.createdAt}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
                    <p className="font-medium dark:text-white">{customer.totalOrders}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
                    <p className="font-medium dark:text-white">${customer.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Order Value</p>
                    <p className="font-medium dark:text-white">
                      ${(customer.totalSpent / (customer.totalOrders || 1)).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Tabs defaultValue="orders">
                <TabsList className="mb-4 dark:bg-gray-800">
                  <TabsTrigger value="orders" className="dark:data-[state=active]:bg-gray-700">Orders</TabsTrigger>
                  <TabsTrigger value="payments" className="dark:data-[state=active]:bg-gray-700">Payments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders">
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="dark:text-white">Order History</CardTitle>
                        <CardDescription className="dark:text-gray-400">
                          List of all orders placed by this customer
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="dark:text-gray-300 dark:border-gray-600">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.length === 0 ? (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No orders found</p>
                        ) : (
                          orders.map((order) => (
                            <div 
                              key={order.id} 
                              className="p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium dark:text-white">{order.id}</h4>
                                  <div className="flex items-center mt-1">
                                    <Calendar className="h-3 w-3 text-gray-500 dark:text-gray-400 mr-1" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{order.date}</span>
                                  </div>
                                </div>
                                <Badge 
                                  className={
                                    order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                  }
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="mt-3 pt-3 border-t dark:border-gray-700 grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
                                  <p className="dark:text-white">{order.items}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                                  <p className="dark:text-white">${order.total.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payments">
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="dark:text-white">Payment History</CardTitle>
                        <CardDescription className="dark:text-gray-400">
                          All payments made by this customer
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="dark:text-gray-300 dark:border-gray-600">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {payments.length === 0 ? (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No payments found</p>
                        ) : (
                          payments.map((payment) => (
                            <div 
                              key={payment.id} 
                              className="p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium dark:text-white">{payment.description}</h4>
                                  <div className="flex items-center mt-1">
                                    <Calendar className="h-3 w-3 text-gray-500 dark:text-gray-400 mr-1" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{payment.date}</span>
                                  </div>
                                </div>
                                <Badge 
                                  className={
                                    payment.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                  }
                                >
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="mt-3 pt-3 border-t dark:border-gray-700 grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method</p>
                                  <p className="dark:text-white">{payment.method}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                                  <p className="dark:text-white">${payment.amount.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
