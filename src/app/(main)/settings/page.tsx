'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  LogOut, 
  Shield, 
  HardDrive, 
  Keyboard, 
  Trash2,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  Lock,
  KeyRound,
  Tag,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useThemeStore, ThemeMode } from '@/store/useThemeStore';
import { useSecurityStore } from '@/store/useSecurityStore';
import { PinScreen, PinMode } from '@/components/security/PinScreen';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { AccentButton } from '@/components/ui/Kit';
import { localDB } from '@/lib/db';

export default function SettingsPage() {
  const router = useRouter();
  const { 
    isCloudMode, 
    transactions, 
    wallets, 
    budgets, 
    goals, 
    categories,
    deleteCategory,
    syncGuestToCloud, 
    init 
  } = useFinancialStore();
  
  const { themeMode, setThemeMode } = useThemeStore();
  const { isPinEnabled, disablePin, lockApp } = useSecurityStore();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<PinMode>('setup');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || null);
      }
    };
    checkUser();
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncGuestToCloud();
      alert('Data lokal berhasil disinkronkan ke Cloud Supabase!');
    } catch (err: any) {
      alert(`Gagal sinkronisasi: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await init();
    router.push('/auth/login');
  };

  const handleClearAllData = async () => {
    const confirm = window.confirm(
      'APAKAH ANDA YAKIN? Tindakan ini akan menghapus seluruh data lokal di browser ini secara permanen!'
    );
    if (!confirm) return;

    await Promise.all([
      localDB.wallets.clear(),
      localDB.categories.clear(),
      localDB.transactions.clear(),
      localDB.budgets.clear(),
      localDB.goals.clear(),
      localDB.debts.clear(),
      localDB.recurring.clear(),
    ]);

    await init();
    alert('Seluruh basis data lokal berhasil dibersihkan.');
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: 'light', label: 'Terang', icon: Sun },
    { mode: 'dark', label: 'Deep Obsidian', icon: Moon },
    { mode: 'system', label: 'Sistem', icon: Laptop },
  ];

  return (
    <div className="max-w-4xl space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan & Akun</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Konfigurasi sinkronisasi cloud, tema tampilan, dan preferensi kerja Anda.
        </p>
      </div>

      {/* ── STATUS AKUN & SINKRONISASI ─────────────────────────────── */}
      <div className="p-6 rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#004D57]/10 text-[#00838F] border border-[#00838F]/30 flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                {userEmail ? userEmail : 'Mode Tamu (Offline-First)'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isCloudMode ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {isCloudMode ? (
                    <>
                      <Cloud size={14} /> Terhubung ke Supabase Cloud
                    </>
                  ) : (
                    <>
                      <CloudOff size={14} /> Tersimpan Lokal di Browser (IndexedDB)
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div>
            {userEmail ? (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut size={15} /> Keluar Akun
              </button>
            ) : (
              <button
                onClick={() => router.push('/auth/login')}
                className="px-4 py-2 bg-[#00838F] text-white hover:brightness-110 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                Masuk / Buat Akun <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {userEmail && (
          <div className="pt-4 border-t border-slate-100 dark:border-[#26354A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Punya data di browser ini yang belum tersimpan ke akun cloud?
            </div>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#26354A] rounded-xl text-xs font-semibold text-slate-800 dark:text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin text-[#00838F]' : 'text-[#00838F]'} />
              {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data Tamu ke Cloud'}
            </button>
          </div>
        )}
      </div>

      {/* ── MODE TAMPILAN & TEMA (TRI-STATE) ────────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 flex items-center gap-2">
          <Moon size={15} className="text-[#00838F]" /> Mode Tampilan & Tema
        </h3>
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Pilih preferensi visual: Terang, Gelap (Deep Obsidian), atau mengikuti pengaturan Sistem perangkat Anda.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-1">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = themeMode === opt.mode;
              return (
                <button
                  key={opt.mode}
                  onClick={() => setThemeMode(opt.mode)}
                  className={`p-3.5 rounded-[16px] border flex flex-col items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#004D57] to-[#023840] border-[#00838F] text-white shadow-md'
                      : 'bg-slate-50 dark:bg-[#0B1120] border-slate-200 dark:border-[#26354A] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#00838F]' : 'text-slate-400'} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── KEAMANAN & PIN APLIKASI (APP LOCK) ──────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 flex items-center gap-2">
          <Lock size={15} className="text-[#00838F]" /> Keamanan & PIN Aplikasi
        </h3>
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound size={16} className="text-[#00838F]" />
                Kunci PIN 6-Digit (App Lock)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isPinEnabled
                  ? 'Aplikasi dilindungi PIN. Workspace akan terkunci otomatis saat dibuka.'
                  : 'Aktifkan PIN untuk melindungi data keuangan Anda dari akses tak dikenal.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isPinEnabled ? (
                <>
                  <button
                    onClick={lockApp}
                    className="px-3.5 py-2 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-[#26354A] text-slate-800 dark:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer hover:border-[#00838F]"
                  >
                    Kunci Sekarang
                  </button>
                  <button
                    onClick={() => {
                      setPinModalMode('change');
                      setIsPinModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-[#00838F]/10 border border-[#00838F]/30 text-[#00838F] hover:bg-[#00838F]/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    Ubah PIN
                  </button>
                  <button
                    onClick={disablePin}
                    className="px-3.5 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    Nonaktifkan
                  </button>
                </>
              ) : (
                <AccentButton
                  label="Buat PIN Baru"
                  icon={Lock}
                  onClick={() => {
                    setPinModalMode('setup');
                    setIsPinModalOpen(true);
                  }}
                  className="!h-10 !text-xs cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── KATEGORI KUSTOM ────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Tag size={15} className="text-[#00838F]" /> Kategori Kustom ({categories.length})
          </h3>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="text-xs font-bold text-[#00838F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Tambah Kategori
          </button>
        </div>
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-slate-100 dark:bg-[#0B1120] border border-slate-200 dark:border-[#26354A] text-xs font-semibold text-slate-800 dark:text-white"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                {c.name}
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="text-slate-400 hover:text-rose-500 transition-colors ml-0.5 cursor-pointer text-sm leading-none"
                  title="Hapus Kategori"
                >
                  &times;
                </button>
              </span>
            ))}
            {categories.length === 0 && (
              <p className="text-xs text-slate-400">Belum ada kategori yang dikonfigurasi.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── RINGKASAN BASIS DATA (TEXT SELALU JELAS DI KEDUA TEMA) ──── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 flex items-center gap-2">
          <HardDrive size={15} className="text-[#00838F]" /> Ringkasan Basis Data
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-[20px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaksi</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{transactions.length}</p>
          </div>
          <div className="p-4 rounded-[20px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dompet / Rekening</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{wallets.length}</p>
          </div>
          <div className="p-4 rounded-[20px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Anggaran Aktif</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{budgets.length}</p>
          </div>
          <div className="p-4 rounded-[20px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Tabungan</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{goals.length}</p>
          </div>
        </div>
      </div>

      {/* ── PINTASAN KEYBOARD DESKTOP ──────────────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 flex items-center gap-2">
          <Keyboard size={15} className="text-[#00838F]" /> Pintasan Keyboard Desktop
        </h3>
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-sm divide-y divide-slate-100 dark:divide-[#26354A]">
          <div className="py-2.5 flex items-center justify-between text-xs first:pt-0">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Catat Transaksi Cepat</span>
            <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-[#0B1120] border border-slate-200 dark:border-[#26354A] rounded-lg text-xs font-mono font-bold text-[#00838F]">
              N
            </kbd>
          </div>
          <div className="py-2.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Buka Modal Ekspor & Cadangan</span>
            <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-[#0B1120] border border-slate-200 dark:border-[#26354A] rounded-lg text-xs font-mono font-bold text-[#00838F]">
              Ctrl + E
            </kbd>
          </div>
          <div className="py-2.5 flex items-center justify-between text-xs last:pb-0">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Scan Gambar Struk Otomatis (Saat modal scanner terbuka)</span>
            <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-[#0B1120] border border-slate-200 dark:border-[#26354A] rounded-lg text-xs font-mono font-bold text-[#00838F]">
              Ctrl + V
            </kbd>
          </div>
        </div>
      </div>

      {/* ── DANGER ZONE ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 px-1 flex items-center gap-2">
          <Shield size={15} /> Zona Bahaya
        </h3>
        <div className="p-5 rounded-[24px] bg-rose-50/60 dark:bg-red-950/20 border border-rose-200 dark:border-red-900/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">Hapus Seluruh Data Lokal</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Menghapus semua mutasi, rekening, anggaran, dan tabungan yang tersimpan di browser ini.
            </p>
          </div>
          <button
            onClick={handleClearAllData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            <Trash2 size={15} /> Hapus Data
          </button>
        </div>
      </div>

      {/* Modal Dialogs */}
      <PinScreen
        mode={pinModalMode}
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => setIsPinModalOpen(false)}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}