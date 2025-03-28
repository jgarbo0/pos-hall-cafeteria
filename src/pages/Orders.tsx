import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Receipt, 
  CheckCircle, 
  Clock, 
  Eye, 
  Edit, 
  Trash, 
  Plus, 
  Calendar, 
  ChevronDown, 
  Printer,
  FileText,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { Order, OrderType, CartItem } from '@/types';
import { format, parse, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getOrders } from '@/services/SupabaseService';
import { Card, CardContent } from '@/components/ui/card';
import { updateOrderPaymentStatus } from '@/services/TablesService';

interface OrderFormData {
  tableNumber: number | null;
  orderType: OrderType;
  items: number; 
  total: number;
  discount?: number;
  status: "processing" | "completed" | "cancelled";
  customerName: string;
}

type DateRange = 'all' | 'today' | 'week' | 'month';

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSummary, setOrderSummary] = useState({
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
    todaySales: 0,
    totalDiscounts: 0
  });
  const [formData, setFormData] = useState<OrderFormData>({
    tableNumber: null,
    orderType: "Dine In",
    items: 1,
    total: 0,
    discount: 0,
    status: "completed",
    customerName: 'Walk-in Customer'
  });
  
  useEffect(() => {
    document.title = "Doob Café - Orders/Sales";
    fetchOrders();
  }, []);
  
  useEffect(() => {
    const summary = calculateOrderSummary(orders);
    setOrderSummary(summary);
  }, [orders]);
  
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatTimestamp = useCallback((timestamp: string): string => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return timestamp;
    }
  }, []);
  
  const calculateOrderSummary = useCallback((ordersList: Order[]) => {
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    
    const totalOrders = ordersList.length;
    const paidOrders = ordersList.filter(order => order.paymentStatus === 'paid').length;
    const pendingOrders = ordersList.filter(order => order.paymentStatus === 'pending').length;
    
    const totalSales = ordersList.reduce((sum, order) => sum + order.total, 0);
    const todaySales = ordersList
      .filter(order => format(new Date(order.timestamp), 'yyyy-MM-dd') === todayString)
      .reduce((sum, order) => sum + order.total, 0);
    
    const totalDiscounts = ordersList.reduce((sum, order) => sum + (order.discount || 0), 0);
    
    return {
      totalOrders,
      paidOrders,
      pendingOrders,
      totalSales,
      todaySales,
      totalDiscounts
    };
  }, []);
  
  const filteredOrders = useMemo(() => {
    const today = new Date();
    
    let filtered = orders.filter(order => {
      if (activeTab === "all") return true;
      return order.status === activeTab;
    });
    
    if (dateRange !== 'all') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.timestamp.split(' ')[0]);
        
        if (dateRange === 'today') {
          return format(orderDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
        }
        
        if (dateRange === 'week') {
          const weekStart = startOfWeek(today);
          const weekEnd = endOfWeek(today);
          return isWithinInterval(orderDate, { start: weekStart, end: weekEnd });
        }
        
        if (dateRange === 'month') {
          const monthStart = startOfMonth(today);
          const monthEnd = endOfMonth(today);
          return isWithinInterval(orderDate, { start: monthStart, end: monthEnd });
        }
        
        return true;
      });
    }
    
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
        order.orderType.toLowerCase().includes(searchLower) ||
        order.total.toString().includes(searchLower)
      );
    }
    
    return filtered;
  }, [orders, activeTab, dateRange, searchTerm]);

  const handleViewOrder = useCallback((order: Order) => {
    setCurrentOrder(order);
    setIsViewDialogOpen(true);
  }, []);

  const handlePrintOrder = useCallback((order: Order) => {
    setCurrentOrder(order);
    setIsPrintDialogOpen(true);
  }, []);

  const handlePrintPreview = useCallback(() => {
    if (!currentOrder) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups for this site.');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${currentOrder.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; font-size: 18px; }
            .header { text-align: center; margin-bottom: 20px; }
            .order-info { margin-bottom: 20px; }
            .order-info div { margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .totals { margin-top: 20px; text-align: right; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; }
            @media print {
              .no-print { display: none; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Doob Café</h1>
            <p>Order Receipt</p>
          </div>
          
          <div class="order-info">
            <div><strong>Order #:</strong> ${currentOrder.orderNumber}</div>
            <div><strong>Date:</strong> ${formatTimestamp(currentOrder.timestamp)}</div>
            <div><strong>Type:</strong> ${currentOrder.orderType}</div>
            ${currentOrder.tableNumber ? `<div><strong>Table:</strong> ${currentOrder.tableNumber}</div>` : ''}
            <div><strong>Status:</strong> ${currentOrder.status}</div>
            <div><strong>Payment:</strong> ${currentOrder.paymentStatus || 'Paid'}</div>
            <div><strong>Customer:</strong> ${currentOrder.customerName || 'Walk-in Customer'}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${currentOrder.items.map(item => `
                <tr>
                  <td>${item.title}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div><strong>Subtotal:</strong> $${currentOrder.subtotal.toFixed(2)}</div>
            <div><strong>Tax:</strong> $${currentOrder.tax.toFixed(2)}</div>
            <div><strong>Total:</strong> $${currentOrder.total.toFixed(2)}</div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
          
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()">Print Receipt</button>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
    
    setIsPrintDialogOpen(false);
  }, [currentOrder, formatTimestamp]);

  const handleEditOrder = useCallback((order: Order) => {
    setCurrentOrder(order);
    setFormData({
      tableNumber: order.tableNumber,
      orderType: order.orderType,
      items: order.items.length,
      total: order.total,
      discount: order.discount,
      status: order.status === "processing" ? "processing" : order.status,
      customerName: order.customerName || 'Walk-in Customer'
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteOrder = useCallback((order: Order) => {
    setCurrentOrder(order);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleAddNewClick = useCallback(() => {
    setFormData({
      tableNumber: null,
      orderType: "Dine In",
      items: 1,
      total: 0,
      discount: 0,
      status: "processing",
      customerName: 'Walk-in Customer'
    });
    setIsAddDialogOpen(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'items' || name === 'total' || name === 'tableNumber' 
        ? value === '' ? null : Number(value)
        : value
    }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    if (name === 'orderType') {
      setFormData(prev => ({
        ...prev,
        [name]: value as OrderType,
      }));
    } else if (name === 'status') {
      setFormData(prev => ({
        ...prev,
        [name]: value as "processing" | "completed" | "cancelled",
      }));
    }
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!currentOrder) return;
    
    setOrders(prevOrders => prevOrders.filter(order => order.id !== currentOrder.id));
    setIsDeleteDialogOpen(false);
    toast.success(`Order ${currentOrder.id} has been deleted.`);
  }, [currentOrder]);

  const handleUpdateOrder = useCallback(() => {
    if (!currentOrder) return;
    
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === currentOrder.id 
        ? { 
            ...order,
            tableNumber: formData.tableNumber,
            orderType: formData.orderType,
            total: formData.total,
            status: formData.status,
            customerName: formData.customerName,
            discount: formData.discount
          }
        : order
    ));
    
    setIsEditDialogOpen(false);
    toast.success(`Order ${currentOrder.id} has been updated.`);
  }, [currentOrder, formData]);

  const handleAddOrder = useCallback(() => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [],
      orderType: formData.orderType,
      tableNumber: formData.tableNumber,
      orderNumber: Math.floor(1000 + Math.random() * 9000).toString(),
      subtotal: formData.total * 0.85,
      tax: formData.total * 0.15,
      total: formData.total,
      status: formData.status,
      timestamp: new Date().toLocaleString(),
      customerName: formData.customerName,
      paymentStatus: 'paid'
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setIsAddDialogOpen(false);
    toast.success(`Order ${newOrder.id} has been created.`);
  }, [formData]);

  const handleRefresh = useCallback(() => {
    fetchOrders();
    toast.success('Orders refreshed');
  }, [fetchOrders]);

  const displayCustomerName = useCallback((customerName?: string): string => {
    return customerName && customerName.trim() !== '' ? customerName : 'Walk-in Customer';
  }, []);

  const handlePayOrder = useCallback(async (order: Order) => {
    try {
      const success = await updateOrderPaymentStatus(order.id, 'paid');
      if (success) {
        setOrders(prevOrders => prevOrders.map(o => 
          o.id === order.id 
            ? { ...o, paymentStatus: 'paid' as 'paid' | 'pending' }
            : o
        ));
        
        toast.success(`Payment for order #${order.orderNumber} has been processed.`);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to process payment');
    }
  }, []);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={setSearchTerm} />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold dark:text-white">Orders/Sales Management</h1>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search orders..." 
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="pl-8"
                />
              </div>
              <Button onClick={handleRefresh} variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleAddNewClick}>
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button>
              <Button variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex flex-col justify-center items-center">
                <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="text-xl font-bold dark:text-white">{orderSummary.totalOrders}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col justify-center items-center">
                <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{orderSummary.paidOrders}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Paid Orders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col justify-center items-center">
                <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                </div>
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{orderSummary.pendingOrders}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Payments</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col justify-center items-center">
                <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900">
                  <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="text-xl font-bold dark:text-white">${orderSummary.totalSales.toFixed(2)}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col justify-center items-center">
                <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <CreditCard className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div className="text-xl font-bold dark:text-white">${orderSummary.todaySales.toFixed(2)}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Today's Sales</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col justify-center items-center">
                <div className="mb-2 mt-2 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  ${(orderSummary.totalDiscounts || 0).toFixed(2)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Discounts</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="dark:bg-gray-800">
                <TabsTrigger value="all" className="dark:data-[state=active]:bg-gray-700">All Orders</TabsTrigger>
                <TabsTrigger value="processing" className="dark:data-[state=active]:bg-gray-700">Processing</TabsTrigger>
                <TabsTrigger value="completed" className="dark:data-[state=active]:bg-gray-700">Completed</TabsTrigger>
                <TabsTrigger value="cancelled" className="dark:data-[state=active]:bg-gray-700">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {dateRange === 'all' ? 'All Time' : 
                   dateRange === 'today' ? 'Today' : 
                   dateRange === 'week' ? 'This Week' : 'This Month'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setDateRange('all')}>
                  All Time
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDateRange('today')}>
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDateRange('week')}>
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDateRange('month')}>
                  This Month
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="dark:text-gray-300">Order ID</TableHead>
                    <TableHead className="dark:text-gray-300">Customer</TableHead>
                    <TableHead className="dark:text-gray-300">Type</TableHead>
                    <TableHead className="dark:text-gray-300">Table</TableHead>
                    <TableHead className="dark:text-gray-300">Items</TableHead>
                    <TableHead className="dark:text-gray-300">Total</TableHead>
                    <TableHead className="dark:text-gray-300">Discount</TableHead>
                    <TableHead className="dark:text-gray-300">Date</TableHead>
                    <TableHead className="dark:text-gray-300">Status</TableHead>
                    <TableHead className="dark:text-gray-300">Payment</TableHead>
                    <TableHead className="dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow className="dark:border-gray-700">
                      <TableCell colSpan={11} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'No matching orders found' : 'No orders found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="dark:border-gray-700">
                        <TableCell className="font-medium dark:text-white">{order.orderNumber}</TableCell>
                        <TableCell className="dark:text-gray-300">{displayCustomerName(order.customerName)}</TableCell>
                        <TableCell className="dark:text-gray-300">{order.orderType}</TableCell>
                        <TableCell className="dark:text-gray-300">
                          {order.tableNumber ? `Table ${order.tableNumber}` : 'N/A'}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">{order.items.length}</TableCell>
                        <TableCell className="dark:text-gray-300">${order.total.toFixed(2)}</TableCell>
                        <TableCell className="dark:text-gray-300">
                          {order.discount && order.discount > 0 
                            ? <span className="text-green-600">${Number(order.discount).toFixed(2)}</span> 
                            : '$0.00'}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">{formatTimestamp(order.timestamp)}</TableCell>
                        <TableCell>
                          <div className={`flex items-center space-x-1 ${
                            order.status === 'completed' ? 'text-green-600 dark:text-green-500' : 'text-amber-500'
                          }`}>
                            {order.status === 'completed' ? (
                              <>
                                <CheckCircle size={16} />
                                <span>Completed</span>
                              </>
                            ) : order.status === 'cancelled' ? (
                              <>
                                <Trash size={16} />
                                <span>Cancelled</span>
                              </>
                            ) : (
                              <>
                                <Clock size={16} />
                                <span>{order.status}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`${
                            order.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-500' : 'text-orange-500'
                          }`}>
                            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handlePrintOrder(order)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditOrder(order)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDeleteOrder(order)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                            {order.paymentStatus === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600"
                                onClick={() => handlePayOrder(order)}
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {currentOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order #</p>
                    <p className="font-medium dark:text-white">{currentOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                    <p className="font-medium dark:text-white">{displayCustomerName(currentOrder.customerName)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-medium dark:text-white">{formatTimestamp(currentOrder.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                    <p className="font-medium dark:text-white">{currentOrder.orderType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Table</p>
                    <p className="font-medium dark:text-white">{currentOrder.tableNumber ? `Table ${currentOrder.tableNumber}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <div className={`flex items-center space-x-1 ${
                      currentOrder.status === 'completed' ? 'text-green-600 dark:text-green-500' : 'text-amber-500'
                    }`}>
                      {currentOrder.status === 'completed' ? (
                        <>
                          <CheckCircle size={16} />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock size={16} />
                          <span>{currentOrder.status}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                    <p className={`font-medium ${
                      currentOrder.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-500' : 'text-orange-500'
                    }`}>
                      {currentOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                  {currentOrder.discount && currentOrder.discount > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Discount</p>
                      <p className="font-medium text-green-600 dark:text-green-500">
                        ${Number(currentOrder.discount).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Order Items</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700">
                    <Table>
                      <TableHeader>
                        <TableRow className="dark:border-gray-700">
                          <TableHead className="dark:text-gray-300">Item</TableHead>
                          <TableHead className="dark:text-gray-300">Price</TableHead>
                          <TableHead className="dark:text-gray-300">Qty</TableHead>
                          <TableHead className="dark:text-gray-300">Discount</TableHead>
                          <TableHead className="dark:text-gray-300 text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentOrder.items.length === 0 ? (
                          <TableRow className="dark:border-gray-700">
                            <TableCell colSpan={5} className="text-center py-4 text-gray-500 dark:text-gray-400">
                              No items
                            </TableCell>
                          </TableRow>
                        ) : (
                          currentOrder.items.map((item, index) => {
                            const itemDiscount = item.discount ? (item.price * item.quantity * item.discount / 100) : 0;
                            const totalAfterDiscount = (item.price * item.quantity) - itemDiscount;
                            
                            return (
                              <TableRow key={index} className="dark:border-gray-700">
                                <TableCell className="font-medium dark:text-white">{item.title}</TableCell>
                                <TableCell className="dark:text-gray-300">${item.price.toFixed(2)}</TableCell>
                                <TableCell className="dark:text-gray-300">{item.quantity}</TableCell>
                                <TableCell className="dark:text-gray-300">
                                  {item.discount ? (
                                    <span className="text-green-600">${itemDiscount.toFixed(2)}</span>
                                  ) : '$0.00'}
                                </TableCell>
                                <TableCell className="dark:text-gray-300 text-right">
                                  ${totalAfterDiscount.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div className="space-y-1 text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Subtotal: <span className="font-medium dark:text-white">${currentOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {currentOrder.discount && currentOrder.discount > 0 && (
                    <div className="text-sm text-green-600 dark:text-green-500">
                      Discount: <span className="font-medium">-${Number(currentOrder.discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Tax: <span className="font-medium dark:text-white">${currentOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="text-base font-medium dark:text-white">
                    Total: ${currentOrder.total.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handlePrintOrder(currentOrder!)}>
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Print Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="dark:text-white">Ready to print order #{currentOrder?.orderNumber}?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePrintPreview}>
              <Printer className="mr-2 h-4 w-4" />
              Print Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-2">
                <label htmlFor="customerName" className="text-sm dark:text-white">Customer Name</label>
                <Input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="orderType" className="text-sm dark:text-white">Order Type</label>
                <Select 
                  value={formData.orderType} 
                  onValueChange={(value) => handleSelectChange('orderType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dine In">Dine In</SelectItem>
                    <SelectItem value="Take Away">Take Away</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="tableNumber" className="text-sm dark:text-white">Table Number</label>
                <Input
                  id="tableNumber"
                  name="tableNumber"
                  type="number"
                  value={formData.tableNumber === null ? '' : formData.tableNumber}
                  onChange={handleInputChange}
                  disabled={formData.orderType === "Take Away"}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="items" className="text-sm dark:text-white">Items</label>
                <Input
                  id="items"
                  name="items"
                  type="number"
                  value={formData.items}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="total" className="text-sm dark:text-white">Total</label>
                <Input
                  id="total"
                  name="total"
                  type="number"
                  value={formData.total}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="discount" className="text-sm dark:text-white">Discount</label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={formData.discount || 0}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm dark:text-white">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateOrder}>Update Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="dark:text-white">Are you sure you want to delete order #{currentOrder?.orderNumber}?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-2">
                <label htmlFor="customerName" className="text-sm dark:text-white">Customer Name</label>
                <Input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="orderType" className="text-sm dark:text-white">Order Type</label>
                <Select 
                  value={formData.orderType} 
                  onValueChange={(value) => handleSelectChange('orderType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dine In">Dine In</SelectItem>
                    <SelectItem value="Take Away">Take Away</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="tableNumber" className="text-sm dark:text-white">Table Number</label>
                <Input
                  id="tableNumber"
                  name="tableNumber"
                  type="number"
                  value={formData.tableNumber === null ? '' : formData.tableNumber}
                  onChange={handleInputChange}
                  disabled={formData.orderType === "Take Away"}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="items" className="text-sm dark:text-white">Items</label>
                <Input
                  id="items"
                  name="items"
                  type="number"
                  value={formData.items}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="total" className="text-sm dark:text-white">Total</label>
                <Input
                  id="total"
                  name="total"
                  type="number"
                  value={formData.total}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="discount" className="text-sm dark:text-white">Discount</label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={formData.discount || 0}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm dark:text-white">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddOrder}>Create Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
