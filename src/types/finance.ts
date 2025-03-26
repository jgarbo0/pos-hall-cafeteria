
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
