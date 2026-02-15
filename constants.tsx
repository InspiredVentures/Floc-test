import React from 'react';
import { Trip, Community } from './types';
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
    image: 'https://images.unsplash.com/photo-1580974844145-298a8570094d?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://static.wixstatic.com/media/nsplsh_6237684246574f4f703273~mv2.jpg',
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
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
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
    image: "https://images.unsplash.com/photo-1578513304533-35619550cedc?auto=format&fit=crop&w=800&q=80",
    memberCount: "78",
    category: "Planning",
    upcomingTrips: MOCK_TRIPS.filter(t => t.id === 'bhutan'),
    accessType: 'free'
  }
];
