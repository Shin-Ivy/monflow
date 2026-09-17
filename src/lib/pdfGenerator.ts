import { Transaction, Wallet } from '@/types/database';

const escapeXml = (str: string = '') => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const generateFormalReportPdf = (
  transactions: Transaction[],
  wallets: Wallet[],
  userName: string = 'Pengguna MonFlow'
) => {
  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netCashFlow = totalIncome - totalExpense;

  // Hitung Pengeluaran Top Per Kategori
  const categoryTotals: { [key: string]: number } = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Keuangan MonFlow</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0F172A; margin: 0; padding: 0; font-size: 11px; }
        .header { border-bottom: 2px solid #00838F; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .brand { font-size: 20px; font-weight: 800; color: #004D57; letter-spacing: 0.5px; }
        .meta { text-align: right; color: #64748B; font-size: 10px; line-height: 1.4; }
        .section-title { font-size: 12px; font-weight: 700; color: #004D57; text-transform: uppercase; margin-top: 18px; margin-bottom: 8px; letter-spacing: 0.5px; }
        .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .card { padding: 12px; border-radius: 8px; border: 1px solid #E2E8F0; background: #F8FAFC; }
        .card-label { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px; }
        .card-value { font-size: 14px; font-weight: 700; font-family: monospace; }
        .income { color: #EB7500; }
        .expense { color: #DB2777; }
        .net { color: #00838F; }
        table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        th { background: #F1F5F9; color: #475569; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 7px 8px; border: 1px solid #CBD5E1; text-align: left; }
        td { padding: 6px 8px; border: 1px solid #E2E8F0; font-size: 10px; }
        tr:nth-child(even) { background: #F8FAFC; }
        .text-right { text-align: right; }
        .font-mono { font-family: monospace; }
        .footer { margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 10px; text-align: center; color: #94A3B8; font-size: 9px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">MONFLOW FINANCIAL REPORT</div>
          <div style="font-size: 11px; color: #64748B; margin-top: 2px;">Smart Personal Ledger & Wealth Analytics</div>
        </div>
        <div class="meta">
          <div><strong>Pengguna:</strong> ${escapeXml(userName)}</div>
          <div><strong>Dicetak:</strong> ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      <div class="section-title">Ringkasan Arus Kas</div>
      <div class="summary-grid">
        <div class="card">
          <div class="card-label">Total Pemasukan</div>
          <div class="card-value income">${formatRupiah(totalIncome)}</div>
        </div>
        <div class="card">
          <div class="card-label">Total Pengeluaran</div>
          <div class="card-value expense">${formatRupiah(totalExpense)}</div>
        </div>
        <div class="card">
          <div class="card-label">Arus Kas Bersih</div>
          <div class="card-value net">${formatRupiah(netCashFlow)}</div>
        </div>
      </div>

      ${
        sortedCategories.length > 0
          ? `
        <div class="section-title">Top Pengeluaran Kategori</div>
        <table>
          <thead>
            <tr>
              <th>Kategori</th>
              <th class="text-right">Nominal Pengeluaran</th>
              <th class="text-right">Porsi</th>
            </tr>
          </thead>
          <tbody>
            ${sortedCategories
              .map(([cat, val]) => {
                const percent = totalExpense > 0 ? ((val / totalExpense) * 100).toFixed(1) : '0';
                return `
                <tr>
                  <td><strong>${escapeXml(cat)}</strong></td>
                  <td class="text-right font-mono">${formatRupiah(val)}</td>
                  <td class="text-right font-mono">${percent}%</td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      <div class="section-title">Rincian Transaksi (${transactions.length} Mutasi)</div>
      <table>
        <thead>
          <tr>
            <th style="width: 25px;">No</th>
            <th>Tanggal</th>
            <th>Deskripsi / Toko</th>
            <th>Kategori</th>
            <th>Dompet</th>
            <th class="text-right">Nominal</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .map((t, idx) => {
              const wallet = wallets.find((w) => w.id === t.wallet_id);
              const isIncome = t.type === 'income';
              return `
              <tr>
                <td>${idx + 1}</td>
                <td class="font-mono">${new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td><strong>${escapeXml(t.description)}</strong></td>
                <td>${escapeXml(t.category)}</td>
                <td>${escapeXml(wallet?.name || 'Utama')}</td>
                <td class="text-right font-mono ${isIncome ? 'income' : 'expense'}">
                  ${isIncome ? '+' : '-'}${formatRupiah(t.amount)}
                </td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        Dibuat otomatis oleh MonFlow App - Smart Personal Ledger &amp; Document Engine
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};