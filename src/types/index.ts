export interface MenuItem {
  id: string;
  title: string;
  available: number;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  description?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
  spicyLevel?: number;
  discount?: number; // Discount percentage (0-100)
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
  paymentStatus?: 'paid' | 'pending';
  timestamp: string;
  customerName?: string;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
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

export type AvailabilityRange = 'day' | 'week' | 'month';

export interface Hall {
  id: number;
  name: string;
  image: string;
  capacity: number;
  type: string;
  availabilityRange: AvailabilityRange;
  description?: string;
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
  tableId?: string | number;
  packageId?: string;
  guests?: {
    total: number;
    children: number;
    family: number;
    group: number;
    single: number;
    staff: number;
  };
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'manager';
  avatar?: string;
}

export type Theme = 'light' | 'dark';

export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  totalOrders?: number;
  totalSpent?: number;
  pendingPayments?: {
    id: string;
    amount: number;
    date: string;
    description: string;
  }[];
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  active?: boolean;
  created_at?: string;
}
