'use client';

import { useEffect } from 'react';

interface HotkeyOptions {
  onNewTransaction?: () => void;
  onOpenExport?: () => void;
}

export function useHotkeys({ onNewTransaction, onOpenExport }: HotkeyOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Abaikan shortcut jika user sedang mengetik di input/textarea/select
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      // 'N' atau 'n' -> Catat Transaksi Baru
      if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onNewTransaction?.();
      }

      // 'Ctrl+E' atau 'Cmd+E' -> Buka Modal Data & Ekspor
      if ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        onOpenExport?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewTransaction, onOpenExport]);
}