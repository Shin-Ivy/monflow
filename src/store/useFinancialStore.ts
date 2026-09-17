import { create } from 'zustand';
import { localDB } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { 
  Wallet, 
  Transaction, 
  TransactionType,
  Budget, 
  SavingsGoal, 
  DebtLoan, 
  RecurringTransaction, 
  CustomCategory 
} from '@/types/database';

interface FinancialState {
  wallets: Wallet[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  debts: DebtLoan[];
  recurring: RecurringTransaction[];
  categories: CustomCategory[];
  isLoading: boolean;
  isCloudMode: boolean;
  userId: string | null;
  hideBalance: boolean;

  init: () => Promise<void>;
  toggleHideBalance: () => void;

  // Dompet
  addWallet: (wallet: Omit<Wallet, 'id'>) => Promise<void>;
  updateWallet: (id: string, updated: Partial<Omit<Wallet, 'id'>>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;

  // Transaksi & Transfer
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  addTransfer: (fromId: string, toId: string, amount: number) => Promise<void>;
  updateTransaction: (id: string, updated: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Budget
  upsertBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  // Tabungan
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => Promise<void>;
  updateGoalAmount: (id: string, newAmount: number) => Promise<void>;
  withdrawGoalAmount: (goalId: string, walletId: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Hutang & Piutang
  addDebtLoan: (item: Omit<DebtLoan, 'id'>) => Promise<void>;
  settleDebtLoan: (id: string, settleAmount: number, walletId: string) => Promise<void>;
  deleteDebtLoan: (id: string) => Promise<void>;

  // Tagihan Rutin
  addRecurring: (item: Omit<RecurringTransaction, 'id'>) => Promise<void>;
  toggleRecurring: (id: string) => Promise<void>;
  deleteRecurring: (id: string) => Promise<void>;

  // Kategori
  addCategory: (cat: Omit<CustomCategory, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  syncGuestToCloud: () => Promise<void>;
}

export const useFinancialStore = create<FinancialState>((set, get) => ({
  wallets: [],
  transactions: [],
  budgets: [],
  goals: [],
  debts: [],
  recurring: [],
  categories: [],
  isLoading: true,
  isCloudMode: false,
  userId: null,
  hideBalance: false,

  toggleHideBalance: () => set((state) => ({ hideBalance: !state.hideBalance })),

  init: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (user) {
        set({ isCloudMode: true, userId: user.id });

        try {
          const [w, tx, b, g, d, r, c] = await Promise.all([
            supabase.from('wallets').select('*').eq('user_id', user.id),
            supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
            supabase.from('budgets').select('*').eq('user_id', user.id),
            supabase.from('goals').select('*').eq('user_id', user.id),
            supabase.from('debts').select('*').eq('user_id', user.id),
            supabase.from('recurring').select('*').eq('user_id', user.id),
            supabase.from('categories').select('*').eq('user_id', user.id),
          ]);

          // Fallback type: 'Bank' jika Supabase tidak memiliki kolom type
          let cloudWallets: Wallet[] = (w.data || []).map((item) => ({
            ...item,
            id: String(item.id),
            type: item.type || 'Bank',
          }));

          const cloudTx: Transaction[] = (tx.data || []).map((item) => ({ ...item, id: String(item.id) }));
          const cloudBudgets: Budget[] = (b.data || []).map((item) => ({ ...item, id: String(item.id) }));
          const cloudGoals: SavingsGoal[] = (g.data || []).map((item) => ({ ...item, id: String(item.id) }));
          const cloudDebts: DebtLoan[] = (d.data || []).map((item) => ({ ...item, id: String(item.id) }));
          const cloudRecurring: RecurringTransaction[] = (r.data || []).map((item) => ({ ...item, id: String(item.id) }));
          const cloudCategories: CustomCategory[] = (c.data || []).map((item) => ({ ...item, id: String(item.id) }));

          // Jika akun cloud baru dan belum memiliki dompet, buatkan dompet awal otomatis
          if (cloudWallets.length === 0) {
            const defaultWallet: Wallet = {
              id: crypto.randomUUID(),
              name: 'Dompet Tunai',
              balance: 0,
              color: '#004D57',
              type: 'Cash',
              user_id: user.id,
            };

            // Kirim ke Supabase tanpa id dan tanpa type agar kompatibel dengan schema tabel
            const { id: _, type: __, ...cloudPayload } = defaultWallet;
            const { data } = await supabase.from('wallets').insert([cloudPayload]).select().single();
            const finalWallet = { ...defaultWallet, id: data ? String(data.id) : defaultWallet.id };
            cloudWallets = [finalWallet];
          }

          if (cloudWallets.length > 0) await localDB.wallets.bulkPut(cloudWallets);
          if (cloudTx.length > 0) await localDB.transactions.bulkPut(cloudTx);

          set({ 
            wallets: cloudWallets, 
            transactions: cloudTx, 
            budgets: cloudBudgets, 
            goals: cloudGoals, 
            debts: cloudDebts,
            recurring: cloudRecurring,
            categories: cloudCategories,
            isLoading: false 
          });
          return;
        } catch (cloudErr) {
          console.error('Koneksi Supabase bermasalah, membaca basis data lokal:', cloudErr);
        }
      }

      // Mode Tamu / Offline
      set({ isCloudMode: false, userId: user ? user.id : null });
      const [lw, ltx, lb, lg, ld, lr, lc] = await Promise.all([
        localDB.wallets.toArray(),
        localDB.transactions.orderBy('date').reverse().toArray(),
        localDB.budgets.toArray(),
        localDB.goals.toArray(),
        localDB.debts.toArray(),
        localDB.recurring.toArray(),
        localDB.categories.toArray(),
      ]);

      if (lw.length === 0) {
        const defaultWallet: Wallet = {
          id: crypto.randomUUID(),
          name: 'Dompet Tunai',
          balance: 0,
          color: '#004D57',
          type: 'Cash',
        };
        await localDB.wallets.add(defaultWallet);
        lw.push(defaultWallet);
      }

      set({ 
        wallets: lw, 
        transactions: ltx, 
        budgets: lb, 
        goals: lg, 
        debts: ld,
        recurring: lr,
        categories: lc,
        isLoading: false 
      });
    } catch { 
      set({ isLoading: false }); 
    }
  },

  // ── DOMPET ──────────────────────────────────────────────────────────
  addWallet: async (walletData) => {
    const { isCloudMode, userId, wallets } = get();
    const tempId = crypto.randomUUID();
    const newWallet: Wallet = {
      ...walletData,
      id: tempId,
      user_id: userId || undefined,
    };

    // 1. Simpan ke localDB lengkap dengan type agar UI tetap memiliki tag 'Bank'/'Cash'
    await localDB.wallets.put(newWallet);
    set({ wallets: [...wallets, newWallet] });

    // 2. Kirim ke Supabase tanpa id dan tanpa type agar tidak gagal schema cache
    if (isCloudMode && userId) {
      try {
        const { id: _, type: __, ...cloudPayload } = newWallet;
        const { data, error } = await supabase
          .from('wallets')
          .insert([cloudPayload])
          .select()
          .single();

        if (error) {
          console.error('Gagal simpan wallet ke Cloud:', error.message);
        } else if (data) {
          const realId = String(data.id);
          await localDB.wallets.delete(tempId);
          await localDB.wallets.put({ ...newWallet, id: realId });
          set((state) => ({
            wallets: state.wallets.map((w) => w.id === tempId ? { ...newWallet, id: realId } : w),
          }));
        }
      } catch (err) {
        console.error('Koneksi addWallet error:', err);
      }
    }
  },

  updateWallet: async (id, updated) => {
    const { isCloudMode, userId, wallets } = get();
    set({ wallets: wallets.map(w => w.id === id ? { ...w, ...updated } : w) });
    await localDB.wallets.update(id, updated);

    if (isCloudMode && userId) {
      try {
        const { type: _, ...cloudUpdate } = updated as any;
        await supabase.from('wallets').update(cloudUpdate).eq('id', id);
      } catch (err) {
        console.error('Gagal updateWallet di Cloud:', err);
      }
    }
  },

  deleteWallet: async (id) => {
    const { isCloudMode, userId, wallets } = get();
    if (wallets.length <= 1) {
      alert('Anda harus menyisakan minimal satu dompet utama.');
      return;
    }

    set({ wallets: wallets.filter(w => w.id !== id) });
    await localDB.wallets.delete(id);

    if (isCloudMode && userId) {
      try {
        await supabase.from('wallets').delete().eq('id', id);
      } catch (err) {
        console.error('Gagal deleteWallet di Cloud:', err);
      }
    }
  },

  // ── TRANSAKSI & MUTASI ──────────────────────────────────────────────
  addTransaction: async (txData) => {
    const { isCloudMode, userId, transactions, wallets } = get();
    const tempId = crypto.randomUUID();
    const newTx: Transaction = { 
      ...txData, 
      id: tempId, 
      user_id: userId || undefined 
    };

    const targetWallet = wallets.find(w => String(w.id) === String(newTx.wallet_id));
    const adjustment = newTx.type === 'income' ? newTx.amount : -newTx.amount;
    const newBalance = targetWallet ? targetWallet.balance + adjustment : 0;

    await localDB.transactions.put(newTx);
    if (targetWallet) {
      await localDB.wallets.update(targetWallet.id, { balance: newBalance });
    }

    set({
      transactions: [newTx, ...transactions],
      wallets: wallets.map(w => String(w.id) === String(newTx.wallet_id) ? { ...w, balance: newBalance } : w),
    });

    if (isCloudMode && userId) {
      try {
        const { id: _, ...cloudPayload } = newTx;

        const { data, error: txErr } = await supabase
          .from('transactions')
          .insert([cloudPayload])
          .select()
          .single();

        if (txErr) {
          console.error('Gagal simpan transaksi ke Cloud:', txErr.message);
        } else if (data) {
          const realId = String(data.id);
          await localDB.transactions.delete(tempId);
          await localDB.transactions.put({ ...data, id: realId });

          set((state) => ({
            transactions: state.transactions.map((t) => t.id === tempId ? { ...data, id: realId } : t),
          }));
        }

        if (targetWallet) {
          await supabase.from('wallets').update({ balance: newBalance }).eq('id', targetWallet.id);
        }
      } catch (err) {
        console.error('Koneksi addTransaction error:', err);
      }
    }
  },

  addTransfer: async (fromId, toId, amount) => {
    const { isCloudMode, userId, wallets, transactions } = get();
    const fromW = wallets.find(w => String(w.id) === String(fromId));
    const toW = wallets.find(w => String(w.id) === String(toId));
    if (!fromW || !toW) return;

    const date = new Date().toISOString();
    const newFromBalance = fromW.balance - amount;
    const newToBalance = toW.balance + amount;

    const txExpense: Transaction = { 
      id: crypto.randomUUID(), 
      user_id: userId || undefined, 
      wallet_id: fromId, 
      category: 'Transfer Keluar', 
      amount, 
      type: 'expense', 
      description: `Transfer ke ${toW.name}`, 
      date 
    };
    const txIncome: Transaction = { 
      id: crypto.randomUUID(), 
      user_id: userId || undefined, 
      wallet_id: toId, 
      category: 'Transfer Masuk', 
      amount, 
      type: 'income', 
      description: `Terima dari ${fromW.name}`, 
      date 
    };

    set({
      wallets: wallets.map(w => {
        if (String(w.id) === String(fromId)) return { ...w, balance: newFromBalance };
        if (String(w.id) === String(toId)) return { ...w, balance: newToBalance };
        return w;
      }),
      transactions: [txExpense, txIncome, ...transactions],
    });

    await localDB.transactions.bulkAdd([txExpense, txIncome]);
    await localDB.wallets.update(fromId, { balance: newFromBalance });
    await localDB.wallets.update(toId, { balance: newToBalance });

    if (isCloudMode && userId) {
      try {
        const cloudTxs = [txExpense, txIncome].map(({ id: _, ...rest }) => rest);
        await supabase.from('transactions').insert(cloudTxs);
        await supabase.from('wallets').update({ balance: newFromBalance }).eq('id', fromId);
        await supabase.from('wallets').update({ balance: newToBalance }).eq('id', toId);
      } catch (err) {
        console.error('Gagal simpan transfer ke Cloud:', err);
      }
    }
  },

  updateTransaction: async (id, updated) => {
    const { isCloudMode, userId, transactions } = get();
    const oldTx = transactions.find((t) => String(t.id) === String(id));
    if (!oldTx) return;

    const newTx: Transaction = { ...oldTx, ...updated };
    set({ transactions: transactions.map(t => String(t.id) === String(id) ? newTx : t) });
    await localDB.transactions.put(newTx);

    if (isCloudMode && userId) {
      try {
        const { id: _, ...cloudUpdate } = updated as any;
        await supabase.from('transactions').update(cloudUpdate).eq('id', id);
      } catch (err) {
        console.error('Gagal update transaksi di Cloud:', err);
      }
    }
  },

  deleteTransaction: async (id) => {
    const { isCloudMode, userId, transactions, wallets } = get();
    const tx = transactions.find((t) => String(t.id) === String(id));
    if (!tx) return;

    const wallet = wallets.find((w) => String(w.id) === String(tx.wallet_id));
    if (wallet) {
      const revBalance = wallet.balance + (tx.type === 'income' ? -tx.amount : tx.amount);
      await localDB.wallets.update(wallet.id, { balance: revBalance });
      set({ wallets: wallets.map(w => String(w.id) === String(wallet.id) ? { ...w, balance: revBalance } : w) });

      if (isCloudMode && userId) {
        await supabase.from('wallets').update({ balance: revBalance }).eq('id', wallet.id);
      }
    }

    set({ transactions: transactions.filter(t => String(t.id) !== String(id)) });
    await localDB.transactions.delete(id);

    if (isCloudMode && userId) {
      try {
        await supabase.from('transactions').delete().eq('id', id);
      } catch (err) {
        console.error('Gagal delete transaksi di Cloud:', err);
      }
    }
  },

  // ── BUDGET ──────────────────────────────────────────────────────────
  upsertBudget: async (budgetData) => {
    const { isCloudMode, userId, budgets } = get();
    const tempId = crypto.randomUUID();
    const newBudget: Budget = { ...budgetData, id: tempId, user_id: userId || undefined };

    set({ budgets: [...budgets.filter(b => b.category_id !== budgetData.category_id), newBudget] });
    await localDB.budgets.put(newBudget);

    if (isCloudMode && userId) {
      try {
        const { id: _, ...cloudPayload } = newBudget;
        await supabase.from('budgets').upsert([cloudPayload]);
      } catch (err) {
        console.error('Gagal upsertBudget ke Cloud:', err);
      }
    }
  },

  deleteBudget: async (id) => {
    const { isCloudMode, userId, budgets } = get();
    set({ budgets: budgets.filter(b => String(b.id) !== String(id)) });
    await localDB.budgets.delete(id);

    if (isCloudMode && userId) {
      try {
        await supabase.from('budgets').delete().eq('id', id);
      } catch (err) {
        console.error('Gagal deleteBudget di Cloud:', err);
      }
    }
  },

  // ── TABUNGAN (GOALS) ────────────────────────────────────────────────
  addGoal: async (goalData) => {
    const { isCloudMode, userId, goals } = get();
    const tempId = crypto.randomUUID();
    const newGoal: SavingsGoal = { ...goalData, id: tempId, user_id: userId || undefined };

    set({ goals: [...goals, newGoal] });
    await localDB.goals.put(newGoal);

    if (isCloudMode && userId) {
      try {
        const { id: _, ...cloudPayload } = newGoal;
        const { data } = await supabase.from('goals').insert([cloudPayload]).select().single();
        if (data) {
          const realId = String(data.id);
          await localDB.goals.delete(tempId);
          await localDB.goals.put({ ...data, id: realId });
          set((state) => ({
            goals: state.goals.map((g) => g.id === tempId ? { ...data, id: realId } : g),
          }));
        }
      } catch (err) {
        console.error('Gagal addGoal ke Cloud:', err);
      }
    }
  },

  updateGoalAmount: async (id, newAmount) => {
    const { isCloudMode, userId, goals } = get();
    set({ goals: goals.map(g => String(g.id) === String(id) ? { ...g, current_amount: newAmount } : g) });
    await localDB.goals.update(id, { current_amount: newAmount });

    if (isCloudMode && userId) {
      try {
        await supabase.from('goals').update({ current_amount: newAmount }).eq('id', id);
      } catch (err) {
        console.error('Gagal updateGoal ke Cloud:', err);
      }
    }
  },

  withdrawGoalAmount: async (goalId, walletId, amount) => {
    const { isCloudMode, userId, goals, wallets, transactions } = get();
    const goal = goals.find(g => String(g.id) === String(goalId));
    const wallet = wallets.find(w => String(w.id) === String(walletId));
    if (!goal || !wallet || amount <= 0 || amount > goal.current_amount) return;

    const newGoalAmount = goal.current_amount - amount;
    const newWalletBalance = wallet.balance + amount;

    const tx: Transaction = {
      id: crypto.randomUUID(),
      user_id: userId || undefined,
      wallet_id: walletId,
      category: 'Pencairan Tabungan',
      amount: amount,
      type: 'income',
      description: `Pencairan Dana: ${goal.title}`,
      date: new Date().toISOString(),
    };

    set({
      goals: goals.map(g => String(g.id) === String(goalId) ? { ...g, current_amount: newGoalAmount } : g),
      wallets: wallets.map(w => String(w.id) === String(walletId) ? { ...w, balance: newWalletBalance } : w),
      transactions: [tx, ...transactions],
    });

    await localDB.goals.update(goalId, { current_amount: newGoalAmount });
    await localDB.wallets.update(walletId, { balance: newWalletBalance });
    await localDB.transactions.put(tx);

    if (isCloudMode && userId) {
      try {
        const { id: _, ...cloudTx } = tx;
        await supabase.from('goals').update({ current_amount: newGoalAmount }).eq('id', goalId);
        await supabase.from('wallets').update({ balance: newWalletBalance }).eq('id', walletId);
        await supabase.from('transactions').insert([cloudTx]);
      } catch (err) {
        console.error('Gagal withdrawGoal ke Cloud:', err);
      }
    }
  },

  deleteGoal: async (id) => {
    const { isCloudMode, userId, goals } = get();
    set({ goals: goals.filter(g => String(g.id) !== String(id)) });
    await localDB.goals.delete(id);

    if (isCloudMode && userId) {
      try {
        await supabase.from('goals').delete().eq('id', id);
      } catch (err) {
        console.error('Gagal deleteGoal di Cloud:', err);
      }
    }
  },

  // ── HUTANG & PIUTANG ────────────────────────────────────────────────
  addDebtLoan: async (itemData) => {
    const { isCloudMode, userId, debts } = get();
    const tempId = crypto.randomUUID();
    const newItem: DebtLoan = { ...itemData, id: tempId, user_id: userId || undefined };

    set({ debts: [newItem, ...debts] });
    await localDB.debts.put(newItem);

    if (isCloudMode && userId) {
      try {
        const { id: _, ...cloudPayload } = newItem;
        const { data } = await supabase.from('debts').insert([cloudPayload]).select().single();
        if (data) {
          const realId = String(data.id);
          await localDB.debts.delete(tempId);
          await localDB.debts.put({ ...data, id: realId });
          set((state) => ({
            debts: state.debts.map((d) => d.id === tempId ? { ...data, id: realId } : d),
          }));
        }
      } catch (err) {
        console.error('Gagal addDebtLoan ke Cloud:', err);
      }
    }
  },

  settleDebtLoan: async (id, settleAmount, walletId) => {
    const { isCloudMode, userId, debts, wallets, transactions } = get();
    const item = debts.find(d => String(d.id) === String(id));
    const wallet = wallets.find(w => String(w.id) === String(walletId));
    if (!item || !wallet) return;

    const newPaid = item.paid_amount + settleAmount;
    const newStatus = newPaid >= item.amount ? 'paid' : 'partial';
    const isPayingDebt = item.type === 'debt';
    const txType: TransactionType = isPayingDebt ? 'expense' : 'income';
    const desc = isPayingDebt 
      ? `Bayar Hutang ke ${item.person_name}` 
      : `Terima Pelunasan Piutang dari ${item.person_name}`;

    const tx: Transaction = {
      id: crypto.randomUUID(),
      user_id: userId || undefined,
      wallet_id: walletId,
      category: isPayingDebt ? 'Pembayaran Hutang' : 'Penerimaan Piutang',
      amount: settleAmount,
      type: txType,
      description: desc,
      date: new Date().toISOString(),
    };

    const newBalance = wallet.balance + (isPayingDebt ? -settleAmount : settleAmount);

    set({
      debts: debts.map(d => String(d.id) === String(id) ? { ...d, paid_amount: newPaid, status: newStatus } : d),
      wallets: wallets.map(w => String(w.id) === String(walletId) ? { ...w, balance: newBalance } : w),
      transactions: [tx, ...transactions],
    });

    await localDB.debts.update(id, { paid_amount: newPaid, status: newStatus });
    await localDB.wallets.update(walletId, { balance: newBalance });
    await localDB.transactions.put(tx);

    if (isCloudMode && userId) {
      try {
        const { id: _, ...cloudTx } = tx;
        await supabase.from('debts').update({ paid_amount: newPaid, status: newStatus }).eq('id', id);
        await supabase.from('wallets').update({ balance: newBalance }).eq('id', walletId);
        await supabase.from('transactions').insert([cloudTx]);
      } catch (err) {
        console.error('Gagal settleDebtLoan ke Cloud:', err);
      }
    }
  },

  deleteDebtLoan: async (id) => {
    const { isCloudMode, userId, debts } = get();
    set({ debts: debts.filter(d => String(d.id) !== String(id)) });
    await localDB.debts.delete(id);

    if (isCloudMode && userId) {
      try {
        await supabase.from('debts').delete().eq('id', id);
      } catch (err) {
        console.error('Gagal deleteDebtLoan di Cloud:', err);
      }
    }
  },

  // ── TAGIHAN RUTIN ───────────────────────────────────────────────────
  addRecurring: async (itemData) => {
    const { isCloudMode, userId, recurring } = get();
    const tempId = crypto.randomUUID();
    const newItem: RecurringTransaction = { ...itemData, id: tempId, user_id: userId || undefined };

    set({ recurring: [newItem, ...recurring] });
    await localDB.recurring.put(newItem);

    if (isCloudMode && userId) {
      try {
        const { id: _, ...cloudPayload } = newItem;
        const { data } = await supabase.from('recurring').insert([cloudPayload]).select().single();
        if (data) {
          const realId = String(data.id);
          await localDB.recurring.delete(tempId);
          await localDB.recurring.put({ ...data, id: realId });
          set((state) => ({
            recurring: state.recurring.map((r) => r.id === tempId ? { ...data, id: realId } : r),
          }));
        }
      } catch (err) {
        console.error('Gagal addRecurring ke Cloud:', err);
      }
    }
  },

  toggleRecurring: async (id) => {
    const { isCloudMode, userId, recurring } = get();
    const item = recurring.find(r => String(r.id) === String(id));
    if (!item) return;

    const newActive = !item.active;
    set({ recurring: recurring.map(r => String(r.id) === String(id) ? { ...r, active: newActive } : r) });
    await localDB.recurring.update(id, { active: newActive });

    if (isCloudMode && userId) {
      try {
        await supabase.from('recurring').update({ active: newActive }).eq('id', id);
      } catch (err) {
        console.error('Gagal toggleRecurring di Cloud:', err);
      }
    }
  },

  deleteRecurring: async (id) => {
    const { isCloudMode, userId, recurring } = get();
    set({ recurring: recurring.filter(r => String(r.id) !== String(id)) });
    await localDB.recurring.delete(id);

    if (isCloudMode && userId) {
      try {
        await supabase.from('recurring').delete().eq('id', id);
      } catch (err) {
        console.error('Gagal deleteRecurring di Cloud:', err);
      }
    }
  },

  // ── KATEGORI KUSTOM ─────────────────────────────────────────────────
  addCategory: async (catData) => {
    const { isCloudMode, userId, categories } = get();
    const tempId = crypto.randomUUID();
    const newCat: CustomCategory = { ...catData, id: tempId, user_id: userId || undefined };

    set({ categories: [...categories, newCat] });
    await localDB.categories.put(newCat);

    if (isCloudMode && userId) {
      try {
        const { id: _, ...cloudPayload } = newCat;
        const { data } = await supabase.from('categories').insert([cloudPayload]).select().single();
        if (data) {
          const realId = String(data.id);
          await localDB.categories.delete(tempId);
          await localDB.categories.put({ ...data, id: realId });
          set((state) => ({
            categories: state.categories.map((c) => c.id === tempId ? { ...data, id: realId } : c),
          }));
        }
      } catch (err) {
        console.error('Gagal addCategory ke Cloud:', err);
      }
    }
  },

  deleteCategory: async (id) => {
    const { isCloudMode, userId, categories } = get();
    set({ categories: categories.filter(c => String(c.id) !== String(id)) });
    await localDB.categories.delete(id);

    if (isCloudMode && userId) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.error('Gagal deleteCategory di Cloud:', err);
      }
    }
  },

  // ── SINKRONISASI DATA TAMU KE CLOUD ─────────────────────────────────
  syncGuestToCloud: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const uid = session.user.id;
    
    const [lw, ltx, lb, lg, ld, lr, lc] = await Promise.all([
      localDB.wallets.toArray(), 
      localDB.transactions.toArray(), 
      localDB.budgets.toArray(), 
      localDB.goals.toArray(),
      localDB.debts.toArray(),
      localDB.recurring.toArray(),
      localDB.categories.toArray(),
    ]);

    // Hilangkan field id dan type saat sinkronisasi dompet ke Supabase
    if (lw.length) {
      const cloudWallets = lw.map(({ id, type, ...x }) => ({ ...x, user_id: uid }));
      await supabase.from('wallets').upsert(cloudWallets);
    }
    if (ltx.length) await supabase.from('transactions').upsert(ltx.map(({ id, ...x }) => ({ ...x, user_id: uid })));
    if (lb.length) await supabase.from('budgets').upsert(lb.map(({ id, ...x }) => ({ ...x, user_id: uid })));
    if (lg.length) await supabase.from('goals').upsert(lg.map(({ id, ...x }) => ({ ...x, user_id: uid })));
    if (ld.length) await supabase.from('debts').upsert(ld.map(({ id, ...x }) => ({ ...x, user_id: uid })));
    if (lr.length) await supabase.from('recurring').upsert(lr.map(({ id, ...x }) => ({ ...x, user_id: uid })));
    if (lc.length) await supabase.from('categories').upsert(lc.map(({ id, ...x }) => ({ ...x, user_id: uid })));

    await get().init();
  }
}));