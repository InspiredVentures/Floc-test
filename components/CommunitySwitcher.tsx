import React, { useState } from 'react';
import { Community } from '../types';

interface CommunitySwitcherProps {
    communities: Community[];
    activeCommunityId: string;
    onSelectCommunity: (id: string) => void;
    onNavigate: (community: Community) => void;
    weeklyGrowth?: string;
    memberCount?: number;
}

export const CommunitySwitcher: React.FC<CommunitySwitcherProps> = ({
    communities,
    activeCommunityId,
    onSelectCommunity,
    onNavigate,
    weeklyGrowth = "0.0",
    memberCount = 0
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const activeCommunity = communities.find(c => c.id === activeCommunityId) || communities[0];

    if (!activeCommunity) return null;

    return (
        <div className="bg-white rounded-[2rem] p-1 border border-primary/5 shadow-xl">
            <div className="bg-primary/5 rounded-[1.8rem] p-6 relative overflow-hidden group">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-accent/20 transition-all duration-500"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 cursor-pointer group/switcher"
                        >
                            <span className="text-xs font-bold text-primary uppercase tracking-widest border border-primary/10 px-2 py-1 rounded-lg bg-white/50 group-hover/switcher:bg-white transition-colors">
                                {communities.length > 1 ? 'Switch Community' : 'Active Community'}
                            </span>
                            {communities.length > 1 && (
                                <span className="material-symbols-outlined text-primary text-sm transition-transform group-hover/switcher:rotate-180">
                                    expand_more
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => onNavigate(activeCommunity)}
                            className="size-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all"
                        >
                            <span className="material-symbols-outlined text-primary text-sm">arrow_outward</span>
                        </button>
                    </div>

                    {/* Dropdown for Switching */}
                    {isOpen && (
                        <div className="absolute top-14 left-6 right-6 bg-white border border-primary/10 rounded-xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                            {communities.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => { onSelectCommunity(c.id); setIsOpen(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-between ${activeCommunityId === c.id ? 'bg-primary text-white' : 'text-primary/60 hover:bg-primary/5 hover:text-primary'}`}
                                >
                                    {c.title}
                                    {activeCommunityId === c.id && <span className="material-symbols-outlined text-sm">check</span>}
                                </button>
                            ))}
                        </div>
                    )}

                    <h2 className="text-3xl font-heading font-black text-primary mb-2 leading-tight italic uppercase">
                        {activeCommunity.title}
                    </h2>
                    <p className="text-primary/60 text-sm font-medium line-clamp-1">
                        {activeCommunity.description || "Leading the community forward."}
                    </p>

                    <div className="mt-6 flex items-center gap-4">
                        {/* Mini Member Stack */}
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="size-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                    <img src={`https://picsum.photos/seed/${activeCommunity.id}${i}/100/100`} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="size-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[9px] font-bold text-white">
                                +{memberCount}
                            </div>
                        </div>
                        <div className="h-8 w-[1px] bg-primary/10"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Growth</span>
                            <span className="text-green-600 text-xs font-bold">+{weeklyGrowth}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
