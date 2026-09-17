'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Wallet as WalletIcon } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { DebtLoan } from '@/types/database';
import { AccentButton } from '../ui/Kit';

export const SettleDebtModal = ({
  debt,
  isOpen,
  onClose,
}: {
  debt: DebtLoan | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { wallets, settleDebtLoan } = useFinancialStore();
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !debt) return null;

  const remaining = debt.amount - debt.paid_amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!numAmount || numAmount <= 0 || !walletId) return;

    setIsSubmitting(true);
    try {
      await settleDebtLoan(debt.id, numAmount, walletId);
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
            <CheckCircle size={18} className="text-[#00838F]" />
            Pelunasan: {debt.person_name}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#F8FAFC]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 bg-[#0B1120] rounded-xl border border-[#334155] flex justify-between items-center text-xs">
            <div>
              <p className="text-[#94A3B8]">Sisa Tagihan:</p>
              <p className="text-lg font-bold font-mono text-[#F8FAFC] mt-0.5">
                Rp {remaining.toLocaleString('id-ID')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAmount(remaining.toString())}
              className="px-3 py-1.5 bg-[#00838F]/20 text-[#00838F] font-bold rounded-lg text-[11px] hover:bg-[#00838F]/30 transition-colors"
            >
              Bayar Lunas
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <WalletIcon size={14} /> Sumber / Tujuan Dompet
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Nominal Pembayaran (Rp)</label>
            <input
              type="number"
              required
              min="1000"
              max={remaining}
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 px-4 bg-[#0B1120] border border-[#334155] rounded-[14px] text-lg font-bold font-mono text-[#00838F] focus:outline-none focus:border-[#00838F]"
            />
          </div>

          <AccentButton
            type="submit"
            label={isSubmitting ? 'Memproses...' : 'Konfirmasi Pembayaran'}
            isLoading={isSubmitting}
            className="w-full mt-2 cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};