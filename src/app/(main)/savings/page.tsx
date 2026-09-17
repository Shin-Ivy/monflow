'use client';

import React, { useState } from 'react';
import { Target, Plus, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AddGoalModal } from '@/components/modals/AddGoalModal';
import { AccentButton } from '@/components/ui/Kit';

export default function SavingsPage() {
  const { goals, wallets, updateGoalAmount, withdrawGoalAmount, deleteGoal } = useFinancialStore();
  const { showToast } = useToastStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const handleDeposit = async (id: string, current: number) => {
    const input = window.prompt('Masukkan nominal setoran tabungan (Rp):');
    if (!input) return;
    const num = parseFloat(input.replace(/[^0-9]/g, ''));
    if (!num || num <= 0) return;
    await updateGoalAmount(id, current + num);
    showToast('Berhasil menambahkan dana ke tabungan!', 'success');
  };

  const handleWithdraw = async (goalId: string, current: number) => {
    if (wallets.length === 0) {
      showToast('Anda belum memiliki dompet tujuan pencairan!', 'error');
      return;
    }
    const input = window.prompt(`Nominal pencairan (Maksimal ${formatRupiah(current)}):`);
    if (!input) return;
    const num = parseFloat(input.replace(/[^0-9]/g, ''));
    if (!num || num <= 0 || num > current) {
      showToast('Nominal tidak valid atau melebihi saldo tabungan!', 'error');
      return;
    }
    await withdrawGoalAmount(goalId, wallets[0].id, num);
    showToast(`Dana ${formatRupiah(num)} berhasil dicairkan ke ${wallets[0].name}!`, 'success');
  };

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Target & Pos Tabungan</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Wujudkan impianmu dengan menabung secara konsisten.</p>
        </div>
        <AccentButton
          label="Buat Target"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          className="!h-10 !px-4 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
          const remaining = Math.max(0, goal.target_amount - goal.current_amount);

          return (
            <div
              key={goal.id}
              className="p-6 rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm space-y-4 hover:border-[#00838F]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-[#00838F] flex items-center justify-center shadow-xs">
                    <Target size={22} />
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Hapus Target"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">{goal.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target: {goal.target_date ? new Date(goal.target_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Tanpa batas waktu'}
                </p>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-slate-500 dark:text-slate-400">PROGRESS</span>
                    <span className="text-[#00838F]">{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-[#070B14] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00838F] to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-[#26354A] mt-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Terkumpul</span>
                    <p className="text-sm font-bold font-mono text-slate-900 dark:text-white">{formatRupiah(goal.current_amount)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Kekurangan</span>
                    <p className="text-sm font-bold font-mono text-rose-500">{formatRupiah(remaining)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleDeposit(goal.id, goal.current_amount)}
                  className="py-2.5 rounded-[12px] bg-teal-500/10 text-[#00838F] hover:bg-teal-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowUpCircle size={15} /> Setor Dana
                </button>
                <button
                  onClick={() => handleWithdraw(goal.id, goal.current_amount)}
                  className="py-2.5 rounded-[12px] bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowDownCircle size={15} /> Cairkan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="p-12 text-center rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] text-slate-400 text-xs">
          Belum ada pos target tabungan yang dibuat.
        </div>
      )}

      <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}