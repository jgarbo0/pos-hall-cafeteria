
import React, { useState, useEffect } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { Order, OrderType } from '@/types';
import { getOrders } from '@/services/SupabaseService';
import { updateOrderPaymentStatus } from '@/services/TablesService';

// Import the refactored components
import OrdersHeader from '@/components/orders/OrdersHeader';
import OrdersSummaryCards from '@/components/orders/OrdersSummaryCards';
import OrdersFilters from '@/components/orders/OrdersFilters';
import OrdersTable from '@/components/orders/OrdersTable';
import ViewOrderDialog from '@/components/orders/dialogs/ViewOrderDialog';
import PrintOrderDialog from '@/components/orders/dialogs/PrintOrderDialog';
import EditOrderDialog from '@/components/orders/dialogs/EditOrderDialog';
import DeleteOrderDialog from '@/components/orders/dialogs/DeleteOrderDialog';
import AddOrderDialog from '@/components/orders/dialogs/AddOrderDialog';

// Import utility functions
import { 
  formatTimestamp, 
  displayOrderCustomerName, 
  createPrintPreview,
  calculateOrderSummary,
  filterOrders
} from '@/utils/orderUtils';

interface OrderFormData {
  tableNumber: number | null;
  orderType: OrderType;
  items: number; 
  total: number;
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
    todaySales: 0
  });
  const [formData, setFormData] = useState<OrderFormData>({
    tableNumber: null,
    orderType: "Dine In",
    items: 1,
    total: 0,
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
  
  const fetchOrders = async () => {
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
  };

  const filteredOrders = filterOrders(orders, activeTab, dateRange, searchTerm);

  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsViewDialogOpen(true);
  };

  const handlePrintOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsPrintDialogOpen(true);
  };

  const handlePrintPreview = () => {
    if (!currentOrder) return;
    const printWindow = createPrintPreview(currentOrder);
    setIsPrintDialogOpen(false);
  };

  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setFormData({
      tableNumber: order.tableNumber,
      orderType: order.orderType,
      items: order.items.length,
      total: order.total,
      status: order.status === "processing" ? "processing" : order.status,
      customerName: order.customerName || 'Walk-in Customer'
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
      status: "processing",
      customerName: 'Walk-in Customer'
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
    
    const updatedOrders = orders.map(order => 
      order.id === currentOrder.id 
        ? { 
            ...order,
            tableNumber: formData.tableNumber,
            orderType: formData.orderType,
            total: formData.total,
            status: formData.status,
            customerName: formData.customerName
          }
        : order
    );
    
    setOrders(updatedOrders);
    setIsEditDialogOpen(false);
    toast.success(`Order ${currentOrder.id} has been updated.`);
  };

  const handleAddOrder = () => {
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
    
    setOrders([newOrder, ...orders]);
    setIsAddDialogOpen(false);
    toast.success(`Order ${newOrder.id} has been created.`);
  };

  const handleRefresh = () => {
    fetchOrders();
    toast.success('Orders refreshed');
  };

  const handlePayOrder = async (order: Order) => {
    if (await updateOrderPaymentStatus(order.id, 'paid')) {
      const updatedOrders = orders.map(o => 
        o.id === order.id 
          ? { ...o, paymentStatus: 'paid' as 'paid' | 'pending' }
          : o
      );
      setOrders(updatedOrders);
      
      const summary = calculateOrderSummary(orders);
      setOrderSummary(summary);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={setSearchTerm} />
        
        <div className="flex-1 p-6 overflow-auto">
          <OrdersHeader 
            searchTerm={searchTerm}
            onSearchChange={handleSearchInputChange}
            onRefresh={handleRefresh}
            onAddNew={handleAddNewClick}
          />
          
          <OrdersSummaryCards summary={orderSummary} />
          
          <OrdersFilters 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          
          <OrdersTable 
            isLoading={isLoading}
            filteredOrders={filteredOrders}
            searchTerm={searchTerm}
            onViewOrder={handleViewOrder}
            onPrintOrder={handlePrintOrder}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
            onPayOrder={handlePayOrder}
            formatTimestamp={formatTimestamp}
            displayCustomerName={displayOrderCustomerName}
          />
        </div>
      </div>

      <ViewOrderDialog 
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        currentOrder={currentOrder}
        onPrint={() => handlePrintOrder(currentOrder!)}
        formatTimestamp={formatTimestamp}
        displayCustomerName={displayOrderCustomerName}
      />

      <PrintOrderDialog 
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        currentOrder={currentOrder}
        onPrintPreview={handlePrintPreview}
      />

      <EditOrderDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        currentOrder={currentOrder}
        formData={formData}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onUpdate={handleUpdateOrder}
      />

      <DeleteOrderDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        currentOrder={currentOrder}
        onConfirmDelete={handleConfirmDelete}
      />

      <AddOrderDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onAdd={handleAddOrder}
      />
    </div>
  );
};

export default Orders;
