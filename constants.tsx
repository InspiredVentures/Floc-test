
import React from 'react';
import { Trip, ImpactStats } from './types';

export const COLORS = {
  primary: '#13ec5b',
  teal: '#008080',
  orange: '#FF6B35',
  dark: '#102216'
};

export const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    title: 'Safari in Kenya',
    destination: 'Masai Mara, Kenya',
    dates: 'Oct 12 — 20, 2024',
    price: '$1,200',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBewW3QzZfN7xjdfZkiGacUSnK1PR7rdz4zNqOCEDtbq_m99hWhZXTphnwuXs9W_RwvxLI01stVkKdZikkinQyStd5IbPeI_HY2gfd8qzL7dPoPaV_NmqSu-BrdPSRA-l6UhxzlwdycMCj3ppiuSu_tdwTtrnPHzhIqQUGWLZd0ORn6GDE9L0t3kQrdDGgEZ66Fu6RNXJdgH5qbw5G-qYrvrW_-aQ1K-epdDcuiAGu59cTmZheTJF5vXyZJaiSOWAQFNRyQMUJiTjUH',
    status: 'CONFIRMED',
    membersCount: 12
  },
  {
    id: '2',
    title: 'Tokyo Foodies',
    destination: 'Tokyo, Japan',
    dates: 'Nov 05 — 12, 2024',
    price: '$2,450',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVLW6ozU1hwIy7LPckvWIeunUw-BMnkM8WSEeE5j_lNew8wkRLYV3u6DvPmMqUHRupm-bCBI6_HGfKed6spdxOxGI-nAzyiJ2gTEzHbIbsHC8ndHDqFqYZZ6CowxwrIH3XPw9xVTwcsuCRV7okKcfqS-5WlZ0E8Btc1sIo4WbSYGPM4drTulVKfVAfxPuNbAbCXvZberDvBom9wr7vm9wjV-XoWgoTSlKPR3i_IuPoIuhSvV32hnzifvQQFEdIS6hUcbd8953Rh0vf',
    status: 'PLANNING',
    membersCount: 15
  }
];

export const MOCK_IMPACT: ImpactStats = {
  co2Offset: '14.2t',
  trees: '1,240',
  localSupport: 85,
  plasticFree: '18/21',
  wildlifeFunding: 4500
};
