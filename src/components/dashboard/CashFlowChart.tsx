'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Transaction } from '@/types/database';

interface CashFlowChartProps {
  transactions: Transaction[];
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ transactions }) => {
  // Olah agregasi transaksi 7 hari terakhir
  const processChartData = () => {
    const daysMap: { [key: string]: { date: string; income: number; expense: number } } = {};
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      daysMap[key] = { date: key, income: 0, expense: 0 };
    }

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (daysMap[txDate]) {
        if (tx.type === 'income') {
          daysMap[txDate].income += tx.amount;
        } else {
          daysMap[txDate].expense += tx.amount;
        }
      }
    });

    return Object.values(daysMap);
  };

  const data = processChartData();

  const formatTooltipCurrency = (value: any) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  return (
    <div className="w-full h-64 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EB7500" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#EB7500" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#DB2777" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#DB2777" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#64748B" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#64748B" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => `${val >= 1000 ? `${val / 1000}k` : val}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              borderColor: '#334155',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#F8FAFC',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
            formatter={(value: any) => [formatTooltipCurrency(value)]}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Pemasukan"
            stroke="#EB7500"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#incomeGrad)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Pengeluaran"
            stroke="#DB2777"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#expenseGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};