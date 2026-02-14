
import { Trip } from '../types';

/**
 * MANUAL WETRAVEL DATA IMPORT
 * 
 * Instructions:
 * 1. Open your WeTravel Dashboard > Manage Trip
 * 2. Copy the details into a new object below
 * 3. Use the 'communityId' field to link it to a specific tribe (found in your URL or constants.ts)
 */

export const WETRAVEL_SOURCE_TRIPS: Trip[] = [
    // Example Manual Entry from WeTravel
    /*
    {
      id: 'wetravel-import-001',
      wetravelId: '123456',
      title: 'Yoga Retreat in Bali',
      destination: 'Ubud, Bali',
      dates: 'Aug 10 - 17, 2025',
      price: '$1,500',
      image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80',
      status: 'PLANNING',
      membersCount: 0,
      communityId: 'c1' // Matches 'Parisian Flâneurs' in constants.ts (just as an example)
    },
    */
];
