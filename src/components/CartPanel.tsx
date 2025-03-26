
import React, { useEffect } from 'react';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { ShoppingBag, ClipboardList } from 'lucide-react';
import { CartItem, Customer } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCartPanel } from '@/hooks/useCartPanel';
import { getCustomerName, printReceipt } from '@/utils/cartUtils';

// Import the components we just created
import CartHeader from './cart/CartHeader';
import CartControls from './cart/CartControls';
import CartItems from './cart/CartItems';
import CartDiscount from './cart/CartDiscount';
import CartSummary from './cart/CartSummary';
import CartOrdersList from './cart/CartOrdersList';

interface CartPanelProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (paymentStatus: 'paid' | 'pending', globalDiscount: number, discountType: string) => void;
  orderNumber: string;
  tableNumber: number;
  customers?: Customer[];
  selectedCustomer?: string;
  onCustomerChange?: (customerId: string) => void;
  orderType?: 'Dine In' | 'Take Away';
  onOrderTypeChange?: (type: 'Dine In' | 'Take Away') => void;
  onTableChange?: (tableNumber: number) => void;
}

const CartPanel: React.FC<CartPanelProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onPlaceOrder,
  orderNumber,
  tableNumber,
  customers = [],
  selectedCustomer = 'Walk-in Customer',
  onCustomerChange = () => {},
  orderType = 'Dine In',
  onOrderTypeChange = () => {},
  onTableChange = () => {}
}) => {
  const navigate = useNavigate();
  const { 
    recentOrders,
    activeTab, 
    setActiveTab,
    availableTables,
    fetchAvailableTables,
    globalDiscount, 
    setGlobalDiscount,
    discountType, 
    setDiscountType,
    itemDiscounts,
    applyItemDiscount,
    clearItemDiscount,
    fetchRecentOrders,
    calculatePricing,
    taxRate
  } = useCartPanel();

  const pricing = calculatePricing(items);
  const isWalkInCustomer = selectedCustomer === 'Walk-in Customer';

  useEffect(() => {
    fetchAvailableTables(orderType);
  }, [orderType]);

  const handleCompleteOrder = (paymentStatus: 'paid' | 'pending') => {
    const itemsWithDiscount = items.map(item => ({
      ...item,
      discount: itemDiscounts[item.id] || 0
    }));
    
    onPlaceOrder(paymentStatus, globalDiscount, discountType);
    
    toast.success(
      `Order #${orderNumber} completed successfully!`,
      {
        action: {
          label: "View Orders",
          onClick: () => navigate('/orders')
        },
        duration: 5000 // Show toast for 5 seconds
      }
    );
    
    setActiveTab("orders");
    fetchRecentOrders();
    
    const printReceiptConfirm = window.confirm("Do you want to print a receipt?");
    if (printReceiptConfirm) {
      handlePrintReceipt();
    }
  };

  const handlePrintReceipt = () => {
    let customerName = 'Walk-in Customer';
    if (selectedCustomer !== 'Walk-in Customer') {
      customerName = getCustomerName(selectedCustomer, customers);
    }
    
    printReceipt(
      orderNumber,
      items,
      customerName,
      orderType,
      tableNumber,
      globalDiscount,
      discountType,
      itemDiscounts,
      pricing.rawSubtotal,
      pricing.discountAmount,
      pricing.tax,
      pricing.total
    );
  };

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col h-full">
      <CartHeader 
        orderNumber={orderNumber}
        activeTab={activeTab}
        onClearCart={onClearCart}
        itemsCount={items.length}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid grid-cols-2 mx-4 mt-2 flex-shrink-0">
          <TabsTrigger value="cart" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Cart
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cart" className="flex-1 flex flex-col overflow-hidden mt-0">
          <CartControls 
            orderType={orderType}
            onOrderTypeChange={onOrderTypeChange}
            tableNumber={tableNumber}
            onTableChange={onTableChange}
            availableTables={availableTables}
            selectedCustomer={selectedCustomer}
            onCustomerChange={onCustomerChange}
            customers={customers}
            fetchAvailableTables={fetchAvailableTables}
          />
          
          <CartItems 
            items={items}
            onRemoveItem={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
            itemDiscounts={itemDiscounts}
            onApplyItemDiscount={applyItemDiscount}
            onClearItemDiscount={clearItemDiscount}
          />

          <CartDiscount 
            globalDiscount={globalDiscount}
            discountType={discountType}
            onDiscountChange={setGlobalDiscount}
            onDiscountTypeChange={setDiscountType}
            hasItems={items.length > 0}
          />
          
          <CartSummary 
            rawSubtotal={pricing.rawSubtotal}
            tax={pricing.tax}
            taxRate={taxRate}
            discountAmount={pricing.discountAmount}
            total={pricing.total}
            hasItems={items.length > 0}
            isWalkInCustomer={isWalkInCustomer}
            onPayNow={() => handleCompleteOrder('paid')}
            onPayLater={() => handleCompleteOrder('pending')}
            onPrintReceipt={handlePrintReceipt}
          />
        </TabsContent>

        <TabsContent value="orders" className="flex-1 flex flex-col overflow-hidden mt-0 pt-0">
          <CartOrdersList orders={recentOrders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CartPanel;
