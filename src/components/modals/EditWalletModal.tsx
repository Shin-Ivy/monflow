'use client';

import React, { useState, useEffect } from 'react';
import { X, CreditCard, Trash2 } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { Wallet } from '@/types/database';
import { AccentButton } from '../ui/Kit';

const PRESET_COLORS = ['#004D57', '#00838F', '#EB7500', '#DB2777', '#A0BA3B', '#6366F1', '#1E293B'];

export const EditWalletModal = ({
  wallet,
  isOpen,
  onClose,
}: {
  wallet: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { updateWallet, deleteWallet } = useFinancialStore();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState<'Bank' | 'Cash' | 'E-Wallet' | 'Investment'>('Bank');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setBalance(wallet.balance.toString());
      setType(wallet.type || 'Bank');
      setColor(wallet.color || PRESET_COLORS[0]);
    }
  }, [wallet]);

  if (!isOpen || !wallet) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      await updateWallet(wallet.id, {
        name,
        balance: parseFloat(balance) || 0,
        type,
        color,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(`Hapus dompet "${wallet.name}"? Tindakan ini tidak dapat dibatalkan.`);
    if (!confirm) return;
    await deleteWallet(wallet.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-[20px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <h2 className="text-base font-bold text-[#F8FAFC]">Edit Rekening / Dompet</h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#F8FAFC]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Nama Rekening</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00838F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Koreksi Saldo (Rp)</label>
            <input
              type="number"
              required
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full h-12 px-4 bg-[#0B1120] border border-[#334155] rounded-[14px] text-lg font-bold font-mono text-[#00838F] focus:outline-none focus:border-[#00838F]"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['Bank', 'Cash', 'E-Wallet', 'Investment'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t as any)}
                className={`py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                  type === t
                    ? 'bg-[#00838F] border-[#00838F] text-white'
                    : 'bg-[#0B1120] border-[#334155] text-[#475569]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Warna Identitas</label>
            <div className="flex gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    color === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <AccentButton
              type="submit"
              label={isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              isLoading={isSubmitting}
              className="w-full"
            />
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-[14px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 size={14} /> Hapus Dompet Ini
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};