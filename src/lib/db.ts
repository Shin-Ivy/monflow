import Dexie, { Table } from 'dexie';
import { 
  Wallet, 
  Transaction, 
  Budget, 
  SavingsGoal, 
  DebtLoan, 
  RecurringTransaction, 
  CustomCategory 
} from '@/types/database';

export class MonFlowLocalDatabase extends Dexie {
  wallets!: Table<Wallet, string>;
  transactions!: Table<Transaction, string>;
  budgets!: Table<Budget, string>;
  goals!: Table<SavingsGoal, string>;
  debts!: Table<DebtLoan, string>;
  recurring!: Table<RecurringTransaction, string>;
  categories!: Table<CustomCategory, string>;

  constructor() {
    super('MonFlowLocalDB');
    this.version(2).stores({
      wallets: 'id, user_id, name',
      transactions: 'id, user_id, wallet_id, category, type, date',
      budgets: 'id, user_id, month_period',
      goals: 'id, user_id, title',
      debts: 'id, user_id, type, status, due_date',
      recurring: 'id, user_id, frequency, active',
      categories: 'id, user_id, type, name',
    });
  }
}

export const localDB = new MonFlowLocalDatabase();