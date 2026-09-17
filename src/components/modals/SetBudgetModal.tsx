'use client';

import React, { useState, useEffect } from 'react';
import { X, PieChart, Tag } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { AccentButton } from '../ui/Kit';

const DEFAULT_CATEGORIES = [
  'Makanan & Minuman',
  'Transportasi',
  'Belanja & Kebutuhan',
  'Langganan & Utilitas',
  'Hiburan & Rekreasi',
  'Kesehatan',
  'Lainnya',
];

export const SetBudgetModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { upsertBudget, categories } = useFinancialStore();

  // Ambil kategori pengeluaran dari store jika ada, jika tidak pakai default
  const expenseCategories = categories?.filter((c) => c.type === 'expense') || [];
  const categoryList = expenseCategories.length > 0 
    ? expenseCategories.map((c) => c.name) 
    : DEFAULT_CATEGORIES;

  const [category, setCategory] = useState(categoryList[0] || 'Makanan & Minuman');
  const [limit, setLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categoryList.length > 0 && !categoryList.includes(category)) {
      setCategory(categoryList[0]);
    }
  }, [categoryList, category]);

  if (!isOpen) return null;

  // Format angka ke titik ribuan (contoh: 50.000, 90.000.000)
  const formattedLimit = limit
    ? new Intl.NumberFormat('id-ID').format(parseInt(limit, 10))
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericLimit = parseFloat(limit);
    if (!numericLimit || numericLimit <= 0) return;

    setIsSubmitting(true);
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
      await upsertBudget({
        category_id: category,
        monthly_limit: numericLimit,
        month_period: currentMonth,
      } as any);
      setLimit('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-[24px] shadow-2xl overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#334155]/80">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
            <PieChart size={18} className="text-[#00838F]" />
            Atur Limit Anggaran
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Pilih Kategori */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] flex items-center gap-1.5">
              <Tag size={14} /> Pilih Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F] cursor-pointer transition-colors"
            >
              {categoryList.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Batas Maksimal Bulanan dengan Format Titik */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Batas Maksimal Bulanan (Rp)
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
                value={formattedLimit}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setLimit(raw);
                }}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-2xl font-bold font-mono text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F] transition-colors"
              />
            </div>
          </div>

          {/* Tombol Simpan */}
          <AccentButton
            type="submit"
            label={isSubmitting ? 'Menyimpan...' : 'Simpan Limit Anggaran'}
            isLoading={isSubmitting}
            className="w-full !h-12 mt-2 cursor-pointer shadow-md"
          />
        </form>
      </div>
    </div>
  );
};