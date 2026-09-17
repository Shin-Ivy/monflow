'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3, FileDown, Calendar, ArrowUpRight } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { generateFormalReportPdf } from '@/lib/pdfGenerator';
import { DateFilterSelector } from '@/components/ui/DateFilterSelector';
import { DateFilterPreset, filterTransactionsByPreset } from '@/lib/dateUtils';
import { AccentButton } from '@/components/ui/Kit';

export default function ReportsPage() {
  const { transactions, wallets } = useFinancialStore();
  const [preset, setPreset] = useState<DateFilterPreset>('thisMonth');

  const filteredTx = useMemo(() => {
    return filterTransactionsByPreset(transactions, preset);
  }, [transactions, preset]);

  const totalExpense = useMemo(() => {
    return filteredTx
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTx]);

  const totalIncome = useMemo(() => {
    return filteredTx
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTx]);

  // Kelompokkan per kategori
  const categorySummary = useMemo(() => {
    const map: { [key: string]: number } = {};
    filteredTx
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return Object.entries(map)
      .map(([name, amount]) => ({
        name,
        amount,
        percent: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTx, totalExpense]);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laporan & Analitik Keuangan</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Analisis mendalam ke mana uang Anda mengalir.</p>
        </div>

        <div className="flex items-center gap-3">
          <DateFilterSelector currentPreset={preset} onSelectPreset={setPreset} />
          <AccentButton
            label="Unduh PDF Resmi"
            icon={FileDown}
            onClick={() => generateFormalReportPdf(filteredTx, wallets)}
            className="!h-10 !px-4 cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualisasi Donut Ringkasan */}
        <div className="lg:col-span-2 p-6 rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm flex flex-col items-center justify-center min-h-[380px] relative">
          <div className="w-full flex justify-between items-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Struktur Pengeluaran
            </span>
            <span className="text-xs font-mono font-semibold text-slate-400">
              {filteredTx.length} Mutasi Tercatat
            </span>
          </div>

          {/* Donut Graphic Representation */}
          <div className="relative w-56 h-56 flex items-center justify-center my-4">
            <div className="w-56 h-56 rounded-full border-[18px] border-slate-100 dark:border-[#070B14] relative">
              <div
                className="w-full h-full rounded-full border-[18px] border-[#00838F] transition-all duration-700"
                style={{ clipPath: totalExpense > 0 ? 'circle(50% at 50% 50%)' : 'none' }}
              />
            </div>
            <div className="absolute flex flex-col items-center justify-center text-center p-4">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">TOTAL PENGELUARAN</span>
              <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                {formatRupiah(totalExpense)}
              </span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-[#26354A]">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Pemasukan</p>
              <p className="text-base font-bold font-mono text-[#EB7500] mt-0.5">{formatRupiah(totalIncome)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Arus Kas Bersih</p>
              <p className={`text-base font-bold font-mono mt-0.5 ${totalIncome >= totalExpense ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#DB2777]'}`}>
                {formatRupiah(totalIncome - totalExpense)}
              </p>
            </div>
          </div>
        </div>

        {/* Rincian Per Kategori */}
        <div className="p-6 rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Detail Per Kategori</h3>
            <p className="text-xs text-slate-400 mt-0.5">Alokasi beban belanja periode ini</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
            {categorySummary.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                  <span className="font-mono text-slate-900 dark:text-white">{formatRupiah(item.amount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-[#070B14] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00838F] to-[#EB7500] rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-slate-400 w-9 text-right">
                    {item.percent.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}

            {categorySummary.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">
                Tidak ada pengeluaran pada filter waktu ini.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-[#26354A] text-center">
            <span className="text-[11px] text-slate-400">Laporan dihitung otomatis berdasarkan transaksi lokal.</span>
          </div>
        </div>
      </div>
    </div>
  );
}