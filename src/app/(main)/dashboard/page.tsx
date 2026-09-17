'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Eye, 
  EyeOff, 
  FileText, 
  Target, 
  BarChart2, 
  Landmark, 
  ChevronRight,
  Wallet as WalletIcon,
  Bell,
  ScanLine,
  Plus
} from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';
import { ReceiptScannerModal } from '@/components/modals/ReceiptScannerModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { CashFlowChart } from '@/components/dashboard/CashFlowChart';

export default function DashboardPage() {
  const { wallets, transactions, hideBalance, toggleHideBalance, init } = useFinancialStore();
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [userName, setUserName] = useState('Bimo');

  useEffect(() => {
    init();
    const storedName = localStorage.getItem('monflow_user_name');
    if (storedName) setUserName(storedName);
  }, [init]);

  const formatRupiah = (val: number) => {
    if (hideBalance) return '••••••••';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);
  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const monthlyExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const netMonth = monthlyIncome - monthlyExpense;

  return (
    <div className="w-full space-y-6 pb-24 md:pb-12">
      {/* ── HEADER PROFIL ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#00838F] text-white font-bold flex items-center justify-center text-base shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-bold text-base md:text-xl text-slate-900 dark:text-white leading-none">
              {userName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Workspace Finansial</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsTxOpen(true)}
            className="hidden md:flex px-4 py-2 bg-[#00838F] text-white rounded-xl text-xs font-bold hover:brightness-110 items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} /> Catat Transaksi
          </button>
          <button 
            className="w-10 h-10 rounded-full bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] flex items-center justify-center text-slate-600 dark:text-slate-300 relative shadow-sm cursor-pointer"
          >
            <Bell size={18} />
            <span className="w-2 h-2 rounded-full bg-[#DB2777] absolute top-2 right-2" />
          </button>
        </div>
      </div>

      {/* ── ROW 1: HERO TEAL CARD & SUMMARY ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card Total Saldo Utama */}
        <div className="rounded-[24px] bg-gradient-to-br from-[#005B66] via-[#004D57] to-[#003138] p-6 text-white border border-[#00838F]/40 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-teal-200 text-xs font-semibold uppercase tracking-wider">
            <span>Total Saldo</span>
            <button onClick={toggleHideBalance} className="p-1 hover:text-white transition-colors cursor-pointer">
              {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="text-3xl lg:text-4xl font-extrabold font-mono tracking-tight my-4">
            {hideBalance ? 'Rp ••••••••' : formatRupiah(totalBalance)}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-teal-500/30">
            <div className="rounded-[14px] bg-[#002D33]/60 p-2.5 flex items-center gap-2.5">
              <WalletIcon size={16} className="text-teal-300" />
              <div>
                <p className="text-[11px] font-bold text-white">{wallets.length} Dompet</p>
                <p className="text-[9px] text-teal-200">Aktif</p>
              </div>
            </div>
            <div className="rounded-[14px] bg-[#002D33]/60 p-2.5 flex items-center gap-2.5 overflow-hidden">
              <BarChart2 size={16} className="text-teal-300 shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-bold text-white font-mono truncate">{formatRupiah(netMonth)}</p>
                <p className="text-[9px] text-teal-200">Net Bulan Ini</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Pemasukan */}
        <div className="rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Pemasukan</span>
            <div className="w-9 h-9 rounded-xl bg-[#EB7500]/15 text-[#EB7500] flex items-center justify-center">
              <ArrowDownLeft size={18} strokeWidth={2.5} />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#EB7500] my-3">
            {formatRupiah(monthlyIncome)}
          </div>
          <p className="text-xs text-slate-400">Akumulasi pemasukan bulan ini</p>
        </div>

        {/* Card Pengeluaran */}
        <div className="rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Pengeluaran</span>
            <div className="w-9 h-9 rounded-xl bg-[#DB2777]/15 text-[#DB2777] flex items-center justify-center">
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#DB2777] my-3">
            {formatRupiah(monthlyExpense)}
          </div>
          <p className="text-xs text-slate-400">Akumulasi pengeluaran bulan ini</p>
        </div>
      </div>

      {/* ── ROW 2: GRAFIK ARUS KAS & SHORTCUTS ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Tren Arus Kas (7 Hari Terakhir)</h2>
              <p className="text-xs text-slate-400">Perbandingan pergerakan transaksi harian</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#EB7500]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EB7500]" /> Masuk
              </span>
              <span className="flex items-center gap-1.5 text-[#DB2777]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DB2777]" /> Keluar
              </span>
            </div>
          </div>
          <CashFlowChart transactions={transactions} />
        </div>

        {/* Quick Action Grid */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setIsExportOpen(true)}
              className="rounded-[20px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-4 flex flex-col items-center gap-2 shadow-xs hover:border-[#00838F]/50 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-teal-500/10 text-[#00838F] flex items-center justify-center">
                <FileText size={18} />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Ekspor PDF</span>
            </button>

            <Link
              href="/savings"
              className="rounded-[20px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-4 flex flex-col items-center gap-2 shadow-xs hover:border-[#EB7500]/50 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-[#EB7500] flex items-center justify-center">
                <Target size={18} />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Top Target</span>
            </Link>

            <Link
              href="/reports"
              className="rounded-[20px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-4 flex flex-col items-center gap-2 shadow-xs hover:border-[#DB2777]/50 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-[#DB2777] flex items-center justify-center">
                <BarChart2 size={18} />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Laporan</span>
            </Link>
          </div>

          {/* AI Receipt Scanner Card */}
          <div
            onClick={() => setIsScannerOpen(true)}
            className="rounded-[24px] bg-gradient-to-br from-[#004D57]/15 to-[#00838F]/5 border border-dashed border-[#00838F]/40 p-5 flex flex-col justify-between cursor-pointer hover:border-[#00838F] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00838F]/20 text-[#00838F] flex items-center justify-center group-hover:scale-105 transition-transform">
                <ScanLine size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Smart AI Receipt Scanner</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Scan nota instan dengan Gemini AI</p>
              </div>
            </div>
            <button className="mt-4 w-full py-2 bg-[#00838F] text-white rounded-xl text-xs font-semibold hover:brightness-110 transition-all cursor-pointer">
              Buka Scanner
            </button>
          </div>

          {/* Banner Kelola Dompet */}
          <Link
            href="/dompet"
            className="rounded-[20px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-4 flex items-center justify-between shadow-xs hover:border-[#00838F]/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00838F]/15 text-[#00838F] flex items-center justify-center">
                <Landmark size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Kelola & Sinkronkan Dompet</h4>
                <p className="text-[10px] text-slate-400">Pantau seluruh rekening kas dan bank</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </Link>
        </div>
      </div>

      {/* ── ROW 3: RECENT TRANSACTIONS TABLE ───────────────────────── */}
      <div className="rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Aktivitas Terakhir</h3>
            <p className="text-xs text-slate-400">Mutasi pengeluaran dan pemasukan terbaru</p>
          </div>
          <Link href="/transaksi" className="text-xs font-bold text-[#00838F] hover:underline">
            Lihat Semua Mutasi
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#26354A] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Transaksi</th>
                <th className="pb-3 font-semibold">Kategori</th>
                <th className="pb-3 font-semibold">Tanggal</th>
                <th className="pb-3 font-semibold text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#26354A]/60">
              {transactions.slice(0, 5).map((tx) => {
                const isExpense = tx.type === 'expense';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-[#1C283F]/50 transition-colors">
                    <td className="py-3.5 pr-4 font-medium text-xs text-slate-900 dark:text-white">
                      {tx.description}
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-[#26354A] text-[10px] font-semibold">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-slate-400 font-mono">
                      {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </td>
                    <td className={`py-3.5 pl-4 text-right font-bold font-mono text-xs ${isExpense ? 'text-[#DB2777]' : 'text-[#EB7500]'}`}>
                      {isExpense ? '-' : '+'}{formatRupiah(tx.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">Belum ada transaksi.</div>
          )}
        </div>
      </div>

      <AddTransactionModal isOpen={isTxOpen} onClose={() => setIsTxOpen(false)} />
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <ReceiptScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
}