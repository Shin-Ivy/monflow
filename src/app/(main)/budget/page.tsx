'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { SetBudgetModal } from '@/components/modals/SetBudgetModal';
import { AccentButton } from '@/components/ui/Kit';

export default function BudgetPage() {
  const { budgets, transactions, deleteBudget } = useFinancialStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Hitung pengeluaran per kategori bulan ini
  const spentMap = useMemo(() => {
    const map: { [key: string]: number } = {};
    transactions
      .filter((t) => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [transactions, currentMonth, currentYear]);

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Anggaran Bulanan</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kendalikan pengeluaran per kategori agar tetap terencana dan hemat.
          </p>
        </div>
        <AccentButton
          label="Set Limit Anggaran"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          className="!h-10 !px-4 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => {
          const catName = (b as any).category_name || b.category_id;
          const limit = (b as any).monthly_limit || (b as any).limit_amount || 0;
          const spent = spentMap[catName] || 0;
          const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
          const isOver = spent > limit;

          return (
            <div
              key={b.id}
              className="p-6 rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm space-y-4 hover:border-[#00838F]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-[#00838F] flex items-center justify-center">
                      <PieChart size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{catName}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bulan Ini</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteBudget(b.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Hapus Limit"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-slate-500 dark:text-slate-400">PEMAKAIAN</span>
                    <span className={isOver ? 'text-rose-500 font-bold' : 'text-[#00838F]'}>
                      {percent}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-[#070B14] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-rose-500' : 'bg-gradient-to-r from-[#00838F] to-[#EB7500]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-[#26354A] mt-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Terpakai</span>
                    <p className="text-sm font-bold font-mono text-slate-900 dark:text-white">{formatRupiah(spent)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Limit Maksimal</span>
                    <p className="text-sm font-bold font-mono text-[#00838F]">{formatRupiah(limit)}</p>
                  </div>
                </div>
              </div>

              {isOver && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Pengeluaran melebihi limit anggaran!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="p-12 text-center rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] text-slate-400 text-xs">
          Belum ada pos anggaran bulanan yang ditentukan.
        </div>
      )}

      <SetBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}