
// Assuming this is the current file content or we're adding to it

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod?: string;
}

export interface HallBookingIncome {
  id: string;
  date: string;
  customerName: string;
  purpose: string;
  attendees: number;
  amount: number;
  hallId?: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
}

export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  color: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  date: string;
  color: string;
}

// Adding the missing Role and Permission interfaces
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault?: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: string[];
}

export interface FinanceWidgetData {
  name: string;
  income: number;
  expense: number;
}

export interface CafeteriaSale {
  id: string;
  date: string;
  customerName: string;
  items: number;
  amount: number;
  paymentMethod: string;
}

export interface PopularMenuItem {
  name: string;
  quantity: number;
  amount: number;
  trend: number;
}
