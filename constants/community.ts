
import { Category, Theme } from '../types';

export const COMMUNITY_THEMES: Theme[] = [
  { id: 'nature', label: 'Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80' },
  { id: 'city', label: 'Urban', url: 'https://images.unsplash.com/photo-1449156001933-468b7bb2596a?auto=format&fit=crop&w=400&q=80' },
  { id: 'ocean', label: 'Ocean', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
  { id: 'mountain', label: 'Alpine', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' },
];

export const COMMUNITY_CATEGORIES: Category[] = [
  { id: 'Photography', label: 'Photography', icon: 'photo_camera' },
  { id: 'Adventure', label: 'Adventure', icon: 'landscape' },
  { id: 'Eco-Travel', label: 'Eco-Travel', icon: 'eco' },
  { id: 'Expedition', label: 'Expedition', icon: 'explore' },
  { id: 'Wellness', label: 'Wellness', icon: 'spa' },
  { id: 'Culinary', label: 'Culinary', icon: 'restaurant' },
  { id: 'Digital Nomad', label: 'Digital Nomad', icon: 'laptop_mac' },
  { id: 'Social', label: 'Social', icon: 'group' },
  { id: 'Cultural', label: 'Cultural', icon: 'museum' },
];

export const CREATE_COMMUNITY_CATEGORIES = ['Photography', 'Eco-Travel', 'Expedition', 'Culinary', 'Wellness', 'Digital Nomad'];

export const ALL_COMMUNITIES_CATEGORIES = ['All', 'Adventure', 'Wellness', 'Eco-Travel', 'Culinary', 'Expedition', 'Social'];

export const DISCOVERY_CATEGORIES: Category[] = [
  { id: 'all', label: 'All', icon: 'grid_view' },
  { id: 'Photography', label: 'Photography', icon: 'photo_camera' },
  { id: 'Adventure', label: 'Adventure', icon: 'landscape' },
  { id: 'Eco-Travel', label: 'Sustainability', icon: 'eco' },
  { id: 'Expedition', label: 'Expedition', icon: 'explore' },
  { id: 'Wellness', label: 'Wellness', icon: 'spa' },
  { id: 'Cultural', label: 'Cultural', icon: 'museum' }
];
