export interface Wallet {
  id: string;
  user_id?: string;
  name: string;
  balance: number;
  icon?: string;
  color: string;
  type?: 'Bank' | 'Cash' | 'E-Wallet' | 'Investment';
  created_at?: string;
}

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  user_id?: string;
  wallet_id: string;
  category_id?: string;
  category: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  created_at?: string;
}

export interface Budget {
  id: string;
  user_id?: string;
  category_id?: string;
  monthly_limit: number;
  month_period: string;
  created_at?: string;
}

export interface SavingsGoal {
  id: string;
  user_id?: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  target_date: string;
  created_at?: string;
}

// ── FITUR BARU DARI MOBILE ──────────────────────────────────────────────────
export type DebtType = 'debt' | 'loan'; // debt = hutang kita, loan = piutang (orang pinjam ke kita)

export interface DebtLoan {
  id: string;
  user_id?: string;
  type: DebtType;
  person_name: string;
  amount: number;
  paid_amount: number;
  due_date: string;
  status: 'unpaid' | 'partial' | 'paid';
  wallet_id: string;
  notes?: string;
  created_at?: string;
}

export interface RecurringTransaction {
  id: string;
  user_id?: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  due_day?: number;
  wallet_id: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_due_date: string;
  active: boolean;
  created_at?: string;
}

export interface CustomCategory {
  id: string;
  user_id?: string;
  name: string;
  type: TransactionType;
  color: string;
  created_at?: string;
}