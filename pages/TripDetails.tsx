
import React, { useState, useEffect, useMemo } from 'react';
import { Trip, TribePost, TribeComment } from '../types';

interface Props {
  trip: Trip;
  onBack: () => void;
  onBook: () => void;
  onOpenChat?: () => void;
}

interface ItineraryDay {
  day: number;
  title: string;
  content: string;
  tags: string[];
  completed: boolean;
}

interface SuggestionComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

interface ActivitySuggestion {
  id: string;
  title: string;
  description: string;
  suggestedBy: string;
  avatar: string;
  votes: number;
  myVote: 'up' | 'down' | null;
  comments: SuggestionComment[];
  tags: string[];
}

const DEFAULT_ITINERARY: ItineraryDay[] = [
  { 
    day: 1, 
    title: "Arrival & Welcome", 
    content: `Arrive at the destination. Private transfer to our locally managed resort. Evening welcome circle and traditional dinner.`,
    tags: ["Dinner Included", "Transfer"],
    completed: true 
  },
  { 
    day: 2, 
    title: "Local Heritage Trek", 
    content: "A moderate 4-hour trek through historic sites and nature trails. Experience authentic local life and have lunch with a village family.",
    tags: ["Lunch Included", "Active"],
    completed: false 
  },
  { 
    day: 3, 
    title: "Community Workshop", 
    content: "Spend the day at a local center. Learn about heritage and help with local community projects.",
    tags: ["Volunteering", "Culture"],
    completed: false 
  },
  { 
    day: 4, 
    title: "Nature Photography", 
    content: "Journey to hidden natural wonders. Visit three of the area's most beautiful spots and stay in a community-run lodge.",
    tags: ["Nature", "Photography"],
    completed: false 
  },
];

const MOCK_POSTS: TribePost[] = [
  {
    id: 'p1',
    author: 'Alex Sterling',
    authorAvatar: 'https://picsum.photos/seed/alex/100/100',
    role: 'Manager',
    content: "Quick update from the field! Everything is ready for our arrival next week. The local team is excited to host us! 🏔️✨",
    likes: 24,
    hasLiked: false,
    comments: [
      { id: 'c1', user: 'Sarah J.', avatar: 'https://picsum.photos/seed/sarah/100/100', text: "Incredible! Can't wait to see it in person.", time: '2h ago' }
    ],
    time: '3h ago'
  },
  {
    id: 'p2',
    author: 'Group Guide',
    authorAvatar: 'https://img.icons8.com/fluency/96/artificial-intelligence.png',
    role: 'Guide',
    content: "Packing Tip: Don't forget layers for the evening trek. The temperatures drop quickly after sunset! 🧣",
    likes: 12,
    hasLiked: true,
    comments: [],
    time: '5h ago'
  },
  {
    id: 'p3',
    author: 'Mike Ross',
    authorAvatar: 'https://picsum.photos/seed/mike/100/100',
    role: 'Member',
    content: "Just checked the gear list. All packed and ready to go! Counting down the days. 🎒",
    likes: 45,
    hasLiked: false,
    comments: [],
    time: '1h ago'
  }
];

const TripDetails: React.FC<Props> = ({ trip, onBack, onBook, onOpenChat }) => {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(DEFAULT_ITINERARY);
  const [isSavedOffline, setIsSavedOffline] = useState(false);
  const [posts, setPosts] = useState<TribePost[]>(MOCK_POSTS);
  const [activeView, setActiveView] = useState<'timeline' | 'feed'>('feed');
  const [sortMode, setSortMode] = useState<'newest' | 'popular'>('newest');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const storageKey = `floc_trip_${trip.id}_itinerary`;
    const cachedData = localStorage.getItem(storageKey);
    
    if (cachedData) {
      try {
        setItinerary(JSON.parse(cachedData));
      } catch (e) {
        console.error("Failed to parse cached itinerary", e);
      }
    }

    const infoKey = `floc_trip_${trip.id}_info`;
    localStorage.setItem(infoKey, JSON.stringify({
      title: trip.title,
      destination: trip.destination,
      dates: trip.dates,
      price: trip.price,
      image: trip.image
    }));
    
    setIsSavedOffline(true);
  }, [trip.id]);

  useEffect(() => {
    const storageKey = `floc_trip_${trip.id}_itinerary`;
    localStorage.setItem(storageKey, JSON.stringify(itinerary));
  }, [itinerary, trip.id]);

  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([
    {
      id: 's1',
      title: 'Sunrise Guided Session',
      description: 'A 4 AM start to reach the best vantage point for sunrise. Highly recommended for photography lovers.',
      suggestedBy: 'Sarah J.',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
      votes: 12,
      myVote: null,
      comments: [
        { id: 'c1', user: 'Mike R.', avatar: 'https://picsum.photos/seed/mike/100/100', text: 'Sounds intense but worth it!', time: '2h ago' },
        { id: 'c2', user: 'Elena V.', avatar: 'https://picsum.photos/seed/elena/100/100', text: 'I have a portable kit I can bring.', time: '1h ago' }
      ],
      tags: ['Active', 'Photography']
    },
    {
      id: 's2',
      title: 'Local Craft Workshop',
      description: 'Learn from local artisans in a small-group setting. Perfect for authentic souvenirs.',
      suggestedBy: 'Alex S.',
      avatar: 'https://picsum.photos/seed/alex/100/100',
      votes: 4,
      myVote: 'up',
      comments: [],
      tags: ['Culture', 'Craft']
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('');

  const sortedPosts = useMemo(() => {
    const sorted = [...posts];
    if (sortMode === 'popular') {
      return sorted.sort((a, b) => b.likes - a.likes);
    } else {
      // For "newest", since we don't have real dates, we'll use our mock logic
      // Assume "1h ago" < "3h ago" < "5h ago"
      const getTimeVal = (timeStr: string) => {
        const num = parseInt(timeStr.split(' ')[0]);
        if (timeStr.includes('m ago')) return num;
        if (timeStr.includes('h ago')) return num * 60;
        if (timeStr.includes('d ago')) return num * 1440;
        return 999999;
      };
      return sorted.sort((a, b) => getTimeVal(a.time) - getTimeVal(b.time));
    }
  }, [posts, sortMode]);

  const toggleComplete = (dayNum: number) => {
    setItinerary(prev => prev.map(item => 
      item.day === dayNum ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleVote = (id: string, direction: 'up' | 'down') => {
    setSuggestions(prev => prev.map(s => {
      if (s.id === id) {
        let newVotes = s.votes;
        let newMyVote = s.myVote;

        if (s.myVote === direction) {
          newVotes = direction === 'up' ? s.votes - 1 : s.votes + 1;
          newMyVote = null;
        } else {
          if (s.myVote === null) {
            newVotes = direction === 'up' ? s.votes + 1 : s.votes - 1;
          } else {
            newVotes = direction === 'up' ? s.votes + 2 : s.votes - 2;
          }
          newMyVote = direction;
        }

        return { 
          ...s, 
          votes: newVotes,
          myVote: newMyVote 
        };
      }
      return s;
    }));
  };

  const handlePostLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const currentlyLiked = p.hasLiked;
        return {
          ...p,
          likes: currentlyLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !currentlyLiked
        };
      }
      return p;
    }));
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: `Join our group for: ${trip.title}`,
      text: `Hey! I'm planning this awesome venture to ${trip.destination} with Floc. Want to join?`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed", err);
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const openSocialShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const addSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newSug: ActivitySuggestion = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      suggestedBy: 'Alex Sterling',
      avatar: 'https://picsum.photos/seed/alex/100/100',
      votes: 1,
      myVote: 'up',
      comments: [],
      tags: newTags.split(',').map(t => t.trim()).filter(t => t !== '')
    };
    setSuggestions([newSug, ...suggestions]);
    setNewTitle('');
    setNewDesc('');
    setNewTags('');
    setShowAddModal(false);
  };

  const completedCount = itinerary.filter(i => i.completed).length;
  const totalCount = itinerary.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="relative flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onBack} className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex gap-2">
          {isSavedOffline && (
            <div className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               Offline
            </div>
          )}
          
          <button 
            onClick={openSocialShare}
            className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-primary/20 group active:scale-90"
            title="Share to Social Media"
          >
            <span className="material-symbols-outlined text-primary group-hover:rotate-12 transition-transform">public</span>
          </button>

          <button 
            onClick={openSocialShare}
            className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/5"
            title="Share"
          >
            <span className="material-symbols-outlined text-white text-[20px]">hub</span>
          </button>

          <button 
            onClick={handleNativeShare}
            className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            title="Native Share"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
          
          <button className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>
        </div>
      </header>

      <div className="relative h-[420px] w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(0deg, rgba(22,13,8,1) 0%, rgba(22,13,8,0.4) 40%, rgba(22,13,8,0) 100%), url('${trip.image}')` }}></div>
        <div className="absolute bottom-6 left-4 right-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-primary text-sm">verified</span>
              <p className="text-white text-[10px] font-black uppercase tracking-widest">Powered by Inspired Ventures</p>
            </div>
          </div>
          <h1 className="text-white text-4xl font-bold leading-tight tracking-tight">{trip.title}</h1>
          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">location_on</span>
              <p className="text-white/80 text-sm font-medium">{trip.destination}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
              <p className="text-white/80 text-sm font-medium">{trip.dates}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-8 px-4 pb-40 -mt-2 relative z-10 bg-background-dark rounded-t-[2rem] pt-8 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-3 gap-3">
          <StatBox icon="schedule" label="Duration" value="10 Days" />
          <StatBox icon="calendar_month" label="Next" value={trip.dates.split('—')[0]} />
          <StatBox icon="group" label="Group" value={`${trip.membersCount}`} />
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full bg-primary/10 border border-primary/30 text-primary py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary/20 active:scale-[0.98] transition-all shadow-xl shadow-primary/5"
        >
          <span className="material-symbols-outlined font-black">add_circle</span>
          Suggest Activity
        </button>

        <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10">
          <button 
            onClick={() => setActiveView('feed')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${activeView === 'feed' ? 'bg-white text-background-dark shadow-lg' : 'text-slate-500'}`}
          >
            <span className="material-symbols-outlined text-sm">dynamic_feed</span>
            Group Feed
          </button>
          <button 
            onClick={() => setActiveView('timeline')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${activeView === 'timeline' ? 'bg-white text-background-dark shadow-lg' : 'text-slate-500'}`}
          >
            <span className="material-symbols-outlined text-sm">route</span>
            Timeline
          </button>
        </div>

        {activeView === 'feed' ? (
          <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-5 shadow-inner">
              <div className="flex items-center gap-4 mb-4">
                <img src="https://picsum.photos/seed/alex/100/100" className="size-10 rounded-full border border-primary/30" alt="" />
                <div className="flex-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Post an Update</p>
                  <h3 className="text-white text-sm font-bold">Broadcast to Group</h3>
                </div>
              </div>
              <div className="relative">
                <textarea 
                  placeholder="Share what's happening on the ground..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all resize-none placeholder:text-slate-600"
                  rows={2}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    <button className="size-8 rounded-full bg-white/5 text-slate-500 hover:text-white flex items-center justify-center transition-all">
                      <span className="material-symbols-outlined text-lg">image</span>
                    </button>
                    <button className="size-8 rounded-full bg-white/5 text-slate-500 hover:text-white flex items-center justify-center transition-all">
                      <span className="material-symbols-outlined text-lg">location_on</span>
                    </button>
                  </div>
                  <button className="px-4 py-1.5 bg-primary text-background-dark text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all">
                    Broadcast
                  </button>
                </div>
              </div>
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center justify-between px-2 pt-2">
               <h3 className="text-white font-black text-[10px] uppercase tracking-widest italic">Tribe Activity</h3>
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSortMode('newest')}
                    className={`text-[9px] font-black uppercase tracking-widest transition-all ${sortMode === 'newest' ? 'text-primary' : 'text-slate-600'}`}
                  >
                    Newest
                  </button>
                  <div className="size-1 bg-slate-800 rounded-full"></div>
                  <button 
                    onClick={() => setSortMode('popular')}
                    className={`text-[9px] font-black uppercase tracking-widest transition-all ${sortMode === 'popular' ? 'text-primary' : 'text-slate-600'}`}
                  >
                    Popular
                  </button>
               </div>
            </div>

            <div className="space-y-4">
              {sortedPosts.map(post => (
                <TribePostCard 
                  key={post.id} 
                  post={post} 
                  onLike={() => handlePostLike(post.id)}
                />
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-12 -right-12 size-40 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Group Progress</p>
                  <h3 className="text-white text-2xl font-black mb-1">Journey Log</h3>
                  <p className="text-slate-400 text-xs font-medium">
                    {completedCount === totalCount 
                      ? "Adventure complete! Legend status earned." 
                      : `${totalCount - completedCount} days left in this venture.`}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <img key={i} src={`https://picsum.photos/seed/${i+40}/40/40`} className="size-6 rounded-full border border-background-dark" alt="" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">+9 others ready</span>
                  </div>
                </div>
                <div className="relative size-24 shrink-0 flex items-center justify-center">
                  <svg className="size-full -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-white/5 fill-none" strokeWidth="6" />
                    <circle cx="48" cy="48" r="40" className="stroke-primary fill-none transition-all duration-1000 ease-out" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progressPercent / 100)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white leading-none">{progressPercent}%</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Done</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 relative z-10">
                <button 
                  onClick={handleNativeShare}
                  className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                  Invite to Group
                </button>
                <button className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95">
                  <span className="material-symbols-outlined text-sm">file_download</span>
                  Itinerary PDF
                </button>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Timeline</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Live from {trip.destination}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
                  <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                </div>
              </div>
              
              <div className="relative pl-4 space-y-0">
                <div className="absolute left-[30px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary via-slate-800 to-slate-800/0 z-0"></div>
                {itinerary.map((item, idx) => (
                  <ItineraryItem 
                    key={item.day} 
                    item={item} 
                    isLast={idx === itinerary.length - 1}
                    onToggleComplete={() => toggleComplete(item.day)}
                    defaultExpanded={idx === completedCount || (completedCount === totalCount && idx === 0)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        <section className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Group Lab</h2>
              <p className="text-xs text-slate-400 font-medium">Suggest & vote on group activities</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary/10 text-primary p-2 rounded-2xl hover:bg-primary/20 transition-all border border-primary/20"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full mb-6 bg-primary/10 border border-primary/20 text-primary py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/20 transition-all active:scale-[0.98] shadow-lg shadow-primary/5 mt-2"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Suggest Activity
          </button>

          <div className="space-y-4">
            {suggestions.map((sug) => (
              <SuggestionCard key={sug.id} suggestion={sug} onVote={(dir) => handleVote(sug.id, dir)} />
            ))}
          </div>
        </section>

        <section className="fixed bottom-0 left-0 right-0 z-[60] p-4 pb-8 bg-background-dark/80 backdrop-blur-2xl border-t border-white/5 max-w-md mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tracking-tight">{trip.price}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-black tracking-tight mt-0.5">
                <span className="material-symbols-outlined text-xs text-primary fill-1">verified_user</span>
                Secure Payment
              </div>
            </div>
            <button 
              onClick={onBook}
              className="flex-1 bg-primary text-background-dark h-14 rounded-2xl font-black text-lg shadow-[0_8px_30px_rgb(255,107,53,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Secure Spot
              <span className="material-symbols-outlined font-black">arrow_forward</span>
            </button>
          </div>
        </section>
      </main>

      <button 
        onClick={onOpenChat}
        className="fixed bottom-24 right-6 size-14 bg-primary text-background-dark rounded-full shadow-[0_8px_30px_rgba(255,107,53,0.4)] flex items-center justify-center z-50 active:scale-90 transition-transform hover:scale-105"
      >
        <span className="material-symbols-outlined text-3xl font-black">forum</span>
      </button>

      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-background-dark w-full max-w-md rounded-t-[2.5rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Social Labs</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Spread the Vibe</p>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-slate-500 hover:text-white p-2 bg-white/5 rounded-full transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="bg-white rounded-[2rem] p-6 mb-8 flex flex-col items-center shadow-2xl group cursor-pointer active:scale-[0.98] transition-all">
               <div className="size-40 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border-4 border-slate-50 transition-colors group-hover:bg-slate-200">
                  <span className="material-symbols-outlined text-background-dark text-7xl font-light">qr_code_2</span>
               </div>
               <div className="text-center">
                 <p className="text-background-dark text-[10px] font-black uppercase tracking-[0.2em] mb-1">Invite Code</p>
                 <h3 className="text-primary text-xl font-black tracking-tighter">{trip.title.split(' ')[0].toUpperCase()}-X2024</h3>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <ShareIcon icon="mail" label="Email" hoverColor="hover:text-blue-400" />
              <ShareIcon icon="chat" label="WhatsApp" hoverColor="hover:text-emerald-400" />
              <ShareIcon icon="flutter_dash" label="Twitter" hoverColor="hover:text-sky-400" />
              <ShareIcon icon="public" label="Facebook" hoverColor="hover:text-indigo-500" />
              <ShareIcon icon="camera" label="Instagram" hoverColor="hover:text-pink-500" />
              <ShareIcon icon="qr_code" label="QR Sync" hoverColor="hover:text-primary" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 group ring-1 ring-white/5">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="material-symbols-outlined text-slate-500">link</span>
                <span className="text-[11px] text-slate-400 font-medium truncate">{window.location.href}</span>
              </div>
              <button 
                onClick={copyToClipboard}
                className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copySuccess ? 'bg-emerald-500 text-background-dark shadow-lg shadow-emerald-500/20' : 'bg-primary text-background-dark shadow-lg shadow-primary/20 active:scale-95'}`}
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-background-dark w-full max-w-md rounded-t-[2.5rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight">New Suggestion</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white p-2">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={addSuggestion} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">What should we do?</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sunrise Guided Hike"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Describe the Vibe</label>
                <textarea 
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Tell the group why this is essential..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Active, Culture, Free"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4"
              >
                Post to Lab
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ShareIcon: React.FC<{ icon: string; label: string; hoverColor?: string }> = ({ icon, label, hoverColor = "hover:text-primary" }) => (
  <button className={`flex flex-col items-center gap-2 group transition-all active:scale-90 ${hoverColor}`}>
    <div className="size-14 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 group-hover:shadow-xl transition-all shadow-lg ring-1 ring-white/5">
      <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{label}</span>
  </button>
);

const TribePostCard: React.FC<{ post: TribePost; onLike: () => void }> = ({ post, onLike }) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<TribeComment[]>(post.comments);

  const handleLikeClick = () => {
    if (isLiking) return;
    setIsLiking(true);
    onLike();
    // Simulate haptic/visual feedback pop duration
    setTimeout(() => setIsLiking(false), 400);
  };

  const handleAddComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!commentText.trim()) return;

    const newComment: TribeComment = {
      id: Date.now().toString(),
      user: 'Alex Sterling',
      avatar: 'https://picsum.photos/seed/alex/100/100',
      text: commentText,
      time: 'Just now'
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={post.authorAvatar} className={`size-10 rounded-full object-cover border-2 ${post.role === 'Manager' ? 'border-primary' : 'border-white/10'}`} alt="" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-white font-black text-sm">{post.author}</h4>
                {post.role === 'Manager' && (
                  <span className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">Group Manager</span>
                )}
                {post.role === 'Guide' && (
                  <span className="bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">Guide</span>
                )}
              </div>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{post.time}</p>
            </div>
          </div>
          <button className="text-slate-600 hover:text-white p-2">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        <p className="text-white text-sm leading-relaxed mb-4">{post.content}</p>

        {post.image && (
          <div className="rounded-2xl overflow-hidden mb-4 aspect-video relative group">
            <img src={post.image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="Post attachment" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        )}

        <div className="flex items-center gap-6">
          <button 
            onClick={handleLikeClick}
            className={`flex items-center gap-2 transition-all active:scale-95 group/like ${post.hasLiked ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
          >
            <span 
              className={`material-symbols-outlined text-xl transition-all ${isLiking ? 'animate-[heart-pop_0.4s_ease-out]' : ''}`}
              style={{ fontVariationSettings: post.hasLiked ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            <div className="relative overflow-hidden h-5 flex items-center">
              <span key={post.likes} className="text-xs font-black transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in">{post.likes}</span>
            </div>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 transition-all ${showComments ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
          >
            <span className={`material-symbols-outlined text-xl ${showComments ? 'fill-1' : ''}`}>forum</span>
            <span className="text-xs font-black">{comments.length}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="px-5 pb-5 pt-2 space-y-4 border-t border-white/5 bg-white/[0.02] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 py-2">
            <img src="https://picsum.photos/seed/alex/100/100" className="size-8 rounded-full border border-primary/20 shrink-0" alt="Your avatar" />
            <form onSubmit={handleAddComment} className="flex-1 relative">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add to the conversation..."
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-[11px] text-white focus:border-primary outline-none transition-all placeholder:text-slate-600 pr-10"
              />
              <button type="submit" disabled={!commentText.trim()} className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all ${commentText.trim() ? 'text-primary scale-110 active:scale-90' : 'text-slate-700 opacity-50'}`}>
                <span className="material-symbols-outlined text-base font-black">send</span>
              </button>
            </form>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar pr-1">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                <img src={comment.avatar} className="size-8 rounded-full border border-white/5 shrink-0" alt="" />
                <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5 relative group">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-tight ${comment.user === 'Alex Sterling' ? 'text-primary' : 'text-slate-300'}`}>
                      {comment.user}
                      {comment.user === 'Alex Sterling' && <span className="ml-1 text-[7px] text-primary/60">(You)</span>}
                    </span>
                    <span className="text-[8px] text-slate-600 font-bold uppercase">{comment.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center transition-all hover:bg-white/10">
    <span className="material-symbols-outlined text-primary text-xl mb-1">{icon}</span>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xs font-black text-white">{value}</p>
  </div>
);

const SuggestionCard: React.FC<{ suggestion: ActivitySuggestion; onVote: (dir: 'up' | 'down') => void }> = ({ suggestion, onVote }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/10 text-left">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-col items-center bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <button 
              onClick={() => onVote('up')}
              className={`flex items-center justify-center size-10 transition-all ${suggestion.myVote === 'up' ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-sm font-black">keyboard_arrow_up</span>
            </button>
            <div className={`text-xs font-black py-0.5 w-full text-center ${suggestion.myVote === 'up' ? 'text-primary' : suggestion.myVote === 'down' ? 'text-blue-400' : 'text-white'}`}>
              {suggestion.votes}
            </div>
            <button 
              onClick={() => onVote('down')}
              className={`flex items-center justify-center size-10 transition-all ${suggestion.myVote === 'down' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-sm font-black">keyboard_arrow_down</span>
            </button>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <img src={suggestion.avatar} className="size-5 rounded-full object-cover border border-white/10" alt="" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{suggestion.suggestedBy}</span>
          </div>
          <h4 className="text-white font-black text-sm leading-tight mb-1">{suggestion.title}</h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{suggestion.description}</p>
          
          {suggestion.tags && suggestion.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {suggestion.tags.map(tag => (
                <span key={tag} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[8px] uppercase font-black tracking-widest text-primary/60">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4">
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-all">
              <span className="material-symbols-outlined text-base">forum</span>
              <span className="text-[9px] font-black uppercase tracking-widest">{suggestion.comments.length} Comments</span>
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
          {suggestion.comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <img src={comment.avatar} className="size-6 rounded-full shrink-0 border border-white/10" alt="" />
              <div className="bg-white/5 rounded-xl p-3 flex-1 border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase">{comment.user}</span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">{comment.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ItineraryItem: React.FC<{ 
  item: ItineraryDay; 
  onToggleComplete: () => void; 
  defaultExpanded: boolean; 
  isLast: boolean;
}> = ({ item, onToggleComplete, defaultExpanded, isLast }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (item.completed) {
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [item.completed]);

  return (
    <div className={`relative mb-6 last:mb-0 group`}>
      <div className={`absolute left-[16px] top-4 flex items-center justify-center size-8 rounded-full z-10 transition-all duration-500 ${item.completed ? 'bg-primary scale-110 shadow-[0_0_20px_rgba(255,107,53,0.5)]' : (expanded ? 'bg-primary/20 border-2 border-primary' : 'bg-slate-800 border border-white/10')}`}>
        {item.completed ? (
          <span className="material-symbols-outlined text-background-dark text-base font-black">check</span>
        ) : (
          <span className={`text-[10px] font-black ${expanded ? 'text-primary' : 'text-slate-500'}`}>{item.day}</span>
        )}
      </div>

      <div 
        className={`ml-14 transition-all duration-500 rounded-3xl p-5 border cursor-pointer text-left ${expanded ? 'bg-primary/5 border-primary/30 shadow-xl' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className={`font-black text-sm tracking-tight transition-all duration-300 ${item.completed && !expanded ? 'text-slate-500 line-through' : 'text-white'}`}>
              {item.title}
            </h3>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className={`size-8 rounded-full transition-all shrink-0 flex items-center justify-center ${item.completed ? 'bg-primary text-background-dark' : 'bg-white/5 text-slate-600 hover:text-white border border-white/10'}`}
          >
            <span className="material-symbols-outlined text-[18px] font-black">
              {item.completed ? 'task_alt' : 'circle'}
            </span>
          </button>
        </div>
        
        {expanded && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.content}</p>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map(tag => (
                <span key={tag} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[8px] uppercase font-black tracking-widest text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete();
              }}
              className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${item.completed ? 'bg-slate-800 text-slate-500 border border-white/5' : 'bg-primary text-background-dark shadow-lg shadow-primary/20'}`}
            >
              <span className="material-symbols-outlined text-sm font-black">
                {item.completed ? 'undo' : 'done_all'}
              </span>
              {item.completed ? 'Undo Task' : 'Mark as Done'}
            </button>
          </div>
        )}
      </div>

      {celebrating && (
        <div className="absolute left-[32px] top-[32px] pointer-events-none z-[100]">
          <div className="absolute size-1 bg-yellow-400 rounded-full animate-sparkle-1"></div>
          <div className="absolute size-1 bg-primary rounded-full animate-sparkle-2"></div>
          <div className="absolute size-1 bg-white rounded-full animate-sparkle-3"></div>
          <div className="absolute size-1 bg-yellow-200 rounded-full animate-sparkle-4"></div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
