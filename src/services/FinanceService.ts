
import { supabase } from "@/integrations/supabase/client";
import { Transaction, HallBookingIncome } from "@/types/finance";

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    date: item.date,
    description: item.description,
    amount: item.amount,
    type: item.type as 'income' | 'expense',
    category: item.category,
    paymentMethod: item.payment_method
  }));
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  // Transform the transaction object to match the database column names
  const dbTransaction = {
    date: transaction.date,
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    payment_method: transaction.paymentMethod // Convert paymentMethod to payment_method
  };

  const { data, error } = await supabase
    .from('transactions')
    .insert([dbTransaction])
    .select()
    .single();

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  return {
    id: data.id,
    date: data.date,
    description: data.description,
    amount: data.amount,
    type: data.type as 'income' | 'expense',
    category: data.category,
    paymentMethod: data.payment_method
  };
};

export const getHallBookingIncomes = async (): Promise<HallBookingIncome[]> => {
  const { data, error } = await supabase
    .from('hall_bookings')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching hall bookings:', error);
    throw error;
  }

  return data.map(booking => ({
    id: booking.id,
    date: booking.date,
    customerName: booking.customer_name,
    purpose: booking.purpose,
    attendees: booking.attendees,
    amount: booking.total_amount
  }));
};

export const addHallBookingIncome = async (hallBooking: Omit<HallBookingIncome, 'id'>): Promise<void> => {
  try {
    console.log('Adding hall booking income:', hallBooking);
    // Convert the date to ISO format if it's a Date object
    const bookingDate = typeof hallBooking.date === 'string' 
      ? hallBooking.date 
      : new Date(hallBooking.date).toISOString().split('T')[0];

    // 1. Record the hall booking income as a transaction
    const transaction = {
      date: bookingDate,
      description: `Hall booking: ${hallBooking.purpose} for ${hallBooking.customerName}`,
      amount: Number(hallBooking.amount),
      type: 'income' as const,
      category: 'Hall Rental',
      paymentMethod: 'Cash' // Default payment method, can be updated if needed
    };
    
    await addTransaction(transaction);
    
  } catch (error) {
    console.error('Error adding hall booking income:', error);
    throw error;
  }
};

export const addSalesIncome = async (orderTotal: number, orderNumber: string, customerName: string): Promise<void> => {
  try {
    const transaction = {
      date: new Date().toISOString().split('T')[0],
      description: `Sales income: Order #${orderNumber} from ${customerName}`,
      amount: orderTotal,
      type: 'income' as const,
      category: 'Food Sales',
      paymentMethod: 'Cash' // Default payment method, can be updated if needed
    };
    
    await addTransaction(transaction);
    
  } catch (error) {
    console.error('Error adding sales income:', error);
    throw error;
  }
};

export const getPaymentMethods = async () => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*');

  if (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }

  return data;
};
