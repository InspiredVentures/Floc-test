import React from 'react';

interface ActionTileProps {
    icon: string;
    label: string;
    active?: boolean;
    onClick: () => void;
}

export const ActionTile: React.FC<ActionTileProps> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 hover:border-primary/20 group shadow-sm ${active ? 'bg-primary border-primary text-white' : 'bg-white border-primary/5 text-primary/40 hover:text-primary hover:bg-primary/5'}`}
    >
        <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${active ? 'text-white' : 'text-primary/40 group-hover:text-primary'}`}>
            {icon}
        </span>
        <span className={`text-[9px] font-black uppercase tracking-widest text-center ${active ? 'text-white' : 'text-primary/40 group-hover:text-primary'}`}>
            {label}
        </span>
    </button>
);
