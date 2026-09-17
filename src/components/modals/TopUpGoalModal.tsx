'use client';

import React, { useState } from 'react';
import { X, PiggyBank, Wallet as WalletIcon } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { SavingsGoal } from '@/types/database';
import { AccentButton } from '../ui/Kit';

export const TopUpGoalModal = ({
  goal,
  isOpen,
  onClose,
}: {
  goal: SavingsGoal | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { wallets, updateGoalAmount, addTransaction } = useFinancialStore();
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !goal) return null;

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!numAmount || numAmount <= 0 || !walletId) return;

    setIsSubmitting(true);
    try {
      // 1. Catat mutasi pengeluaran dari dompet sebagai pos Tabungan
      await addTransaction({
        wallet_id: walletId,
        amount: numAmount,
        type: 'expense',
        category: 'Tabungan & Investasi',
        description: `Setor Tabungan: ${goal.title}`,
        date: new Date().toISOString(),
      });

      // 2. Tambah akumulasi saldo pada goal
      await updateGoalAmount(goal.id, goal.current_amount + numAmount);

      setAmount('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-[20px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
            <PiggyBank size={18} className="text-[#00838F]" />
            Setor Tabungan: {goal.title}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleTopUp} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <WalletIcon size={14} /> Sumber Dompet
            </label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full h-12 px-3 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00838F]"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Rp {w.balance.toLocaleString('id-ID')})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Nominal Alokasi (Rp)</label>
            <input
              type="number"
              required
              min="1000"
              placeholder="Rp 0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 px-4 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xl font-bold font-mono text-[#00838F] focus:outline-none focus:border-[#00838F]"
            />
          </div>

          <AccentButton
            type="submit"
            label={isSubmitting ? 'Mengalokasikan...' : 'Konfirmasi Setor Saldo'}
            isLoading={isSubmitting}
            className="w-full mt-2 cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};