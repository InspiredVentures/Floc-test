
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trip, Community } from '../types';
import { FlocLogo } from '../components/FlocLogo';
import { useUser } from '../contexts/UserContext';
import BackToTop from '../components/BackToTop';
import { Skeleton } from '../components/Skeleton';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid_view' },
  { id: 'my-tribes', label: 'My Groups', icon: 'groups' },
  { id: 'Planning', label: 'Planning', icon: 'campaign' },
  { id: 'Confirmed', label: 'Confirmed', icon: 'check_circle' },
  { id: 'Global', label: 'Global', icon: 'public' },
  { id: 'Wellness', label: 'Wellness', icon: 'spa' },
  { id: 'Cultural', label: 'Cultural', icon: 'museum' }
];

const Discovery: React.FC = () => {
  const navigate = useNavigate();
  const { isMember, joinCommunity, leaveCommunity, communities } = useUser();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [impactTicker, setImpactTicker] = useState(42812);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const ticker = setInterval(() => setImpactTicker(prev => prev + Math.floor(Math.random() * 5)), 3000);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(ticker);
      clearTimeout(timer);
    };
  }, []);

  const filteredCommunities = useMemo(() => {
    let result = communities;
    if (activeFilter === 'my-tribes') {
      result = result.filter(c => isMember(c.id));
    } else if (activeFilter !== 'all') {
      result = result.filter(c => c.category === activeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(comm =>
        comm.title.toLowerCase().includes(q) ||
        comm.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeFilter, searchQuery, communities, isMember]);

  return (
    <div className="flex flex-col min-h-full bg-background text-[#14532D] pb-32">
      <div className="bg-primary/5 border-b border-primary/5 py-2 px-6 flex items-center justify-center gap-4 overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[10px] text-accent">public</span>
          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-primary/40">Community Impact:</span>
          <span className="text-[7px] font-black uppercase text-accent italic">{impactTicker.toLocaleString()}KG CO2 OFFSET</span>
          <span className="size-1 bg-primary/20 rounded-full"></span>
          <span className="text-[7px] font-black uppercase text-accent">82 VENTURES LIVE</span>
        </div>
      </div>

      <header className={`sticky top-0 z-[40] px-6 transition-all duration-300 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-primary/5 shadow-2xl' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlocLogo />
            <div className="flex flex-col pt-1">
              <h1 className="text-primary font-black text-xl tracking-tighter leading-none italic uppercase">Discovery</h1>
              <span className="text-accent text-[8px] uppercase tracking-[0.2em] font-black leading-none">by Inspired</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-64 lg:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-accent text-lg">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search niche or community..."
                className="w-full h-10 bg-primary/5 border border-primary/10 rounded-xl pl-10 pr-4 text-xs text-primary placeholder:text-primary/30 focus:border-accent outline-none transition-all"
              />
            </div>
            <button onClick={() => navigate('/notifications')} className="size-10 flex items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 relative transition-all active:scale-95 hover:bg-primary/10">
              <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 size-2 bg-accent rounded-full animate-pulse"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="mt-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 py-4 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border shrink-0 ${activeFilter === cat.id ? 'bg-primary border-primary text-white shadow-lg' : 'bg-primary/5 border-primary/10 text-primary/40 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-base">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 h-64">
                  <Skeleton className="h-full w-full !rounded-[2rem]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community, idx) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/community/${community.id}`)}
                >
                  <div className="bg-white border border-primary/10 rounded-[2.5rem] overflow-hidden shadow-xl transition-all group-hover:border-accent/30 group-hover:scale-[1.02]">
                    <div className="aspect-[4/3] bg-cover bg-center relative" style={{ backgroundImage: `url(${community.image})` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-accent text-white text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full">{community.category}</div>
                          <div className="bg-white text-primary text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full">{community.memberCount} Members</div>
                        </div>
                        <h3 className="text-white text-xl font-heading font-black italic tracking-tighter leading-none uppercase">{community.title}</h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredCommunities.length === 0 && (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-4xl text-primary/20 mb-4 opacity-50">search_off</span>
              <p className="text-primary/40 text-sm font-bold uppercase tracking-widest italic text-center">No communities found for your selection.</p>
            </div>
          )}
        </div>
      </main>
      <BackToTop />
    </div>
  );
};

export default Discovery;
