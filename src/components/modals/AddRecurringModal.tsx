'use client';

import React, { useState, useEffect } from 'react';
import { X, CalendarClock, Wallet as WalletIcon } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AccentButton } from '../ui/Kit';

export const AddRecurringModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { categories, wallets, addRecurring } = useFinancialStore();
  const { showToast } = useToastStore();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Tagihan');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [dueDay, setDueDay] = useState('1');
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
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
    if (!title.trim() || !numAmount || numAmount <= 0) return;

    setIsSubmitting(true);
    try {
      const dayNum = parseInt(dueDay, 10) || 1;
      const now = new Date();
      let nextDate = new Date(now.getFullYear(), now.getMonth(), dayNum);
      if (nextDate <= now) {
        nextDate = new Date(now.getFullYear(), now.getMonth() + 1, dayNum);
      }

      await addRecurring({
        title: title.trim(),
        amount: numAmount,
        category,
        due_day: dayNum,
        frequency,
        active: true,
        type: 'expense',
        wallet_id: walletId || wallets[0]?.id || '',
        next_due_date: nextDate.toISOString(),
      });

      showToast(`Tagihan rutin "${title}" berhasil didaftarkan!`, 'success');
      setTitle('');
      setAmount('');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan tagihan rutin', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-[24px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#334155]/80">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
            <CalendarClock size={18} className="text-[#00838F]" /> Tambah Komitmen Tagihan
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Nama Tagihan / Langganan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: WiFi Rumah, Listrik PLN, Netflix..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Nominal Beban (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold font-mono text-[#DB2777]">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="0"
                value={formattedAmount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-lg font-bold font-mono text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] flex items-center gap-1.5">
              <WalletIcon size={13} /> Sumber Dompet Pembayaran
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
                Jatuh Tempo (Tgl)
              </label>
              <input
                type="number"
                min="1"
                max="31"
                required
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
                Frekuensi
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full h-11 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none cursor-pointer focus:border-[#00838F]"
              >
                <option value="monthly" className="bg-white dark:bg-[#0B1120]">Bulanan</option>
                <option value="yearly" className="bg-white dark:bg-[#0B1120]">Tahunan</option>
              </select>
            </div>
          </div>

          <AccentButton
            type="submit"
            label={isSubmitting ? 'Menyimpan...' : 'Daftarkan Tagihan'}
            isLoading={isSubmitting}
            className="w-full !h-12 mt-2 cursor-pointer shadow-md"
          />
        </form>
      </div>
    </div>
  );
};