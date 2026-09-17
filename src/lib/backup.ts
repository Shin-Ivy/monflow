import { localDB } from './db';
import { 
  Wallet, 
  Transaction, 
  Budget, 
  SavingsGoal, 
  CustomCategory 
} from '@/types/database';

export interface BackupData {
  version: number;
  timestamp: string;
  wallets: Wallet[];
  categories: CustomCategory[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
}

const escapeXml = (str: string = '') => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// ── 1. EKSPOR FORMAT JSON ──────────────────────────────────────────────────
export const exportJsonBackup = async () => {
  const [wallets, categories, transactions, budgets, goals] = await Promise.all([
    localDB.wallets.toArray(),
    localDB.categories.toArray(),
    localDB.transactions.toArray(),
    localDB.budgets.toArray(),
    localDB.goals.toArray(),
  ]);

  const payload: BackupData = {
    version: 1,
    timestamp: new Date().toISOString(),
    wallets,
    categories,
    transactions,
    budgets,
    goals,
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(payload, null, 2)
  )}`;
  const link = document.createElement('a');
  link.href = jsonString;
  link.download = `Monflow_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
};

// ── 2. EKSPOR FORMAT XML (ENCAPSULATED TAGS) ──────────────────────────────
export const exportXmlBackup = async () => {
  const [wallets, categories, transactions, budgets, goals] = await Promise.all([
    localDB.wallets.toArray(),
    localDB.categories.toArray(),
    localDB.transactions.toArray(),
    localDB.budgets.toArray(),
    localDB.goals.toArray(),
  ]);

  const timestamp = new Date().toISOString();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<monflow_backup version="1" exported_at="${timestamp}">\n`;

  // Wallets
  xml += `  <wallets>\n`;
  wallets.forEach((w) => {
    xml += `    <wallet id="${w.id}" name="${escapeXml(w.name)}" balance="${w.balance}" color="${w.color}" type="${w.type || 'Cash'}" />\n`;
  });
  xml += `  </wallets>\n`;

  // Categories
  xml += `  <categories>\n`;
  categories.forEach((c) => {
    xml += `    <category id="${c.id}" name="${escapeXml(c.name)}" type="${c.type}" color="${c.color}" />\n`;
  });
  xml += `  </categories>\n`;

  // Transactions
  xml += `  <transactions>\n`;
  transactions.forEach((t) => {
    xml += `    <transaction id="${t.id}" wallet_id="${t.wallet_id}" category="${escapeXml(t.category)}" amount="${t.amount}" type="${t.type}" description="${escapeXml(t.description)}" date="${t.date}" />\n`;
  });
  xml += `  </transactions>\n`;

  // Budgets
  xml += `  <budgets>\n`;
  budgets.forEach((b) => {
    xml += `    <budget id="${b.id}" category_id="${escapeXml(b.category_id || '')}" monthly_limit="${b.monthly_limit}" month_period="${b.month_period}" />\n`;
  });
  xml += `  </budgets>\n`;

  // Savings Goals
  xml += `  <savings_goals>\n`;
  goals.forEach((g) => {
    xml += `    <savings_goal id="${g.id}" title="${escapeXml(g.title)}" target_amount="${g.target_amount}" current_amount="${g.current_amount}" target_date="${g.target_date}" />\n`;
  });
  xml += `  </savings_goals>\n`;

  xml += `</monflow_backup>`;

  const xmlBlob = `data:text/xml;charset=utf-8,${encodeURIComponent(xml)}`;
  const link = document.createElement('a');
  link.href = xmlBlob;
  link.download = `Monflow_Backup_${new Date().toISOString().slice(0, 10)}.xml`;
  link.click();
};

// ── 3. RESTORE DATA (AUTO-DETECT JSON / XML) ───────────────────────────────
export const restoreBackupFile = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;

        if (file.name.endsWith('.xml') || text.trim().startsWith('<?xml') || text.includes('<monflow_backup>')) {
          // Parse XML
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');

          if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error('Gagal memproses file XML: Format tidak sesuai.');
          }

          const root = xmlDoc.getElementsByTagName('monflow_backup')[0];
          if (!root) {
            throw new Error('Gagal memproses file XML: Format tidak sesuai.');
          }

          const wallets: Wallet[] = Array.from(xmlDoc.getElementsByTagName('wallet')).map((el) => ({
            id: el.getAttribute('id') || crypto.randomUUID(),
            name: el.getAttribute('name') || 'Dompet',
            balance: parseFloat(el.getAttribute('balance') || '0'),
            color: el.getAttribute('color') || '#004D57',
            type: (el.getAttribute('type') as any) || 'Cash',
          }));

          const categories: CustomCategory[] = Array.from(xmlDoc.getElementsByTagName('category')).map((el) => ({
            id: el.getAttribute('id') || crypto.randomUUID(),
            name: el.getAttribute('name') || 'Kategori',
            type: (el.getAttribute('type') as any) || 'expense',
            color: el.getAttribute('color') || '#00838F',
          }));

          const transactions: Transaction[] = Array.from(xmlDoc.getElementsByTagName('transaction')).map((el) => ({
            id: el.getAttribute('id') || crypto.randomUUID(),
            wallet_id: el.getAttribute('wallet_id') || '',
            category: el.getAttribute('category') || 'Lainnya',
            amount: parseFloat(el.getAttribute('amount') || '0'),
            type: (el.getAttribute('type') as any) || 'expense',
            description: el.getAttribute('description') || '',
            date: el.getAttribute('date') || new Date().toISOString(),
          }));

          const budgets: Budget[] = Array.from(xmlDoc.getElementsByTagName('budget')).map((el) => ({
            id: el.getAttribute('id') || crypto.randomUUID(),
            category_id: el.getAttribute('category_id') || '',
            monthly_limit: parseFloat(el.getAttribute('monthly_limit') || '0'),
            month_period: el.getAttribute('month_period') || new Date().toISOString().slice(0, 7),
          }));

          const goals: SavingsGoal[] = Array.from(xmlDoc.getElementsByTagName('savings_goal')).map((el) => ({
            id: el.getAttribute('id') || crypto.randomUUID(),
            title: el.getAttribute('title') || 'Target',
            target_amount: parseFloat(el.getAttribute('target_amount') || '0'),
            current_amount: parseFloat(el.getAttribute('current_amount') || '0'),
            target_date: el.getAttribute('target_date') || new Date().toISOString(),
          }));

          await applyRestoredData({ version: 1, timestamp: new Date().toISOString(), wallets, categories, transactions, budgets, goals });
          resolve(true);
        } else {
          // Parse JSON
          const data: BackupData = JSON.parse(text);
          if (!data.wallets || !data.transactions) {
            throw new Error('Format file JSON tidak valid.');
          }
          await applyRestoredData(data);
          resolve(true);
        }
      } catch (err: any) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};

const applyRestoredData = async (data: BackupData) => {
  await Promise.all([
    localDB.wallets.clear(),
    localDB.categories.clear(),
    localDB.transactions.clear(),
    localDB.budgets.clear(),
    localDB.goals.clear(),
  ]);

  if (data.wallets?.length) await localDB.wallets.bulkAdd(data.wallets);
  if (data.categories?.length) await localDB.categories.bulkAdd(data.categories);
  if (data.transactions?.length) await localDB.transactions.bulkAdd(data.transactions);
  if (data.budgets?.length) await localDB.budgets.bulkAdd(data.budgets);
  if (data.goals?.length) await localDB.goals.bulkAdd(data.goals);
};