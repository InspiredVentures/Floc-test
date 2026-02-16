import React from 'react';
import { Trip, Community, CommunityPost } from './types';
import { WETRAVEL_SOURCE_TRIPS } from './data/source_trips';

export const COLORS = {
  primary: '#14532D', // EVA Forest Green
  teal: '#008080',
  accent: '#007FFF', // Sapphire Blue
  dark: '#160D08'
};

export const MOCK_IMPACT = {
  co2Offset: '4.2 Tons',
  trees: '128'
};

const STATIC_TRIPS: Trip[] = [
  {
    id: 'uganda-rwanda',
    title: 'Uganda & Rwanda',
    destination: 'Uganda & Rwanda',
    dates: 'Feb 15 — 22, 2026',
    price: '£3,850',
    image: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=800&q=80',
    status: 'PLANNING',
    membersCount: 8,
    communityId: 'uganda-planning'
  },
  {
    id: 'borneo',
    title: 'The Safari Journey',
    destination: 'Borneo',
    dates: 'Oct 12 — 20, 2026',
    price: '£2,450',
    image: '/images/eva/whale-shark-hero.jpg',
    status: 'PLANNING',
    membersCount: 15,
    communityId: 'borneo-planning'
  },
  {
    id: 'bhutan',
    title: 'Bhutanese Mindfulness',
    destination: 'Bhutan',
    dates: 'May 10 — 18, 2026',
    price: '£4,200',
    image: '/images/trips/bhutan-tigers-nest.jpg',
    status: 'PLANNING',
    membersCount: 5,
    communityId: 'bhutan-planning'
  },
  {
    id: 'cambodia',
    title: 'The Mobility Project',
    destination: 'Cambodia',
    dates: 'Sep 05 — 12, 2026',
    price: '£1,850',
    image: 'https://static.wixstatic.com/media/06d336_485946e67c73434cb08e4828035f0f50~mv2.jpg',
    status: 'PLANNING',
    membersCount: 12,
    communityId: 'cambodia-planning'
  },
  {
    id: 'nepal',
    title: 'Nepal Tiger Tracking',
    destination: 'Nepal',
    dates: 'Nov 12 — 20, 2026',
    price: '£2,100',
    image: '/images/trips/nepal-tiger.avif',
    status: 'PLANNING',
    membersCount: 10,
    communityId: 'nepal-planning'
  },
  {
    id: 'tanzania',
    title: 'Tanzania Kinship',
    destination: 'Tanzania',
    dates: 'Aug 10 - 17, 2026',
    price: '£2,200',
    image: 'https://static.wixstatic.com/media/0c1e44_4ace85639fbf4bc4add08bf2e38d52ba~mv2.jpg',
    status: 'PLANNING',
    membersCount: 18,
    communityId: 'tanzania-planning'
  },
  {
    id: 'morocco',
    title: 'Atlas Range Ascent',
    destination: 'Morocco',
    dates: 'Mar 10 — 18, 2026',
    price: '£1,950',
    image: '/images/eva/living-mountain-hero.jpg',
    status: 'PLANNING',
    membersCount: 14,
    communityId: 'morocco-planning'
  }
];

export const MOCK_TRIPS: Trip[] = [...STATIC_TRIPS, ...WETRAVEL_SOURCE_TRIPS];

const getTripsForCommunity = (communityId: string) => {
  return MOCK_TRIPS.filter(t => t.communityId === communityId);
};

export const MOCK_COMMUNITIES: Community[] = [
  // GLOBAL
  {
    id: 'eva-global',
    title: "EVA Community",
    meta: "Global Feed • 4.2k members",
    description: "The main home for the EVA community. Share your journey stories, impact updates, and connect with fellow travellers.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    memberCount: "4.2k",
    category: "Global",
    upcomingTrips: [],
    accessType: 'free'
  },
  // UGANDA
  {
    id: 'uganda-planning',
    title: "Thinking about Uganda & Rwanda",
    meta: "Planning Group • 124 interested",
    description: "Connect with others curious about the Gorillas & Chimps journey. Ask questions and plan together.",
    image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=800&q=80",
    memberCount: "124",
    category: "Planning",
    upcomingTrips: MOCK_TRIPS.filter(t => t.id === 'uganda-rwanda'),
    accessType: 'free',
    isManaged: true
  },
  {
    id: 'uganda-confirmed',
    title: "Uganda & Rwanda | Feb 2026",
    meta: "Confirmed Group • 8 joining",
    description: "The private group for confirmed travellers on the February 2026 journey.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    memberCount: "8",
    category: "Confirmed",
    upcomingTrips: MOCK_TRIPS.filter(t => t.id === 'uganda-rwanda'),
    accessType: 'request'
  },
  // BORNEO
  {
    id: 'borneo-planning',
    title: "Thinking about Borneo",
    meta: "Planning Group • 245 interested",
    description: "Discuss the Pygmy Elephant journey and meet potential travel mates.",
    image: "https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?auto=format&fit=crop&q=80&w=800",
    memberCount: "245",
    category: "Planning",
    upcomingTrips: MOCK_TRIPS.filter(t => t.id === 'borneo'),
    accessType: 'free',
    isManaged: true
  },
  {
    id: 'borneo-confirmed',
    title: "Borneo | Oct 2026",
    meta: "Confirmed Group • 15 joining",
    description: "Private chat for the October 2026 Borneo team.",
    image: "https://images.unsplash.com/photo-1512100356956-c1b47efeb116?auto=format&fit=crop&w=800&q=80",
    memberCount: "15",
    category: "Confirmed",
    upcomingTrips: MOCK_TRIPS.filter(t => t.id === 'borneo'),
    accessType: 'request'
  },
  // NEPAL
  {
    id: 'nepal-planning',
    title: "Thinking about Nepal",
    meta: "Planning Group • 186 interested",
    description: "Connect with others interested in the Tiger Tracking journey.",
    image: "/images/trips/nepal-tiger.jpg",
    memberCount: "186",
    category: "Planning",
    upcomingTrips: MOCK_TRIPS.filter(t => t.id === 'nepal'),
    accessType: 'free'
  },
  // CAMBODIA
  {
    id: 'cambodia-planning',
    title: "Thinking about Cambodia",
    meta: "Planning Group • 112 interested",
    description: "Discuss the Mobility Project and wheelchair building in Cambodia.",
    image: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=800&q=80",
    memberCount: "112",
    category: "Planning",
    upcomingTrips: MOCK_TRIPS.filter(t => t.id === 'cambodia'),
    accessType: 'free'
  },
  // TANZANIA
  {
    id: 'tanzania-planning',
    title: "Thinking about Tanzania",
    meta: "Planning Group • 98 interested",
    description: "Plan your Kinship Journey to Arusha with others.",
    image: "https://images.unsplash.com/photo-1489914169085-9b54fdd8f2a2?auto=format&fit=crop&w=800&q=80",
    memberCount: "98",
    category: "Planning",
    upcomingTrips: MOCK_TRIPS.filter(t => t.id === 'tanzania'),
    accessType: 'free'
  },
  // MOROCCO
  {
    id: 'morocco-planning',
    title: "Thinking about Morocco",
    meta: "Planning Group • 154 interested",
    description: "Discuss the High Atlas restoration journey and impact goals.",
    image: "https://images.unsplash.com/photo-1539020290231-9584fd1720d2?auto=format&fit=crop&w=800&q=80",
    memberCount: "154",
    category: "Planning",
    upcomingTrips: MOCK_TRIPS.filter(t => t.id === 'morocco'),
    accessType: 'free'
  },
  // BHUTAN
  {
    id: 'bhutan-planning',
    title: "Thinking about Bhutan",
    meta: "Planning Group • 78 interested",
    description: "Explore the Bhutanese Mindfulness journey and connect with interested travellers.",
    image: "/images/trips/bhutan-tigers-nest.jpg",
    memberCount: "78",
    category: "Planning",
    upcomingTrips: MOCK_TRIPS.filter(t => t.id === 'bhutan'),
    accessType: 'free'
  }
];

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
