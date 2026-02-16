import { Community } from '../types';
import { MOCK_TRIPS } from './trips';

export const COMMUNITY_FILTERS = ['All', 'Planning', 'Confirmed', 'Global'];

export const COMMUNITY_TOPICS = ['Adventure', 'Eco-Travel', 'Wellness', 'Photography', 'Cultural', 'Trip', 'Digital Nomad'];

export const DISCOVERY_FILTERS = [
  { id: 'all', label: 'All', icon: 'grid_view' },
  { id: 'my-tribes', label: 'My Groups', icon: 'groups' },
  { id: 'Planning', label: 'Planning', icon: 'campaign' },
  { id: 'Confirmed', label: 'Confirmed', icon: 'check_circle' },
  { id: 'Global', label: 'Global', icon: 'public' }
];

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
