'use client';

import React, { useState, useEffect } from 'react';
import { X, HandCoins, Wallet as WalletIcon } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AccentButton } from '../ui/Kit';

export const AddDebtModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { addDebtLoan, wallets } = useFinancialStore();
  const { showToast } = useToastStore();

  const [type, setType] = useState<'debt' | 'loan'>('debt');
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!walletId && wallets.length > 0) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  if (!isOpen) return null;

  const formattedAmount = amount
    ? new Intl.NumberFormat('id-ID').format(parseInt(amount, 10))
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!personName.trim() || !numAmount || numAmount <= 0) return;

    setIsSubmitting(true);
    try {
      const finalDueDate = dueDate 
        ? new Date(dueDate).toISOString() 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      await addDebtLoan({
        type,
        person_name: personName.trim(),
        amount: numAmount,
        paid_amount: 0,
        due_date: finalDueDate,
        notes: notes.trim() || undefined,
        status: 'unpaid',
        wallet_id: walletId || wallets[0]?.id || '',
      });

      showToast(`Catatan ${type === 'debt' ? 'hutang' : 'piutang'} berhasil dibuat!`, 'success');
      setPersonName('');
      setAmount('');
      setNotes('');
      setDueDate('');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-[24px] shadow-2xl overflow-hidden transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#334155]/80">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
            <HandCoins size={18} className="text-[#00838F]" /> Catat Hutang / Piutang
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-[#0B1120] rounded-[14px] border border-slate-200 dark:border-[#334155]">
            <button
              type="button"
              onClick={() => setType('debt')}
              className={`py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                type === 'debt' ? 'bg-[#DB2777] text-white shadow-md' : 'text-slate-600 dark:text-[#94A3B8]'
              }`}
            >
              Hutang (Saya Pinjam)
            </button>
            <button
              type="button"
              onClick={() => setType('loan')}
              className={`py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                type === 'loan' ? 'bg-[#EB7500] text-white shadow-md' : 'text-slate-600 dark:text-[#94A3B8]'
              }`}
            >
              Piutang (Orang Pinjam)
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Nama Orang / Pihak
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi, Andi, Bank..."
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Nominal (Rp)
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold font-mono ${type === 'debt' ? 'text-[#DB2777]' : 'text-[#EB7500]'}`}>
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="0"
                value={formattedAmount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className={`w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-lg font-bold font-mono outline-none focus:border-[#00838F] text-slate-900 dark:text-[#F8FAFC] ${
                  type === 'debt' ? 'text-[#DB2777]' : 'text-[#EB7500]'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] flex items-center gap-1.5">
              <WalletIcon size={13} /> Dompet Terkait
            </label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none cursor-pointer focus:border-[#00838F]"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id} className="bg-white dark:bg-[#0B1120]">
                  {w.name} (Rp {w.balance.toLocaleString('id-ID')})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Jatuh Tempo (Opsional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Catatan Keterangan
            </label>
            <input
              type="text"
              placeholder="Contoh: Pinjaman modal usaha, bayar makan siang..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-11 px-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
            />
          </div>

          <AccentButton
            type="submit"
            label={isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            isLoading={isSubmitting}
            className="w-full !h-12 mt-2 cursor-pointer shadow-md"
          />
        </form>
      </div>
    </div>
  );
};