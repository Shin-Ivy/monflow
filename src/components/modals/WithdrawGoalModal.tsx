'use client';

import React, { useState } from 'react';
import { X, ArrowDownRight, Wallet as WalletIcon } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { SavingsGoal } from '@/types/database';
import { AccentButton } from '../ui/Kit';

export const WithdrawGoalModal = ({
  goal,
  isOpen,
  onClose,
}: {
  goal: SavingsGoal | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { wallets, withdrawGoalAmount } = useFinancialStore();
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !goal) return null;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!numAmount || numAmount <= 0 || numAmount > goal.current_amount || !walletId) return;

    setIsSubmitting(true);
    try {
      await withdrawGoalAmount(goal.id, walletId, numAmount);
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
            <ArrowDownRight size={18} className="text-[#EB7500]" />
            Cairkan Dana: {goal.title}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#F8FAFC]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleWithdraw} className="p-6 space-y-4">
          <div className="p-4 bg-[#0B1120] rounded-xl border border-[#334155] flex justify-between items-center text-xs">
            <div>
              <p className="text-[#94A3B8]">Saldo Terkumpul Saat Ini:</p>
              <p className="text-lg font-bold font-mono text-[#00838F] mt-0.5">
                Rp {goal.current_amount.toLocaleString('id-ID')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAmount(goal.current_amount.toString())}
              className="px-3 py-1.5 bg-[#EB7500]/20 text-[#EB7500] font-bold rounded-lg text-[11px] hover:bg-[#EB7500]/30 transition-colors"
            >
              Cairkan Semua
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <WalletIcon size={14} /> Dompet Penerima Dana
            </label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full h-11 px-3 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs text-[#F8FAFC]"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Rp {w.balance.toLocaleString('id-ID')})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Nominal Pencairan (Rp)</label>
            <input
              type="number"
              required
              min="1000"
              max={goal.current_amount}
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 px-4 bg-[#0B1120] border border-[#334155] rounded-[14px] text-lg font-bold font-mono text-[#EB7500] focus:outline-none focus:border-[#EB7500]"
            />
          </div>

          <AccentButton
            type="submit"
            label={isSubmitting ? 'Memproses...' : 'Konfirmasi Pencairan Dana'}
            isLoading={isSubmitting}
            className="w-full mt-2 cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};