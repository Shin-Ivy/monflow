'use client';

import React, { useState } from 'react';
import { X, Tag, Plus } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AccentButton } from '../ui/Kit';
import { TransactionType } from '@/types/database';

const COLOR_PALETTE = [
  '#004D57',
  '#00838F',
  '#EB7500',
  '#DB2777',
  '#A0BA3B',
  '#6366F1',
  '#F59E0B',
  '#10B981',
  '#475569',
];

export const CategoryModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { addCategory } = useFinancialStore();
  const { showToast } = useToastStore();

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addCategory({
        name: name.trim(),
        type,
        color,
      });
      showToast(`Kategori "${name}" berhasil ditambahkan!`, 'success');
      setName('');
      onClose();
    } catch (err: any) {
      showToast(`Gagal menambah kategori: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-[20px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
            <Tag size={18} className="text-[#00838F]" />
            Tambah Kategori Baru
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#F8FAFC]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#0B1120] rounded-[14px] border border-[#334155]">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                type === 'expense' ? 'bg-[#DB2777] text-white' : 'text-[#94A3B8]'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                type === 'income' ? 'bg-[#EB7500] text-white' : 'text-[#94A3B8]'
              }`}
            >
              Pemasukan
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Nama Kategori
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kopi & Nongkrong, Servis Kendaraan..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00838F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Warna Identitas
            </label>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                    color === c ? 'border-white scale-110 shadow-md' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <AccentButton
            type="submit"
            label={isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
            icon={Plus}
            isLoading={isSubmitting}
            className="w-full mt-2 cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};