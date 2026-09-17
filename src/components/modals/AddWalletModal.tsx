'use client';

import React, { useState } from 'react';
import { X, Landmark } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AccentButton } from '../ui/Kit';

const PRESET_COLORS = ['#004D57', '#EB7500', '#DB2777', '#A0BA3B', '#6366F1', '#1E293B'];

export const AddWalletModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { addWallet } = useFinancialStore();
  const { showToast } = useToastStore();

  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState<'Bank' | 'Cash' | 'E-Wallet'>('Bank');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setBalance(raw);
  };

  const formattedBalance = balance
    ? new Intl.NumberFormat('id-ID').format(parseInt(balance, 10))
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const numBalance = balance ? parseFloat(balance) : 0;
      await addWallet({
        name: name.trim(),
        balance: numBalance,
        color,
        type,
      });

      showToast(`Rekening "${name}" berhasil dibuat!`, 'success');
      setName('');
      setBalance('');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Gagal menambahkan rekening', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-[24px] overflow-hidden shadow-2xl transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#334155]/80 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
            <Landmark size={18} className="text-[#00838F]" />
            Tambah Rekening Baru
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama Rekening */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Nama Rekening / Bank
            </label>
            <input 
              type="text"
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: BCA Utama, Kas Tunai, GoPay..."
              className="w-full h-12 px-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-xs text-slate-900 dark:text-[#F8FAFC] outline-none focus:border-[#00838F]"
            />
          </div>

          {/* Saldo Awal dengan Pemisah Titik Otomatis */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Saldo Awal (Rp)
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
                onChange={handleBalanceChange}
                className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#334155] rounded-[14px] text-lg font-bold font-mono text-[#00838F] outline-none focus:border-[#00838F]"
              />
            </div>
          </div>

          {/* Pilihan Tipe Rekening */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Tipe Dompet
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Bank', 'Cash', 'E-Wallet'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2.5 rounded-[12px] border text-xs font-bold transition-all cursor-pointer ${
                    type === t 
                      ? 'bg-[#00838F] border-[#00838F] text-white shadow-md' 
                      : 'bg-slate-50 dark:bg-[#0B1120] border-slate-200 dark:border-[#334155] text-slate-600 dark:text-[#94A3B8] hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Pilihan Warna Identitas */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Warna Identitas
            </label>
            <div className="flex items-center gap-3 pt-1">
              {PRESET_COLORS.map((c) => (
                <button 
                  key={c} 
                  type="button" 
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                    color === c 
                      ? 'border-slate-900 dark:border-white scale-110 shadow-md' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <AccentButton 
            label={isSubmitting ? 'Menyimpan...' : 'Simpan Rekening'} 
            type="submit" 
            isLoading={isSubmitting}
            className="w-full !h-12 mt-2 cursor-pointer shadow-md" 
          />
        </form>
      </div>
    </div>
  );
};