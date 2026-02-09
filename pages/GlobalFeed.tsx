
import React, { useState, useMemo } from 'react';
import { TribePost, Community } from '../types';
import { GoogleGenAI } from "@google/genai";

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
    comments: [{ id: 'c1', user: 'Mike', avatar: 'https://picsum.photos/seed/mike/100/100', text: "Amazing!", time: "5m ago" }],
    time: '20m ago',
    timestamp: Date.now() - 1200000
  },
  {
    id: 'gp2',
    author: 'Alex Sterling',
    authorAvatar: 'https://picsum.photos/seed/alex/100/100',
    tribeName: 'Parisian Flâneurs',
    role: 'Manager',
    content: "New photo walk scheduled for next Sunday! We'll be exploring the hidden passages of the 2nd Arrondissement. 📸",
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    likes: 42,
    hasLiked: false,
    comments: [],
    time: '1h ago',
    timestamp: Date.now() - 3600000
  },
  {
    id: 'gp4',
    author: 'Sarah Jenkins',
    authorAvatar: 'https://picsum.photos/seed/sarah/100/100',
    tribeName: 'Amazonian Guardians',
    role: 'Member',
    content: "Watching the sun dip below the canopy. This is why we protect these lungs of the earth. 🌳🌅",
    video: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-521-large.mp4',
    likes: 1204,
    hasLiked: false,
    comments: [
      { id: 'c2', user: 'Lara', avatar: 'https://picsum.photos/seed/lara/100/100', text: "Incredible video!", time: "10m ago" },
      { id: 'c3', user: 'Kai', avatar: 'https://picsum.photos/seed/kai/100/100', text: "Magical.", time: "2m ago" }
    ],
    time: '4h ago',
    timestamp: Date.now() - 14400000
  },
  {
    id: 'gp5',
    author: 'Leo Valdez',
    authorAvatar: 'https://picsum.photos/seed/leo/100/100',
    tribeName: 'Nomad Coders',
    role: 'Guide',
    content: "Setup for the week. High speed fiber in the middle of the jungle. Future is here. 💻🏝️",
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80',
    likes: 88,
    hasLiked: false,
    comments: [],
    time: '2h ago',
    timestamp: Date.now() - 7200000
  },
  {
    id: 'gp6',
    author: 'Zara Chen',
    authorAvatar: 'https://picsum.photos/seed/zara/100/100',
    tribeName: 'Culinary Seekers',
    role: 'Member',
    content: "Local market finds in Oaxaca. These colors are a feast for the soul before they even hit the pan. 🌮🌶️",
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    likes: 312,
    hasLiked: true,
    comments: [{ id: 'c4', user: 'Marco', avatar: 'https://picsum.photos/seed/mar/100/100', text: "Delicious!", time: "1h ago" }],
    time: '3h ago',
    timestamp: Date.now() - 10800000
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
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [posts, setPosts] = useState<TribePost[]>(MOCK_GLOBAL_POSTS);

  // Composer State
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isPolishing, setIsPolishing] = useState(false);

  // Sorting Algorithm
  const sortedPosts = useMemo(() => {
    const list = [...posts];
    if (activeTab === 'pulse') {
      return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } else {
      // "Vibe Score" calculation
      return list.sort((a, b) => {
        const scoreA = a.likes + (a.comments.length * 5) + (a.image || a.video ? 50 : 0);
        const scoreB = b.likes + (b.comments.length * 5) + (b.image || b.video ? 50 : 0);
        return scoreB - scoreA;
      });
    }
  }, [posts, activeTab]);

  const handleAiPolish = async () => {
    if (!caption.trim()) return;
    setIsPolishing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rewrite this travel update to be more "Inspired" (mission-driven, adventurous, and community-focused). Original: "${caption}". Keep it under 200 characters. No hashtags.`,
      });
      if (response.text) setCaption(response.text.trim());
    } catch (e) {
      console.error(e);
    } finally {
      setIsPolishing(false);
    }
  };

  const handlePost = () => {
    const newPost: TribePost = {
      id: `gp-${Date.now()}`,
      author: 'Alex Sterling',
      authorAvatar: 'https://picsum.photos/seed/alex/100/100',
      tribeName: 'Global Explorer',
      role: 'Member',
      content: caption,
      image: mediaType === 'image' ? mediaUrl : undefined,
      video: mediaType === 'video' ? mediaUrl : undefined,
      likes: 0,
      hasLiked: false,
      comments: [],
      time: 'Just now',
      timestamp: Date.now()
    };
    setPosts([newPost, ...posts]);
    setIsComposerOpen(false);
    setCaption('');
    setMediaUrl('');
    setMediaType(null);
    setActiveTab('pulse');
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.hasLiked ? p.likes - 1 : p.likes + 1, hasLiked: !p.hasLiked };
      }
      return p;
    }));
  };

  const getPostCommunity = (post: TribePost): Community => ({
    id: post.tribeName?.replace(/\s+/g, '-').toLowerCase() || 'tribe',
    title: post.tribeName || 'Tribe',
    meta: "Community • Global Pulse",
    description: `The collective home for ${post.tribeName}. Focused on meaningful global ventures.`,
    image: post.image || post.authorAvatar,
    memberCount: "1.2k",
    category: "Exploration",
    upcomingTrips: [],
    accessType: 'free'
  });

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
          <div 
            onClick={() => setIsComposerOpen(true)}
            className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
          >
            <div className="size-16 rounded-[1.5rem] p-0.5 border-2 border-dashed border-slate-700 flex items-center justify-center group-hover:border-primary transition-all">
               <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">add</span>
            </div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center w-16">Add Pulse</span>
          </div>
          {['Eco-Warriors', 'Paris Flâneurs', 'Aurora', 'Nomads', 'Culinary'].map((tribe, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group" onClick={() => onSelectCommunity({ id: tribe.toLowerCase(), title: tribe, meta: "Community", description: "", image: "", memberCount: "800", category: "Trending", upcomingTrips: [], accessType: 'free' })}>
              <div className="size-16 rounded-[1.5rem] p-1 bg-gradient-to-tr from-primary to-orange-400 group-hover:scale-105 transition-transform">
                <div className="size-full rounded-[1.2rem] border-2 border-background-dark bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/${tribe}/100/100)` }}></div>
              </div>
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center w-16 truncate group-hover:text-primary transition-colors">{tribe}</span>
            </div>
          ))}
        </section>

        {/* Tab Selection */}
        <div className="px-6 mb-8">
          <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10">
            <button 
              onClick={() => setActiveTab('pulse')}
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'pulse' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
            >
              <span className={`material-symbols-outlined text-sm ${activeTab === 'pulse' ? 'animate-pulse' : ''}`}>bolt</span>
              Latest Pulse
            </button>
            <button 
              onClick={() => setActiveTab('vibes')}
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'vibes' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Top Vibes
            </button>
          </div>
        </div>

        {/* Feed Content */}
        <div className="px-4 space-y-10">
          {sortedPosts.map((post, idx) => {
            const isHero = activeTab === 'vibes' && idx === 0;
            return (
              <div 
                key={`${post.id}-${activeTab}`}
                className={`group animate-in fade-in slide-in-from-bottom-4 duration-700 ${isHero ? 'bg-primary/5 border-2 border-primary/20 p-1 rounded-[3rem]' : ''}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`bg-surface-dark/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all group-hover:border-primary/20 ${isHero ? 'border-primary/30' : ''}`}>
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
                            <button onClick={() => onSelectCommunity(getPostCommunity(post))} className="bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5">
                              <p className="text-primary text-[7px] font-black uppercase tracking-widest">{post.tribeName}</p>
                            </button>
                          </div>
                          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                            {activeTab === 'pulse' ? <span className="inline-block size-1.5 bg-primary rounded-full mr-1 animate-pulse"></span> : null}
                            {post.time} • {activeTab === 'pulse' ? 'Recent' : 'Trending'}
                          </p>
                        </div>
                      </div>
                      
                      {activeTab === 'vibes' && post.likes > 200 && (
                        <div className="bg-primary text-background-dark px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-primary/20">
                          <span className="material-symbols-outlined text-[10px] font-black">local_fire_department</span>
                          <span className="text-[7px] font-black uppercase tracking-widest">High Vibe</span>
                        </div>
                      )}
                    </div>

                    <p className={`text-slate-200 leading-relaxed mb-5 font-medium ${isHero ? 'text-lg italic tracking-tight text-white' : 'text-[13px]'}`}>
                      {post.content}
                    </p>

                    {(post.image || post.video) && (
                      <div className={`rounded-[2rem] overflow-hidden mb-5 relative group shadow-2xl bg-black ${isHero ? 'aspect-video' : 'aspect-[4/3]'}`}>
                        {post.video ? (
                          <video src={post.video} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                        ) : (
                          <img src={post.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-[5s]" alt="" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-5 left-5">
                          <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
                             <span className="material-symbols-outlined text-xs">{post.video ? 'videocam' : 'location_on'}</span>
                             {post.video ? 'Inspired Motion' : (post.tribeName?.split(' ')[0] || 'Venture')}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-6 pt-2">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-all active:scale-90 ${post.hasLiked ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                      >
                        <span className={`material-symbols-outlined text-2xl ${post.hasLiked ? 'fill-1 font-black' : ''}`}>favorite</span>
                        <span className="text-xs font-black tracking-tight">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-all">
                        <span className="material-symbols-outlined text-2xl">forum</span>
                        <span className="text-xs font-black tracking-tight">{post.comments.length}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-all ml-auto">
                        <span className="material-symbols-outlined text-2xl">share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Catch up message */}
        <div className="py-24 flex flex-col items-center gap-6 text-center opacity-50">
           <div className="size-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
           </div>
           <div>
              <p className="text-white font-black text-sm tracking-tight italic">That's the current Pulse.</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Refreshed for you just now</p>
           </div>
           <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-primary text-[10px] font-black uppercase tracking-widest underline underline-offset-4">Back to top</button>
        </div>
      </main>

      {/* Media Composer Modal (Pulse Studio) */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-3xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
           <header className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/5">
              <button onClick={() => setIsComposerOpen(false)} className="text-slate-500 hover:text-white">
                 <span className="material-symbols-outlined text-2xl">close</span>
              </button>
              <h2 className="text-white font-black text-lg italic tracking-tight">Pulse Studio</h2>
              <button 
                onClick={handlePost}
                disabled={!caption.trim() && !mediaUrl}
                className="bg-primary text-background-dark px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 disabled:opacity-30 transition-all active:scale-95"
              >
                 Post Now
              </button>
           </header>

           <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <div className="flex items-center gap-4">
                 <img src="https://picsum.photos/seed/alex/100/100" className="size-14 rounded-2xl border-2 border-primary/20" alt="" />
                 <div>
                    <h3 className="text-white font-black text-base">Alex Sterling</h3>
                    <p className="text-primary text-[9px] font-black uppercase tracking-widest">Global Explorer</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="relative">
                    <textarea 
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="What's the vibe today?"
                      className="w-full bg-transparent border-none text-white text-2xl font-black placeholder:text-slate-800 focus:ring-0 min-h-[140px] resize-none leading-tight"
                    />
                    <button 
                      onClick={handleAiPolish}
                      disabled={isPolishing || !caption.trim()}
                      className={`absolute bottom-0 right-0 p-3 rounded-2xl border transition-all flex items-center gap-2 ${isPolishing ? 'bg-primary border-primary animate-pulse' : 'bg-white/5 border-white/10 text-primary hover:bg-white/10'}`}
                    >
                       <span className={`material-symbols-outlined text-lg ${isPolishing ? 'text-background-dark' : ''}`}>auto_awesome</span>
                       <span className={`text-[9px] font-black uppercase tracking-widest ${isPolishing ? 'text-background-dark' : ''}`}>
                          {isPolishing ? 'Polishing...' : 'Inspired Polish'}
                       </span>
                    </button>
                 </div>

                 {!mediaUrl ? (
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => { setMediaType('image'); setMediaUrl('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'); }}
                        className="aspect-[4/3] bg-white/5 border border-white/10 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all group"
                      >
                         <span className="material-symbols-outlined text-slate-600 text-4xl group-hover:text-primary transition-colors">image</span>
                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">Add Photo</span>
                      </button>
                      <button 
                        onClick={() => { setMediaType('video'); setMediaUrl('https://assets.mixkit.co/videos/preview/mixkit-glacier-river-in-a-mountain-valley-41315-large.mp4'); }}
                        className="aspect-[4/3] bg-white/5 border border-white/10 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all group"
                      >
                         <span className="material-symbols-outlined text-slate-600 text-4xl group-hover:text-primary transition-colors">videocam</span>
                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">Add Video</span>
                      </button>
                   </div>
                 ) : (
                   <div className="relative rounded-[3rem] overflow-hidden border-2 border-primary/30 shadow-2xl aspect-video bg-black group">
                      {mediaType === 'video' ? (
                        <video src={mediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                      ) : (
                        <img src={mediaUrl} className="w-full h-full object-cover" alt="Selected" />
                      )}
                      <button 
                        onClick={() => { setMediaUrl(''); setMediaType(null); }}
                        className="absolute top-4 right-4 size-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                      >
                         <span className="material-symbols-outlined text-xl">close</span>
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GlobalFeed;
