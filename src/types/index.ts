
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
