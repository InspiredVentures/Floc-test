
import React from 'react';
import { Trip } from './types';

export const COLORS = {
  primary: '#FF6B35',
  teal: '#008080',
  orange: '#FF6B35',
  dark: '#160D08'
};

export const MOCK_IMPACT = {
  co2Offset: '4.2 Tons',
  trees: '128'
};

export const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    title: 'Safari in Kenya',
    destination: 'Masai Mara, Kenya',
    dates: 'Oct 12 — 20, 2024',
    price: '$1,200',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    status: 'CONFIRMED',
    membersCount: 12
  },
  {
    id: '2',
    title: 'Tokyo Foodies',
    destination: 'Tokyo, Japan',
    dates: 'Nov 05 — 12, 2024',
    price: '$2,450',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    status: 'PLANNING',
    membersCount: 15
  },
  {
    id: '3',
    title: 'Kilimanjaro Summit',
    destination: 'Tanzania',
    dates: 'Jan 15 — 24, 2025',
    price: '$3,800',
    image: 'https://images.unsplash.com/photo-1589197331516-4d83015f8d67?auto=format&fit=crop&w=800&q=80',
    status: 'PLANNING',
    membersCount: 8
  },
  {
    id: '4',
    title: 'The Lost City Trek',
    destination: 'Colombia',
    dates: 'Dec 02 — 10, 2024',
    price: '$1,850',
    image: 'https://images.unsplash.com/photo-1583531352515-88841314dd95?auto=format&fit=crop&w=800&q=80',
    status: 'CONFIRMED',
    membersCount: 14
  },
  {
    id: '5',
    title: 'Jordan Discovery',
    destination: 'Petra & Wadi Rum',
    dates: 'Mar 10 — 18, 2025',
    price: '$2,100',
    image: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=800&q=80',
    status: 'PLANNING',
    membersCount: 10
  }
];
