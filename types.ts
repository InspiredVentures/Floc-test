
export enum AppView {
  LOGIN = 'LOGIN',
  ONBOARDING = 'ONBOARDING',
  DISCOVERY = 'DISCOVERY',
  ALL_COMMUNITIES = 'ALL_COMMUNITIES',
  TRIP_DETAILS = 'TRIP_DETAILS',
  COMMUNITY_DETAILS = 'COMMUNITY_DETAILS',
  JOIN_REQUEST = 'JOIN_REQUEST',
  DASHBOARD = 'DASHBOARD',
  CREATE_VENTURE = 'CREATE_VENTURE',
  CREATE_COMMUNITY = 'CREATE_COMMUNITY',
  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  MY_COMMUNITIES = 'MY_COMMUNITIES',
  GLOBAL_FEED = 'GLOBAL_FEED',
  PROFILE = 'PROFILE',
  CHAT = 'CHAT',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SETTINGS = 'SETTINGS',
  BOOKING_SUCCESS = 'BOOKING_SUCCESS',
  LEADER_SUPPORT = 'LEADER_SUPPORT',
  IMPACT_GUIDE = 'IMPACT_GUIDE',
  PROTOCOL_VIEWER = 'PROTOCOL_VIEWER',
  BILLING_CENTER = 'BILLING_CENTER',
  ANALYTICS_API = 'ANALYTICS_API',
  IMPACT = 'IMPACT'
}

export interface Member {
  id: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Co-Leader' | 'Member';
  avatar: string;
  location: string;
  joinedDate: string;
  customPermissions?: string[];
  status?: 'approved' | 'pending' | 'rejected' | 'banned';
  email?: string;
  isContactable?: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image?: string;
  month: string;
  day: string;
  isAttending?: boolean;
}

export interface CommunityResource {
  id: string;
  title: string;
  type: string;
  size?: string;
  url: string;
  icon: string;
  downloadCount?: number;
}

export interface PendingMember {
  id: string;
  name: string;
  avatar: string;
  reason: string;
  timestamp: string;
  category: string;
}

export interface Community {
  id: string;
  title: string;
  meta: string;
  description: string;
  image: string;
  memberCount: string;
  category: string;
  upcomingTrips: Trip[];
  accessType: 'free' | 'request';
  unreadCount?: number;
  isManaged?: boolean;
  members?: Member[];
  pendingMembers?: PendingMember[];
  declinedMembers?: PendingMember[];
  entryQuestions?: string[];
  enabledFeatures?: string[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  dates: string;
  price: string;
  image: string;
  status: 'CONFIRMED' | 'PLANNING' | 'DRAFT';
  membersCount: number;
  communityId?: string;
  wetravelId?: string; // To link back to source
}

export interface TripSuggestion {
  id: string;
  destination: string;
  budget: 'Eco' | 'Mid' | 'Luxury';
  style: string;
  duration: string;
  ingredients: string[];
  travelFrom: string;
  suggestedBy: string;
  avatar: string;
  votes: number;
  myVote: 'up' | 'down' | null;
  timestamp: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId?: string; // Optional for group chats
  content: string;
  timestamp: number;
  read: boolean;
  isMe?: boolean; // Optional, can be derived
  status?: 'sent' | 'delivered' | 'read';
  sources?: { title: string; uri: string }[];
  suggestion?: TripSuggestion;
}

export interface CommunityComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorAvatar: string;
  communityName?: string;
  role?: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  hasLiked: boolean;
  comments: { id: string; user: string; avatar: string; text: string; time: string }[];
  time: string;
  timestamp?: number;
  suggestion?: TripSuggestion;
  communityId?: string;
  isPinned?: boolean;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio?: string;
  location?: string;
  role?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  location?: string;
  joinedDate: string;
  isOnline?: boolean;
  lastSeen?: string;
  stats: {
    trips: number;
    communities: number;
    followers: number;
    following: number;
  };
}

// DirectMessage is deprecated in favor of unified Message
export type DirectMessage = Message;

export interface Conversation {
  id: string;
  participants: string[];  // usernames
  participantDetails: {
    username: string;
    displayName: string;
    avatar: string;
    isOnline?: boolean;
    isTyping?: boolean;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  type?: 'direct' | 'group';
  title?: string; // For group chats
}


export interface AppNotification {
  id: string;
  type: 'TRIP' | 'CHAT' | 'SUGGESTION';
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  relatedId?: string;
  relatedType?: 'trip' | 'community';
}

export interface NotificationPreferences {
  tripUpdates: boolean;
  chatMessages: boolean;
  communitySuggestions: boolean;
  marketingEmails: boolean;
}
