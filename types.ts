
export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DISCOVERY = 'DISCOVERY',
  TRIP_DETAILS = 'TRIP_DETAILS',
  DASHBOARD = 'DASHBOARD',
  MY_TRIPS = 'MY_TRIPS',
  IMPACT = 'IMPACT',
  PROFILE = 'PROFILE',
  CHAT = 'CHAT',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SETTINGS = 'SETTINGS',
  BOOKING_SUCCESS = 'BOOKING_SUCCESS'
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

export interface ImpactStats {
  co2Offset: string;
  trees: string;
  localSupport: number;
  plasticFree: string;
  wildlifeFunding: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
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
