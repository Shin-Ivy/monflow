'use client';

import React, { useState, useMemo } from 'react';
import { HandCoins, Plus, ArrowUpRight, ArrowDownLeft, CheckCircle2, Trash2 } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AddDebtModal } from '@/components/modals/AddDebtModal';
import { AccentButton } from '@/components/ui/Kit';

export default function DebtsPage() {
  const { debts, wallets, settleDebtLoan, deleteDebtLoan } = useFinancialStore();
  const { showToast } = useToastStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const totalDebt = useMemo(() => {
    return debts
      .filter((d) => d.type === 'debt' && d.status !== 'paid')
      .reduce((acc, d) => acc + (d.amount - d.paid_amount), 0);
  }, [debts]);

  const totalLoan = useMemo(() => {
    return debts
      .filter((d) => d.type === 'loan' && d.status !== 'paid')
      .reduce((acc, d) => acc + (d.amount - d.paid_amount), 0);
  }, [debts]);

  const handleSettle = async (id: string, remaining: number) => {
    if (wallets.length === 0) {
      showToast('Anda memerlukan dompet aktif untuk mencatat mutasi pelunasan!', 'error');
      return;
    }
    const input = window.prompt(`Masukkan nominal pembayaran (Maksimal ${formatRupiah(remaining)}):`);
    if (!input) return;
    const num = parseFloat(input.replace(/[^0-9]/g, ''));
    if (!num || num <= 0 || num > remaining) {
      showToast('Nominal pelunasan tidak valid!', 'error');
      return;
    }

    await settleDebtLoan(id, num, wallets[0].id);
    showToast(`Berhasil mencatat pelunasan ${formatRupiah(num)}!`, 'success');
  };

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hutang & Piutang</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pantau kewajiban bayar dan penagihan dana Anda.</p>
        </div>
        <AccentButton
          label="Catat Baru"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          className="!h-10 !px-4 cursor-pointer"
        />
      </div>

      {/* ── 2 KARTU HERO TOTAL HUTANG & PIUTANG ──────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 rounded-[24px] bg-white dark:bg-[#151F32] border border-rose-200 dark:border-[#26354A] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Total Hutang Saya
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-[#DB2777] my-3">{formatRupiah(totalDebt)}</div>
          <p className="text-xs text-slate-400">Harus dilunasi ke orang lain</p>
        </div>

        <div className="p-6 rounded-[24px] bg-white dark:bg-[#151F32] border border-emerald-200 dark:border-[#26354A] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Total Piutang (Tagihan)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-[#EB7500] my-3">{formatRupiah(totalLoan)}</div>
          <p className="text-xs text-slate-400">Uang Anda yang belum dibayar orang lain</p>
        </div>
      </div>

      {/* ── DAFTAR HUTANG & PIUTANG ──────────────────────────────────── */}
      <div className="space-y-3">
        {debts.map((item) => {
          const isDebt = item.type === 'debt';
          const remaining = item.amount - item.paid_amount;
          const isPaid = item.status === 'paid' || remaining <= 0;

          return (
            <div
              key={item.id}
              className="p-5 rounded-[22px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isDebt ? 'bg-[#DB2777]/10 text-[#DB2777]' : 'bg-[#EB7500]/10 text-[#EB7500]'
                  }`}
                >
                  {isDebt ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.person_name}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : isDebt
                          ? 'bg-rose-500/10 text-rose-500'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {isPaid ? 'LUNAS' : isDebt ? 'HUTANG' : 'PIUTANG'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.notes || (isDebt ? 'Kewajiban bayar' : 'Penagihan dana')}
                    {item.due_date && ` • Jatuh tempo: ${new Date(item.due_date).toLocaleDateString('id-ID')}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sisa Tagihan</span>
                  <div className={`text-base font-bold font-mono ${isDebt ? 'text-[#DB2777]' : 'text-[#EB7500]'}`}>
                    {formatRupiah(remaining)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isPaid && (
                    <button
                      onClick={() => handleSettle(item.id, remaining)}
                      className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-[#00838F] hover:bg-teal-500/20 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cicil / Lunasi
                    </button>
                  )}
                  <button
                    onClick={() => deleteDebtLoan(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {debts.length === 0 && (
          <div className="p-12 text-center rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] text-slate-400 text-xs">
            Tidak ada catatan hutang atau piutang aktif.
          </div>
        )}
      </div>

      <AddDebtModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}