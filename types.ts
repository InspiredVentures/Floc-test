
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
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status?: 'sent' | 'delivered' | 'read';
  sources?: { title: string; uri: string }[];
  suggestion?: TripSuggestion;
}

export interface TribeComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export interface TribePost {
  id: string;
  author: string;
  authorAvatar: string;
  role: 'Manager' | 'Guide' | 'Member';
  content: string;
  image?: string;
  video?: string;
  likes: number;
  hasLiked: boolean;
  comments: TribeComment[];
  time: string;
  timestamp?: number;
  tribeName?: string;
  suggestion?: TripSuggestion;
}

export interface AppNotification {
  id: string;
  type: 'TRIP' | 'CHAT' | 'SUGGESTION';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedId?: string;
}

export interface NotificationPreferences {
  tripUpdates: boolean;
  chatMessages: boolean;
  communitySuggestions: boolean;
  marketingEmails: boolean;
}
