'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon, Tag, Calendar, FileText } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AccentButton } from '../ui/Kit';
import { TransactionType } from '@/types/database';

export const AddTransactionModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { wallets, categories, addTransaction } = useFinancialStore();
  const { showToast } = useToastStore();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [walletId, setWalletId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter kategori berdasarkan tipe aktif (income / expense)
  const availableCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (isOpen) {
      setWalletId(wallets[0]?.id || '');
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [isOpen, wallets]);

  useEffect(() => {
    if (availableCategories.length > 0) {
      setCategory(availableCategories[0].name);
    } else {
      setCategory(type === 'expense' ? 'Pengeluaran Umum' : 'Pemasukan Umum');
    }
  }, [type, categories]);

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setAmount(raw);
  };

  const formattedAmount = amount
    ? new Intl.NumberFormat('id-ID').format(parseInt(amount, 10))
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !walletId) return;

    setIsSubmitting(true);
    try {
      await addTransaction({
        wallet_id: walletId,
        amount: numAmount,
        type,
        category: category || (type === 'expense' ? 'Pengeluaran Umum' : 'Pemasukan Umum'),
        description: description.trim() || category,
        date: new Date(date).toISOString(),
      });

      showToast('Transaksi berhasil ditambahkan!', 'success');
      setAmount('');
      setDescription('');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan transaksi', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-[24px] shadow-2xl overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#334155]/80">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Catat Transaksi</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Switcher Tipe: Pengeluaran / Pemasukan */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-[#0B1120] rounded-[14px] border border-slate-200 dark:border-[#334155]">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-[10px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'expense' 
                  ? 'bg-[#DB2777] text-white shadow-md' 
                  : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowUpRight size={15} /> Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-[10px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'income' 
                  ? 'bg-[#EB7500] text-white shadow-md' 
                  : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowDownLeft size={15} /> Pemasukan
            </button>
          </div>

          {/* Input Nominal dengan Pemisah Titik Otomatis */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Nominal (Rp)
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold font-mono ${
                type === 'expense' ? 'text-[#DB2777]' : 'text-[#EB7500]'
              }`}>
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="0"
                value={formattedAmount}
                onChange={handleAmountChange}
                className={`w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xl font-bold font-mono outline-none focus:border-[#00838F] transition-colors text-slate-900 dark:text-[#F8FAFC] ${
                  type === 'expense' ? 'text-[#DB2777]' : 'text-[#EB7500]'
                }`}
              />
            </div>
          </div>

          {/* Dropdown Kategori */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] flex items-center gap-1.5">
              <Tag size={13} /> Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none cursor-pointer focus:border-[#00838F]"
            >
              {availableCategories.map((c) => (
                <option key={c.id} value={c.name} className="bg-white dark:bg-[#0B1120]">
                  {c.name}
                </option>
              ))}
              {availableCategories.length === 0 && (
                <option value={type === 'expense' ? 'Pengeluaran Umum' : 'Pemasukan Umum'} className="bg-white dark:bg-[#0B1120]">
                  {type === 'expense' ? 'Pengeluaran Umum' : 'Pemasukan Umum'}
                </option>
              )}
            </select>
          </div>

          {/* Deskripsi Catatan */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] flex items-center gap-1.5">
              <FileText size={13} /> Keterangan
            </label>
            <input
              type="text"
              placeholder="Contoh: Makan Siang, Kopi, Gaji Bulanan"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-11 px-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
            />
          </div>

          {/* Baris Dompet & Tanggal */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] flex items-center gap-1.5">
                <WalletIcon size={13} /> Dompet
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

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] flex items-center gap-1.5">
                <Calendar size={13} /> Tanggal
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <AccentButton
            type="submit"
            label={isSubmitting ? 'Menyimpan...' : 'Simpan Mutasi'}
            isLoading={isSubmitting}
            className="w-full !h-12 mt-2 cursor-pointer shadow-md"
          />
        </form>
      </div>
    </div>
  );
};