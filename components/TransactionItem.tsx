import React from 'react';

interface TransactionItemProps {
  title: string;
  date: string;
  amount: string;
  status: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ title, date, amount, status }) => (
  <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
    <div className="flex-1">
      <h4 className="text-white font-black text-xs uppercase tracking-tight mb-1">{title}</h4>
      <p className="text-slate-600 text-[9px] font-bold">{date} • {status}</p>
    </div>
    <span className={`text-sm font-black ${amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>{amount}</span>
  </div>
);
