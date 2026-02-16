
import React, { useState } from 'react';
import { Community, Trip, TribePost, TribeComment, TripSuggestion } from '../types';

interface Props {
  community: Community;
  onBack: () => void;
  onSelectTrip: (trip: Trip) => void;
  onJoin: (community: Community) => void;
  onOpenChat?: () => void;
}

const TribePostCard: React.FC<{ post: TribePost; onLike: () => void }> = ({ post, onLike }) => (
  <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={post.authorAvatar} className="size-10 rounded-full border-2 border-white/10" alt="" />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-white font-black text-sm">{post.author}</h4>
              <span className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">{post.role}</span>
            </div>
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{post.time}</p>
          </div>
        </div>
      </div>
      <p className="text-white text-sm leading-relaxed mb-4">{post.content}</p>
      {post.image && <img src={post.image} className="rounded-2xl w-full h-auto mb-4" alt="" />}
      <div className="flex items-center gap-6">
        <button onClick={onLike} className={`flex items-center gap-2 ${post.hasLiked ? 'text-primary' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: post.hasLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          <span className="text-xs font-black">{post.likes}</span>
        </button>
        <button className="flex items-center gap-2 text-slate-500"><span className="material-symbols-outlined text-xl">forum</span><span className="text-xs font-black">{post.comments.length}</span></button>
      </div>
    </div>
  </div>
);

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
             <div className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg text-[8px] font-black text-primary uppercase">{suggestion.budget} Budget</div>
             <div className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-[8px] font-black text-slate-400 uppercase">{suggestion.style}</div>
             <div className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-[8px] font-black text-slate-400 uppercase">{suggestion.duration}</div>
          </div>
          
          <div className="mt-4 space-y-2">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ingredients</p>
             <div className="flex flex-wrap gap-1.5">
               {suggestion.ingredients.map(ing => (
                 <span key={ing} className="bg-white/5 px-2 py-1 rounded-md text-[10px] text-slate-300 border border-white/5 leading-none">{ing}</span>
               ))}
             </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-1.5 text-slate-500">
                <span className="material-symbols-outlined text-xs">flight_takeoff</span>
                <span className="text-[9px] font-bold">From: {suggestion.travelFrom}</span>
             </div>
             <button 
               onClick={() => setShowComments(!showComments)}
               className={`text-[9px] font-black uppercase tracking-widest transition-all ${showComments ? 'text-white' : 'text-primary hover:underline'}`}
             >
               {showComments ? 'Close Discussion' : `Discuss (${suggestion.comments.length})`}
             </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 bg-black/20 -mx-5 -mb-5 p-5 border-t border-white/5">
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <img src="https://picsum.photos/seed/alex/100/100" className="size-8 rounded-full border border-primary/20" alt="Your avatar" />
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
            {suggestion.comments.length === 0 && (
              <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest py-4">No comments yet. Be the first to discuss!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MOCK_COMMUNITY_POSTS: TribePost[] = [
  {
    id: 'cp1',
    author: 'Elena Vance',
    authorAvatar: 'https://picsum.photos/seed/elena/100/100',
    role: 'Member',
    content: "Just got back from the volunteer session at the reef. The progress is amazing! Check out these colors. 🐠✨",
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
    likes: 42,
    hasLiked: true,
    comments: [],
    time: '45m ago'
  },
  {
    id: 'cp2',
    author: 'Tribe Admin',
    authorAvatar: 'https://picsum.photos/seed/admin/100/100',
    role: 'Manager',
    content: "Big news! Our upcoming Bali venture just secured a partnership with the local mangrove restoration project. Every member gets a dedicated planting plot! 🌱",
    likes: 128,
    hasLiked: false,
    comments: [
      { id: 'c1', user: 'Mike R.', avatar: 'https://picsum.photos/seed/mike/100/100', text: "This is what Floc is all about. Sign me up!", time: '10m ago' }
    ],
    time: '2h ago'
  }
];

const COMMUNITY_TABS = ['feed', 'ventures', 'lab', 'about'] as const;
const CONTRIBUTOR_IDS = [1, 2, 3, 4];
const TRIP_STYLES = ['Adventure', 'Wellness', 'Photography', 'Cultural'];

const CommunityDetails: React.FC<Props> = ({ community, onBack, onSelectTrip, onJoin, onOpenChat }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'ventures' | 'lab' | 'about'>('feed');
  const [isJoined, setIsJoined] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  
  const [sugDest, setSugDest] = useState('');
  const [sugBudget, setSugBudget] = useState<'Eco' | 'Mid' | 'Luxury'>('Mid');
  const [sugStyle, setSugStyle] = useState('Adventure');
  const [sugDuration, setSugDuration] = useState('7 Days');
  const [sugIngredients, setSugIngredients] = useState('');
  const [sugFrom, setSugFrom] = useState('');

  const [suggestions, setSuggestions] = useState<(TripSuggestion & { comments: TribeComment[] })[]>([
    {
      id: 's1',
      destination: 'Iceland Northern Lights',
      budget: 'Luxury',
      style: 'Photography',
      duration: '5 Days',
      ingredients: ['Hot Springs', 'Glacier Hike', 'Local Seafood'],
      travelFrom: 'London, UK',
      suggestedBy: 'Mike Ross',
      avatar: 'https://picsum.photos/seed/mike/100/100',
      votes: 18,
      myVote: 'up',
      timestamp: '2d ago',
      comments: [
        { id: 'sc1', user: 'Elena V.', avatar: 'https://picsum.photos/seed/elena/100/100', text: "I've been wanting to do this for years! The glacier hike is a must.", time: '1d ago' },
        { id: 'sc2', user: 'Sarah J.', avatar: 'https://picsum.photos/seed/sarah/100/100', text: "Would love to see the budget breakdown for luxury vs mid-range.", time: '12h ago' }
      ]
    }
  ]);

  const handleJoinClick = () => {
    if (community.accessType === 'free') setIsJoined(true);
    onJoin(community);
  };

  const handlePostSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newSug: TripSuggestion & { comments: TribeComment[] } = {
      id: Date.now().toString(),
      destination: sugDest,
      budget: sugBudget,
      style: sugStyle,
      duration: sugDuration,
      ingredients: sugIngredients.split(',').map(i => i.trim()),
      travelFrom: sugFrom,
      suggestedBy: 'Alex Sterling',
      avatar: 'https://picsum.photos/seed/alex/100/100',
      votes: 1,
      myVote: 'up',
      timestamp: 'Just now',
      comments: []
    };
    setSuggestions([newSug, ...suggestions]);
    setShowSuggestModal(false);
    setSugDest(''); setSugIngredients(''); setSugFrom('');
  };

  const handleVote = (id: string, dir: 'up' | 'down') => {
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

  return (
    <div className="flex flex-col min-h-full bg-background-dark relative">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onBack} className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <button className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      <div className="relative h-[280px] w-full overflow-hidden shrink-0">
        <img src={community.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
              {community.category}
            </span>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
               <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-white text-[8px] font-black uppercase tracking-widest">{Math.floor(Math.random() * 20) + 5} Active Now</span>
            </div>
          </div>
          <h1 className="text-white text-3xl font-black leading-tight tracking-tight">{community.title}</h1>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">{community.memberCount} Members</p>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-10 flex gap-4">
        {!isJoined ? (
          <button 
            onClick={handleJoinClick}
            className="flex-1 bg-primary text-background-dark font-black py-4 rounded-2xl text-sm shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">{community.accessType === 'request' ? 'lock' : 'add_circle'}</span>
            {community.accessType === 'request' ? 'Request Access' : 'Join Community'}
          </button>
        ) : (
          <button 
            onClick={onOpenChat}
            className="flex-1 bg-emerald-500 text-background-dark font-black py-4 rounded-2xl text-sm shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">forum</span>
            Open Community Chat
          </button>
        )}
      </div>

      <div className="flex px-4 mt-8 border-b border-white/5 overflow-x-auto hide-scrollbar whitespace-nowrap">
        {COMMUNITY_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? 'text-primary' : 'text-slate-500'
            }`}
          >
            {tab === 'lab' ? 'Planning Lab' : tab === 'ventures' ? 'Trips' : tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in zoom-in duration-300"></div>
            )}
          </button>
        ))}
      </div>

      <main className="px-6 py-6 pb-32">
        {activeTab === 'feed' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isJoined && (
              <div 
                onClick={() => setShowSuggestModal(true)}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between cursor-pointer group hover:bg-primary/10 transition-all shadow-lg shadow-primary/5"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                    <span className="material-symbols-outlined text-background-dark font-black">rocket_launch</span>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-widest">Pitch a Trip</h4>
                    <p className="text-primary text-[9px] font-bold">Where should the Collective go next?</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">add_circle</span>
              </div>
            )}

            {MOCK_COMMUNITY_POSTS.map(post => (
              <TribePostCard key={post.id} post={post} onLike={() => {}} />
            ))}
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-white font-black text-xl italic tracking-tight">Trip Lab</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Pitch & Vote on Ventures</p>
               </div>
               <button 
                 onClick={() => setShowSuggestModal(true)}
                 className="bg-primary/10 text-primary p-2 rounded-xl border border-primary/20"
               >
                 <span className="material-symbols-outlined">add</span>
               </button>
            </div>
            
            <div className="space-y-4">
              {suggestions.map(sug => (
                <TripSuggestionCard 
                  key={sug.id} 
                  suggestion={sug} 
                  onVote={(dir) => handleVote(sug.id, dir)} 
                  onAddComment={(text) => handleAddCommentToSuggestion(sug.id, text)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ventures' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {community.upcomingTrips.length > 0 ? (
              community.upcomingTrips.map(trip => (
                <div 
                  key={trip.id} 
                  onClick={() => onSelectTrip(trip)}
                  className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all active:scale-98"
                >
                  <div className="flex gap-4 p-4">
                    <img src={trip.image} className="size-24 rounded-xl object-cover shrink-0 shadow-lg" alt="" />
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md self-start mb-2">Confirmed</div>
                      <h3 className="text-white font-bold text-base leading-tight mb-1">{trip.title}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        {trip.dates}
                      </div>
                      <p className="text-primary text-sm font-black mt-2">{trip.price}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="size-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <span className="material-symbols-outlined text-slate-500 text-3xl">event_busy</span>
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No active trips yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
              <h2 className="text-white text-lg font-black tracking-tight mb-3">Community Purpose</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {community.description}
              </p>
            </section>
            <section>
              <h2 className="text-white text-lg font-black tracking-tight mb-4">Top Contributors</h2>
              <div className="grid grid-cols-4 gap-4">
                {CONTRIBUTOR_IDS.map(i => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <img src={`https://picsum.photos/seed/member${i}/100/100`} className="size-14 rounded-full border-2 border-primary/20" alt="" />
                      <div className="absolute -bottom-1 -right-1 bg-primary size-5 rounded-full flex items-center justify-center border-2 border-background-dark shadow-sm">
                        <span className="material-symbols-outlined text-[8px] font-black text-background-dark">verified</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-black uppercase truncate w-16 text-center">User {i}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {showSuggestModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-background-dark w-full max-w-md rounded-t-[3rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined">rocket_launch</span>
                 </div>
                 <h2 className="text-2xl font-black text-white italic tracking-tight">Pitch Venture</h2>
               </div>
               <button onClick={() => setShowSuggestModal(false)} className="text-slate-600 hover:text-white p-2">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>

            <form onSubmit={handlePostSuggestion} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Destination</label>
                  <input type="text" required value={sugDest} onChange={e => setSugDest(e.target.value)} placeholder="e.g. Patagonia Peaks, Chile" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Budget level</label>
                    <select value={sugBudget} onChange={e => setSugBudget(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none appearance-none">
                       <option value="Eco">Eco ($)</option>
                       <option value="Mid">Mid ($$)</option>
                       <option value="Luxury">Luxury ($$$)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Duration</label>
                    <input type="text" required value={sugDuration} onChange={e => setSugDuration(e.target.value)} placeholder="e.g. 10 Days" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Trip Style</label>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                    {TRIP_STYLES.map(style => (
                      <button key={style} type="button" onClick={() => setSugStyle(style)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all shrink-0 ${sugStyle === style ? 'bg-primary border-primary text-background-dark' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Ingredients (Suggestions)</label>
                  <textarea value={sugIngredients} onChange={e => setSugIngredients(e.target.value)} rows={3} placeholder="Comma separated: Night camping, Village lunch, Group meditation..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none transition-all resize-none text-sm" />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Travelling From</label>
                  <input type="text" required value={sugFrom} onChange={e => setSugFrom(e.target.value)} placeholder="e.g. London, San Francisco..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3">
                Post to Planning Lab
                <span className="material-symbols-outlined font-black">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {isJoined && (
        <button 
          onClick={onOpenChat}
          className="fixed bottom-24 right-6 size-14 bg-emerald-500 text-background-dark rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.4)] flex items-center justify-center z-50 active:scale-90 transition-transform hover:scale-105"
        >
          <span className="material-symbols-outlined text-3xl font-black">forum</span>
        </button>
      )}
    </div>
  );
};

export default CommunityDetails;
