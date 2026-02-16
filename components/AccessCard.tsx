import React from 'react';

interface AccessCardProps {
  active: boolean;
  title: string;
  desc: string;
  icon: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export const AccessCard: React.FC<AccessCardProps> = ({ active, title, desc, icon, onClick, children }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-3xl border text-left flex items-center gap-4 transition-all w-full group ${active ? 'bg-primary border-primary shadow-xl shadow-primary/10' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
  >
    <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-background-dark text-primary' : 'bg-white/5 text-slate-500 group-hover:text-white'}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className={`font-black text-sm mb-1 truncate ${active ? 'text-background-dark' : 'text-white'}`}>{title}</h4>
      <p className={`text-[11px] leading-tight ${active ? 'text-background-dark/70 font-medium' : 'text-slate-500 group-hover:text-slate-300'}`}>{desc}</p>
    </div>
    {children}
  </button>
);
