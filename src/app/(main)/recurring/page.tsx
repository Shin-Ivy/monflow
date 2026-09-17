'use client';

import React, { useState } from 'react';
import { CalendarClock, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { AddRecurringModal } from '@/components/modals/AddRecurringModal';
import { AccentButton } from '@/components/ui/Kit';

export default function RecurringPage() {
  const { recurring, toggleRecurring, deleteRecurring } = useFinancialStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const totalMonthlyCommitment = recurring
    .filter((r) => r.active)
    .reduce((acc, r) => acc + (r.frequency === 'yearly' ? r.amount / 12 : r.amount), 0);

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tagihan & Komitmen Rutin</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Otomasi pantauan komitmen pengeluaran berkala Anda.</p>
        </div>
        <AccentButton
          label="Tambah Tagihan"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          className="!h-10 !px-4 cursor-pointer"
        />
      </div>

      {/* Banner Total Estimasi Komitmen Bulanan */}
      <div className="rounded-[24px] bg-gradient-to-br from-[#005B66] via-[#004D57] to-[#003138] p-6 text-white border border-[#00838F]/40 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">Estimasi Beban Rutin Bulanan</span>
          <div className="text-3xl lg:text-4xl font-extrabold font-mono tracking-tight mt-2">
            {formatRupiah(totalMonthlyCommitment)}
          </div>
          <p className="text-xs text-teal-200/80 mt-1">Akumulasi dari seluruh langganan aktif</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-[#002D33]/60 border border-teal-500/30 text-xs font-bold font-mono">
          {recurring.filter((r) => r.active).length} Tagihan Aktif
        </div>
      </div>

      {/* List Tagihan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recurring.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-[22px] border transition-all flex items-center justify-between ${
              item.active
                ? 'bg-white dark:bg-[#151F32] border-slate-200 dark:border-[#26354A] shadow-sm'
                : 'bg-slate-50 dark:bg-[#0B1120]/40 border-dashed border-slate-200 dark:border-[#26354A] opacity-60'
            }`}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Jatuh Tempo: Setiap Tgl {item.due_day} ({item.frequency === 'monthly' ? 'Bulanan' : 'Tahunan'})
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <div className="text-base font-bold font-mono text-[#DB2777]">{formatRupiah(item.amount)}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleRecurring(item.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  item.active
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
                title={item.active ? 'Nonaktifkan' : 'Aktifkan'}
              >
                <CheckCircle2 size={18} />
              </button>
              <button
                onClick={() => deleteRecurring(item.id)}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {recurring.length === 0 && (
        <div className="p-12 text-center rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] text-slate-400 text-xs">
          Belum ada tagihan rutin yang terdaftar. Klik "Tambah Tagihan" untuk memulainya.
        </div>
      )}

      <AddRecurringModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}