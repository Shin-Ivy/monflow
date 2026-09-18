'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useSecurityStore } from '@/store/useSecurityStore';
import { useThemeStore } from '@/store/useThemeStore';
import { PinScreen } from '../security/PinScreen';
import { ToastContainer } from '../ui/Toast';
import { InitialSetupModal } from '../onboarding/InitialSetupModal';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { init, wallets, isLoading } = useFinancialStore();
  const { isPinEnabled, isLocked, unlockApp } = useSecurityStore();
  const { themeMode } = useThemeStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    init();
  }, [init]);

  // Sinkronisasi otomatis class 'dark' ke tag <html> berdasarkan state tema / sistem OS
  useEffect(() => {
    const root = document.documentElement;

    const applyDark = (shouldBeDark: boolean) => {
      if (shouldBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (themeMode === 'dark') {
      applyDark(true);
    } else if (themeMode === 'light') {
      applyDark(false);
    } else {
      // Jika mode 'system' atau bawaan
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyDark(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => applyDark(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [themeMode]);

  // Halaman publik yang tidak memerlukan proteksi PIN maupun modal onboarding
  const isPublicPath = pathname === '/' || pathname.startsWith('/auth');

  // Lock PIN hanya aktif jika user BUKAN di landing page / auth
  const shouldShowPinLock = mounted && isPinEnabled && isLocked && !isPublicPath;

  // Onboarding hanya tampil jika di dalam workspace aplikasi dan belum ada dompet
  const shouldShowOnboarding = mounted && !isPublicPath && !isLoading && wallets.length === 0;

  return (
    <>
      {children}

      {/* Lock PIN hanya berlaku di dalam workspace /dashboard dll */}
      {shouldShowPinLock && (
        <div className="fixed inset-0 z-[999] bg-[#070B14] flex items-center justify-center">
          <PinScreen
            mode="verify"
            isOpen={true}
            onClose={() => {}}
            onSuccess={() => unlockApp()}
          />
        </div>
      )}

      {/* Modal Onboarding pengguna baru */}
      <InitialSetupModal isOpen={shouldShowOnboarding} />

      {/* Toast Alert Global */}
      <ToastContainer />
    </>
  );
};