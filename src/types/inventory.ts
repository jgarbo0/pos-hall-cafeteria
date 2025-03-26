
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  purchasePrice: number;
  expiryDate?: string;
  supplier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  inventoryItemId: string;
  transactionType: 'purchase' | 'usage' | 'adjustment' | 'waste';
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  transactionDate: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryCategory {
  name: string;
  count: number;
}

export interface LowStockAlert {
  id: string;
  name: string;
  currentQuantity: number;
  minStockLevel: number;
  unit: string;
}

export interface ExpiryAlert {
  id: string;
  name: string;
  expiryDate: string;
  daysRemaining: number;
}
