
import React, { useState, useMemo } from 'react';
import { Trip, Community } from '../types';
import { useUser } from '../contexts/UserContext';
import { COMMUNITY_FILTERS } from '../constants';

interface Props {
  onBack: () => void;
  onSelectTrip: (trip: Trip) => void;
  onSelectCommunity: (community: Community) => void;
}

const AllCommunities: React.FC<Props> = ({ onBack, onSelectTrip, onSelectCommunity }) => {
  const { communities } = useUser();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCommunities = useMemo(() => {
    if (activeCategory === 'All') return communities;
    return communities.filter(c => c.category === activeCategory);
  }, [communities, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF5] text-[#14532D]">
      <header className="sticky top-0 z-50 bg-[#FCFBF5]/80 backdrop-blur-md px-4 pt-8 pb-4 border-b border-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-primary p-2 hover:bg-primary/5 rounded-full active:scale-90 transition-all">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-heading font-black text-primary tracking-tight uppercase italic">Communities</h1>
        </div>
        <span className="text-accent text-[10px] font-black uppercase italic tracking-tighter mr-2">Inspired</span>
      </header>

      <div className="p-4">
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8">
          {COMMUNITY_FILTERS.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/5 text-primary/40 border border-primary/5 hover:text-primary'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 pb-24">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
              onClick={() => onSelectCommunity(community)}
            >
              <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl border border-primary/10 group-hover:border-accent/50 transition-all">
                <img src={community.image} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt={community.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-accent text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full">{community.category}</span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full">{community.memberCount} Members</span>
                  </div>
                  <h3 className="text-white font-heading font-black text-xl leading-none uppercase italic tracking-tighter">{community.title}</h3>
                  <p className="text-white/60 text-[10px] font-bold mt-1 line-clamp-1">{community.description}</p>
                </div>
              </div>
            </div>
          ))}

          {filteredCommunities.length === 0 && (
            <div className="text-center py-20 opacity-50">
              <span className="material-symbols-outlined text-4xl mb-2">grid_off</span>
              <p className="text-xs font-black uppercase tracking-widest">No communities found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCommunities;
