
import { FinancialTransaction } from './index';

export interface Transaction extends FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  icon: React.ComponentType;
}

export interface SavingGoal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  color: string;
  icon: React.ComponentType;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  date: string;
  icon: React.ComponentType;
  color: string;
}

export interface HallBookingIncome {
  id: string;
  date: string | Date;
  customerName: string;
  purpose: string;
  attendees: number;
  amount: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: 'dashboard' | 'menu' | 'orders' | 'products' | 'customers' | 'hall' | 'finance' | 'settings';
  actions: ('view' | 'create' | 'edit' | 'delete')[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs
  isDefault?: boolean;
}

export interface UserRole {
  userId: string;
  roleId: string;
  roleName: string;
}
