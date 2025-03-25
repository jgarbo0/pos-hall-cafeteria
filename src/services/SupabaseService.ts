
import { supabase } from '@/integrations/supabase/client';
import { 
  MenuItem, 
  CartItem, 
  Order, 
  Category, 
  FinancialTransaction, 
  Product, 
  HallBooking 
} from '@/types';
import { toast } from 'sonner';

// Menu Items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        id,
        title,
        price,
        available,
        popular,
        description,
        image,
        categories(id, name)
      `)
      .order('title');
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      available: item.available,
      image: item.image || 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
      category: item.categories?.id || '',
      popular: item.popular || false,
      description: item.description
    }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const createMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        title: item.title,
        price: item.price,
        available: item.available,
        category_id: item.category,
        description: item.description || null,
        image: item.image || 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
        popular: item.popular || false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      price: data.price,
      available: data.available,
      category: data.category_id,
      image: data.image,
      popular: data.popular,
      description: data.description
    };
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (id: string, item: Partial<MenuItem>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .update({
        title: item.title,
        price: item.price,
        available: item.available,
        category_id: item.category,
        description: item.description,
        image: item.image,
        popular: item.popular
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Orders
export const createOrder = async (
  orderNumber: string, 
  orderType: string, 
  tableNumber: number | null, 
  cartItems: CartItem[],
  customerName: string = 'Walk-in Customer'
): Promise<Order> => {
  try {
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    // Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        order_type: orderType,
        table_number: tableNumber,
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'processing',
        customer_name: customerName
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Insert order items
    const orderItems = cartItems.map(item => ({
      order_id: orderData.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes || null,
      spicy_level: item.spicyLevel || null
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    return {
      id: orderData.id,
      orderNumber: orderData.order_number,
      orderType: orderData.order_type as 'Dine In' | 'Take Away',
      tableNumber: orderData.table_number,
      items: cartItems,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      total: orderData.total,
      status: orderData.status as 'processing' | 'completed' | 'cancelled',
      timestamp: orderData.timestamp
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        order_type,
        table_number,
        subtotal,
        tax,
        total,
        status,
        timestamp,
        customer_name
      `)
      .order('timestamp', { ascending: false });
    
    if (ordersError) throw ordersError;
    
    const orders: Order[] = [];
    
    for (const order of ordersData) {
      // Get order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          price,
          notes,
          spicy_level,
          menu_items(id, title, price, image, description, category_id)
        `)
        .eq('order_id', order.id);
      
      if (itemsError) throw itemsError;
      
      const cartItems: CartItem[] = itemsData.map(item => ({
        id: item.menu_items.id,
        title: item.menu_items.title,
        quantity: item.quantity,
        price: item.price,
        image: item.menu_items.image,
        category: item.menu_items.category_id,
        notes: item.notes,
        spicyLevel: item.spicy_level
      }));
      
      orders.push({
        id: order.id,
        orderNumber: order.order_number,
        orderType: order.order_type as 'Dine In' | 'Take Away',
        tableNumber: order.table_number,
        items: cartItems,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: order.status as 'processing' | 'completed' | 'cancelled',
        timestamp: order.timestamp
      });
    }
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Financial Transactions
export const getTransactions = async (): Promise<FinancialTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      date: item.date,
      description: item.description,
      amount: item.amount,
      type: item.type as 'income' | 'expense',
      category: item.category,
      paymentMethod: item.payment_method,
      reference: item.reference
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const createTransaction = async (transaction: Omit<FinancialTransaction, 'id'>): Promise<FinancialTransaction> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        payment_method: transaction.paymentMethod,
        reference: transaction.reference
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      date: data.date,
      description: data.description,
      amount: data.amount,
      type: data.type as 'income' | 'expense',
      category: data.category,
      paymentMethod: data.payment_method,
      reference: data.reference
    };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Hall Bookings
export const getHallBookings = async (): Promise<HallBooking[]> => {
  try {
    const { data, error } = await supabase
      .from('hall_bookings')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    return data.map(booking => ({
      id: booking.id,
      date: booking.date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      customerName: booking.customer_name,
      customerPhone: booking.customer_phone,
      purpose: booking.purpose,
      attendees: booking.attendees,
      additionalServices: booking.additional_services || [],
      status: booking.status as 'pending' | 'confirmed' | 'canceled',
      totalAmount: booking.total_amount,
      notes: booking.notes || '',
      hallId: booking.hall_id,
      tableId: booking.table_id,
      packageId: booking.package_id
    }));
  } catch (error) {
    console.error('Error fetching hall bookings:', error);
    throw error;
  }
};

export const createHallBooking = async (booking: Omit<HallBooking, 'id'>): Promise<HallBooking> => {
  try {
    const { data, error } = await supabase
      .from('hall_bookings')
      .insert({
        date: booking.date,
        start_time: booking.startTime,
        end_time: booking.endTime,
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        purpose: booking.purpose,
        attendees: booking.attendees,
        additional_services: booking.additionalServices,
        status: booking.status,
        total_amount: booking.totalAmount,
        notes: booking.notes,
        hall_id: booking.hallId,
        table_id: booking.tableId,
        package_id: booking.packageId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      purpose: data.purpose,
      attendees: data.attendees,
      additionalServices: data.additional_services || [],
      status: data.status as 'pending' | 'confirmed' | 'canceled',
      totalAmount: data.total_amount,
      notes: data.notes || '',
      hallId: data.hall_id,
      tableId: data.table_id,
      packageId: data.package_id
    };
  } catch (error) {
    console.error('Error creating hall booking:', error);
    throw error;
  }
};

// Popular Items for Dashboard
export const getPopularItems = async (): Promise<{id: string; name: string; category: string; sales: number; growth: number;}[]> => {
  try {
    // This could be improved with a proper query to get the actual popular items based on order history
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        id,
        title,
        categories(name),
        popular
      `)
      .eq('popular', true)
      .limit(5);
    
    if (error) throw error;
    
    // For now, we're generating random sales and growth numbers
    return data.map(item => ({
      id: item.id,
      name: item.title,
      category: item.categories?.name || 'Uncategorized',
      sales: Math.floor(Math.random() * 100) + 20, // Random number between 20-120
      growth: Math.floor(Math.random() * 30) + 5 // Random number between 5-35
    }));
  } catch (error) {
    console.error('Error fetching popular items:', error);
    throw error;
  }
};

export default {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  createOrder,
  getOrders,
  getTransactions,
  createTransaction,
  getHallBookings,
  createHallBooking,
  getPopularItems
};
