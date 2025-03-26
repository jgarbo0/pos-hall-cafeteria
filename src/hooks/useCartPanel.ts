import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CartItem, Order } from '@/types';
import { toast } from 'sonner';
import { RestaurantTable, getRestaurantTables } from '@/services/TablesService';

export const useCartPanel = () => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("cart");
  const [availableTables, setAvailableTables] = useState<RestaurantTable[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [itemDiscounts, setItemDiscounts] = useState<Record<string, number>>({});
  const [taxRate, setTaxRate] = useState<number>(10);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchRecentOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTaxRate();
  }, []);

  const fetchTaxRate = async () => {
    try {
      const { data, error } = await supabase
        .from('tax_settings')
        .select('tax_rate')
        .single();
      
      if (error) throw error;
      
      if (data && data.tax_rate !== null) {
        setTaxRate(Number(data.tax_rate));
      }
    } catch (error) {
      console.error('Error fetching tax rate:', error);
      // Keep default tax rate if there's an error
    }
  };

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

  const fetchAvailableTables = async (orderType: 'Dine In' | 'Take Away') => {
    if (orderType !== 'Dine In') return;
    
    try {
      const tables = await getRestaurantTables();
      setAvailableTables(tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Failed to load tables');
    }
  };

  const calculatePricing = (items: CartItem[]) => {
    const rawSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const calculateGlobalDiscount = () => {
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

    const discountAmount = calculateGlobalDiscount() + itemDiscountTotal;
    
    const subtotal = rawSubtotal - discountAmount;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    return {
      rawSubtotal,
      discountAmount,
      subtotal,
      tax,
      total,
      taxRate
    };
  };

  const applyItemDiscount = (itemId: string, discount: number) => {
    setItemDiscounts(prev => ({
      ...prev,
      [itemId]: discount
    }));
    toast.success(`Discount applied to item: ${discount}%`);
  };

  const clearItemDiscount = (itemId: string) => {
    setItemDiscounts(prev => {
      const newDiscounts = {...prev};
      delete newDiscounts[itemId];
      return newDiscounts;
    });
  };

  return {
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
  };
};
