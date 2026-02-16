import React from 'react';

interface PowerMenuItemProps {
    icon: string;
    title: string;
    desc: string;
    onClick: () => void;
    delay: string;
}

export const PowerMenuItem = ({ icon, title, desc, onClick, delay }: PowerMenuItemProps) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`w-full bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-4 text-left hover:bg-white/10 transition-all active:scale-[0.98] animate-in slide-in-from-bottom-4 duration-500 ${delay}`}
    >
        <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="text-white font-black text-lg leading-none mb-1 truncate">{title}</h4>
            <p className="text-slate-500 text-xs font-medium truncate">{desc}</p>
        </div>
        <span className="material-symbols-outlined text-slate-700 ml-auto">chevron_right</span>
    </button>
);
