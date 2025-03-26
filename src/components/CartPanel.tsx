import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Clock, Printer, ClipboardList, Percent } from 'lucide-react';
import { CartItem, Customer, Order } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RestaurantTable, getRestaurantTables } from '@/services/TablesService';

interface CartPanelProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (paymentStatus: 'paid' | 'pending') => void;
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
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("cart");
  const [availableTables, setAvailableTables] = useState<RestaurantTable[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [itemDiscounts, setItemDiscounts] = useState<Record<string, number>>({});

  const rawSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const calculateDiscount = () => {
    if (discountType === 'percentage') {
      return rawSubtotal * (globalDiscount / 100);
    } else {
      return Math.min(globalDiscount, rawSubtotal);
    }
  };

  const itemDiscountTotal = items.reduce((sum, item) => {
    const itemDiscount = itemDiscounts[item.id] || 0;
    return sum + ((item.price * item.quantity) * (itemDiscount / 100));
  }, 0);

  const discountAmount = calculateDiscount() + itemDiscountTotal;
  
  const subtotal = rawSubtotal - discountAmount;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const isWalkInCustomer = selectedCustomer === 'Walk-in Customer';

  useEffect(() => {
    if (activeTab === "orders") {
      fetchRecentOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    if (orderType === 'Dine In') {
      fetchAvailableTables();
    }
  }, [orderType]);

  const fetchRecentOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data) {
        const transformedOrders: Order[] = data.map(order => ({
          id: order.id,
          items: [], // We don't fetch items here for performance reasons
          orderType: order.order_type as 'Dine In' | 'Take Away',
          tableNumber: order.table_number,
          orderNumber: order.order_number,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total,
          status: order.status as 'processing' | 'completed' | 'cancelled',
          paymentStatus: order.payment_status as 'paid' | 'pending',
          timestamp: order.timestamp,
          customerName: order.customer_name || 'Walk-in Customer'
        }));
        
        setRecentOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      toast.error('Failed to load recent orders');
    }
  };

  const fetchAvailableTables = async () => {
    try {
      const tables = await getRestaurantTables();
      setAvailableTables(tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Failed to load tables');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleApplyItemDiscount = (itemId: string, discount: number) => {
    setItemDiscounts(prev => ({
      ...prev,
      [itemId]: discount
    }));
    toast.success(`Discount applied to item: ${discount}%`);
  };

  const handleCompleteOrder = (paymentStatus: 'paid' | 'pending') => {
    const itemsWithDiscount = items.map(item => ({
      ...item,
      discount: itemDiscounts[item.id] || (discountType === 'percentage' ? globalDiscount : 0)
    }));
    
    onPlaceOrder(paymentStatus);
    
    toast.success(
      `Order #${orderNumber} completed successfully!`,
      {
        action: {
          label: "View Orders",
          onClick: () => navigate('/orders')
        },
      }
    );
    
    setActiveTab("orders");
    fetchRecentOrders();
    
    const printReceipt = window.confirm("Do you want to print a receipt?");
    if (printReceipt) {
      handlePrintReceipt();
    }
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups for this site.');
      return;
    }
    
    let customerName = 'Walk-in Customer';
    if (selectedCustomer !== 'Walk-in Customer') {
      const selectedCustomerObj = customers.find(c => c.id === selectedCustomer);
      if (selectedCustomerObj) {
        customerName = selectedCustomerObj.name;
      }
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${orderNumber}</title>
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
            <div><strong>Order #:</strong> ${orderNumber}</div>
            <div><strong>Date:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Type:</strong> ${orderType}</div>
            ${orderType === 'Dine In' ? `<div><strong>Table:</strong> ${tableNumber}</div>` : ''}
            <div><strong>Customer:</strong> ${customerName}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                ${discountAmount > 0 ? '<th>Discount</th>' : ''}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => {
                const itemDiscount = itemDiscounts[item.id] || 0;
                const hasDiscount = itemDiscount > 0 || globalDiscount > 0;
                const discountValue = itemDiscount > 0 ? itemDiscount : (discountType === 'percentage' ? globalDiscount : 0);
                const itemTotal = item.price * item.quantity;
                const discountedTotal = hasDiscount ? 
                  (discountType === 'percentage' ? 
                    itemTotal * (1 - (discountValue / 100)) : 
                    itemTotal - (globalDiscount / items.length)) : 
                  itemTotal;
                
                return `
                  <tr>
                    <td>${item.title}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    ${discountAmount > 0 ? 
                      `<td>${discountValue}${discountType === 'percentage' ? '%' : 'USD'}</td>` : 
                      ''}
                    <td>$${discountedTotal.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div><strong>Subtotal:</strong> $${rawSubtotal.toFixed(2)}</div>
            ${discountAmount > 0 ? 
              `<div><strong>Discount:</strong> -$${discountAmount.toFixed(2)}</div>` : 
              ''}
            <div><strong>Tax:</strong> $${tax.toFixed(2)}</div>
            <div><strong>Total:</strong> $${total.toFixed(2)}</div>
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
  };

  const getCustomerName = (customerId: string) => {
    if (customerId === 'Walk-in Customer') return 'Walk-in Customer';
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Walk-in Customer';
  };

  const displayOrderCustomerName = (customerName?: string): string => {
    return customerName && customerName.trim() !== '' ? customerName : 'Walk-in Customer';
  };

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white">Order #{orderNumber}</h2>
          {activeTab === "cart" && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearCart}
              disabled={items.length === 0}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="cart" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Cart
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cart" className="flex-1 flex flex-col">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <Label htmlFor="order-type" className="text-sm font-medium mb-1 block">
                  Order Type
                </Label>
                <RadioGroup 
                  id="order-type" 
                  className="flex gap-4" 
                  value={orderType} 
                  onValueChange={(value) => onOrderTypeChange(value as 'Dine In' | 'Take Away')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Dine In" id="dine-in" />
                    <Label htmlFor="dine-in" className="cursor-pointer">Dine In</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Take Away" id="take-away" />
                    <Label htmlFor="take-away" className="cursor-pointer">Take Away</Label>
                  </div>
                </RadioGroup>
              </div>

              {orderType === 'Dine In' && (
                <div>
                  <Label htmlFor="table-select" className="text-sm font-medium mb-1 block">
                    Table
                  </Label>
                  <Select 
                    value={tableNumber.toString()} 
                    onValueChange={(value) => onTableChange(parseInt(value))}
                  >
                    <SelectTrigger id="table-select" className="w-full">
                      <SelectValue placeholder="Select a table" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map(table => (
                        <SelectItem 
                          key={table.id} 
                          value={table.name.replace('Table ', '')}
                          disabled={table.status === 'occupied' || table.status === 'reserved'}
                        >
                          {table.name} ({table.seats} seats) - {table.location || 'Main Area'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="customer-select" className="text-sm font-medium mb-1 block">
                  Customer
                </Label>
                <Select value={selectedCustomer} onValueChange={onCustomerChange}>
                  <SelectTrigger id="customer-select" className="w-full">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Walk-in Customer">Walk-in Customer</SelectItem>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {items.length > 0 && (
                <div className="space-y-2 border-t pt-3 mt-3 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="discount-type" className="text-sm font-medium">
                      Discount Type
                    </Label>
                    <div className="flex items-center space-x-2">
                      <RadioGroup 
                        id="discount-type" 
                        className="flex gap-4" 
                        value={discountType} 
                        onValueChange={(value) => setDiscountType(value as 'percentage' | 'fixed')}
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="percentage" id="percentage" />
                          <Label htmlFor="percentage" className="cursor-pointer text-xs">Percentage</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="fixed" id="fixed" />
                          <Label htmlFor="fixed" className="cursor-pointer text-xs">Fixed</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="discount" className="text-sm font-medium mb-1 block">
                      Global Discount {discountType === 'percentage' ? '(%)' : '($)'}
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input 
                          id="discount"
                          type="number" 
                          value={globalDiscount.toString()}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                              setGlobalDiscount(value);
                            } else {
                              setGlobalDiscount(0);
                            }
                          }}
                          min="0"
                          max={discountType === 'percentage' ? "100" : undefined}
                          step="0.01"
                          placeholder={discountType === 'percentage' ? "0-100" : "0.00"}
                          className="pr-8"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          {discountType === 'percentage' ? '%' : '$'}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setGlobalDiscount(0)}
                        size="sm"
                        className="text-xs"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <ShoppingBag className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-center">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => {
                  const itemDiscount = itemDiscounts[item.id] || 0;
                  return (
                    <div key={item.id} className="flex flex-col border-b dark:border-gray-700 pb-4">
                      <div className="flex items-start">
                        <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0 mr-4">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm dark:text-white">{item.title}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">${item.price.toFixed(2)}</p>
                          <div className="flex items-center mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="mx-2 text-sm dark:text-white">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus size={12} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-auto"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                        <div className="ml-2 font-medium text-sm dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <div className="mt-2 flex gap-2 items-center">
                        <div className="flex-1 relative">
                          <Input 
                            type="number" 
                            placeholder="Item discount %" 
                            value={itemDiscount > 0 ? itemDiscount.toString() : ''} 
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value) && value >= 0 && value <= 100) {
                                setItemDiscounts(prev => ({
                                  ...prev,
                                  [item.id]: value
                                }));
                              } else if (e.target.value === '') {
                                setItemDiscounts(prev => {
                                  const newDiscounts = {...prev};
                                  delete newDiscounts[item.id];
                                  return newDiscounts;
                                });
                              }
                            }}
                            min="0"
                            max="100"
                            className="h-8 text-xs pr-7"
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <Percent size={14} className="text-gray-400" />
                          </div>
                        </div>
                        {itemDiscount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => {
                              setItemDiscounts(prev => {
                                const newDiscounts = {...prev};
                                delete newDiscounts[item.id];
                                return newDiscounts;
                              });
                            }}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t dark:border-gray-700">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="dark:text-white">${rawSubtotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-500 flex items-center">
                    <Percent size={14} className="mr-1" /> Discount
                  </span>
                  <span className="text-green-500">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tax (10%)</span>
                <span className="dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="dark:text-white">Total</span>
                <span className="dark:text-white">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {isWalkInCustomer ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={items.length === 0}
                    onClick={() => handleCompleteOrder('paid')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                  </Button>
                  <Button
                    variant="outline"
                    disabled={items.length === 0}
                    onClick={handlePrintReceipt}
                  >
                    <Printer className="mr-2 h-4 w-4" /> Print
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={items.length === 0}
                    onClick={() => handleCompleteOrder('paid')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                  </Button>
                  <Button
                    className="bg-amber-500 hover:bg-amber-600"
                    disabled={items.length === 0}
                    onClick={() => handleCompleteOrder('pending')}
                  >
                    <Clock className="mr-2 h-4 w-4" /> Pay Later
                  </Button>
                </div>
              )}
              
              {items.length > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handlePrintReceipt}
                >
                  <Printer className="mr-2 h-4 w-4" /> Print Receipt
                </Button>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="flex-1 flex flex-col mt-0">
          <ScrollArea className="flex-1 p-4">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <ClipboardList className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-center">No recent orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-sm dark:text-white">Order #{order.orderNumber}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(order.timestamp)}</p>
                      </div>
                      <Badge className={order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-amber-500'}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                      <span>Customer:</span>
                      <span className="font-medium">{displayOrderCustomerName(order.customerName)}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                      <span>Type:</span>
                      <span>{order.orderType}</span>
                    </div>
                    {order.orderType === 'Dine In' && order.tableNumber && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                        <span>Table:</span>
                        <span>#{order.tableNumber}</span>
                      </div>
                    )}
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t dark:border-gray-600 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/orders?id=${order.id}`)}
                        className="text-xs"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CartPanel;
