
import React, { useState, useEffect, useMemo } from 'react';
import { Trip, TribePost, TribeComment, TripSuggestion } from '../types';

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

const INITIAL_POSTS: TribePost[] = [
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
    author: 'Elena Vance',
    authorAvatar: 'https://picsum.photos/seed/elena/100/100',
    role: 'Member',
    content: "Just packed my camera gear. Getting some extra SD cards for all the shots we're going to take! 📸",
    likes: 12,
    hasLiked: true,
    comments: [],
    time: '5h ago'
  }
];

const TripDetails: React.FC<Props> = ({ trip, onBack, onBook, onOpenChat }) => {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(DEFAULT_ITINERARY);
  const [posts, setPosts] = useState<TribePost[]>(INITIAL_POSTS);
  const [activeView, setActiveView] = useState<'timeline' | 'feed'>('feed');
  const [sortMode, setSortMode] = useState<'newest' | 'popular'>('newest');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // New state for Trip Suggestions within the Trip Feed
  const [suggestions, setSuggestions] = useState<(TripSuggestion & { comments: TribeComment[] })[]>([
    {
      id: 'ts1',
      destination: 'Post-Trip: Amazon Extension',
      budget: 'Mid',
      style: 'Adventure',
      duration: '4 Days',
      ingredients: ['River Kayaking', 'Jungle Night Walk'],
      travelFrom: trip.destination,
      suggestedBy: 'Sarah Jenkins',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
      votes: 12,
      myVote: 'up',
      timestamp: '1d ago',
      comments: [
        { id: 'tc1', user: 'Alex S.', avatar: 'https://picsum.photos/seed/alex/100/100', text: "I can coordinate this with our local guides if enough people are interested!", time: '5h ago' }
      ]
    }
  ]);

  const sortedPosts = useMemo(() => {
    const sorted = [...posts];
    if (sortMode === 'popular') return sorted.sort((a, b) => b.likes - a.likes);
    return sorted;
  }, [posts, sortMode]);

  const toggleComplete = (dayNum: number) => {
    setItinerary(prev => prev.map(item => item.day === dayNum ? { ...item, completed: !item.completed } : item));
  };

  const handlePostLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const currentlyLiked = p.hasLiked;
        return { ...p, likes: currentlyLiked ? p.likes - 1 : p.likes + 1, hasLiked: !currentlyLiked };
      }
      return p;
    }));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    setIsPosting(true);
    // Simulate API call
    setTimeout(() => {
      const newPost: TribePost = {
        id: Date.now().toString(),
        author: 'Alex Sterling',
        authorAvatar: 'https://picsum.photos/seed/alex/100/100',
        role: 'Manager',
        content: newPostContent,
        likes: 0,
        hasLiked: false,
        comments: [],
        time: 'Just now'
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsPosting(false);
    }, 600);
  };

  const handleSuggestionVote = (id: string, dir: 'up' | 'down') => {
    setSuggestions(prev => prev.map(s => {
      if (s.id === id) {
        let newVotes = s.votes;
        if (s.myVote === dir) {
          newVotes = dir === 'up' ? s.votes - 1 : s.votes + 1;
          return { ...s, votes: newVotes, myVote: null };
        } else {
          newVotes = dir === 'up' ? s.votes + (s.myVote === 'down' ? 2 : 1) : s.votes - (s.myVote === 'up' ? 2 : 1);
          return { ...s, votes: newVotes, myVote: dir };
        }
      }
      return s;
    }));
  };

  const handleAddCommentToSuggestion = (suggestionId: string, text: string) => {
    setSuggestions(prev => prev.map(s => {
      if (s.id === suggestionId) {
        const newComment: TribeComment = {
          id: Date.now().toString(),
          user: 'Alex Sterling',
          avatar: 'https://picsum.photos/seed/alex/100/100',
          text,
          time: 'Just now'
        };
        return { ...s, comments: [newComment, ...s.comments] };
      }
      return s;
    }));
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
      </header>

      <div className="relative h-[420px] w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(0deg, rgba(22,13,8,1) 0%, rgba(22,13,8,0.4) 40%, rgba(22,13,8,0) 100%), url('${trip.image}')` }}></div>
        <div className="absolute bottom-6 left-4 right-4">
          <h1 className="text-white text-4xl font-bold leading-tight tracking-tight">{trip.title}</h1>
          <div className="flex flex-col gap-1.5 mt-3 text-white/80 text-sm font-medium">
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">location_on</span>{trip.destination}</div>
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">calendar_month</span>{trip.dates}</div>
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-8 px-4 pb-40 -mt-2 relative z-10 bg-background-dark rounded-t-[2rem] pt-8 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-3 gap-3">
          <StatBox icon="schedule" label="Duration" value="10 Days" />
          <StatBox icon="calendar_month" label="Next" value={trip.dates.split('—')[0]} />
          <StatBox icon="group" label="Group" value={`${trip.membersCount}`} />
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10">
          <button onClick={() => setActiveView('feed')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${activeView === 'feed' ? 'bg-white text-background-dark shadow-lg' : 'text-slate-500'}`}><span className="material-symbols-outlined text-sm">dynamic_feed</span>Tribe Feed</button>
          <button onClick={() => setActiveView('timeline')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${activeView === 'timeline' ? 'bg-white text-background-dark shadow-lg' : 'text-slate-500'}`}><span className="material-symbols-outlined text-sm">route</span>Timeline</button>
        </div>

        {activeView === 'feed' ? (
          <section className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
            {/* Social Composer */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-xl">
               <form onSubmit={handleAddPost} className="space-y-4">
                  <div className="flex gap-4">
                     <img src="https://picsum.photos/seed/alex/100/100" className="size-10 rounded-full border-2 border-primary/20" alt="Your Avatar" />
                     <textarea 
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share an update with the tribe..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm resize-none placeholder:text-slate-600 min-h-[60px]"
                     />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                     <div className="flex gap-2">
                        <button type="button" className="text-slate-500 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">image</span></button>
                        <button type="button" className="text-slate-500 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">location_on</span></button>
                     </div>
                     <button 
                        type="submit" 
                        disabled={!newPostContent.trim() || isPosting}
                        className="bg-primary text-background-dark px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                     >
                        {isPosting ? 'Posting...' : 'Post to Feed'}
                     </button>
                  </div>
               </form>
            </div>

            {/* Updates Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-white font-black text-[10px] uppercase tracking-widest italic">Member Activity</h3>
                 <div className="flex items-center gap-3">
                    <button onClick={() => setSortMode('newest')} className={`text-[9px] font-black uppercase tracking-widest transition-all ${sortMode === 'newest' ? 'text-primary' : 'text-slate-600'}`}>Newest</button>
                    <button onClick={() => setSortMode('popular')} className={`text-[9px] font-black uppercase tracking-widest transition-all ${sortMode === 'popular' ? 'text-primary' : 'text-slate-600'}`}>Popular</button>
                 </div>
              </div>
              <div className="space-y-4">
                {sortedPosts.map(post => <TribePostCard key={post.id} post={post} onLike={() => handlePostLike(post.id)} />)}
              </div>
            </div>

            {/* Trip Ideas Lab Section */}
            <div className="space-y-6">
               <div className="px-2">
                 <h3 className="text-white font-black text-[10px] uppercase tracking-widest italic">Venture Lab</h3>
                 <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Proposed extensions & future trips</p>
               </div>
               <div className="space-y-4">
                 {suggestions.map(sug => (
                   <TripSuggestionCard 
                     key={sug.id} 
                     suggestion={sug} 
                     onVote={(dir) => handleSuggestionVote(sug.id, dir)}
                     onAddComment={(text) => handleAddCommentToSuggestion(sug.id, text)}
                   />
                 ))}
                 <button className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 group hover:bg-white/10 transition-all border-dashed border-2">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined">rocket_launch</span>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Pitch a Future Venture</span>
                 </button>
               </div>
            </div>
          </section>
        ) : (
          <>
            <section className="bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Group Progress</p>
                  <h3 className="text-white text-2xl font-black mb-1">Journey Log</h3>
                  <p className="text-slate-400 text-xs font-medium">{progressPercent}% of adventure logged.</p>
                </div>
                <div className="relative size-24 shrink-0 flex items-center justify-center">
                  <svg className="size-full -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-white/5 fill-none" strokeWidth="6" />
                    <circle cx="48" cy="48" r="40" className="stroke-primary fill-none transition-all duration-1000 ease-out" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progressPercent / 100)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-black text-white">{progressPercent}%</span></div>
                </div>
              </div>
            </section>
            <section className="relative pl-4 space-y-0">
               <div className="absolute left-[30px] top-6 bottom-6 w-[2px] bg-slate-800"></div>
               {itinerary.map((item, idx) => <ItineraryItem key={item.day} item={item} isLast={idx === itinerary.length - 1} onToggleComplete={() => toggleComplete(item.day)} defaultExpanded={idx === completedCount} />)}
            </section>
          </>
        )}

        <section className="fixed bottom-0 left-0 right-0 z-[60] p-4 pb-8 bg-background-dark/80 backdrop-blur-2xl border-t border-white/5 max-w-md mx-auto flex items-center justify-between gap-4">
           <div className="flex flex-col">
              <div className="flex items-baseline gap-1"><span className="text-2xl font-black text-white tracking-tight">{trip.price}</span></div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-tight">Per Explorer</p>
           </div>
           <button onClick={onBook} className="flex-1 bg-primary text-background-dark h-14 rounded-2xl font-black text-lg shadow-[0_8px_30px_rgb(255,107,53,0.3)] active:scale-[0.98] transition-all">Secure Spot</button>
        </section>
      </main>

      <button onClick={onOpenChat} className="fixed bottom-24 right-6 size-14 bg-primary text-background-dark rounded-full shadow-[0_8px_30px_rgba(255,107,53,0.4)] flex items-center justify-center z-50 active:scale-90 transition-transform"><span className="material-symbols-outlined text-3xl font-black">forum</span></button>
    </div>
  );
};

const StatBox: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center">
    <span className="material-symbols-outlined text-primary text-xl mb-1">{icon}</span>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xs font-black text-white">{value}</p>
  </div>
);

const TribePostCard: React.FC<{ post: TribePost; onLike: () => void }> = ({ post, onLike }) => {
  const [isLiking, setIsLiking] = useState(false);
  const handleLikeClick = () => { if (isLiking) return; setIsLiking(true); onLike(); setTimeout(() => setIsLiking(false), 450); };
  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <img src={post.authorAvatar} className="size-10 rounded-full object-cover border-2 border-white/10" alt="" />
          <div><div className="flex items-center gap-1.5"><h4 className="text-white font-black text-sm">{post.author}</h4><span className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">{post.role}</span></div><p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{post.time}</p></div>
        </div>
        <p className="text-white text-sm leading-relaxed mb-4">{post.content}</p>
        <div className="flex items-center gap-6">
          <button onClick={handleLikeClick} className={`flex items-center gap-2 transition-all relative ${post.hasLiked ? 'text-primary' : 'text-slate-500 hover:text-white'}`}><span className={`material-symbols-outlined text-xl transition-all ${isLiking ? 'animate-[heart-pop_0.4s_ease-out]' : ''}`} style={{ fontVariationSettings: post.hasLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span><span className="text-xs font-black">{post.likes}</span></button>
          <button className="flex items-center gap-2 text-slate-500"><span className="material-symbols-outlined text-xl">forum</span><span className="text-xs font-black">{post.comments.length}</span></button>
        </div>
      </div>
    </div>
  );
};

const TripSuggestionCard: React.FC<{ 
  suggestion: TripSuggestion & { comments: TribeComment[] }; 
  onVote: (dir: 'up' | 'down') => void;
  onAddComment: (text: string) => void;
}> = ({ suggestion, onVote, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden shadow-xl hover:border-primary/20 transition-all p-5">
      <div className="flex gap-4">
        <div className="flex flex-col items-center bg-black/20 rounded-2xl border border-white/5 overflow-hidden shrink-0 h-fit">
          <button onClick={() => onVote('up')} className={`p-2 transition-all ${suggestion.myVote === 'up' ? 'text-primary' : 'text-slate-600'}`}>
            <span className="material-symbols-outlined font-black">keyboard_arrow_up</span>
          </button>
          <span className={`text-xs font-black ${suggestion.myVote === 'up' ? 'text-primary' : suggestion.myVote === 'down' ? 'text-blue-400' : 'text-white'}`}>{suggestion.votes}</span>
          <button onClick={() => onVote('down')} className={`p-2 transition-all ${suggestion.myVote === 'down' ? 'text-blue-400' : 'text-slate-600'}`}>
            <span className="material-symbols-outlined font-black">keyboard_arrow_down</span>
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
                <img src={suggestion.avatar} className="size-5 rounded-full" alt="" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{suggestion.suggestedBy}</span>
             </div>
             <span className="text-[8px] font-bold text-slate-600 uppercase">{suggestion.timestamp}</span>
          </div>
          <h4 className="text-white font-black text-lg italic tracking-tight leading-none mb-1">{suggestion.destination}</h4>
          <div className="flex flex-wrap gap-2 mt-3">
             <div className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg text-[8px] font-black text-primary uppercase">{suggestion.budget}</div>
             <div className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-[8px] font-black text-slate-400 uppercase">{suggestion.style}</div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-1.5 text-slate-500">
                <span className="material-symbols-outlined text-xs">flight_takeoff</span>
                <span className="text-[9px] font-bold">Start: {suggestion.travelFrom}</span>
             </div>
             <button 
               onClick={() => setShowComments(!showComments)}
               className={`text-[9px] font-black uppercase tracking-widest transition-all ${showComments ? 'text-white' : 'text-primary hover:underline'}`}
             >
               {showComments ? 'Close' : `Discuss (${suggestion.comments.length})`}
             </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 bg-black/20 -mx-5 -mb-5 p-5 border-t border-white/5">
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <img src="https://picsum.photos/seed/alex/100/100" className="size-8 rounded-full border border-primary/20" alt="" />
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[11px] text-white focus:border-primary outline-none transition-all"
              />
              <button 
                type="submit" 
                disabled={!commentText.trim()} 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {suggestion.comments.map(comment => (
              <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <img src={comment.avatar} className="size-7 rounded-full shrink-0 border border-white/10" alt="" />
                <div className="bg-white/5 rounded-2xl p-3 flex-1 border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-tight ${comment.user === 'Alex Sterling' ? 'text-primary' : 'text-slate-300'}`}>
                      {comment.user}
                    </span>
                    <span className="text-[8px] text-slate-600 font-bold uppercase">{comment.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ItineraryItem: React.FC<{ item: ItineraryDay; onToggleComplete: () => void; defaultExpanded: boolean; isLast: boolean; }> = ({ item, onToggleComplete, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="relative mb-6 last:mb-0">
      <div className={`absolute left-[16px] top-4 flex items-center justify-center size-8 rounded-full z-10 transition-all ${item.completed ? 'bg-primary scale-110' : (expanded ? 'bg-primary/20 border-2 border-primary' : 'bg-slate-800 border border-white/10')}`}>
        {item.completed ? <span className="material-symbols-outlined text-background-dark text-base font-black">check</span> : <span className={`text-[10px] font-black ${expanded ? 'text-primary' : 'text-slate-500'}`}>{item.day}</span>}
      </div>
      <div className={`ml-14 transition-all rounded-3xl p-5 border cursor-pointer ${expanded ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/5'}`} onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4"><h3 className={`font-black text-sm transition-all ${item.completed && !expanded ? 'text-slate-500 line-through' : 'text-white'}`}>{item.title}</h3><button onClick={(e) => { e.stopPropagation(); onToggleComplete(); }} className={`size-8 rounded-full transition-all flex items-center justify-center ${item.completed ? 'bg-primary text-background-dark' : 'bg-white/5 text-slate-600 border border-white/10'}`}><span className="material-symbols-outlined text-[18px] font-black">{item.completed ? 'task_alt' : 'circle'}</span></button></div>
        {expanded && <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300 space-y-4"><p className="text-xs text-slate-400 leading-relaxed font-medium">{item.content}</p><div className="flex flex-wrap gap-1.5">{item.tags.map(tag => <span key={tag} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[8px] uppercase font-black tracking-widest text-slate-400">{tag}</span>)}</div></div>}
      </div>
    </div>
  );
};

export default TripDetails;
