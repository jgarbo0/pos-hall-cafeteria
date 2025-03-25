
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
