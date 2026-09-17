'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ArrowLeftRight, Plus, PieChart, Wallet } from 'lucide-react';

export const MobileNavBar = ({ onOpenAddTx }: { onOpenAddTx: () => void }) => {
  const pathname = usePathname();

  const navs = [
    { label: 'Utama', path: '/dashboard', icon: LayoutGrid },
    { label: 'Mutasi', path: '/transaksi', icon: ArrowLeftRight },
    { label: 'FAB', path: '#', icon: Plus, isFab: true },
    { label: 'Budget', path: '/budget', icon: PieChart },
    { label: 'Dompet', path: '/dompet', icon: Wallet },
  ];

  return (
    <div className="fixed bottom-4 inset-x-4 z-40 md:hidden">
      <nav className="h-16 rounded-[22px] bg-[#151F32]/95 dark:bg-[#151F32]/95 bg-white/95 backdrop-blur-lg border border-[#26354A] dark:border-[#26354A] border-slate-200 shadow-2xl flex items-center justify-around px-2">
        {navs.map((item, idx) => {
          if (item.isFab) {
            return (
              <button
                key={idx}
                onClick={onOpenAddTx}
                className="w-12 h-12 -mt-5 rounded-full bg-[#00838F] hover:brightness-110 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,131,143,0.5)] active:scale-95 transition-all"
              >
                <Plus size={26} strokeWidth={2.5} />
              </button>
            );
          }

          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                isActive
                  ? 'text-[#00838F]'
                  : 'text-[#64748B] dark:text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};