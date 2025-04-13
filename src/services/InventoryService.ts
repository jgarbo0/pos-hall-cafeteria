
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, InventoryTransaction, InventoryCategory } from '@/types/inventory';
import { toast } from 'sonner';

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: Number(item.quantity),
      unit: item.unit,
      minStockLevel: Number(item.min_stock_level),
      purchasePrice: Number(item.purchase_price),
      expiryDate: item.expiry_date,
      supplier: item.supplier,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    toast.error('Failed to load inventory items');
    throw error;
  }
};

export const getInventoryItemById = async (id: string): Promise<InventoryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      quantity: Number(data.quantity),
      unit: data.unit,
      minStockLevel: Number(data.min_stock_level),
      purchasePrice: Number(data.purchase_price),
      expiryDate: data.expiry_date,
      supplier: data.supplier,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    toast.error('Failed to load inventory item details');
    throw error;
  }
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        min_stock_level: item.minStockLevel,
        purchase_price: item.purchasePrice,
        expiry_date: item.expiryDate,
        supplier: item.supplier
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success(`${item.name} added to inventory`);
    
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      quantity: Number(data.quantity),
      unit: data.unit,
      minStockLevel: Number(data.min_stock_level),
      purchasePrice: Number(data.purchase_price),
      expiryDate: data.expiry_date,
      supplier: data.supplier,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error creating inventory item:', error);
    toast.error('Failed to add inventory item');
    throw error;
  }
};

export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>): Promise<void> => {
  try {
    const updateData: any = {};
    
    if (item.name !== undefined) updateData.name = item.name;
    if (item.category !== undefined) updateData.category = item.category;
    if (item.quantity !== undefined) updateData.quantity = item.quantity;
    if (item.unit !== undefined) updateData.unit = item.unit;
    if (item.minStockLevel !== undefined) updateData.min_stock_level = item.minStockLevel;
    if (item.purchasePrice !== undefined) updateData.purchase_price = item.purchasePrice;
    if (item.expiryDate !== undefined) updateData.expiry_date = item.expiryDate;
    if (item.supplier !== undefined) updateData.supplier = item.supplier;
    
    const { error } = await supabase
      .from('inventory_items')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Inventory item updated successfully');
  } catch (error) {
    console.error('Error updating inventory item:', error);
    toast.error('Failed to update inventory item');
    throw error;
  }
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Inventory item deleted successfully');
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    toast.error('Failed to delete inventory item');
    throw error;
  }
};

export const recordInventoryTransaction = async (transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>): Promise<InventoryTransaction> => {
  try {
    // Calculate total price if unit price is provided
    const totalPrice = transaction.unitPrice && transaction.quantity 
      ? transaction.unitPrice * transaction.quantity 
      : transaction.totalPrice;
    
    // First, insert the transaction
    const { data, error } = await supabase
      .from('inventory_transactions')
      .insert({
        inventory_item_id: transaction.inventoryItemId,
        transaction_type: transaction.transactionType,
        quantity: transaction.quantity,
        unit_price: transaction.unitPrice,
        total_price: totalPrice,
        transaction_date: transaction.transactionDate || new Date().toISOString(),
        notes: transaction.notes
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Then, update the inventory item quantity based on transaction type
    const item = await getInventoryItemById(transaction.inventoryItemId);
    if (!item) throw new Error('Inventory item not found');
    
    let newQuantity = item.quantity;
    
    switch (transaction.transactionType) {
      case 'purchase':
        newQuantity += transaction.quantity;
        break;
      case 'usage':
      case 'waste':
        newQuantity -= transaction.quantity;
        break;
      case 'adjustment':
        // For adjustment, the quantity provided is the new total
        newQuantity = transaction.quantity;
        break;
    }
    
    await updateInventoryItem(transaction.inventoryItemId, { quantity: newQuantity });
    
    // If it's a purchase transaction, also record an expense
    if (transaction.transactionType === 'purchase' && totalPrice) {
      // Import from Finance service
      const { addTransaction } = await import('@/services/FinanceService');
      await addTransaction({
        date: data.transaction_date.split('T')[0],
        description: `Inventory purchase: ${item.name}`,
        amount: totalPrice,
        type: 'expense',
        category: 'Inventory',
        paymentMethod: 'Cash'
      });
    }
    
    toast.success('Inventory transaction recorded successfully');
    
    return {
      id: data.id,
      inventoryItemId: data.inventory_item_id,
      transactionType: data.transaction_type as 'purchase' | 'usage' | 'adjustment' | 'waste',
      quantity: Number(data.quantity),
      unitPrice: data.unit_price ? Number(data.unit_price) : undefined,
      totalPrice: data.total_price ? Number(data.total_price) : undefined,
      transactionDate: data.transaction_date,
      notes: data.notes,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error recording inventory transaction:', error);
    toast.error('Failed to record inventory transaction');
    throw error;
  }
};

export const getInventoryTransactions = async (itemId?: string): Promise<InventoryTransaction[]> => {
  try {
    let query = supabase
      .from('inventory_transactions')
      .select('*')
      .order('transaction_date', { ascending: false });
    
    if (itemId) {
      query = query.eq('inventory_item_id', itemId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(transaction => ({
      id: transaction.id,
      inventoryItemId: transaction.inventory_item_id,
      transactionType: transaction.transaction_type as 'purchase' | 'usage' | 'adjustment' | 'waste',
      quantity: Number(transaction.quantity),
      unitPrice: transaction.unit_price ? Number(transaction.unit_price) : undefined,
      totalPrice: transaction.total_price ? Number(transaction.total_price) : undefined,
      transactionDate: transaction.transaction_date,
      notes: transaction.notes,
      createdAt: transaction.created_at
    }));
  } catch (error) {
    console.error('Error fetching inventory transactions:', error);
    toast.error('Failed to load inventory transactions');
    throw error;
  }
};

export const getLowStockItems = async (): Promise<InventoryItem[]> => {
  try {
    // Fix the raw property issue by using a direct comparison
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .lte('quantity', 'min_stock_level')
      .order('name');
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: Number(item.quantity),
      unit: item.unit,
      minStockLevel: Number(item.min_stock_level),
      purchasePrice: Number(item.purchase_price),
      expiryDate: item.expiry_date,
      supplier: item.supplier,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    toast.error('Failed to load low stock items');
    throw error;
  }
};

export const getExpiringItems = async (daysThreshold: number = 7): Promise<InventoryItem[]> => {
  try {
    // Calculate the date threshold
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .lt('expiry_date', thresholdDate.toISOString().split('T')[0])
      .gt('expiry_date', new Date().toISOString().split('T')[0])
      .gt('quantity', 0)
      .order('expiry_date');
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: Number(item.quantity),
      unit: item.unit,
      minStockLevel: Number(item.min_stock_level),
      purchasePrice: Number(item.purchase_price),
      expiryDate: item.expiry_date,
      supplier: item.supplier,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error fetching expiring items:', error);
    toast.error('Failed to load expiring items');
    throw error;
  }
};

export const getInventoryCategories = async (): Promise<InventoryCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('category');
    
    if (error) throw error;
    
    // Count items in each category
    const categories: { [key: string]: number } = {};
    data.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category]++;
    });
    
    return Object.keys(categories).map(name => ({
      name,
      count: categories[name]
    }));
  } catch (error) {
    console.error('Error fetching inventory categories:', error);
    toast.error('Failed to load inventory categories');
    throw error;
  }
};
