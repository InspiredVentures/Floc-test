
import React, { useState } from 'react';
import { Trip, Community } from '../types';

interface Props {
  onBack: () => void;
  onSelectTrip: (trip: Trip) => void;
  onSelectCommunity: (community: Community) => void;
}

const CATEGORIES = ['All', 'Adventure', 'Wellness', 'Eco-Travel', 'Culinary', 'Expedition', 'Social'];

const AllCommunities: React.FC<Props> = ({ onBack, onSelectTrip, onSelectCommunity }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-4 pt-8 pb-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white p-2 hover:bg-white/5 rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-white tracking-tight">Communities</h1>
        </div>
        <span className="text-white/40 text-[10px] font-black uppercase italic tracking-tighter mr-2">Inspired</span>
      </header>

      <div className="p-4">
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-500 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pb-24">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="group cursor-pointer animate-in fade-in zoom-in duration-500"
              onClick={() => onSelectCommunity({
                id: `comm-${i}`,
                title: `Community ${i+1}`,
                meta: `${activeCategory} • ${Math.floor(Math.random()*5000)} Members`,
                description: `A passionate community of ${activeCategory.toLowerCase()} explorers focused on conscious travel and positive impact.`,
                image: `https://picsum.photos/seed/${i + 100}/400/500`,
                memberCount: `${Math.floor(Math.random()*5000)}`,
                category: activeCategory,
                upcomingTrips: [],
                accessType: i % 2 === 0 ? 'free' : 'request'
              })}
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/5 group-hover:border-primary/50 transition-all">
                <img src={`https://picsum.photos/seed/${i + 100}/400/500`} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-black text-xs leading-tight mb-1 uppercase tracking-tight">New Community {i + 1}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="size-1 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-white/60 text-[8px] font-bold uppercase tracking-widest">{Math.floor(Math.random() * 500) + 10} Members</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCommunities;
