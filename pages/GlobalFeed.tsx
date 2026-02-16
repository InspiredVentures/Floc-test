
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Feed } from '../components/Feed';
import { MOCK_GLOBAL_POSTS } from '../data/global_posts';

const GlobalFeed: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pulse' | 'vibes' | 'following'>('pulse');
  const [searchQuery, setSearchQuery] = useState('');

  // Search/Filter logic for the Feed component could be lifted up here if needed,
  // but for simplicity we'll just pass the initial list.
  // In a real app, Feed would fetch its own data or accept a filtered list.

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return MOCK_GLOBAL_POSTS;
    const q = searchQuery.toLowerCase();
    return MOCK_GLOBAL_POSTS.filter(p =>
      p.content.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.communityName?.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col min-h-full bg-[#FCFBF5] text-[#14532D] font-body selection:bg-accent selection:text-white">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 pt-10 pb-4 border-b border-primary/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined text-2xl font-black">eco</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-heading font-black text-primary tracking-tighter italic leading-none uppercase">Community Pulse</h1>
              <p className="text-accent text-[8px] uppercase tracking-[0.2em] font-black mt-0.5">EVA by Inspired</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block w-64 lg:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-accent text-lg">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the Pulse..."
                className="w-full h-10 bg-primary/5 border border-primary/10 rounded-xl pl-10 pr-4 text-xs text-primary placeholder:text-primary/30 focus:border-accent outline-none transition-all"
              />
            </div>
            <button onClick={() => navigate('/notifications')} className="size-10 flex items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 relative transition-all active:scale-95 hover:bg-primary/10">
              <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 size-2 bg-accent rounded-full animate-pulse"></span>
            </button>
          </div>
        </div>

        <div className="flex bg-primary/5 p-1 rounded-2xl ring-1 ring-primary/10 max-w-sm">
          <button onClick={() => setActiveTab('pulse')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'pulse' ? 'bg-primary text-white shadow-xl' : 'text-primary/40'}`}>
            Global Feed
          </button>
          <button onClick={() => setActiveTab('following')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'following' ? 'bg-primary text-white shadow-xl' : 'text-primary/40'}`}>
            My Communities
          </button>
        </div>
      </header>

      <main className="p-6 pb-32 max-w-2xl mx-auto w-full">
        {/* Feed Component */}
        <Feed context="global" initialPosts={filteredPosts} />
      </main>
    </div>
  );
};

export default GlobalFeed;
