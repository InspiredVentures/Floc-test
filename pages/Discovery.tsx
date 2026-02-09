
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_TRIPS } from '../constants';
import { Trip, Community } from '../types';
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
  },
  {
    id: 'c5',
    title: "Jordanian Pathfinders",
    meta: "Cultural • 1.8k members",
    description: "Exploring the ancient trails of Jordan, from the rose-red city of Petra to the Martian landscapes of Wadi Rum.",
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=800&q=80",
    memberCount: "1.8k",
    category: "Cultural",
    upcomingTrips: [MOCK_TRIPS[4]],
    accessType: 'free'
  },
  {
    id: 'c6',
    title: "Amazonian Guardians",
    meta: "Sustainability • 2.4k members",
    description: "Supporting the biodiversity of the Amazon through scientific exploration and indigenous partnership.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80",
    memberCount: "2.4k",
    category: "Eco-Travel",
    upcomingTrips: [],
    accessType: 'request'
  },
  {
    id: 'c7',
    title: "Atlas Adventurers",
    meta: "Expedition • 1.1k members",
    description: "Hiking through the High Atlas Mountains of Morocco, staying in Berber villages and supporting local education.",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80",
    memberCount: "1.1k",
    category: "Expedition",
    upcomingTrips: [],
    accessType: 'free'
  },
  {
    id: 'c8',
    title: "Costa Rica Connoisseurs",
    meta: "Wellness • 3.2k members",
    description: "Pura Vida experiences blending rainforest wellness retreats with wildlife conservation volunteering.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    memberCount: "3.2k",
    category: "Wellness",
    upcomingTrips: [],
    accessType: 'free'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Groups', icon: 'grid_view' },
  { id: 'eco', label: 'Sustainability', icon: 'eco' },
  { id: 'photo', label: 'Photography', icon: 'photo_camera' },
  { id: 'exp', label: 'Expedition', icon: 'explore' },
  { id: 'social', label: 'Social', icon: 'groups' }
];

const Discovery: React.FC<Props> = ({ onSelectTrip, onSelectCommunity, onOpenNotifications, onSeeAll, onCreateCommunity }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpandingSearch, setIsExpandingSearch] = useState(false);
  const [aiRelatedConcepts, setAiRelatedConcepts] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCommunities = useMemo(() => {
    let result = MOCK_COMMUNITIES;
    if (activeFilter !== 'all') {
      const catMap: Record<string, string> = {
        'eco': 'Eco-Travel',
        'photo': 'Photography',
        'exp': 'Expedition',
        'social': 'Social'
      };
      result = result.filter(c => c.category === catMap[activeFilter]);
    }
    if (searchQuery) {
      result = result.filter(comm => 
        comm.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        comm.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeFilter, searchQuery]);

  const semanticMatches = useMemo(() => {
    if (!searchQuery || aiRelatedConcepts.length === 0) return [];
    return MOCK_COMMUNITIES.filter(comm => {
      const isExactMatch = filteredCommunities.some(e => e.id === comm.id);
      if (isExactMatch) return false;
      return aiRelatedConcepts.some(concept => 
        comm.category.toLowerCase().includes(concept.toLowerCase()) ||
        comm.title.toLowerCase().includes(concept.toLowerCase())
      );
    });
  }, [aiRelatedConcepts, filteredCommunities, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsExpandingSearch(true);
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Search intent analysis for travel communities: "${searchQuery}". Return 3 keywords representing related travel interests. CSV format only.`,
          });
          const concepts = response.text?.split(',').map(s => s.trim().toLowerCase()) || [];
          setAiRelatedConcepts(concepts);
        } catch (e) { console.error(e); } finally { setIsExpandingSearch(false); }
      } else { setAiRelatedConcepts([]); }
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const featuredCommunity = MOCK_COMMUNITIES[0]; // Set to Parisian Flâneurs as featured

  return (
    <div className="flex flex-col min-h-full bg-background-dark pb-32">
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-[60] px-6 transition-all duration-300 ${scrolled ? 'py-4 bg-background-dark/95 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'py-8 bg-transparent'}`}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-all duration-500 ${scrolled ? 'size-8' : 'size-10 rotate-3'}`}>
              <span className="text-white font-black text-xl leading-none">F</span>
            </div>
            {!scrolled && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <h1 className="text-white font-black text-xl tracking-tighter leading-none italic">Discover</h1>
                <span className="text-primary text-[8px] uppercase tracking-[0.2em] font-black">Inspired Ventures</span>
              </div>
            )}
          </div>
          <button onClick={onOpenNotifications} className="size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 relative ios-blur hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-white text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
          </button>
        </div>
      </header>

      {/* Hero Spotlight: Community-First */}
      {!searchQuery && (
        <section className="relative h-[550px] w-full shrink-0 group">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110" style={{ backgroundImage: `url('${featuredCommunity.image}')` }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-background-dark/20 to-background-dark"></div>
          
          <div className="absolute bottom-12 left-6 right-6 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-primary text-sm">stars</span>
              <p className="text-white text-[9px] font-black uppercase tracking-widest">Featured Community</p>
            </div>
            <h2 className="text-white text-5xl font-black tracking-tighter leading-[0.9] italic">
              {featuredCommunity.title.split(' ').slice(0, -1).join(' ')} <br/>
              <span className="text-primary not-italic">{featuredCommunity.title.split(' ').slice(-1)}</span>
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Ventures</p>
                <p className="text-white text-xs font-bold">{featuredCommunity.upcomingTrips.length} Upcoming Trips</p>
              </div>
              <button 
                onClick={() => onSelectCommunity(featuredCommunity)}
                className="bg-white text-background-dark px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
              >
                Explore Group
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Global Search Interface */}
      <section className={`px-6 z-50 sticky top-[80px] transition-all duration-300 ${searchQuery ? 'mt-24' : '-mt-8'}`}>
        <div className="relative group max-w-md mx-auto">
          <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-5 text-slate-500 text-[20px] group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full h-16 pl-14 pr-12 rounded-3xl bg-surface-dark border border-white/10 ios-blur focus:bg-background-dark focus:border-primary outline-none text-sm font-bold text-white placeholder:text-slate-600 transition-all shadow-2xl" 
              placeholder="Find your community or interest..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isExpandingSearch && (
              <div className="absolute right-5">
                <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feed Content */}
      <main className="mt-8">
        {searchQuery ? (
          <section className="px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between">
                <h3 className="text-white font-black text-xl italic tracking-tighter">Communities</h3>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{filteredCommunities.length} Results</span>
             </div>
             <div className="space-y-4">
                {filteredCommunities.map(comm => (
                  <CommunityResultCard key={comm.id} community={comm} onClick={() => onSelectCommunity(comm)} />
                ))}
                
                {aiRelatedConcepts.length > 0 && (
                  <div className="mt-12 space-y-4">
                    <div className="flex items-center gap-2 px-2">
                       <span className="material-symbols-outlined text-primary text-base">auto_awesome</span>
                       <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Related Interests</h4>
                    </div>
                    {semanticMatches.map(comm => (
                       <CommunityResultCard key={comm.id} community={comm} onClick={() => onSelectCommunity(comm)} related />
                    ))}
                  </div>
                )}
             </div>
          </section>
        ) : (
          <div className="space-y-12">
            
            {/* RECOMMENDED FOR YOU */}
            <section className="space-y-6">
              <div className="px-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-white text-2xl font-black tracking-tighter italic leading-none">Recommended <span className="text-primary not-italic">for You</span></h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Groups curated from the Inspired profile</p>
                </div>
                <button onClick={onSeeAll} className="bg-white/5 border border-white/10 text-white p-2 rounded-xl">
                  <span className="material-symbols-outlined text-sm">tune</span>
                </button>
              </div>
              
              <div className="flex overflow-x-auto hide-scrollbar gap-5 px-6 pb-4">
                {MOCK_COMMUNITIES.slice(0, 5).map(comm => (
                  <div 
                    key={comm.id}
                    onClick={() => onSelectCommunity(comm)}
                    className="flex-none w-[320px] group cursor-pointer relative"
                  >
                    <div className="bg-surface-dark border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all group-hover:border-primary/40 duration-500">
                      <div className="relative h-44">
                        <img src={comm.image} className="size-full object-cover transition-transform group-hover:scale-105 duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent"></div>
                        <div className="absolute top-4 left-4">
                           <div className="bg-emerald-500/90 backdrop-blur-md text-background-dark text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-xs">trending_up</span>
                              Trending
                           </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-primary text-[9px] font-black uppercase tracking-widest">{comm.category}</span>
                           <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{comm.memberCount} Members</span>
                        </div>
                        <h4 className="text-white text-xl font-black italic tracking-tight truncate mb-3">{comm.title}</h4>
                        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-medium">{comm.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* EXPLORE ALL COMMUNITIES */}
            <section className="space-y-6">
              <div className="px-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-white text-2xl font-black tracking-tighter italic leading-none">Global <span className="text-primary not-italic">Collectives</span></h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Explore Inspired Ventures Communities</p>
                </div>
                <button onClick={onSeeAll} className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">View All</button>
              </div>
              <div className="flex overflow-x-auto hide-scrollbar gap-5 px-6 pb-4">
                {MOCK_COMMUNITIES.map(comm => (
                  <div 
                    key={comm.id}
                    onClick={() => onSelectCommunity(comm)}
                    className="flex-none w-64 group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-4 shadow-2xl border border-white/5 group-hover:border-primary/40 transition-all duration-500">
                      <img src={comm.image} className="size-full object-cover transition-transform group-hover:scale-110 duration-[2s]" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                         <div className="flex items-center gap-1.5 mb-2">
                           <span className="text-white text-[9px] font-black uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">Join Group</span>
                         </div>
                         <h4 className="text-white text-lg font-black italic tracking-tight truncate leading-none">{comm.title}</h4>
                      </div>
                    </div>
                    <div className="px-2 flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{comm.category}</span>
                       <span className="text-primary text-[10px] font-black">{comm.memberCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Launch Community CTA */}
            <section className="px-6 pt-4 pb-12">
               <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-12">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveFilter(cat.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeFilter === cat.id ? 'bg-primary border-primary text-background-dark shadow-xl shadow-primary/20' : 'bg-surface-dark border-white/10 text-slate-500 hover:text-white'}`}
                    >
                      <span className="material-symbols-outlined text-base">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
               </div>

               <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/20 rounded-[4rem] p-12 flex flex-col items-center text-center group hover:border-primary/40 transition-all duration-700">
                  <div className="size-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center text-primary mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all shadow-inner border border-primary/20">
                      <span className="material-symbols-outlined text-4xl font-black">add_circle</span>
                  </div>
                  <h4 className="text-white text-3xl font-black italic tracking-tighter">Lead the Pack</h4>
                  <p className="text-slate-400 text-sm font-medium max-w-[260px] leading-relaxed mt-4">
                    Architect a community around your passion and co-create unique global ventures.
                  </p>
                  <button 
                    onClick={onCreateCommunity}
                    className="mt-8 px-10 py-5 bg-primary text-background-dark text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all hover:bg-white"
                  >
                    Launch Community
                  </button>
               </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

const CommunityResultCard: React.FC<{ community: Community, onClick: () => void, related?: boolean }> = ({ community, onClick, related }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-5 p-5 rounded-[2.5rem] border transition-all cursor-pointer shadow-xl group relative overflow-hidden active:scale-[0.98] ${related ? 'bg-primary/5 border-primary/20' : 'bg-surface-dark border-white/10 hover:border-primary/40'}`}
  >
    <div className="size-24 rounded-[2rem] bg-cover bg-center shrink-0 shadow-2xl transition-all group-hover:scale-105" style={{ backgroundImage: `url(${community.image})` }}></div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${related ? 'text-primary' : 'text-primary/60'}`}>{community.category}</span>
        {related && (
          <div className="bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1">
             <span className="material-symbols-outlined text-[10px] text-primary">auto_awesome</span>
             <span className="text-[7px] font-black text-primary uppercase">Interest Match</span>
          </div>
        )}
      </div>
      <h4 className="text-white font-black text-xl italic tracking-tight leading-none mb-2 truncate">{community.title}</h4>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{community.memberCount} Members • {community.accessType === 'request' ? 'Vetted' : 'Open'}</p>
    </div>
    <span className="material-symbols-outlined text-slate-700 text-2xl font-black group-hover:text-primary transition-all group-hover:translate-x-1">arrow_forward_ios</span>
  </div>
);

export default Discovery;
