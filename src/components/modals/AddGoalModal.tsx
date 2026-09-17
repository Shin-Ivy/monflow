'use client';

import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AccentButton } from '../ui/Kit';

export const AddGoalModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { addGoal } = useFinancialStore();
  const { showToast } = useToastStore();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const formattedTarget = targetAmount
    ? new Intl.NumberFormat('id-ID').format(parseInt(targetAmount, 10))
    : '';

  const formattedCurrent = currentAmount
    ? new Intl.NumberFormat('id-ID').format(parseInt(currentAmount, 10))
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = parseFloat(targetAmount);
    if (!title.trim() || !numTarget || numTarget <= 0) return;

    setIsSubmitting(true);
    try {
      // Default tanggal 1 tahun ke depan jika tanggal tidak diisi
      const finalTargetDate = targetDate 
        ? new Date(targetDate).toISOString() 
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      await addGoal({
        title: title.trim(),
        target_amount: numTarget,
        current_amount: currentAmount ? parseFloat(currentAmount) : 0,
        target_date: finalTargetDate,
      });

      showToast(`Target tabungan "${title}" berhasil dibuat!`, 'success');
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('');
      setTargetDate('');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan target tabungan', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-[24px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#334155]/80">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
            <Target size={18} className="text-[#00838F]" /> Target Tabungan Baru
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Nama Impian / Target
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Liburan ke Mekkah, Beli Laptop..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Nominal Target (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold font-mono text-[#00838F]">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="0"
                value={formattedTarget}
                onChange={(e) => setTargetAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-lg font-bold font-mono text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Saldo Awal Terkumpul (Opsional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold font-mono text-slate-400">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={formattedCurrent}
                onChange={(e) => setCurrentAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-base font-bold font-mono text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Target Waktu Tercapai
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
            />
          </div>

          <AccentButton
            type="submit"
            label={isSubmitting ? 'Menyimpan...' : 'Buat Target Tabungan'}
            isLoading={isSubmitting}
            className="w-full !h-12 mt-2 cursor-pointer shadow-md"
          />
        </form>
      </div>
    </div>
  );
};