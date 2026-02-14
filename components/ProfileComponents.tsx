import React from 'react';

export const DNACard = ({ label, icon, score }: { label: string, icon: string, score: string }) => (
    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl group hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">{score}</span>
        </div>
        <h4 className="text-white font-black text-[10px] uppercase tracking-[0.1em]">{label}</h4>
    </div>
);

export const StatBox = ({ label, value, icon, onClick }: { label: string, value: string, icon: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="bg-surface-dark border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95 shadow-xl"
    >
        <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
        <div className="flex flex-col">
            <span className="text-white font-black text-lg leading-none">{value}</span>
            <span className="text-slate-600 text-[7px] font-black uppercase tracking-widest mt-1">{label}</span>
        </div>
    </button>
);
