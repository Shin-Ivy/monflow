'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Trash2, 
  Plus, 
  SlidersHorizontal,
  Wallet as WalletIcon
} from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';
import { AccentButton } from '@/components/ui/Kit';
import { Transaction } from '@/types/database';

type TimeFilter = 'thisMonth' | 'today' | '7days' | 'all';

export default function TransaksiPage() {
  const { transactions, wallets, deleteTransaction } = useFinancialStore();
  const { showToast } = useToastStore();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('thisMonth');
  const [searchQuery, setSearchQuery] = useState('');
  const [walletFilter, setWalletFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  // Filter transaksi berdasarkan waktu, pencarian, dompet, dan tipe
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    return transactions.filter((t) => {
      const txDate = new Date(t.date);
      const txTime = txDate.getTime();

      // 1. Filter Rentang Waktu
      if (timeFilter === 'today') {
        if (txTime < today) return false;
      } else if (timeFilter === '7days') {
        const sevenDaysAgo = today - 7 * 24 * 60 * 60 * 1000;
        if (txTime < sevenDaysAgo) return false;
      } else if (timeFilter === 'thisMonth') {
        if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }

      // 2. Filter Tipe
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;

      // 3. Filter Dompet
      if (walletFilter !== 'all' && t.wallet_id !== walletFilter) return false;

      // 4. Filter Pencarian Teks
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const descMatch = t.description?.toLowerCase().includes(query);
        const catMatch = t.category?.toLowerCase().includes(query);
        if (!descMatch && !catMatch) return false;
      }

      return true;
    });
  }, [transactions, timeFilter, typeFilter, walletFilter, searchQuery]);

  const handleDelete = async (id: string, desc: string) => {
    const confirm = window.confirm(`Hapus transaksi "${desc || 'ini'}"?`);
    if (!confirm) return;
    await deleteTransaction(id);
    showToast('Transaksi berhasil dihapus', 'success');
  };

  const getWalletName = (walletId: string) => {
    const w = wallets.find((item) => item.id === walletId);
    return w ? w.name : 'Tunai';
  };

  return (
    <div className="w-full space-y-6 pb-24 md:pb-16">
      {/* ── HEADER HALAMAN ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Daftar Transaksi</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Daftar seluruh mutasi masuk dan keluar yang tercatat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-[#151F32] rounded-[14px] border border-slate-200 dark:border-[#26354A]">
            {(
              [
                { key: 'thisMonth', label: 'Bulan Ini' },
                { key: 'today', label: 'Hari Ini' },
                { key: '7days', label: '7 Hari Terakhir' },
                { key: 'all', label: 'Semua Waktu' },
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setTimeFilter(f.key)}
                className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                  timeFilter === f.key
                    ? 'bg-[#00838F] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <AccentButton
            label="Catat Transaksi"
            icon={Plus}
            onClick={() => setIsAddTxOpen(true)}
            className="hidden sm:flex !h-10 !px-4 cursor-pointer"
          />
        </div>
      </div>

      {/* ── BARIS PENCARIAN & FILTER DROPDOWN ──────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari transaksi berdasarkan catatan atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] rounded-[14px] text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-[#00838F] shadow-2xs transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter Dompet */}
          <select
            value={walletFilter}
            onChange={(e) => setWalletFilter(e.target.value)}
            className="flex-1 sm:flex-none h-11 px-3 bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] rounded-[14px] text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-[#00838F] shadow-2xs transition-colors"
          >
            <option value="all" className="bg-white dark:bg-[#0B1120]">Semua Dompet</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id} className="bg-white dark:bg-[#0B1120]">
                {w.name}
              </option>
            ))}
          </select>

          {/* Filter Tipe Mutasi */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 sm:flex-none h-11 px-3 bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] rounded-[14px] text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-[#00838F] shadow-2xs transition-colors"
          >
            <option value="all" className="bg-white dark:bg-[#0B1120]">Semua Tipe</option>
            <option value="expense" className="bg-white dark:bg-[#0B1120]">Pengeluaran</option>
            <option value="income" className="bg-white dark:bg-[#0B1120]">Pemasukan</option>
          </select>
        </div>
      </div>

      {/* ── TAMPILAN DESKTOP (TABEL) ───────────────────────────────── */}
      <div className="hidden md:block rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0B1120] border-b border-slate-200 dark:border-[#26354A] text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Status & Kategori</th>
                <th className="py-3.5 px-5">Dompet</th>
                <th className="py-3.5 px-5">Tanggal & Waktu</th>
                <th className="py-3.5 px-5 text-right">Nominal</th>
                <th className="py-3.5 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#26354A]/60">
              {filteredTransactions.map((tx) => {
                const isExpense = tx.type === 'expense';
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#1C283F]/40 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isExpense
                              ? 'bg-[#DB2777]/10 text-[#DB2777]'
                              : 'bg-[#EB7500]/10 text-[#EB7500]'
                          }`}
                        >
                          {isExpense ? <ArrowUpRight size={17} /> : <ArrowDownLeft size={17} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {tx.description || tx.category}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            {tx.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#26354A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00838F]" />
                        {getWalletName(tx.wallet_id)}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {new Date(tx.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      , {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </td>

                    <td
                      className={`py-3.5 px-5 text-right font-bold font-mono text-xs ${
                        isExpense ? 'text-[#DB2777]' : 'text-[#EB7500]'
                      }`}
                    >
                      {isExpense ? '-' : '+'}{formatRupiah(tx.amount)}
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => handleDelete(tx.id, tx.description)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        title="Hapus Mutasi"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TAMPILAN MOBILE (CARD LIST SESUAI APK MOBILE) ──────────── */}
      <div className="md:hidden space-y-2.5">
        {filteredTransactions.map((tx) => {
          const isExpense = tx.type === 'expense';
          return (
            <div
              key={tx.id}
              className="p-4 rounded-[20px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-2xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isExpense
                      ? 'bg-[#DB2777]/10 text-[#DB2777]'
                      : 'bg-[#EB7500]/10 text-[#EB7500]'
                  }`}
                >
                  {isExpense ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {tx.description || tx.category}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {tx.category}
                    </span>
                    <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-[10px] font-bold text-[#00838F]">
                      {getWalletName(tx.wallet_id)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {new Date(tx.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                    , {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`text-xs font-bold font-mono ${
                    isExpense ? 'text-[#DB2777]' : 'text-[#EB7500]'
                  }`}
                >
                  {isExpense ? '-' : '+'}{formatRupiah(tx.amount)}
                </span>
                <button
                  onClick={() => handleDelete(tx.id, tx.description)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  title="Hapus"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* State Kosong */}
      {filteredTransactions.length === 0 && (
        <div className="p-12 text-center rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] text-slate-400 text-xs">
          Tidak ada transaksi yang cocok dengan filter atau pencarian Anda.
        </div>
      )}

      {/* Modal Tambah Transaksi */}
      <AddTransactionModal isOpen={isAddTxOpen} onClose={() => setIsAddTxOpen(false)} />
    </div>
  );
}