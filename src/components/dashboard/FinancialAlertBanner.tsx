'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle, Sparkles, ChevronRight, X } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';

export const FinancialAlertBanner = () => {
  const { wallets, goals } = useFinancialStore();
  const [dismissLowBalance, setDismissLowBalance] = React.useState(false);
  const [dismissSavings, setDismissSavings] = React.useState(false);

  // 1. Deteksi Dompet Saldo Rendah (< Rp 50.000)
  const lowBalanceWallet = useMemo(() => {
    return wallets.find((w) => w.balance > 0 && w.balance < 50000);
  }, [wallets]);

  // 2. Evaluasi Tabungan (Ada target yang belum tercapai)
  const activeGoal = useMemo(() => {
    return goals.find((g) => g.current_amount < g.target_amount);
  }, [goals]);

  return (
    <div className="space-y-3">
      {/* Alert Saldo Menipis */}
      {lowBalanceWallet && !dismissLowBalance && (
        <div className="p-4 rounded-[16px] bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-300 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-xs font-bold">Peringatan Saldo Menipis</p>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Saldo di <span className="font-semibold">{lowBalanceWallet.name}</span> tersisa kurang dari Rp 50.000. Pertimbangkan untuk top up.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissLowBalance(true)}
            className="p-1 text-amber-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Pengingat Evaluasi Tabungan */}
      {activeGoal && !dismissSavings && (
        <div className="p-4 rounded-[16px] bg-[#004D57]/30 border border-[#00838F]/40 flex items-center justify-between gap-3 text-[#F8FAFC] animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00838F]/20 text-[#00838F] shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-bold">Evaluasi Target Tabungan</p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Target <span className="text-[#00838F] font-semibold">{activeGoal.title}</span> baru terkumpul{' '}
                {((activeGoal.current_amount / activeGoal.target_amount) * 100).toFixed(0)}%. Tetap konsisten menabung!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/savings"
              className="px-3 py-1.5 bg-[#00838F] hover:brightness-110 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-all"
            >
              Cek Progres <ChevronRight size={13} />
            </Link>
            <button
              onClick={() => setDismissSavings(true)}
              className="p-1 text-[#64748B] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};