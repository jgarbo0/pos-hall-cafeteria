
import React, { useState } from 'react';
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
import { Receipt, CheckCircle, Clock, Eye, Edit, Trash, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for orders
const initialOrders = [
  {
    id: "ORD-3421",
    tableNumber: 5,
    type: "Dine In",
    items: 4,
    total: 42.50,
    status: "completed",
    date: "2023-10-15 12:34 PM"
  },
  {
    id: "ORD-3422",
    tableNumber: null,
    type: "Take Away",
    items: 2,
    total: 18.75,
    status: "completed",
    date: "2023-10-15 12:45 PM"
  },
  {
    id: "ORD-3423",
    tableNumber: 3,
    type: "Dine In",
    items: 6,
    total: 87.20,
    status: "processing",
    date: "2023-10-15 1:05 PM"
  },
  {
    id: "ORD-3424",
    tableNumber: null,
    type: "Take Away",
    items: 1,
    total: 12.99,
    status: "processing",
    date: "2023-10-15 1:15 PM"
  }
];

// Order interface
interface Order {
  id: string;
  tableNumber: number | null;
  type: "Dine In" | "Take Away";
  items: number;
  total: number;
  status: "processing" | "completed";
  date: string;
}

// Order form data interface
interface OrderFormData {
  tableNumber: number | null;
  type: "Dine In" | "Take Away";
  items: number;
  total: number;
  status: "processing" | "completed";
}

const Orders = () => {
  const [activeTab, setActiveTab] = useState("processing");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    tableNumber: null,
    type: "Dine In",
    items: 1,
    total: 0,
    status: "processing"
  });
  
  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setFormData({
      tableNumber: order.tableNumber,
      type: order.type,
      items: order.items,
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
      type: "Dine In",
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    const updatedOrders = orders.map(order => 
      order.id === currentOrder.id 
        ? { ...order, ...formData }
        : order
    );
    
    setOrders(updatedOrders);
    setIsEditDialogOpen(false);
    toast.success(`Order ${currentOrder.id} has been updated.`);
  };

  const handleAddOrder = () => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      date: new Date().toLocaleString()
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
          
          <Tabs defaultValue="processing" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
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
                          <TableCell className="dark:text-gray-300">{order.type}</TableCell>
                          <TableCell className="dark:text-gray-300">
                            {order.tableNumber ? `Table ${order.tableNumber}` : 'N/A'}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">{order.items}</TableCell>
                          <TableCell className="dark:text-gray-300">${order.total.toFixed(2)}</TableCell>
                          <TableCell className="dark:text-gray-300">{order.date}</TableCell>
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
            </TabsContent>
          </Tabs>
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
                    <p className="font-medium dark:text-white">{currentOrder.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                    <p className="font-medium dark:text-white">{currentOrder.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Table</p>
                    <p className="font-medium dark:text-white">{currentOrder.tableNumber ? `Table ${currentOrder.tableNumber}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
                    <p className="font-medium dark:text-white">{currentOrder.items}</p>
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
                <label htmlFor="type" className="text-sm dark:text-white">Order Type</label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
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
                  disabled={formData.type === "Take Away"}
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
                  onValueChange={(value) => handleSelectChange('status', value as "processing" | "completed")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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
                <label htmlFor="add-type" className="text-sm dark:text-white">Order Type</label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
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
                  disabled={formData.type === "Take Away"}
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
                  onValueChange={(value) => handleSelectChange('status', value as "processing" | "completed")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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
