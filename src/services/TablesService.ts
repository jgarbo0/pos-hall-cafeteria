
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RestaurantTable {
  id: string;
  name: string;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export const getRestaurantTables = async (): Promise<RestaurantTable[]> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    const typedData = data?.map(table => ({
      ...table,
      status: validateTableStatus(table.status)
    })) || [];
    
    return typedData;
  } catch (error) {
    console.error('Error fetching restaurant tables:', error);
    toast.error('Failed to load restaurant tables');
    return [];
  }
};

export const createRestaurantTable = async (table: Omit<RestaurantTable, 'id' | 'created_at' | 'updated_at'>): Promise<RestaurantTable | null> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .insert(table)
      .select()
      .single();
    
    if (error) throw error;
    
    const typedData: RestaurantTable = {
      ...data,
      status: validateTableStatus(data.status)
    };
    
    toast.success(`Table "${table.name}" created successfully`);
    return typedData;
  } catch (error) {
    console.error('Error creating restaurant table:', error);
    toast.error('Failed to create restaurant table');
    return null;
  }
};

const validateTableStatus = (status: string): 'available' | 'occupied' | 'reserved' => {
  if (status === 'available' || status === 'occupied' || status === 'reserved') {
    return status;
  }
  console.warn(`Invalid table status: "${status}". Defaulting to "available".`);
  return 'available';
};

export const updateRestaurantTable = async (id: string, table: Partial<RestaurantTable>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('restaurant_tables')
      .update(table)
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success(`Table "${table.name || 'selected'}" updated successfully`);
    return true;
  } catch (error) {
    console.error('Error updating restaurant table:', error);
    toast.error('Failed to update restaurant table');
    return false;
  }
};

export const deleteRestaurantTable = async (id: string, tableName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('restaurant_tables')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success(`Table "${tableName}" deleted successfully`);
    return true;
  } catch (error) {
    console.error('Error deleting restaurant table:', error);
    toast.error('Failed to delete restaurant table');
    return false;
  }
};

export const updateTableStatus = async (id: string, status: 'available' | 'occupied' | 'reserved'): Promise<boolean> => {
  return updateRestaurantTable(id, { status });
};

export const updateOrderPaymentStatus = async (id: string, paymentStatus: 'paid' | 'pending'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', id);
    
    if (error) throw error;
    
    const statusText = paymentStatus === 'paid' ? 'marked as paid' : 'marked as pending';
    toast.success(`Order payment ${statusText} successfully`);
    return true;
  } catch (error) {
    console.error('Error updating order payment status:', error);
    toast.error('Failed to update order payment status');
    return false;
  }
};

export default {
  getRestaurantTables,
  createRestaurantTable,
  updateRestaurantTable,
  deleteRestaurantTable,
  updateTableStatus,
  updateOrderPaymentStatus
};
