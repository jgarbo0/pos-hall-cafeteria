import { supabase } from '@/integrations/supabase/client';
import { 
  MenuItem, 
  CartItem, 
  Order, 
  Category, 
  FinancialTransaction, 
  Product, 
  HallBooking,
  Customer,
  StaffUser
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
  customerName: string = 'Walk-in Customer',
  paymentStatus: 'paid' | 'pending' = 'paid',
  discountType: 'percentage' | 'fixed' = 'percentage'
): Promise<Order> => {
  try {
    // Calculate totals with discounts
    let subtotal = 0;
    let totalDiscount = 0;
    
    // Get any global discount from the cart items
    let globalDiscount = 0;
    const firstItem = cartItems[0];
    if (firstItem && firstItem.globalDiscount !== undefined) {
      globalDiscount = firstItem.globalDiscount;
    }
    
    // Calculate each item's price after potential discount
    for (const item of cartItems) {
      let itemPrice = item.price * item.quantity;
      // Apply item discount if present
      if (item.discount && item.discount > 0) {
        const itemDiscount = itemPrice * (item.discount / 100);
        totalDiscount += itemDiscount;
        itemPrice = itemPrice - itemDiscount;
      }
      subtotal += itemPrice;
    }
    
    // Apply global discount if present
    if (globalDiscount > 0) {
      if (discountType === 'percentage') {
        const discountAmount = subtotal * (globalDiscount / 100);
        totalDiscount += discountAmount;
      } else {
        totalDiscount += globalDiscount;
      }
    }
    
    // Get tax rate from tax_settings
    const { data: taxData, error: taxError } = await supabase
      .from('tax_settings')
      .select('tax_rate')
      .single();
    
    let taxRate = 10; // Default 10%
    if (!taxError && taxData && taxData.tax_rate !== null) {
      taxRate = Number(taxData.tax_rate);
    }
    
    // Calculate total after discount is applied
    const discountedSubtotal = subtotal - (discountType === 'percentage' ? 
      (subtotal * (globalDiscount / 100)) : 
      globalDiscount);
    
    const tax = discountedSubtotal * (taxRate / 100);
    const total = discountedSubtotal + tax;
    
    console.log('Order details:', {
      subtotal,
      discount: totalDiscount,
      discountType,
      taxRate,
      tax,
      total
    });
    
    // Insert order - Make sure discount is properly saved
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        order_type: orderType,
        table_number: tableNumber,
        subtotal: subtotal, // Original subtotal before discount
        discount: totalDiscount, // Save the total discount amount
        discount_type: discountType, // Save the discount type
        tax: tax,
        total: total,
        status: 'completed',
        customer_name: customerName,
        payment_status: paymentStatus
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Insert order items with discount information
    const orderItems = cartItems.map(item => ({
      order_id: orderData.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0, // Store individual item discount
      notes: item.notes || null,
      spicy_level: item.spicyLevel || null
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    // Record income in transactions table for financial reporting
    // We import the function here to avoid circular dependency
    const { addSalesIncome } = await import('@/services/FinanceService');
    await addSalesIncome(total, orderNumber, customerName);
    
    return {
      id: orderData.id,
      orderNumber: orderData.order_number,
      orderType: orderData.order_type as 'Dine In' | 'Take Away',
      tableNumber: orderData.table_number,
      items: cartItems,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      total: orderData.total,
      discount: orderData.discount, // Include discount in returned order object
      discountType: orderData.discount_type as 'percentage' | 'fixed', // Include discount type
      status: orderData.status as 'processing' | 'completed' | 'cancelled',
      paymentStatus: orderData.payment_status as 'paid' | 'pending',
      timestamp: orderData.timestamp,
      customerName: orderData.customer_name
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
        discount,
        discount_type,
        status,
        timestamp,
        customer_name,
        payment_status
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
          discount,
          menu_items(id, title, price, image, description, category_id, available)
        `)
        .eq('order_id', order.id);
      
      if (itemsError) throw itemsError;
      
      const cartItems: CartItem[] = itemsData.map(item => ({
        id: item.menu_items.id,
        title: item.menu_items.title,
        quantity: item.quantity,
        price: item.price,
        image: item.menu_items.image || 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
        category: item.menu_items.category_id,
        available: item.menu_items.available || 0,
        notes: item.notes,
        spicyLevel: item.spicy_level,
        discount: item.discount
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
        discount: order.discount,
        discountType: order.discount_type as 'percentage' | 'fixed',
        status: order.status as 'processing' | 'completed' | 'cancelled',
        paymentStatus: order.payment_status as 'paid' | 'pending',
        timestamp: order.timestamp,
        customerName: order.customer_name
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
    // Ensure total_amount is a number
    const totalAmount = typeof booking.totalAmount === 'string' 
      ? parseFloat(booking.totalAmount as string) 
      : booking.totalAmount;

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
        total_amount: totalAmount,
        notes: booking.notes,
        hall_id: booking.hallId,
        table_id: booking.tableId ? String(booking.tableId) : null,
        package_id: booking.packageId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('Hall booking created:', data);
    
    // Record the hall booking income in the transactions table for financial reporting
    // We import the function here to avoid circular dependency
    const { addHallBookingIncome } = await import('@/services/FinanceService');
    await addHallBookingIncome({
      date: data.date,
      customerName: data.customer_name,
      purpose: data.purpose,
      attendees: data.attendees,
      amount: data.total_amount
    });
    
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
      sales: Math.floor(Math.random() * 100) + 20,
      growth: Math.floor(Math.random() * 30) + 5
    }));
  } catch (error) {
    console.error('Error fetching popular items:', error);
    throw error;
  }
};

// Customers
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // For now, we'll add mock data for totalOrders, totalSpent, and pendingPayments
    // In a real app, you would calculate these from orders tables
    return data.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      totalOrders: Math.floor(Math.random() * 20) + 1,
      totalSpent: Math.floor(Math.random() * 500) + 100,
      pendingPayments: Math.random() > 0.7 ? [
        {
          id: 'p' + Math.floor(Math.random() * 1000),
          amount: Math.floor(Math.random() * 50) + 10,
          date: new Date().toISOString().split('T')[0],
          description: 'Order #' + Math.floor(Math.random() * 10000)
        }
      ] : []
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    toast.error('Failed to fetch customers');
    throw error;
  }
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Customer not found
      }
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      totalOrders: Math.floor(Math.random() * 20) + 1,
      totalSpent: Math.floor(Math.random() * 500) + 100,
      pendingPayments: Math.random() > 0.7 ? [
        {
          id: 'p' + Math.floor(Math.random() * 1000),
          amount: Math.floor(Math.random() * 50) + 10,
          date: new Date().toISOString().split('T')[0],
          description: 'Order #' + Math.floor(Math.random() * 10000)
        }
      ] : []
    };
  } catch (error) {
    console.error('Error fetching customer:', error);
    toast.error('Failed to fetch customer details');
    throw error;
  }
};

export const createCustomer = async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success(`Customer ${customer.name} created successfully`);
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      totalOrders: 0,
      totalSpent: 0,
      pendingPayments: []
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    toast.error('Failed to create customer');
    throw error;
  }
};

export const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('customers')
      .update({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      })
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success(`Customer ${customer.name} updated successfully`);
  } catch (error) {
    console.error('Error updating customer:', error);
    toast.error('Failed to update customer');
    throw error;
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Customer deleted successfully');
  } catch (error) {
    console.error('Error deleting customer:', error);
    toast.error('Failed to delete customer');
    throw error;
  }
};

// Staff Users
export const getStaffUsers = async (): Promise<StaffUser[]> => {
  try {
    const { data, error } = await supabase
      .from('staff_users')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching staff users:', error);
    toast.error('Failed to fetch staff users');
    throw error;
  }
};

export const getStaffUserById = async (id: string): Promise<StaffUser | null> => {
  try {
    const { data, error } = await supabase
      .from('staff_users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching staff user:', error);
    toast.error('Failed to fetch staff user details');
    throw error;
  }
};

export const createStaffUser = async (user: Omit<StaffUser, 'id'>): Promise<StaffUser> => {
  try {
    const { data, error } = await supabase
      .from('staff_users')
      .insert({
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active !== undefined ? user.active : true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success(`User ${user.name} created successfully`);
    
    return data;
  } catch (error) {
    console.error('Error creating staff user:', error);
    toast.error('Failed to create staff user');
    throw error;
  }
};

export const updateStaffUser = async (id: string, user: Partial<StaffUser>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('staff_users')
      .update({
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
      })
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success(`User ${user.name} updated successfully`);
  } catch (error) {
    console.error('Error updating staff user:', error);
    toast.error('Failed to update staff user');
    throw error;
  }
};

export const deleteStaffUser = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('staff_users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('User deleted successfully');
  } catch (error) {
    console.error('Error deleting staff user:', error);
    toast.error('Failed to delete staff user');
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
  getPopularItems,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getStaffUsers,
  getStaffUserById,
  createStaffUser,
  updateStaffUser,
  deleteStaffUser
};
