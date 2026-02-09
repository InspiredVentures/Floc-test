
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
    author: 'Mike Ross',
    authorAvatar: 'https://picsum.photos/seed/mike/100/100',
    tribeName: 'Aurora Chasers',
    role: 'Member',
    content: "The lights were incredible last night in Tromsø. Worth every freezing minute! 🌌",
    image: 'https://images.unsplash.com/photo-1531366930499-41f6693d1599?auto=format&fit=crop&w=800&q=80',
    likes: 234,
    hasLiked: true,
    comments: [],
    time: '3h ago'
  }
];

const GlobalFeed: React.FC<Props> = ({ onSelectCommunity, onOpenNotifications }) => {
  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md px-6 pt-10 pb-4 flex items-center justify-between border-b border-white/5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter italic">Pulse</h1>
          <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-black">Community Activity</p>
        </div>
        <button 
          onClick={onOpenNotifications}
          className="size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 relative"
        >
          <span className="material-symbols-outlined text-white text-[20px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
        </button>
      </header>

      <main className="pb-32">
        {/* Tribe Stories */}
        <section className="py-6 px-6 overflow-x-auto hide-scrollbar flex gap-4">
          {['Eco-Warriors', 'Paris Flâneurs', 'Aurora', 'Nomads', 'Culinary'].map((tribe, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className="size-16 rounded-full p-1 bg-gradient-to-tr from-primary to-orange-400">
                <div className="size-full rounded-full border-2 border-background-dark bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/${tribe}/100/100)` }}></div>
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center w-16 truncate">{tribe}</span>
            </div>
          ))}
        </section>

        {/* The Feed */}
        <div className="px-4 space-y-6 mt-2">
          {MOCK_GLOBAL_POSTS.map(post => (
            <div key={post.id} className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={post.authorAvatar} className="size-10 rounded-full border-2 border-primary/20" alt="" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-white font-black text-sm">{post.author}</h4>
                        <span className="text-primary text-[8px] font-black px-1.5 py-0.5 rounded bg-primary/10 tracking-widest uppercase">
                          {post.tribeName}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{post.time}</p>
                    </div>
                  </div>
                </div>

                <p className="text-white text-sm leading-relaxed mb-4">{post.content}</p>

                {post.image && (
                  <div className="rounded-3xl overflow-hidden mb-4 aspect-video relative group">
                    <img src={post.image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                )}

                <div className="flex items-center gap-6">
                  <button className={`flex items-center gap-2 transition-all ${post.hasLiked ? 'text-primary' : 'text-slate-500 hover:text-white'}`}>
                    <span className={`material-symbols-outlined text-xl ${post.hasLiked ? 'fill-1' : ''}`}>favorite</span>
                    <span className="text-xs font-black">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl">forum</span>
                    <span className="text-xs font-black">12</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-all ml-auto">
                    <span className="material-symbols-outlined text-xl">share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GlobalFeed;
