
import React, { useState, useEffect } from 'react';
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
import { Receipt, CheckCircle, Clock, Eye, Edit, Trash, Plus, Calendar, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Order, OrderType } from '@/types';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Modified mock data to match the Order type exactly
const initialOrders: Order[] = [
  {
    id: "ORD-3421",
    items: [],
    orderType: "Dine In",
    tableNumber: 5,
    orderNumber: "3421",
    subtotal: 35.00,
    tax: 7.50,
    total: 42.50,
    status: "completed",
    timestamp: "2023-10-15 12:34 PM"
  },
  {
    id: "ORD-3422",
    items: [],
    orderType: "Take Away",
    tableNumber: null,
    orderNumber: "3422",
    subtotal: 15.75,
    tax: 3.00,
    total: 18.75,
    status: "completed",
    timestamp: "2023-10-16 12:45 PM"
  },
  {
    id: "ORD-3423",
    items: [],
    orderType: "Dine In",
    tableNumber: 3,
    orderNumber: "3423",
    subtotal: 72.66,
    tax: 14.54,
    total: 87.20,
    status: "processing",
    timestamp: "2023-10-17 1:05 PM"
  },
  {
    id: "ORD-3424",
    items: [],
    orderType: "Take Away",
    tableNumber: null,
    orderNumber: "3424",
    subtotal: 10.82,
    tax: 2.17,
    total: 12.99,
    status: "processing",
    timestamp: format(new Date(), "yyyy-MM-dd h:mm a")
  }
];

// Order form data interface that matches our Order type
interface OrderFormData {
  tableNumber: number | null;
  orderType: OrderType;
  items: number; // We'll just track count here for form
  total: number;
  status: "processing" | "completed" | "cancelled";
}

type DateRange = 'all' | 'today' | 'week' | 'month';

const Orders = () => {
  const [activeTab, setActiveTab] = useState("processing");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [formData, setFormData] = useState<OrderFormData>({
    tableNumber: null,
    orderType: "Dine In",
    items: 1,
    total: 0,
    status: "processing"
  });
  
  const getFilteredOrders = () => {
    const today = new Date();
    
    // First filter by status
    let filtered = orders.filter(order => {
      if (activeTab === "all") return true;
      return order.status === activeTab;
    });
    
    // Then filter by date range
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
    
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setFormData({
      tableNumber: order.tableNumber,
      orderType: order.orderType,
      items: order.items.length,
      total: order.total,
      status: order.status
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setFormData({
      tableNumber: null,
      orderType: "Dine In",
      items: 1,
      total: 0,
      status: "processing"
    });
    setIsAddDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'items' || name === 'total' || name === 'tableNumber' 
        ? value === '' ? null : Number(value)
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
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
  };

  const handleConfirmDelete = () => {
    if (!currentOrder) return;
    
    const updatedOrders = orders.filter(order => order.id !== currentOrder.id);
    setOrders(updatedOrders);
    setIsDeleteDialogOpen(false);
    toast.success(`Order ${currentOrder.id} has been deleted.`);
  };

  const handleUpdateOrder = () => {
    if (!currentOrder) return;
    
    // Update the order with the new data, ensuring it matches the Order type
    const updatedOrders = orders.map(order => 
      order.id === currentOrder.id 
        ? { 
            ...order,
            tableNumber: formData.tableNumber,
            orderType: formData.orderType,
            total: formData.total,
            status: formData.status
          }
        : order
    );
    
    setOrders(updatedOrders);
    setIsEditDialogOpen(false);
    toast.success(`Order ${currentOrder.id} has been updated.`);
  };

  const handleAddOrder = () => {
    // Create a new order that matches the Order type
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [],
      orderType: formData.orderType,
      tableNumber: formData.tableNumber,
      orderNumber: Math.floor(1000 + Math.random() * 9000).toString(),
      subtotal: formData.total * 0.85, // Just for demo: subtracting estimated tax
      tax: formData.total * 0.15,
      total: formData.total,
      status: formData.status,
      timestamp: new Date().toLocaleString()
    };
    
    setOrders([newOrder, ...orders]);
    setIsAddDialogOpen(false);
    toast.success(`Order ${newOrder.id} has been created.`);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold dark:text-white">Orders Management</h1>
            <div className="flex gap-2">
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
          
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="processing" onValueChange={setActiveTab}>
              <TabsList className="dark:bg-gray-800">
                <TabsTrigger value="processing" className="dark:data-[state=active]:bg-gray-700">Processing</TabsTrigger>
                <TabsTrigger value="completed" className="dark:data-[state=active]:bg-gray-700">Completed</TabsTrigger>
                <TabsTrigger value="all" className="dark:data-[state=active]:bg-gray-700">All Orders</TabsTrigger>
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
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-300">Order ID</TableHead>
                  <TableHead className="dark:text-gray-300">Type</TableHead>
                  <TableHead className="dark:text-gray-300">Table</TableHead>
                  <TableHead className="dark:text-gray-300">Items</TableHead>
                  <TableHead className="dark:text-gray-300">Total</TableHead>
                  <TableHead className="dark:text-gray-300">Date</TableHead>
                  <TableHead className="dark:text-gray-300">Status</TableHead>
                  <TableHead className="dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow className="dark:border-gray-700">
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="dark:border-gray-700">
                      <TableCell className="font-medium dark:text-white">{order.id}</TableCell>
                      <TableCell className="dark:text-gray-300">{order.orderType}</TableCell>
                      <TableCell className="dark:text-gray-300">
                        {order.tableNumber ? `Table ${order.tableNumber}` : 'N/A'}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{order.items.length}</TableCell>
                      <TableCell className="dark:text-gray-300">${order.total.toFixed(2)}</TableCell>
                      <TableCell className="dark:text-gray-300">{order.timestamp}</TableCell>
                      <TableCell>
                        <div className={`flex items-center space-x-1 ${
                          order.status === 'completed' ? 'text-green-600 dark:text-green-500' : 'text-amber-500'
                        }`}>
                          {order.status === 'completed' ? (
                            <>
                              <CheckCircle size={16} />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock size={16} />
                              <span>Processing</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditOrder(order)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDeleteOrder(order)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {currentOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <p className="font-medium dark:text-white">{currentOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-medium dark:text-white">{currentOrder.timestamp}</p>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
                    <p className="font-medium dark:text-white">{currentOrder.items.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="font-medium dark:text-white">${currentOrder.total.toFixed(2)}</p>
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
                          <span>Processing</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
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
                  step="0.01"
                  value={formData.total}
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

      {/* Delete Order Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="dark:text-white">Are you sure you want to delete order {currentOrder?.id}?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Order Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="add-orderType" className="text-sm dark:text-white">Order Type</label>
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
                <label htmlFor="add-tableNumber" className="text-sm dark:text-white">Table Number</label>
                <Input
                  id="add-tableNumber"
                  name="tableNumber"
                  type="number"
                  value={formData.tableNumber === null ? '' : formData.tableNumber}
                  onChange={handleInputChange}
                  disabled={formData.orderType === "Take Away"}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="add-items" className="text-sm dark:text-white">Items</label>
                <Input
                  id="add-items"
                  name="items"
                  type="number"
                  value={formData.items}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="add-total" className="text-sm dark:text-white">Total</label>
                <Input
                  id="add-total"
                  name="total"
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="add-status" className="text-sm dark:text-white">Status</label>
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
