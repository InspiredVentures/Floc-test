export type UserRole = 'Owner' | 'Admin' | 'Co-Leader' | 'Member';

export interface Permission {
  id: string;
  icon: string;
  label: string;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  location: string;
  joinedDate: string;
  customPermissions?: string[];
}

export interface PendingMember {
  id: string;
  name: string;
  avatar: string;
  reason: string;
  timestamp: string;
  category: 'Eco' | 'Adventure' | 'Social' | 'Creative' | 'General';
}

export interface Invitation {
  id: string;
  email: string;
  inviteCode: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: 'approved' | 'declined' | 'removed' | 'roleChanged' | 'permissionUpdated';
  actor: string; // User who performed the action
  target: string; // User affected by the action
  details?: string; // Additional context
}
