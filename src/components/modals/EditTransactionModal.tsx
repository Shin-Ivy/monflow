'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, Wallet as WalletIcon, FileText } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { Transaction, TransactionType } from '@/types/database';
import { AccentButton } from '../ui/Kit';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = {
  expense: [
    'Makanan & Minuman',
    'Transportasi',
    'Belanja & Kebutuhan',
    'Langganan & Utilitas',
    'Hiburan & Rekreasi',
    'Kesehatan',
    'Lainnya',
  ],
  income: [
    'Gaji & Pendapatan',
    'Freelance / Bonus',
    'Investasi & Dividen',
    'Hadiah / Hibah',
    'Penjualan',
    'Lainnya',
  ],
};

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const { wallets, updateTransaction } = useFinancialStore();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [walletId, setWalletId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setWalletId(transaction.wallet_id);
      setDescription(transaction.description);
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!numericAmount || numericAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await updateTransaction(transaction.id, {
        wallet_id: walletId,
        category,
        amount: numericAmount,
        type,
        description: description.trim() || category,
        date: new Date(date).toISOString(),
      });
      onClose();
    } catch (err) {
      console.error('Failed to update transaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-[20px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <h2 className="text-base font-bold text-[#F8FAFC]">Edit Transaksi</h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#F8FAFC]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Nominal (Rp)</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-14 px-4 bg-[#0B1120] border border-[#334155] rounded-[14px] text-2xl font-bold font-mono text-[#F8FAFC] focus:outline-none focus:border-[#00838F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <WalletIcon className="w-3.5 h-3.5" /> Sumber Dompet
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full h-11 px-3 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00838F]"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00838F]"
              >
                {(CATEGORIES[type] || []).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Catatan / Toko
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-11 px-3 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00838F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Tanggal
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00838F]"
              />
            </div>
          </div>

          <div className="pt-2">
            <AccentButton
              type="submit"
              label={isSubmitting ? 'Memperbarui...' : 'Simpan Perubahan'}
              isLoading={isSubmitting}
              className="w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};