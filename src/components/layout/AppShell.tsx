'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Wallet, 
  PieChart, 
  PiggyBank, 
  HandCoins,
  CalendarClock,
  BarChart3, 
  Settings,
  Menu, 
  X, 
  Eye, 
  EyeOff, 
  Plus,
  Database
} from 'lucide-react';
import { AccentButton } from '../ui/Kit';
import { AddTransactionModal } from '../modals/AddTransactionModal';
import { ExportModal } from '../modals/ExportModal';
import { MobileNavBar } from './MobileNavBar';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useHotkeys } from '@/hooks/useHotkeys';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isCloudMode, hideBalance, toggleHideBalance } = useFinancialStore();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useHotkeys({
    onNewTransaction: () => setIsAddTxOpen(true),
    onOpenExport: () => setIsExportOpen(true),
  });

  const navItems = [
    { name: 'DASHBOARD', path: '/dashboard', icon: LayoutDashboard },
    { name: 'TRANSAKSI', path: '/transaksi', icon: ArrowLeftRight },
    { name: 'DOMPET', path: '/dompet', icon: Wallet },
    { name: 'BUDGET', path: '/budget', icon: PieChart },
    { name: 'TABUNGAN', path: '/savings', icon: PiggyBank },
    { name: 'HUTANG PIUTANG', path: '/debts', icon: HandCoins },
    { name: 'TAGIHAN RUTIN', path: '/recurring', icon: CalendarClock },
    { name: 'LAPORAN', path: '/reports', icon: BarChart3 },
    { name: 'PENGATURAN', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] dark:bg-[#070B14] text-slate-900 dark:text-[#F8FAFC] overflow-hidden font-sans relative transition-colors duration-200">
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR DESKTOP ──────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#070B14] h-full flex flex-col justify-between p-5 border-r border-slate-200 dark:border-[#26354A] shrink-0
          transform transition-transform duration-300 ease-in-out shadow-lg md:shadow-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            {/* Logo MonFlow Resmi */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="MonFlow Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 dark:text-[#F8FAFC] tracking-wide block leading-none">
                  MonFlow
                </span>
                <span className="text-[10px] font-bold text-[#00838F] tracking-[1px] uppercase block mt-1">
                  FINANCIAL HUB
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-slate-400 dark:text-[#94A3B8] tracking-[1.0px] uppercase">
                MENU UTAMA
              </span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-[12px] font-semibold text-xs tracking-wide transition-all border ${
                      isActive
                        ? 'bg-gradient-to-r from-[#004D57] to-[#023840] text-white border-[#00838F]/50 shadow-md'
                        : 'text-slate-600 dark:text-[#94A3B8] border-transparent hover:bg-slate-100 dark:hover:bg-[#151F32] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400 dark:text-[#94A3B8]'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-[#26354A]">
          <AccentButton
            label="Catat Transaksi"
            icon={Plus}
            onClick={() => setIsAddTxOpen(true)}
            className="w-full !h-10 cursor-pointer"
          />

          <div className="text-[10px] font-bold text-slate-400 dark:text-[#64748B] px-2 uppercase flex items-center justify-between">
            <span>MONFLOW WEB</span>
            <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-[#00838F] font-bold">V1.0</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ────────────────────────────────────── */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col bg-[#F8FAFC] dark:bg-[#070B14] min-w-0">
        <header className="h-16 border-b border-slate-200 dark:border-[#26354A] bg-white dark:bg-[#0B1120] px-4 md:px-8 flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 text-[#00838F] hover:bg-slate-100 dark:hover:bg-[#151F32] rounded-lg transition-all"
            >
              <Menu size={20} />
            </button>

            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
              isCloudMode 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isCloudMode ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isCloudMode ? 'Cloud Synced' : 'Offline Mode (Local)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExportOpen(true)}
              title="Laporan & Ekspor Data"
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#26354A] bg-slate-100 dark:bg-[#151F32] text-slate-700 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#00838F]" />
              <span className="hidden sm:inline">Data & Ekspor</span>
            </button>

            <button
              onClick={toggleHideBalance}
              title="Sembunyikan/Tampilkan Saldo"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151F32] transition-colors cursor-pointer"
            >
              {hideBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            <Link
              href="/settings"
              className="w-8 h-8 rounded-full bg-[#004D57] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:brightness-110 transition-all"
            >
              MF
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <MobileNavBar onOpenAddTx={() => setIsAddTxOpen(true)} />
      <AddTransactionModal isOpen={isAddTxOpen} onClose={() => setIsAddTxOpen(false)} />
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};