'use client';

import React, { useRef } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Printer, 
  Database, 
  Upload, 
  DownloadCloud, 
  FileCode2, 
  FileText 
} from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { exportToCSV } from '@/lib/export';
import { exportJsonBackup, exportXmlBackup, restoreBackupFile } from '@/lib/backup';
import { generateFormalReportPdf } from '@/lib/pdfGenerator';
import { AccentButton } from '../ui/Kit';

export const ExportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { transactions, wallets, init } = useFinancialStore();
  const { showToast } = useToastStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmRestore = window.confirm(
      'Mengimpor backup akan menggantikan data lokal yang ada saat ini. Lanjutkan?'
    );
    if (!confirmRestore) return;

    try {
      await restoreBackupFile(file);
      await init();
      showToast('Data cadangan berhasil dipulihkan!', 'success');
      onClose();
    } catch (err: any) {
      showToast(`Gagal memulihkan: ${err.message}`, 'error');
    }
  };

  const handlePdfGeneration = () => {
    const userName = localStorage.getItem('monflow_user_name') || 'Pengguna MonFlow';
    generateFormalReportPdf(transactions, wallets, userName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-[24px] overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-[#334155] flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2 text-[#F8FAFC]">
            <Database size={18} className="text-[#00838F]" /> Manajemen Cadangan & Laporan Resmi[cite: 2]
          </h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[#94A3B8]">
            Pilih format dokumen resmi atau berkas cadangan terenkapsulasi penuh (.JSON / .XML)[cite: 2].
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Laporan PDF Resmi */}
            <button
              onClick={handlePdfGeneration}
              className="p-4 bg-[#0B1120] border border-[#334155] rounded-[16px] flex flex-col justify-between text-left hover:border-[#00838F]/50 transition-all group cursor-pointer"
            >
              <div className="p-2 bg-[#00838F]/10 rounded-lg text-[#00838F] w-fit mb-3 group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">Laporan Resmi (PDF)[cite: 2]</p>
                <p className="text-[10px] text-[#64748B] mt-0.5">Format dokumen formal dengan ringkasan & tabel.</p>
              </div>
            </button>

            {/* Ekspor Excel CSV */}
            <button
              onClick={() => exportToCSV(transactions, wallets)}
              className="p-4 bg-[#0B1120] border border-[#334155] rounded-[16px] flex flex-col justify-between text-left hover:border-[#00838F]/50 transition-all group cursor-pointer"
            >
              <div className="p-2 bg-[#EB7500]/10 rounded-lg text-[#EB7500] w-fit mb-3 group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">Tabel Excel (CSV)</p>
                <p className="text-[10px] text-[#64748B] mt-0.5">Tabel mutasi untuk spreadsheet eksternal.</p>
              </div>
            </button>

            {/* Backup XML Encapsulated */}
            <button
              onClick={exportXmlBackup}
              className="p-4 bg-[#0B1120] border border-[#334155] rounded-[16px] flex flex-col justify-between text-left hover:border-[#00838F]/50 transition-all group cursor-pointer"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                <FileCode2 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">Cadangan XML Tag[cite: 2]</p>
                <p className="text-[10px] text-[#64748B] mt-0.5">Format XML &lt;monflow_backup&gt; terstruktur[cite: 2].</p>
              </div>
            </button>

            {/* Backup JSON */}
            <button
              onClick={exportJsonBackup}
              className="p-4 bg-[#0B1120] border border-[#334155] rounded-[16px] flex flex-col justify-between text-left hover:border-[#00838F]/50 transition-all group cursor-pointer"
            >
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                <DownloadCloud size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">Cadangan JSON Tree</p>
                <p className="text-[10px] text-[#64748B] mt-0.5">Arsip menyeluruh format JSON standar.</p>
              </div>
            </button>
          </div>

          {/* Tombol Restore Terpadu */}
          <div className="pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-[#0B1120] border border-dashed border-[#00838F]/50 hover:bg-[#004D57]/10 rounded-[14px] text-xs font-bold text-[#00838F] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload size={16} /> Pulihkan Data dari Berkas (.JSON / .XML)[cite: 2]
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileRestore}
            accept=".json,.xml"
            className="hidden"
          />

          <div className="pt-1">
            <AccentButton label="Selesai" onClick={onClose} className="w-full !h-11 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};