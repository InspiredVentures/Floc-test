import { Trip } from '../types';
import { WETRAVEL_SOURCE_TRIPS } from '../data/source_trips';

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

export const getTripsForCommunity = (communityId: string) => {
  return MOCK_TRIPS.filter(t => t.communityId === communityId);
};
