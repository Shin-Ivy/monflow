'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Sparkles, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useToastStore } from '@/store/useToastStore';
import { AccentButton } from '../ui/Kit';

interface ScannedReceipt {
  merchant_name: string;
  total_amount: number;
  date: string;
  category_suggestion: string;
  items_summary: string;
}

export const ReceiptScannerModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { wallets, addTransaction } = useFinancialStore();
  const { showToast } = useToastStore();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedReceipt | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listener Paste Gambar (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isOpen) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) handleProcessFile(file);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProcessFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImagePreview(base64);
      runGeminiOcr(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const runGeminiOcr = async (base64Image: string, mimeType: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      showToast('NEXT_PUBLIC_GEMINI_API_KEY belum dikonfigurasi di .env.local', 'error');
      return;
    }

    setIsScanning(true);
    setScannedData(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // SYSTEM PROMPT RESMI MONFLOW MOBILE
      const prompt = `Anda adalah asisten cerdas pencatat keuangan aplikasi MonFlow Indonesia. Analisis foto struk / bon belanja ini dan ekstrak datanya secara akurat ke dalam format JSON murni.
Format JSON yang WAJIB:
{
  "merchant_name": "Nama Toko / Tempat (contoh: Karis Jaya Shop, Indomaret, Alfamart, SPBU)",
  "total_amount": 70000,
  "date": "YYYY-MM-DD",
  "category_suggestion": "Pilih salah satu: Makanan & Minuman, Belanja, Transportasi, Hiburan, Tagihan, Kesehatan, Pendidikan, atau Kebutuhan",
  "items_summary": "Daftar ringkas barang yang dibeli dipisah koma"
}
Aturan Penting:
1. "total_amount" adalah angka total akhir yang dibayar konsumen (bukan subtotal/diskon/kembalian).
2. Jika tanggal pada struk tidak terbaca jelas, gunakan tanggal hari ini.
3. Hanya kembalikan teks JSON valid tanpa tanda backtick markdown.`; //

      const pureBase64 = base64Image.split(',')[1];
      const imagePart = {
        inlineData: {
          data: pureBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text().trim();
      const cleanJson = responseText.replace(/```json|```/g, '').trim();
      const parsed: ScannedReceipt = JSON.parse(cleanJson);

      setScannedData(parsed);
      showToast('Struk belanja berhasil dianalisis!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Gagal memproses struk belanja: ' + err.message, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveTransaction = async () => {
    if (!scannedData || !selectedWalletId) return;

    try {
      await addTransaction({
        wallet_id: selectedWalletId,
        amount: scannedData.total_amount,
        type: 'expense',
        category: scannedData.category_suggestion || 'Belanja',
        description: `${scannedData.merchant_name} (${scannedData.items_summary || 'Belanja'})`,
        date: new Date(scannedData.date).toISOString(),
      });

      showToast('Transaksi struk berhasil disimpan!', 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-[24px] overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-[#334155] flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2 text-[#F8FAFC]">
            <Sparkles size={18} className="text-[#00838F]" /> AI Receipt Scanner (Gemini Flash)[cite: 2]
          </h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Upload Box / Drag & Drop */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#334155] hover:border-[#00838F]/60 bg-[#0B1120] rounded-[18px] p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px]"
          >
            {imagePreview ? (
              <div className="relative group w-full flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Struk Preview"
                  className="max-h-48 rounded-xl object-contain shadow-lg"
                />
                <p className="text-[10px] text-[#94A3B8] mt-2">Klik untuk ganti gambar</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-[#004D57]/30 text-[#00838F] flex items-center justify-center mb-3">
                  <Upload size={22} />
                </div>
                <p className="text-xs font-bold text-[#F8FAFC]">Unggah Foto Struk Belanja</p>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Pilih file gambar atau tekan <kbd className="px-1.5 py-0.5 bg-[#1E293B] border border-[#334155] rounded text-white text-[10px]">Ctrl + V</kbd> untuk paste langsung.
                </p>
              </>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleProcessFile(file);
            }}
            accept="image/*"
            className="hidden"
          />

          {/* Loading Indicator */}
          {isScanning && (
            <div className="p-4 rounded-xl bg-[#004D57]/20 border border-[#00838F]/30 flex items-center gap-3 text-xs text-[#00838F] animate-pulse">
              <Sparkles className="animate-spin" size={16} />
              <span>Gemini Flash sedang mengekstrak nama toko, nominal, dan tanggal...</span>
            </div>
          )}

          {/* Scanned Result Card */}
          {scannedData && !isScanning && (
            <div className="p-4 rounded-[16px] bg-[#0B1120] border border-[#334155] space-y-3 animate-in fade-in duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">Toko / Tempat</span>
                  <p className="text-sm font-bold text-[#F8FAFC]">{scannedData.merchant_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">Total Akhir</span>
                  <p className="text-base font-bold font-mono text-[#DB2777]">
                    Rp {scannedData.total_amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#334155]/60 pt-3">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">Kategori Saran</span>
                  <p className="text-xs text-[#00838F] font-semibold">{scannedData.category_suggestion}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">Tanggal</span>
                  <p className="text-xs text-[#94A3B8] font-mono">{scannedData.date}</p>
                </div>
              </div>

              {scannedData.items_summary && (
                <div className="border-t border-[#334155]/60 pt-2">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">Daftar Barang</span>
                  <p className="text-xs text-[#94A3B8] italic">{scannedData.items_summary}</p>
                </div>
              )}

              <div className="border-t border-[#334155]/60 pt-3 space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase">Pilih Dompet Pengeluaran</label>
                <select
                  value={selectedWalletId}
                  onChange={(e) => setSelectedWalletId(e.target.value)}
                  className="w-full h-10 px-3 bg-[#1E293B] border border-[#334155] rounded-[10px] text-xs text-[#F8FAFC]"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} (Rp {w.balance.toLocaleString('id-ID')})
                    </option>
                  ))}
                </select>
              </div>

              <AccentButton
                label="Simpan ke Transaksi"
                icon={Check}
                onClick={handleSaveTransaction}
                className="w-full !h-11 mt-2 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};