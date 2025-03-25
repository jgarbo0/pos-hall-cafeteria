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
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Download, User, DollarSign, CreditCard, AlertCircle, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt?: string;
  address?: string;
  pendingAmount?: number;
  status?: 'active' | 'inactive';
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  method: string;
  description: string;
  invoiceNumber?: string;
  dueDate?: string;
}

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
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
  const [activeTab, setActiveTab] = useState('orders');
  
  const customers: Record<string, Customer> = {
    c1: { 
      id: 'c1', 
      name: 'Ahmed Mohamed', 
      email: 'ahmed@example.com', 
      phone: '+971 55 123 4567', 
      totalOrders: 24, 
      totalSpent: 845.50, 
      createdAt: '2023-01-15', 
      address: 'Building 5, Apartment 204, Dubai Marina, Dubai, UAE',
      pendingAmount: 45.75,
      status: 'active'
    },
    c2: { 
      id: 'c2', 
      name: 'Fatima Hussein', 
      email: 'fatima@example.com', 
      phone: '+971 50 987 6543', 
      totalOrders: 18, 
      totalSpent: 620.75, 
      createdAt: '2023-03-22', 
      address: 'Villa 12, Street 14, Jumeirah, Dubai, UAE',
      status: 'active'
    },
    c3: { 
      id: 'c3', 
      name: 'Omar Jama', 
      email: 'omar@example.com', 
      phone: '+971 54 456 7890', 
      totalOrders: 9, 
      totalSpent: 312.25, 
      createdAt: '2023-05-08', 
      address: 'Apartment 503, Tower A, Sheikh Zayed Road, Dubai, UAE',
      pendingAmount: 28.50,
      status: 'active'
    },
    c4: { 
      id: 'c4', 
      name: 'Amina Abdi', 
      email: 'amina@example.com', 
      phone: '+971 56 789 0123', 
      totalOrders: 15, 
      totalSpent: 490.00, 
      createdAt: '2023-02-17', 
      address: 'Unit 7, Al Wasl Road, Dubai, UAE',
      status: 'inactive'
    },
  };
  
  const customer = id ? customers[id] : null;
  
  const payments: Payment[] = [
    { id: 'p1', date: '2023-09-15', amount: 45.75, status: 'paid', method: 'Credit Card', description: 'Order #12458', invoiceNumber: 'INV-2023-001' },
    { id: 'p2', date: '2023-08-22', amount: 125.00, status: 'paid', method: 'PayPal', description: 'Order #12356', invoiceNumber: 'INV-2023-002' },
    { id: 'p3', date: '2023-07-30', amount: 28.50, status: 'pending', method: 'Bank Transfer', description: 'Order #12301', invoiceNumber: 'INV-2023-003', dueDate: '2023-08-30' },
    { id: 'p4', date: '2023-07-18', amount: 76.25, status: 'paid', method: 'Credit Card', description: 'Order #12278', invoiceNumber: 'INV-2023-004' },
    { id: 'p5', date: '2023-06-05', amount: 32.15, status: 'failed', method: 'Credit Card', description: 'Order #12189', invoiceNumber: 'INV-2023-005' },
    { id: 'p6', date: '2023-06-01', amount: 32.15, status: 'paid', method: 'Cash', description: 'Order #12188', invoiceNumber: 'INV-2023-006' },
  ];
  
  const invoices: Invoice[] = [
    { 
      id: 'INV-2023-001', 
      date: '2023-09-01', 
      dueDate: '2023-09-15', 
      amount: 45.75, 
      status: 'paid',
      items: [
        { description: 'Main course meal', quantity: 3, price: 12.99 },
        { description: 'Dessert', quantity: 1, price: 6.78 }
      ]
    },
    { 
      id: 'INV-2023-003', 
      date: '2023-07-15', 
      dueDate: '2023-08-30', 
      amount: 28.50, 
      status: 'pending',
      items: [
        { description: 'Appetizer', quantity: 2, price: 8.75 },
        { description: 'Beverage', quantity: 2, price: 5.50 }
      ]
    },
    { 
      id: 'INV-2023-007', 
      date: '2023-05-20', 
      dueDate: '2023-06-20', 
      amount: 65.30, 
      status: 'overdue',
      items: [
        { description: 'Special event catering', quantity: 1, price: 65.30 }
      ]
    }
  ];
  
  const orders: Order[] = [
    { id: 'ord-12458', date: '2023-09-15', items: 3, total: 45.75, status: 'completed' },
    { id: 'ord-12356', date: '2023-08-22', items: 7, total: 125.00, status: 'completed' },
    { id: 'ord-12301', date: '2023-07-30', items: 2, total: 28.50, status: 'processing' },
    { id: 'ord-12278', date: '2023-07-18', items: 4, total: 76.25, status: 'completed' },
    { id: 'ord-12189', date: '2023-06-05', items: 1, total: 32.15, status: 'cancelled' },
    { id: 'ord-12188', date: '2023-06-01', items: 1, total: 32.15, status: 'completed' },
  ];
  
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue');
  
  const handleMarkAsPaid = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} marked as paid.`);
  };
  
  if (!customer) {
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
            </div>
            
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
              <h1 className="text-3xl font-bold mb-4 dark:text-white">Customer Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">The customer you are looking for does not exist or has been removed.</p>
              <Button onClick={() => navigate('/customers')}>
                Go to Customers List
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
            <Badge 
              className={
                customer.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }
            >
              {customer.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
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
                  {customer.pendingAmount && customer.pendingAmount > 0 && (
                    <div className="flex justify-between pt-3 border-t dark:border-gray-700">
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Amount</p>
                      <p className="font-medium text-yellow-600 dark:text-yellow-400">${customer.pendingAmount.toFixed(2)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {pendingInvoices.length > 0 && (
                <Card className="dark:bg-gray-800 dark:border-gray-700 border-yellow-200 dark:border-yellow-900/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-yellow-700 dark:text-yellow-400">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Pending Bills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingInvoices.map(invoice => (
                      <div key={invoice.id} className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium dark:text-gray-300">{invoice.id}</span>
                          <Badge className={
                            invoice.status === 'overdue' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Due: {invoice.dueDate}</span>
                          <span className="text-sm font-medium dark:text-yellow-300">${invoice.amount.toFixed(2)}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2 h-8 text-xs w-full dark:bg-gray-700 dark:border-gray-600"
                          onClick={() => handleMarkAsPaid(invoice.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Mark as Paid
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="lg:col-span-2">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 dark:bg-gray-800">
                  <TabsTrigger value="orders" className="dark:data-[state=active]:bg-gray-700">Orders</TabsTrigger>
                  <TabsTrigger value="payments" className="dark:data-[state=active]:bg-gray-700">Payments</TabsTrigger>
                  <TabsTrigger value="invoices" className="dark:data-[state=active]:bg-gray-700">Invoices</TabsTrigger>
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
                                  {payment.invoiceNumber && (
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                      Invoice: {payment.invoiceNumber}
                                    </div>
                                  )}
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
                              {payment.status === 'pending' && payment.dueDate && (
                                <div className="mt-2 pt-2 border-t dark:border-gray-700">
                                  <div className="flex justify-between items-center">
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400">Due: {payment.dueDate}</p>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs dark:bg-gray-700 dark:border-gray-600"
                                      onClick={() => handleMarkAsPaid(payment.invoiceNumber || '')}
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Mark as Paid
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="invoices">
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="dark:text-white">Invoice History</CardTitle>
                        <CardDescription className="dark:text-gray-400">
                          All invoices issued to this customer
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="dark:text-gray-300 dark:border-gray-600">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {invoices.length === 0 ? (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No invoices found</p>
                        ) : (
                          invoices.map((invoice) => (
                            <div 
                              key={invoice.id} 
                              className="rounded-lg border dark:border-gray-700 overflow-hidden"
                            >
                              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium dark:text-white">{invoice.id}</h4>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Issued: {invoice.date} | Due: {invoice.dueDate}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge 
                                    className={
                                      invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                    }
                                  >
                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                  </Badge>
                                  {invoice.status !== 'paid' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-7 text-xs dark:bg-gray-700 dark:border-gray-600"
                                      onClick={() => handleMarkAsPaid(invoice.id)}
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Mark as Paid
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="border-b dark:border-gray-700 pb-2 mb-2">
                                  <div className="grid grid-cols-5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    <div className="col-span-2">Description</div>
                                    <div className="text-center">Quantity</div>
                                    <div className="text-right">Price</div>
                                    <div className="text-right">Total</div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {invoice.items.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-5 text-sm dark:text-gray-300">
                                      <div className="col-span-2">{item.description}</div>
                                      <div className="text-center">{item.quantity}</div>
                                      <div className="text-right">${item.price.toFixed(2)}</div>
                                      <div className="text-right">${(item.quantity * item.price).toFixed(2)}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end">
                                  <div className="w-1/3">
                                    <div className="flex justify-between text-sm">
                                      <span className="font-medium dark:text-gray-300">Total:</span>
                                      <span className="font-bold dark:text-white">${invoice.amount.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center border-t dark:border-gray-700">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="dark:bg-gray-700 dark:border-gray-600"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Send a Copy
                                </Button>
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

