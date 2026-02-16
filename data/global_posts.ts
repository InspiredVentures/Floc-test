import { CommunityPost } from '../types';

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
