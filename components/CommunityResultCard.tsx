import React from 'react';
import { Community } from '../types';

export const CommunityResultCard: React.FC<{ community: Community, onClick: () => void }> = ({ community, onClick }) => (
    <div
        onClick={onClick}
        className="flex items-center gap-5 p-5 rounded-[2.5rem] bg-surface-dark border border-white/10 hover:border-primary/40 transition-all cursor-pointer shadow-xl group active:scale-[0.98]"
    >
        <div className="size-24 rounded-[2rem] bg-cover bg-center shrink-0 shadow-2xl transition-all group-hover:scale-105" style={{ backgroundImage: `url(${community.image})` }}></div>
        <div className="flex-1 min-w-0">
            <span className="text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 inline-block">{community.category}</span>
            <h4 className="text-white font-black text-xl italic tracking-tight leading-none mb-2 truncate">{community.title}</h4>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{community.memberCount} Members</p>
        </div>
        <span className="material-symbols-outlined text-slate-700 text-2xl font-black group-hover:text-primary transition-all">chevron_right</span>
    </div>
);
