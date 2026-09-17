import { Transaction, Wallet } from '@/types/database';

export const exportToCSV = (transactions: Transaction[], wallets: Wallet[]) => {
  const walletMap = new Map(wallets.map(w => [w.id, w.name]));
  
  // Header CSV
  let csvContent = "Tanggal,Deskripsi,Kategori,Dompet,Tipe,Nominal\n";

  // Baris Data
  transactions.forEach(tx => {
    const row = [
      new Date(tx.date).toLocaleDateString('id-ID'),
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.category,
      walletMap.get(tx.wallet_id) || 'N/A',
      tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      tx.amount
    ].join(",");
    csvContent += row + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `MonFlow_Laporan_${new Date().toISOString().slice(0,10)}.csv`);
  link.click();
};