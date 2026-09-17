import { Transaction } from '@/types/database';

export type DateFilterPreset = 'today' | 'last7Days' | 'thisMonth' | 'allTime' | 'custom'; //

export interface DateFilterOption {
  key: DateFilterPreset;
  label: string;
}

export const DATE_FILTER_OPTIONS: DateFilterOption[] = [
  { key: 'thisMonth', label: 'Bulan Ini' },
  { key: 'today', label: 'Hari Ini' },
  { key: 'last7Days', label: '7 Hari Terakhir' },
  { key: 'allTime', label: 'Semua Waktu' },
];

export const formatRelativeDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Hari Ini, ${timeStr}`; //
  if (isYesterday) return `Kemarin, ${timeStr}`; //[cite: 2]

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const filterTransactionsByPreset = (
  transactions: Transaction[],
  preset: DateFilterPreset,
  customStart?: string,
  customEnd?: string
): Transaction[] => {
  const now = new Date();

  return transactions.filter((t) => {
    const txDate = new Date(t.date);

    switch (preset) {
      case 'today':
        return (
          txDate.getDate() === now.getDate() &&
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      case 'last7Days': {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return txDate >= sevenDaysAgo && txDate <= now;
      }
      case 'thisMonth':
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      case 'custom':
        if (!customStart || !customEnd) return true;
        return txDate >= new Date(customStart) && txDate <= new Date(customEnd);
      case 'allTime':
      default:
        return true;
    }
  });
};