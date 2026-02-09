
import React, { useState } from 'react';
import { TribePost, Community } from '../types';

interface Props {
  onSelectCommunity: (community: Community) => void;
  onOpenNotifications: () => void;
}

const MOCK_GLOBAL_POSTS: TribePost[] = [
  {
    id: 'gp1',
    author: 'Elena Vance',
    authorAvatar: 'https://picsum.photos/seed/elena/100/100',
    tribeName: 'Eco-Warriors Bali',
    role: 'Member',
    content: "Just finished our weekly mangrove restoration. We planted over 200 slashings today! The energy in this tribe is unmatched. 🌱✨",
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&w=800&q=80',
    likes: 156,
    hasLiked: true,
    comments: [],
    time: '20m ago'
  },
  {
    id: 'gp2',
    author: 'Alex Sterling',
    authorAvatar: 'https://picsum.photos/seed/alex/100/100',
    tribeName: 'Parisian Flâneurs',
    role: 'Manager',
    content: "New photo walk scheduled for next Sunday! We'll be exploring the hidden passages of the 2nd Arrondissement. 📸",
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    likes: 89,
    hasLiked: false,
    comments: [],
    time: '1h ago'
  },
  {
    id: 'gp3',
    author: 'Marcus Aurelius',
    authorAvatar: 'https://picsum.photos/seed/mar/100/100',
    tribeName: 'Summit Seekers',
    role: 'Guide',
    content: "Base camp established. The air is thin but the resolve is thick. Preparing for the push at dawn. Respect the mountain. 🏔️",
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    likes: 242,
    hasLiked: false,
    comments: [],
    time: '3h ago'
  }
];

const FlocLogo = ({ className = "size-8" }: { className?: string }) => (
  <div className={`flex items-baseline font-black leading-none text-primary ${className}`}>
    <span className="text-[1.1em] tracking-tighter italic">F</span>
    <div className="size-[0.25em] bg-primary rounded-full ml-[0.05em] mb-[0.1em]"></div>
  </div>
);

const GlobalFeed: React.FC<Props> = ({ onSelectCommunity, onOpenNotifications }) => {
  const [activeTab, setActiveTab] = useState<'pulse' | 'vibes'>('pulse');

  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md px-6 pt-10 pb-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <FlocLogo className="text-3xl" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter italic leading-none">Pulse</h1>
            <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-black mt-0.5">Community Network</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-white text-[20px]">search</span>
          </button>
          <button 
            onClick={onOpenNotifications}
            className="size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 relative transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-white text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-dark animate-notification-pulse"></span>
          </button>
        </div>
      </header>

      <main className="pb-32">
        {/* Tribe Stories */}
        <section className="py-6 px-6 overflow-x-auto hide-scrollbar flex gap-4">
          <div className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
            <div className="size-16 rounded-[1.5rem] p-0.5 border-2 border-dashed border-slate-700 flex items-center justify-center group-hover:border-primary transition-all">
               <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">add</span>
            </div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center w-16">Add Pulse</span>
          </div>
          {['Eco-Warriors', 'Paris Flâneurs', 'Aurora', 'Nomads', 'Culinary'].map((tribe, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer">
              <div className="size-16 rounded-[1.5rem] p-1 bg-gradient-to-tr from-primary to-orange-400">
                <div className="size-full rounded-[1.2rem] border-2 border-background-dark bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/${tribe}/100/100)` }}></div>
              </div>
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center w-16 truncate">{tribe}</span>
            </div>
          ))}
        </section>

        {/* Tab Selection */}
        <div className="px-6 mb-6">
          <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10">
            <button 
              onClick={() => setActiveTab('pulse')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'pulse' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
            >
              Latest
            </button>
            <button 
              onClick={() => setActiveTab('vibes')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'vibes' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
            >
              Top Vibes
            </button>
          </div>
        </div>

        {/* Feed Entry / Composer Placeholder */}
        <div className="px-6 mb-8">
           <div className="bg-surface-dark border border-white/5 rounded-[2rem] p-4 flex items-center gap-4 shadow-xl ring-1 ring-white/5 transition-all hover:bg-white/[0.03] cursor-pointer group">
              <img src="https://picsum.photos/seed/alex/100/100" className="size-10 rounded-full border-2 border-primary/20 group-hover:scale-105 transition-transform" alt="" />
              <span className="text-slate-500 text-xs font-medium">What's the vibe today, Alex?</span>
              <div className="ml-auto flex gap-2">
                 <button className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-sm">image</span>
                 </button>
                 <button className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-sm">videocam</span>
                 </button>
              </div>
           </div>
        </div>

        {/* The Feed */}
        <div className="px-4 space-y-8 mt-2">
          {MOCK_GLOBAL_POSTS.map((post, idx) => (
            <React.Fragment key={post.id}>
              <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-primary/20 group animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={post.authorAvatar} className="size-11 rounded-2xl border-2 border-white/10 group-hover:border-primary/30 transition-all shadow-lg" alt="" />
                        <div className="absolute -bottom-1 -right-1 size-4 bg-primary rounded-lg flex items-center justify-center border border-background-dark">
                           <span className="material-symbols-outlined text-[8px] font-black text-background-dark">check</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-white font-black text-sm">{post.author}</h4>
                          <div className="bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5">
                            <p className="text-primary text-[7px] font-black uppercase tracking-widest">{post.tribeName}</p>
                          </div>
                        </div>
                        <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">{post.time} • Global Pulse</p>
                      </div>
                    </div>
                    <button className="text-slate-600 hover:text-white p-2 transition-colors">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </div>

                  <p className="text-slate-200 text-[13px] leading-relaxed mb-5 font-medium">{post.content}</p>

                  {post.image && (
                    <div className="rounded-[2rem] overflow-hidden mb-5 aspect-[4/3] relative group shadow-2xl">
                      <img src={post.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-[5s]" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-5 left-5">
                        <button className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-white/20 transition-all">
                           <span className="material-symbols-outlined text-xs">location_on</span>
                           {post.tribeName.split(' ')[2] || 'Global'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-6 pt-2">
                    <button className={`flex items-center gap-2 transition-all active:scale-90 group/btn ${post.hasLiked ? 'text-primary' : 'text-slate-500 hover:text-white'}`}>
                      <span 
                        className={`material-symbols-outlined text-2xl transition-all ${post.hasLiked ? 'fill-1' : ''}`}
                      >
                        favorite
                      </span>
                      <span className="text-xs font-black tracking-tight">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-all group/btn">
                      <span className="material-symbols-outlined text-2xl">forum</span>
                      <span className="text-xs font-black tracking-tight">12</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-all ml-auto group/btn">
                      <span className="material-symbols-outlined text-2xl">share</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Insert "Suggested Tribes" section after the first post */}
              {idx === 0 && (
                <section className="py-2 space-y-4">
                   <div className="flex items-center justify-between px-2">
                      <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] italic">Trending Tribes</h4>
                      <span className="text-primary text-[8px] font-black uppercase tracking-widest">See All</span>
                   </div>
                   <div className="flex overflow-x-auto hide-scrollbar gap-4 -mx-4 px-4 pb-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex-none w-48 bg-surface-dark border border-white/5 rounded-3xl p-4 flex flex-col gap-3 shadow-xl">
                           <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined">groups</span>
                           </div>
                           <h5 className="text-white font-black text-xs uppercase tracking-tight leading-none">Nomad {i} Collective</h5>
                           <p className="text-[9px] text-slate-500 leading-tight">Focus on remote work & high-impact ventures.</p>
                           <button className="mt-1 w-full py-2 bg-white/5 text-[8px] font-black text-white uppercase tracking-widest rounded-lg border border-white/5 hover:bg-primary hover:text-background-dark transition-all">Join Pulse</button>
                        </div>
                      ))}
                   </div>
                </section>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Catch up message */}
        <div className="py-20 flex flex-col items-center gap-4 text-center">
           <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined">auto_awesome</span>
           </div>
           <div>
              <p className="text-white font-black text-sm tracking-tight italic">You're all caught up!</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Refreshed just now</p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default GlobalFeed;
