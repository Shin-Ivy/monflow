'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, User, Wallet as WalletIcon } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AccentButton } from '../ui/Kit';

export const InitialSetupModal = ({
  isOpen = true,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
} = {}) => {
  // ... sisa kode ke bawah tetap sama
  const { addWallet } = useFinancialStore();
  const { showToast } = useToastStore();

  const [name, setName] = useState('');
  const [walletName, setWalletName] = useState('Kas Tunai Utama');
  const [balance, setBalance] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const formattedBalance = balance
    ? new Intl.NumberFormat('id-ID').format(parseInt(balance, 10))
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !walletName.trim()) return;

    setIsSubmitting(true);
    try {
      localStorage.setItem('monflow_user_name', name.trim());

      const numBalance = balance ? parseFloat(balance) : 0;
      await addWallet({
        name: walletName.trim(),
        balance: numBalance,
        color: '#004D57',
        type: 'Cash',
      });

      showToast(`Selamat datang di MonFlow, ${name.trim()}!`, 'success');
      if (onClose) onClose();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyiapkan workspace', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-[24px] shadow-2xl overflow-hidden transition-colors">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          {/* Header Logo & Sambutan */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] p-2 flex items-center justify-center shadow-md">
              <Image
                src="/logo.png"
                alt="MonFlow Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Selamat Datang di MonFlow
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Mari siapkan workspace pembukuan finansial pribadi Anda dalam beberapa detik.
            </p>
          </div>

          {/* Nama Pengguna */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] flex items-center gap-1.5">
              <User size={13} /> Nama Panggilan Anda
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Bimo, Alex..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-white outline-none focus:border-[#00838F]"
            />
          </div>

          {/* Nama Dompet Awal */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] flex items-center gap-1.5">
              <WalletIcon size={13} /> Nama Dompet Pertama
            </label>
            <input
              type="text"
              required
              placeholder="Kas Tunai Utama"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-white outline-none focus:border-[#00838F]"
            />
          </div>

          {/* Saldo Awal Berformat Titik */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Saldo Awal Dompet (Rp)
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
                value={formattedBalance}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setBalance(raw);
                }}
                className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-lg font-bold font-mono text-[#00838F] outline-none focus:border-[#00838F]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <AccentButton
            type="submit"
            label={isSubmitting ? 'Menyiapkan...' : 'Mulai Kelola Keuangan'}
            icon={ArrowRight}
            isLoading={isSubmitting}
            className="w-full !h-12 mt-2 cursor-pointer shadow-md"
          />
        </form>
      </div>
    </div>
  );
};