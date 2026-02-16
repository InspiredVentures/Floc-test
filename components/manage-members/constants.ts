import { UserRole, PendingMember, Permission } from './types';

export const PERMISSIONS: Permission[] = [
  { id: 'settings', icon: 'admin_panel_settings', label: 'Community Settings', description: 'Modify community name, branding, and visibility.' },
  { id: 'edit', icon: 'edit_square', label: 'Edit Ventures', description: 'Create, modify, and cancel tribe trips.' },
  { id: 'manage', icon: 'group_add', label: 'Manage Roster', description: 'Approve applicants and adjust member roles.' },
  { id: 'delete', icon: 'delete_forever', label: 'Dissolve Community', description: 'Permanently remove the community from the network.' },
];

export const ROLE_DEFAULTS: Record<UserRole, {
  color: string;
  badge: string;
  permissions: string[];
  desc: string;
}> = {
  'Owner': {
    color: 'text-primary border-primary/30 bg-primary/10',
    badge: 'bg-primary text-background-dark',
    permissions: ['settings', 'edit', 'manage', 'delete'],
    desc: 'Community Owner'
  },
  'Admin': {
    color: 'text-primary border-primary/30 bg-primary/10',
    badge: 'bg-primary text-background-dark',
    permissions: ['settings', 'edit', 'manage', 'delete'],
    desc: 'Founding member with absolute authority over Community operations.'
  },
  'Co-Leader': {
    color: 'text-primary border-primary/30 bg-primary/10',
    badge: 'bg-primary text-white',
    permissions: ['edit', 'manage'],
    desc: 'Trusted partner who can modify ventures and approve members.'
  },
  'Member': {
    color: 'text-slate-400 border-white/10 bg-white/5',
    badge: 'bg-slate-700 text-white',
    permissions: [],
    desc: 'Standard member with access to chats, voting, and the venture timeline.'
  },
};

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Eco': ['eco', 'sustainability', 'green', 'conservation', 'nature', 'planet', 'ocean'],
  'Adventure': ['hike', 'trek', 'climb', 'expedition', 'adventure', 'mountain', 'wilderness'],
  'Social': ['community', 'meet', 'people', 'share', 'connect', 'group', 'together'],
  'Creative': ['photography', 'camera', 'photo', 'guide', 'skill', 'storyteller', 'content'],
};

export const MOCK_PENDING: PendingMember[] = [
  { id: 'p1', name: "Marcus Aurelius", avatar: "https://picsum.photos/seed/mar/100/100", reason: "Passionate about ocean conservation and eco-travel. I want to help with the beach cleanups!", timestamp: "2h ago", category: 'Eco' },
  { id: 'p2', name: "Sophie Turner", avatar: "https://picsum.photos/seed/sop/100/100", reason: "Looking to travel with purpose. I'm an avid trekker and mountain lover.", timestamp: "5h ago", category: 'Adventure' },
  { id: 'p3', name: "David Chen", avatar: "https://picsum.photos/seed/dav/100/100", reason: "Professional photographer looking for a tribe to capture sustainable adventures with.", timestamp: "1d ago", category: 'Creative' },
];
