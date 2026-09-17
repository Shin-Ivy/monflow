'use client';

import React, { useState } from 'react';
import { CreditCard, Landmark, Plus, ArrowLeftRight } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AddWalletModal } from '@/components/modals/AddWalletModal';
import { AccentButton } from '@/components/ui/Kit';

export default function DompetPage() {
  const { wallets, addTransfer, deleteWallet } = useFinancialStore();
  const { showToast } = useToastStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [fromId, setFromId] = useState(wallets[0]?.id || '');
  const [toId, setToId] = useState(wallets[1]?.id || '');
  const [amount, setAmount] = useState('');

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const formattedAmount = amount
    ? new Intl.NumberFormat('id-ID').format(parseInt(amount, 10))
    : '';

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0 || !fromId || !toId || fromId === toId) {
      showToast('Pilih sumber dan tujuan rekening yang berbeda!', 'error');
      return;
    }
    await addTransfer(fromId, toId, num);
    showToast('Transfer internal berhasil dijalankan!', 'success');
    setAmount('');
  };

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dompet & Rekening Bank</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Kelola semua sumber rekening dan pos keuangan Anda.</p>
        </div>
        <AccentButton
          label="Rekening Baru"
          icon={Plus}
          onClick={() => setIsAddOpen(true)}
          className="!h-10 !px-4 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grid Kartu Dompet */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wallets.map((w) => (
            <div
              key={w.id}
              className="p-5 rounded-[22px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm flex flex-col justify-between h-44 relative group hover:border-[#00838F]/50 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-[#00838F] flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: w.color }} />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{w.type || 'Akun'}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{w.name}</h3>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {formatRupiah(w.balance)}
                </div>
              </div>

              {wallets.length > 1 && (
                <button
                  onClick={() => deleteWallet(w.id)}
                  className="absolute bottom-4 right-4 text-xs text-rose-500 opacity-0 group-hover:opacity-100 hover:underline transition-opacity cursor-pointer font-semibold"
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Card Form Transfer Internal */}
        <div className="rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowLeftRight size={16} className="text-[#00838F]" /> Transfer Internal Antar Rekening
          </h2>

          <form onSubmit={handleTransfer} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Dari Dompet</label>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[12px] text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatRupiah(w.balance)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Ke Dompet Tujuan</label>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[12px] text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Nominal Transfer</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold font-mono text-[#00838F]">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="0"
                  value={formattedAmount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full h-11 pl-10 pr-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[12px] text-sm font-bold font-mono text-slate-900 dark:text-white outline-none focus:border-[#00838F]"
                />
              </div>
            </div>

            <AccentButton label="Eksekusi Transfer" type="submit" className="w-full !h-11 mt-2 cursor-pointer" />
          </form>
        </div>
      </div>

      <AddWalletModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}