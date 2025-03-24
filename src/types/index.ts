
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
