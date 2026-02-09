
import React, { useState } from 'react';
import { Community, Trip, TribePost, TribeComment } from '../types';

interface Props {
  community: Community;
  onBack: () => void;
  onSelectTrip: (trip: Trip) => void;
  onJoin: (community: Community) => void;
  onOpenChat?: () => void;
}

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

const CommunityDetails: React.FC<Props> = ({ community, onBack, onSelectTrip, onJoin, onOpenChat }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'ventures' | 'about'>('feed');
  const [isJoined, setIsJoined] = useState(false); // Simulated state for UI demo

  const handleJoinClick = () => {
    if (community.accessType === 'free') {
      setIsJoined(true);
    }
    onJoin(community);
  };

  const tabLabels: Record<string, string> = {
    feed: 'feed',
    ventures: 'Travel with us',
    about: 'about'
  };

  return (
    <div className="flex flex-col min-h-full bg-background-dark relative">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
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
            {community.accessType === 'request' ? 'Request Access' : 'Join Tribe'}
          </button>
        ) : (
          <button 
            onClick={onOpenChat}
            className="flex-1 bg-emerald-500 text-background-dark font-black py-4 rounded-2xl text-sm shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">forum</span>
            Open Tribe Chat
          </button>
        )}
      </div>

      <div className="flex px-6 mt-8 border-b border-white/5">
        {(['feed', 'ventures', 'about'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? 'text-primary' : 'text-slate-500'
            }`}
          >
            {tabLabels[tab]}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in zoom-in duration-300"></div>
            )}
          </button>
        ))}
      </div>

      <main className="px-6 py-6 pb-32">
        {activeTab === 'feed' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Live Chat Banner */}
            {isJoined && (
              <div 
                onClick={onOpenChat}
                className="bg-gradient-to-r from-emerald-500/20 to-emerald-900/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer group hover:bg-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    <span className="material-symbols-outlined text-background-dark font-black">chat_bubble</span>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-widest">Live Messaging</h4>
                    <p className="text-emerald-400 text-[10px] font-bold">42 members chatting now</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-emerald-500 group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
              </div>
            )}

            {MOCK_COMMUNITY_POSTS.map(post => (
              <TribePostCard key={post.id} post={post} onLike={() => {}} />
            ))}
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
              <h2 className="text-white text-lg font-black tracking-tight mb-3">Tribe Purpose</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {community.description}
              </p>
            </section>
            
            <section>
              <h2 className="text-white text-lg font-black tracking-tight mb-4">Top Contributors</h2>
              <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
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

      {/* Floating Chat Button for quick access */}
      {isJoined && (
        <button 
          onClick={onOpenChat}
          className="fixed bottom-24 right-6 size-14 bg-emerald-500 text-background-dark rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.4)] flex items-center justify-center z-50 active:scale-90 transition-transform hover:scale-105"
        >
          <span className="material-symbols-outlined text-3xl font-black">forum</span>
          <div className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full border-2 border-background-dark flex items-center justify-center">
            <span className="text-[8px] font-black text-white">3</span>
          </div>
        </button>
      )}
    </div>
  );
};

const TribePostCard: React.FC<{ post: TribePost; onLike: () => void }> = ({ post, onLike }) => {
  const [showComments, setShowComments] = useState(false);
  
  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={post.authorAvatar} className="size-10 rounded-full object-cover border-2 border-white/10" alt="" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-white font-black text-sm">{post.author}</h4>
                <span className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">
                  {post.role}
                </span>
              </div>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{post.time}</p>
            </div>
          </div>
          <button className="text-slate-600 hover:text-white p-2 transition-colors">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        <p className="text-white text-sm leading-relaxed mb-4">{post.content}</p>

        {post.image && (
          <div className="rounded-2xl overflow-hidden mb-4 aspect-video relative shadow-lg">
            <img src={post.image} className="w-full h-full object-cover" alt="Post attachment" />
          </div>
        )}

        <div className="flex items-center gap-6">
          <button className={`flex items-center gap-2 transition-all ${post.hasLiked ? 'text-primary' : 'text-slate-500 hover:text-white'}`}>
            <span className={`material-symbols-outlined text-xl ${post.hasLiked ? 'fill-1' : ''}`}>favorite</span>
            <span className="text-xs font-black">{post.likes}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-xl">forum</span>
            <span className="text-xs font-black">{post.comments.length}</span>
          </button>
          <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-all ml-auto">
            <span className="material-symbols-outlined text-xl">share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetails;
