
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_TRIPS } from '../constants';
import { Trip, Community } from '../types';
import { DISCOVERY_CATEGORIES as CATEGORIES } from '../constants/community';
import { GoogleGenAI } from "@google/genai";

interface Props {
  onSelectTrip: (trip: Trip) => void;
  onSelectCommunity: (community: Community) => void;
  onOpenNotifications: () => void;
  onSeeAll: () => void;
  onCreateCommunity?: () => void;
}

const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'c1',
    title: "Parisian Flâneurs",
    meta: "Photography • 1.2k members",
    description: "Exploring the hidden architecture and street life of Paris. We focus on ethical travel and supporting local artisans.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    memberCount: "1.2k",
    category: "Photography",
    upcomingTrips: [MOCK_TRIPS[1]],
    accessType: 'free'
  },
  {
    id: 'c3',
    title: "Summit Seekers",
    meta: "Adventure • 4.5k members",
    description: "Conquering the world's highest peaks with a focus on local mountain community support and ethical guiding.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    memberCount: "4.5k",
    category: "Adventure",
    upcomingTrips: [MOCK_TRIPS[2]],
    accessType: 'request'
  },
  {
    id: 'c4',
    title: "Eco-Warriors Bali",
    meta: "Sustainability • 3.5k members",
    description: "Preserving Bali's natural beauty through direct community action and conscious travel experiences.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    memberCount: "3.5k",
    category: "Eco-Travel",
    upcomingTrips: [],
    accessType: 'free'
  }
];

const FlocLogo = ({ className = "size-8" }: { className?: string }) => (
  <div className={`flex items-baseline font-black leading-none text-primary ${className}`}>
    <span className="text-[1.1em] tracking-tighter italic">F</span>
    <div className="size-[0.25em] bg-primary rounded-full ml-[0.05em] mb-[0.1em]"></div>
  </div>
);

const Discovery: React.FC<Props> = ({ onSelectTrip, onSelectCommunity, onOpenNotifications, onSeeAll, onCreateCommunity }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpandingSearch, setIsExpandingSearch] = useState(false);
  const [aiRelatedConcepts, setAiRelatedConcepts] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [impactTicker, setImpactTicker] = useState(42812);
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [architectResult, setArchitectResult] = useState<{name: string, desc: string} | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const ticker = setInterval(() => setImpactTicker(prev => prev + Math.floor(Math.random() * 5)), 3000);
    return () => { window.removeEventListener('scroll', handleScroll); clearInterval(ticker); };
  }, []);

  const filteredCommunities = useMemo(() => {
    let result = MOCK_COMMUNITIES;
    if (activeFilter !== 'all') result = result.filter(c => c.category === activeFilter);
    if (searchQuery) {
      result = result.filter(comm => 
        comm.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        comm.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeFilter, searchQuery]);

  const handleTribeArchitect = async () => {
    if (!searchQuery) return;
    setIsArchitecting(true);
    setArchitectResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Architect a conceptual travel community based on this search query: "${searchQuery}". 
        Return a JSON object with "name" (a catchy tribe name) and "desc" (a 150-char description of its core mission). 
        Make it sound exclusive and adventurous.`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      setArchitectResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsArchitecting(false);
    }
  };

  const showResults = searchQuery !== '' || activeFilter !== 'all';

  return (
    <div className="flex flex-col min-h-full bg-background-dark pb-32">
      {/* Global Impact Ticker */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 px-6 flex items-center justify-center gap-4 overflow-hidden whitespace-nowrap">
         <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
            <span className="material-symbols-outlined text-[10px] text-primary">public</span>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/60">Global Protocol Pulse:</span>
            <span className="text-[7px] font-black uppercase text-primary italic">{impactTicker.toLocaleString()}KG CO2 OFFSET</span>
            <span className="size-1 bg-white/20 rounded-full"></span>
            <span className="text-[7px] font-black uppercase text-emerald-400">82 VENTURES LIVE</span>
         </div>
      </div>

      <header className={`fixed top-0 left-0 right-0 z-[60] px-6 transition-all duration-500 ${scrolled ? 'py-4 bg-background-dark/95 backdrop-blur-xl border-b border-white/5 shadow-2xl mt-0' : 'py-8 bg-transparent mt-8'}`}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlocLogo className={`transition-all duration-500 transform ${scrolled ? 'text-2xl' : 'text-5xl'}`} />
            {!scrolled && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-500 ml-2 pt-1">
                <h1 className="text-white font-black text-xl tracking-tighter leading-none italic">Discovery</h1>
                <span className="text-primary text-[8px] uppercase tracking-[0.2em] font-black leading-none">Inspired Ventures</span>
              </div>
            )}
          </div>
          <button onClick={onOpenNotifications} className="size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 relative ios-blur hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-white text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
          </button>
        </div>
      </header>

      <section className={`px-6 z-50 sticky top-[95px] transition-all duration-300 ${showResults ? 'mt-28' : 'mt-40'}`}>
        <div className="max-w-md mx-auto space-y-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-[20px] group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full h-16 pl-14 pr-12 rounded-3xl bg-surface-dark border border-white/10 ios-blur focus:bg-background-dark focus:border-primary outline-none text-sm font-bold text-white placeholder:text-slate-600 transition-all shadow-2xl" 
              placeholder="Search niche or tribe..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-2 py-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border shrink-0 ${activeFilter === cat.id ? 'bg-primary border-primary text-background-dark shadow-lg shadow-primary/20 scale-105' : 'bg-surface-dark border-white/10 text-slate-500 hover:text-white hover:border-white/20'}`}
              >
                <span className="material-symbols-outlined text-base">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mt-8 px-6">
        <div className="max-w-md mx-auto space-y-8">
          {filteredCommunities.length > 0 ? (
            filteredCommunities.map(comm => (
              <CommunityResultCard key={comm.id} community={comm} onClick={() => onSelectCommunity(comm)} />
            ))
          ) : (
            <div className="py-12 space-y-8 animate-in fade-in zoom-in-95 duration-500">
               <div className="text-center">
                  <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                     <span className="material-symbols-outlined text-4xl text-slate-700">search_off</span>
                  </div>
                  <h4 className="text-white font-black text-xl italic tracking-tight">Tribe not found</h4>
                  <p className="text-slate-500 text-xs mt-2 font-medium">No results for "{searchQuery}"</p>
               </div>

               {searchQuery && (
                 <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/20 rounded-[3rem] p-8 text-center group">
                    <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:rotate-12 transition-transform">
                       <span className="material-symbols-outlined text-3xl font-black">architecture</span>
                    </div>
                    
                    {architectResult ? (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                         <h3 className="text-white font-black text-2xl italic tracking-tighter mb-2">{architectResult.name}</h3>
                         <p className="text-slate-400 text-xs leading-relaxed mb-6 italic">"{architectResult.desc}"</p>
                         <button onClick={onCreateCommunity} className="bg-primary text-background-dark px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Launch this Tribe</button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-white font-black text-lg italic tracking-tight mb-2">Architect with AI</h3>
                        <p className="text-slate-500 text-xs leading-relaxed mb-6">Build the blueprint for a new tribe based on your search query.</p>
                        <button 
                          onClick={handleTribeArchitect}
                          disabled={isArchitecting}
                          className="bg-white/5 border border-white/10 text-primary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 mx-auto hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                           {isArchitecting ? (
                             <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                           ) : (
                             <span className="material-symbols-outlined text-sm font-black">auto_awesome</span>
                           )}
                           {isArchitecting ? 'Architecting...' : 'Dream up this Tribe'}
                        </button>
                      </>
                    )}
                 </div>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const CommunityResultCard: React.FC<{ community: Community, onClick: () => void }> = ({ community, onClick }) => (
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

export default Discovery;
