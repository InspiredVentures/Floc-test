
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityPost } from '../types';
import { useUser } from '../contexts/UserContext';
import { Feed } from '../components/Feed';

export const MOCK_GLOBAL_POSTS: CommunityPost[] = [
  {
    id: 'gp1',
    author: 'Elena Vance',
    authorAvatar: 'https://picsum.photos/seed/elena/100/100',
    communityName: 'Eva Community',
    role: 'Guide',
    content: "Just returned from the scouting trip to Uganda. The connection with the local community is stronger than ever. Can't wait for the February group! 🦍🌿",
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=800&q=80',
    likes: 156,
    hasLiked: true,
    comments: [{ id: 'c1', user: 'Mike', avatar: 'https://picsum.photos/seed/mike/100/100', text: "Counting down the days!", time: "5m ago" }],
    time: '20m ago',
    timestamp: Date.now() - 1200000
  },
  {
    id: 'gp2',
    author: 'Alex Sterling',
    authorAvatar: 'https://picsum.photos/seed/alex/100/100',
    communityName: 'Borneo Planning',
    role: 'Member',
    content: "Does anyone have recommendations for lightweight hiking boots for the Borneo humidity? Preparing my gear list! 🥾",
    image: 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?auto=format&fit=crop&q=80&w=800',
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
    communityName: 'Eva Community',
    role: 'Member',
    content: "The impact report from last year's Tanzania trip is out. 1200 trees planted and a new community center funded. Proud to be part of this. 🌍❤️",
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    likes: 1204,
    hasLiked: false,
    comments: [
      { id: 'c2', user: 'Lara', avatar: 'https://picsum.photos/seed/lara/100/100', text: "Incredible work!", time: "10m ago" },
      { id: 'c3', user: 'Kai', avatar: 'https://picsum.photos/seed/kai/100/100', text: "This is why we travel.", time: "2m ago" }
    ],
    time: '4h ago',
    timestamp: Date.now() - 14400000
  },
  {
    id: 'gp5',
    author: 'Leo Valdez',
    authorAvatar: 'https://picsum.photos/seed/leo/100/100',
    communityName: 'Bhutan Planning',
    role: 'Guide',
    content: "Meditating on the Tiger's Nest itinerary. We might add a special sunrise session. Thoughts? 🧘‍♂️🏔️",
    image: 'https://images.unsplash.com/photo-1578513304533-35619550cedc?auto=format&fit=crop&w=800&q=80',
    likes: 88,
    hasLiked: false,
    comments: [],
    time: '2h ago',
    timestamp: Date.now() - 7200000
  }
];

const SEARCHABLE_POSTS = MOCK_GLOBAL_POSTS.map(post => ({
  original: post,
  searchContent: post.content.toLowerCase(),
  searchAuthor: post.author.toLowerCase(),
  searchCommunity: post.communityName?.toLowerCase() || ''
}));

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
    return SEARCHABLE_POSTS.filter(p =>
      p.searchContent.includes(q) ||
      p.searchAuthor.includes(q) ||
      p.searchCommunity.includes(q)
    ).map(p => p.original);
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
