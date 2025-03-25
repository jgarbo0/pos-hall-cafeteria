export interface MenuItem {
  id: string;
  title: string;
  available: number;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
  spicyLevel?: number;
}

export interface Category {
  id: string;
  name: string;
}

export type OrderType = 'Dine In' | 'Take Away';

export interface Order {
  id: string;
  items: CartItem[];
  orderType: OrderType;
  tableNumber?: number | null;
  orderNumber: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'processing' | 'completed' | 'cancelled';
  timestamp: string;
}

export interface TableItem {
  id: number;
  name: string;
  seats: number;
  status: 'available' | 'occupied';
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  items: string[];
}

export interface HallBooking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  purpose: string;
  attendees: number;
  additionalServices: string[];
  status: 'pending' | 'confirmed' | 'canceled';
  totalAmount: number;
  notes: string;
  hallId?: number;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod?: string;
  reference?: string;
}

export interface Product extends MenuItem {
  description?: string;
  cost?: number;
  barcode?: string;
  sku?: string;
}
