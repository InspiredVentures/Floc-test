import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { supabaseService } from '../services/supabaseService';
import { communityService } from '../services/communityService';
import { MOCK_COMMUNITIES } from '../constants';
import { Community, DirectMessage, Conversation, Member, AppNotification, Message, Profile } from '../types';

interface UserContextType {
    user: User | null;
    profile: Profile | null; // Use the interface from types
    isLoading: boolean;
    joinedCommunityIds: string[];
    bookedTripIds: string[];
    communities: Community[];
    followingUsernames: string[];
    conversations: Conversation[];
    messages: DirectMessage[];
    notifications: AppNotification[];
    joinCommunity: (id: string) => void;
    leaveCommunity: (id: string) => void;
    createCommunity: (data: Omit<Community, 'id' | 'memberCount' | 'upcomingTrips'>) => Promise<Community | undefined>;
    bookTrip: (id: string) => void;
    followUser: (username: string) => void;
    unfollowUser: (username: string) => void;
    isFollowing: (username: string) => boolean;
    sendMessage: (recipientId: string, recipientName: string, recipientAvatar: string, content: string, conversationId?: string, type?: 'direct' | 'group') => void;
    addMessage: (conversationId: string, senderId: string, senderName: string, senderAvatar: string, content: string) => void;
    markAsRead: (conversationId: string) => void;
    getConversation: (participantUsername: string) => Conversation | undefined;
    getTotalUnreadCount: () => number;
    isMember: (id: string) => boolean;
    isBooked: (id: string) => boolean;
    approveMember: (communityId: string, memberId: string) => void;
    declineMember: (communityId: string, memberId: string) => void;
    removeMember: (communityId: string, memberId: string) => void;
    updateMemberRole: (communityId: string, memberId: string, role: Member['role'], permissions?: string[]) => void;
    updateCommunity: (id: string, updates: Partial<Community>) => void;
    deleteCommunity: (id: string) => Promise<void>;
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
    markNotificationsAsRead: () => void;
    deleteNotification: (id: string) => void;
    setTypingStatus: (conversationId: string, isTyping: boolean) => void;
    updatePresence: (username: string, isOnline: boolean) => void;
    refreshProfile: () => Promise<void>;
    debugLogin: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize with some default joined communities for demo purposes
    // Initialize with some default joined communities for demo purposes
    const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>(['1', 'c1']);

    // Load booked trips from localStorage on mount
    const [bookedTripIds, setBookedTripIds] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('floc_booked_trips');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load booked trips from localStorage:', e);
        }
        return [];
    });

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // 1. Try to get Real User from Supabase
                const { user, profile } = await authService.getCurrentUser() || {};

                if (user) {
                    setUser(user);
                    setProfile(profile as Profile || null);
                } else {
                    // 2. Fallback: Check for Persistent Mock User in LocalStorage
                    const storedMockUser = localStorage.getItem('mock_user');
                    const storedMockProfile = localStorage.getItem('mock_profile');
                    if (storedMockUser && storedMockProfile) {
                        console.log('[UserContext] Restoring Mock User from LocalStorage');
                        // alert("DEBUG: Restoring Mock Session!"); 
                        setUser(JSON.parse(storedMockUser));
                        setProfile(JSON.parse(storedMockProfile));

                        // REFACTORED: Derive joined IDs immediately when restoring mock user
                        const storedMockCommunities = localStorage.getItem('mock_communities');
                        if (storedMockCommunities) {
                            try {
                                const parsed = JSON.parse(storedMockCommunities);
                                const mockIds = parsed
                                    .filter((c: any) => c.members?.some((m: any) => m.id === 'dev-user-id'))
                                    .map((c: any) => c.id);
                                console.log('[UserContext] InitAuth: Derived joined IDs from storage:', mockIds);

                                if (mockIds.length === 0 && parsed.length > 0) {
                                    console.warn('[UserContext] InitAuth: No joined IDs found (or check failed), defaulting to ALL mock communities.');
                                    const allIds = parsed.map((c: any) => c.id);
                                    setJoinedCommunityIds(allIds);
                                } else {
                                    setJoinedCommunityIds(mockIds);
                                }
                            } catch (e) {
                                console.error('[UserContext] Error parsing mock communities for joined IDs:', e);
                                // Fallback: If calculation fails, show ALL mock communities so user sees something
                                const parsed = JSON.parse(storedMockCommunities); // Re-parse safely? No, simple fallback
                                if (parsed && Array.isArray(parsed)) {
                                    setJoinedCommunityIds(parsed.map((c: any) => c.id));
                                } else {
                                    setJoinedCommunityIds([]);
                                }
                            }
                        }
                    } else {
                        setUser(null);
                        setProfile(null);
                    }
                }

                // Load joined communities (redundant logic removed)
                // The main joined logic is now handled in the mock restoration block above.
            } catch (error) {
                console.error('[UserContext] Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // Listen for Auth Changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                // Protect Mock Session from being cleared by Supabase's lack of session
                const storedMockUser = localStorage.getItem('mock_user');
                if (storedMockUser) {
                    console.log('[UserContext] Supabase SIGNED_OUT, but Mock Session exists. Ignoring.');
                    return;
                }

                setUser(null);
                setProfile(null);
                setJoinedCommunityIds([]);
            } else if (event === 'SIGNED_IN' && session) {
                // Re-initialize to handle user loading
                initializeAuth();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const refreshProfile = async () => {
        const { user, profile } = await authService.getCurrentUser() || {};
        setUser(user || null);
        setProfile(profile as Profile || null);
    };

    const debugLogin = () => {
        const mockUser: User = {
            id: 'dev-user-id',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
        } as User;

        const mockProfile: Profile = {
            id: 'dev-user-id',
            username: 'dev_explorer',
            display_name: 'Dev Explorer',
            avatar_url: 'https://picsum.photos/seed/dev/200/200',
            bio: 'Local development user',
            location: 'Localhost',
            role: 'user'
        };

        setUser(mockUser);
        setProfile(mockProfile);

        // PERSIST MOCK SESSION
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        localStorage.setItem('mock_profile', JSON.stringify(mockProfile));
    };
    // Helper to clear mock session on logout
    const clearMockSession = () => {
        localStorage.removeItem('mock_user');
        localStorage.removeItem('mock_profile');
    };

    // Load following from localStorage on mount
    const [followingUsernames, setFollowingUsernames] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('floc_following_users');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load following from localStorage:', e);
        }
        return [];
    });


    const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);

    // Fetch communities from Supabase
    useEffect(() => {
        const fetchCommunities = async () => {
            // CHECK LOCAL STORAGE FOR MOCK DATA FIRST (Recover persistence in Mock Mode)
            const storedMock = localStorage.getItem('mock_communities');
            if (storedMock) {
                try {
                    const parsed = JSON.parse(storedMock);
                    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                        console.log('[UserContext] Loaded mock communities from localStorage:', parsed.length);
                        // alert(`DEBUG: Loaded ${parsed.length} communities from LocalStorage!`);
                        setCommunities(parsed);
                    } else {
                        console.log('[UserContext] LocalStorage check found empty array.');
                    }
                } catch (e) {
                    console.error('[UserContext] Failed to parse local mock data', e);
                }
            } else {
                console.log('[UserContext] No mock_communities found in LocalStorage.');
            }

            try {
                console.log('[UserContext] Calling fetchCommunities...');
                const data = await supabaseService.getCommunities();
                console.log('[UserContext] Fetched communities data:', data);
                if (data && data.length > 0) {
                    console.log('[UserContext] Updating communities state with DB data');
                    setCommunities(data);
                } else {
                    console.warn('[UserContext] No communities found in DB. Falling back to LocalStorage (if available).');
                    // Force restore from LocalStorage if DB is empty (essential for Mock Mode persistence)
                    const storedMock = localStorage.getItem('mock_communities');
                    if (storedMock) {
                        const parsed = JSON.parse(storedMock);
                        setCommunities(parsed);
                        console.log('[UserContext] Re-applied mock communities from storage (DB was empty).');
                    }
                }
            } catch (error) {
                console.error('[UserContext] Failed to fetch communities:', error);
            }
        };

        fetchCommunities();
    }, []);

    // Save communities to localStorage isn't needed if we sync with DB, 
    // but for now we might keep it or remove it. Removing it to avoid confusion/stale data.
    // React.useEffect(() => { ... }, [communities]);

    // Save following to localStorage whenever it changes
    React.useEffect(() => {
        try {
            localStorage.setItem('floc_following_users', JSON.stringify(followingUsernames));
        } catch (e) {
            console.error('Failed to save following to localStorage:', e);
        }
    }, [followingUsernames]);

    // Load conversations and messages from localStorage
    const [conversations, setConversations] = useState<Conversation[]>(() => {
        try {
            const saved = localStorage.getItem('floc_conversations');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error('Failed to load conversations:', e);
        }

        // Seed initial conversations if none exist
        return [
            {
                id: 'conv-1',
                participants: ['alex-sterling', 'elena-vance'],
                participantDetails: [
                    { username: 'alex-sterling', displayName: 'Alex Sterling', avatar: 'https://picsum.photos/seed/alex/400/400', isOnline: true },
                    { username: 'elena-vance', displayName: 'Elena Vance', avatar: 'https://picsum.photos/seed/elena/400/400', isOnline: true }
                ],
                unreadCount: 2,
                type: 'direct',
                lastMessage: {
                    id: 'm1',
                    conversationId: 'conv-1',
                    senderId: 'elena-vance',
                    senderName: 'Elena Vance',
                    senderAvatar: 'https://picsum.photos/seed/elena/400/400',
                    content: "Hey! Are you ready for the Bali trip? We need to finalize the reef cleanup schedule.",
                    timestamp: Date.now() - 3600000,
                    read: false
                }
            },
            {
                id: '1', // Matches Community ID for Reef Guardians
                participants: ['alex-sterling'],
                participantDetails: [
                    { username: 'alex-sterling', displayName: 'Alex Sterling', avatar: 'https://picsum.photos/seed/alex/400/400', isOnline: true }
                ],
                unreadCount: 5,
                type: 'group',
                title: 'Reef Guardians Collective',
                lastMessage: {
                    id: 'm2',
                    conversationId: '1',
                    senderId: 'mike-ross',
                    senderName: 'Mike Ross',
                    senderAvatar: 'https://picsum.photos/seed/mike/400/400',
                    content: "The mangrove planting was a huge success! Check out the photos in the feed.",
                    timestamp: Date.now() - 7200000,
                    read: false
                }
            },
            {
                id: 'concierge-1',
                participants: ['alex-sterling', 'inspired-concierge'],
                participantDetails: [
                    { username: 'alex-sterling', displayName: 'Alex Sterling', avatar: 'https://picsum.photos/seed/alex/400/400', isOnline: true },
                    { username: 'inspired-concierge', displayName: 'Inspired Concierge', avatar: 'https://img.icons8.com/fluency/96/artificial-intelligence.png', isOnline: true }
                ],
                unreadCount: 0,
                type: 'direct',
                lastMessage: {
                    id: 'm-concierge-1',
                    conversationId: 'concierge-1',
                    senderId: 'inspired-concierge',
                    senderName: 'Inspired Concierge',
                    senderAvatar: 'https://img.icons8.com/fluency/96/artificial-intelligence.png',
                    content: "Welcome back, Leader. I'm your dedicated Inspired Concierge for managing your Community and ventures. How can I assist you today?",
                    timestamp: Date.now() - 86400000,
                    read: true
                }
            }
        ];
    });

    // Load messages from localStorage
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const saved = localStorage.getItem('floc_messages');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error('Failed to load messages:', e);
        }

        // Seed initial messages matching the conversations above
        return [
            {
                id: 'm1',
                conversationId: 'conv-1',
                senderId: 'elena-vance',
                senderName: 'Elena Vance',
                senderAvatar: 'https://picsum.photos/seed/elena/400/400',
                content: "Hey! Are you ready for the Bali trip? We need to finalize the reef cleanup schedule.",
                timestamp: Date.now() - 3600000,
                read: false
            },
            {
                id: 'm0',
                conversationId: 'conv-1',
                senderId: 'alex-sterling',
                senderName: 'Alex Sterling',
                senderAvatar: 'https://picsum.photos/seed/alex/400/400',
                content: "Checking the schedule now!",
                timestamp: Date.now() - 7200000,
                read: true
            },
            {
                id: 'm-concierge-1',
                conversationId: 'concierge-1',
                senderId: 'inspired-concierge',
                senderName: 'Inspired Concierge',
                senderAvatar: 'https://img.icons8.com/fluency/96/artificial-intelligence.png',
                content: "Welcome back, Leader. I'm your dedicated Inspired Concierge for managing your Community and ventures. How can I assist you today?",
                timestamp: Date.now() - 86400000,
                read: true
            },
            {
                id: 'm2',
                conversationId: '1',
                senderId: 'mike-ross',
                senderName: 'Mike Ross',
                senderAvatar: 'https://picsum.photos/seed/mike/400/400',
                content: "The mangrove planting was a huge success! Check out the photos in the feed.",
                timestamp: Date.now() - 7200000,
                read: false
            }
        ];
    });

    // Load notifications from localStorage
    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        try {
            const saved = localStorage.getItem('floc_notifications');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load notifications:', e);
        }
        return [];
    });

    // Save notifications to localStorage
    React.useEffect(() => {
        try {
            localStorage.setItem('floc_notifications', JSON.stringify(notifications));
        } catch (e) {
            console.error('Failed to save notifications:', e);
        }
    }, [notifications]);

    const addNotification = (data: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: AppNotification = {
            ...data,
            id: `notif-${Date.now()}`,
            timestamp: Date.now(),
            isRead: false
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const setTypingStatus = (conversationId: string, isTyping: boolean) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    participantDetails: conv.participantDetails.map(p =>
                        p.username !== 'alex-sterling' ? { ...p, isTyping } : p
                    )
                };
            }
            return conv;
        }));
    };

    const updatePresence = (username: string, isOnline: boolean) => {
        setConversations(prev => prev.map(conv => ({
            ...conv,
            participantDetails: conv.participantDetails.map(p =>
                p.username === username ? { ...p, isOnline } : p
            )
        })));
    };

    const joinCommunity = async (id: string) => {
        if (joinedCommunityIds.includes(id)) return;

        if (!user) {
            console.error('Cannot join community: User not logged in');
            return;
        }

        const success = await communityService.joinCommunity(id, user.id, {
            name: profile?.display_name || user.email?.split('@')[0] || 'Member',
            avatar: profile?.avatar_url || 'https://picsum.photos/seed/default/100/100'
        });

        if (success) {
            setJoinedCommunityIds(prev => [...prev, id]);
            // Also refresh communities list to update member count/list if needed?
            // For now, simpler is better.
        }
    };

    const leaveCommunity = (id: string) => {
        setJoinedCommunityIds(prev => prev.filter(communityId => communityId !== id));
    };

    const createCommunity = async (data: Omit<Community, 'id' | 'memberCount' | 'upcomingTrips'>) => {
        console.log('[UserContext] createCommunity called with data:', data);

        if (!user || !profile) {
            console.error('[UserContext] Cannot create community: User not logged in', { user, profile });
            return;
        }

        // HANDLE DEV OWNER: fallback to local-only if using "Development Login"
        if (user.id === 'dev-user-id') {
            console.warn('[UserContext] Dev user detected. Skipping database persistence.');
            const newCommunity: Community = {
                id: `c${Date.now()}`,
                title: data.title,
                description: data.description,
                category: data.category,
                image: data.image,
                meta: `${data.category} • 1 member`,
                memberCount: '1',
                upcomingTrips: [],
                accessType: data.accessType || 'request',
                isManaged: true,
                unreadCount: 0,
                members: [{
                    id: user.id,
                    name: profile.display_name,
                    avatar: profile.avatar_url,
                    role: 'Owner',
                    location: profile.location,
                    joinedDate: new Date().toISOString(),
                    status: 'approved'
                }],
                entryQuestions: data.entryQuestions,
                enabledFeatures: data.enabledFeatures
            };

            // OPTIMISTIC UPDATE + LOCAL STORAGE PERSISTENCE
            setCommunities(prev => {
                const updated = [newCommunity, ...prev];
                try {
                    localStorage.setItem('mock_communities', JSON.stringify(updated));
                    console.log('[UserContext] Saved mock communities to localStorage:', updated.length);
                    // DEBUG ALERT to confirm save
                    // alert(`DEBUG: Saved Community "${newCommunity.title}" to LocalStorage!`);
                } catch (e) {
                    console.error('Failed to save to localStorage', e);
                    alert("Failed to save to LocalStorage!");
                }
                return updated;
            });

            // Force update joined IDs immediately
            setJoinedCommunityIds(prev => {
                const newIds = [...prev, newCommunity.id];
                console.log('[UserContext] Updating joined IDs locally:', newIds);
                return newIds;
            });

            return newCommunity;
        }

        console.log('[UserContext] Calling supabaseService.createCommunity...');
        // Create in database first
        const newCommunity = await supabaseService.createCommunity({
            title: data.title,
            description: data.description,
            category: data.category,
            image: data.image,
            owner_id: user.id,
            access_type: data.accessType,
            entry_questions: data.entryQuestions,
            enabled_features: data.enabledFeatures
        });

        if (!newCommunity) {
            console.error('[UserContext] Failed to create community in database (returned null)');
            return;
        }

        console.log('[UserContext] Community created in DB:', newCommunity);

        // Add creator as member
        console.log('[UserContext] Adding creator as member...');
        const memberAdded = await supabaseService.addMemberToCommunity(newCommunity.id, user.id, {
            name: profile.display_name || 'Owner',
            avatar: profile.avatar_url || 'https://picsum.photos/seed/default/100/100',
            role: 'Owner'
        });

        console.log('[UserContext] Member added result:', memberAdded);

        // Update local state with the returned community from DB
        const fullCommunity: Community = {
            ...newCommunity,
            members: [{
                id: user.id,
                name: profile.display_name || 'Owner',
                avatar: profile.avatar_url || 'https://picsum.photos/seed/default/100/100',
                role: 'Owner',
                location: profile.location || 'Just joined',
                joinedDate: new Date().toISOString(),
                status: 'approved'
            }]
        };

        setCommunities(prev => [fullCommunity, ...prev]);
        setJoinedCommunityIds(prev => [...prev, fullCommunity.id]);
        console.log('[UserContext] Local state updated with new community:', fullCommunity);

        return fullCommunity;
    };

    const bookTrip = (id: string) => {
        if (!bookedTripIds.includes(id)) {
            setBookedTripIds(prev => [...prev, id]);
        }
    };

    const followUser = (username: string) => {
        if (!followingUsernames.includes(username)) {
            setFollowingUsernames(prev => [...prev, username]);
            console.log('[UserContext] Followed user:', username);
        }
    };

    const unfollowUser = (username: string) => {
        setFollowingUsernames(prev => prev.filter(u => u !== username));
        console.log('[UserContext] Unfollowed user:', username);
    };

    const isFollowing = (username: string) => followingUsernames.includes(username);

    const getConversation = (participantUsername: string) => {
        return conversations.find(conv => conv.participants.includes(participantUsername));
    };

    const sendMessage = (recipientId: string, recipientName: string, recipientAvatar: string, content: string, conversationId?: string, type: 'direct' | 'group' = 'direct') => {
        const currentUser = user?.id || 'guest';
        const currentUserName = profile?.display_name || user?.email?.split('@')[0] || 'Guest';
        const currentUserAvatar = profile?.avatar_url || 'https://picsum.photos/seed/guest/100/100';

        let conversation = conversationId
            ? conversations.find(c => c.id === conversationId)
            : conversations.find(c => c.type === type && (type === 'direct' ? c.participants.includes(recipientId) : c.id === recipientId));

        if (!conversation) {
            conversation = {
                id: type === 'group' ? recipientId : `conv-${Date.now()}`,
                participants: type === 'direct' ? [currentUser, recipientId] : [currentUser], // In a real app, participants would be pre-loaded
                participantDetails: type === 'direct' ? [
                    { username: currentUser, displayName: currentUserName, avatar: currentUserAvatar, isOnline: true },
                    { username: recipientId, displayName: recipientName, avatar: recipientAvatar, isOnline: Math.random() > 0.3 }
                ] : [
                    { username: currentUser, displayName: currentUserName, avatar: currentUserAvatar, isOnline: true }
                ],
                unreadCount: 0,
                type,
                title: type === 'group' ? recipientName : undefined
            };
            setConversations(prev => [conversation!, ...prev]);
        }

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            conversationId: conversation.id,
            senderId: currentUser,
            senderName: currentUserName,
            senderAvatar: currentUserAvatar,
            recipientId: type === 'direct' ? recipientId : undefined,
            content,
            timestamp: Date.now(),
            read: true, // Sent message is always 'read' by sender
            status: 'delivered'
        };

        setMessages(prev => [...prev, newMessage]);

        // Simulate reply from other user for direct messages
        if (type === 'direct' && recipientId !== currentUser && recipientId !== 'inspired-concierge') {
            const replyDelay = 3000;

            // Set typing status after a short delay
            setTimeout(() => {
                setConversations(prev => prev.map(c => {
                    if (c.id === conversation!.id) {
                        return {
                            ...c,
                            participantDetails: c.participantDetails.map(p =>
                                p.username === recipientId ? { ...p, isTyping: true } : p
                            )
                        };
                    }
                    return c;
                }));
            }, 1000);

            setTimeout(() => {
                // Stop typing
                setConversations(prev => prev.map(c => {
                    if (c.id === conversation!.id) {
                        return {
                            ...c,
                            participantDetails: c.participantDetails.map(p =>
                                p.username === recipientId ? { ...p, isTyping: false } : p
                            )
                        };
                    }
                    return c;
                }));

                const replyContent = "Message delivered";

                const reply: Message = {
                    id: `msg-reply-${Date.now()}`,
                    conversationId: conversation!.id,
                    senderId: recipientId,
                    senderName: recipientName,
                    senderAvatar: recipientAvatar,
                    recipientId: currentUser,
                    content: replyContent,
                    timestamp: Date.now(),
                    read: false,
                    status: 'read'
                };

                setMessages(prev => [...prev, reply]);

                addNotification({
                    type: 'CHAT',
                    title: recipientName,
                    message: reply.content,
                    relatedId: conversation!.id,
                    relatedType: 'community'
                });
            }, replyDelay);
        }
    };

    const addMessage = (conversationId: string, senderId: string, senderName: string, senderAvatar: string, content: string) => {
        const newMessage: Message = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            conversationId,
            senderId,
            senderName,
            senderAvatar,
            recipientId: user?.id,
            content,
            timestamp: Date.now(),
            read: false, // New message is unread
            status: 'read'
        };
        setMessages(prev => [...prev, newMessage]);
    };

    // Sync unread counts and last message when messages change
    React.useEffect(() => {
        setConversations(prevConvs => {
            let hasChanges = false;
            const updatedConvs = prevConvs.map(conv => {
                const convMessages = messages.filter(m => m.conversationId === conv.id);
                const unread = convMessages.filter(m => !m.read && m.senderId !== 'alex-sterling').length;
                const lastMsg = convMessages.length > 0
                    ? convMessages.sort((a, b) => b.timestamp - a.timestamp)[0]
                    : conv.lastMessage;

                if (conv.unreadCount !== unread || conv.lastMessage?.id !== lastMsg?.id) {
                    hasChanges = true;
                    return {
                        ...conv,
                        unreadCount: unread,
                        lastMessage: lastMsg
                    };
                }
                return conv;
            });

            return hasChanges ? updatedConvs : prevConvs;
        });
    }, [messages]);

    const markAsRead = (conversationId: string) => {
        // Mark all messages in conversation as read
        setMessages(prev => prev.map(msg => {
            if (msg.conversationId === conversationId && !msg.read && msg.senderId !== 'alex-sterling') {
                return { ...msg, read: true };
            }
            return msg;
        }));
    };

    const getTotalUnreadCount = () => {
        return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
    };

    const isMember = (id: string) => joinedCommunityIds.includes(id);
    const isBooked = (id: string) => bookedTripIds.includes(id);

    const approveMember = async (communityId: string, memberId: string) => {
        const success = await communityService.approveMember(communityId, memberId);
        if (success) {
            setCommunities(prev => prev.map(comm => {
                if (comm.id !== communityId) return comm;

                const pending = comm.pendingMembers || [];
                const declined = comm.declinedMembers || [];

                // Check pending first, then declined
                let userToApprove = pending.find(m => m.id === memberId);
                let fromDeclined = false;

                if (!userToApprove) {
                    userToApprove = declined.find(m => m.id === memberId);
                    fromDeclined = true;
                }

                if (!userToApprove) return comm;

                const newMember: Member = {
                    id: userToApprove.id,
                    name: userToApprove.name,
                    avatar: userToApprove.avatar,
                    role: 'Member',
                    location: 'Recently Joined',
                    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    status: 'approved'
                };

                return {
                    ...comm,
                    members: [...(comm.members || []), newMember],
                    pendingMembers: pending.filter(m => m.id !== memberId),
                    declinedMembers: declined.filter(m => m.id !== memberId),
                    memberCount: (parseInt(comm.memberCount) + 1).toString()
                };
            }));
        }
    };

    const declineMember = async (communityId: string, memberId: string) => {
        const success = await communityService.declineMember(communityId, memberId);
        if (success) {
            setCommunities(prev => prev.map(comm => {
                if (comm.id !== communityId) return comm;

                const pending = comm.pendingMembers || [];
                const memberToDecline = pending.find(m => m.id === memberId);

                // If not in pending, maybe they are already a member we are removing? 
                // For now assuming we are declining a REQUEST.
                if (!memberToDecline) return comm;

                return {
                    ...comm,
                    pendingMembers: pending.filter(m => m.id !== memberId),
                    declinedMembers: [...(comm.declinedMembers || []), { ...memberToDecline, timestamp: 'Just now' }]
                };
            }));
        }
    };

    const removeMember = async (communityId: string, memberId: string) => {
        const success = await communityService.removeMember(communityId, memberId);
        if (success) {
            setCommunities(prev => prev.map(comm => {
                if (comm.id !== communityId) return comm;

                const members = comm.members || [];
                const memberToRemove = members.find(m => m.id === memberId);

                if (!memberToRemove) return comm;

                // Create a PendingMember-like object for the declined list
                const declinedMember = {
                    id: memberToRemove.id,
                    name: memberToRemove.name,
                    avatar: memberToRemove.avatar,
                    reason: "Removed by leader",
                    timestamp: "Just now",
                    category: "General"
                };

                return {
                    ...comm,
                    members: members.filter(m => m.id !== memberId),
                    declinedMembers: [...(comm.declinedMembers || []), declinedMember],
                    memberCount: Math.max(0, parseInt(comm.memberCount) - 1).toString()
                };
            }));
        }
    };

    const updateMemberRole = async (communityId: string, memberId: string, role: Member['role'], permissions?: string[]) => {
        const success = await communityService.updateMemberRole(communityId, memberId, role);
        if (success) {
            setCommunities(prev => prev.map(comm => {
                if (comm.id !== communityId) return comm;
                return {
                    ...comm,
                    members: (comm.members || []).map(m =>
                        m.id === memberId ? { ...m, role, customPermissions: permissions } : m
                    )
                };
            }));
        }
    };

    const updateCommunity = (id: string, updates: Partial<Community>) => {
        setCommunities(prev => prev.map(comm =>
            comm.id === id ? { ...comm, ...updates } : comm
        ));
    };

    const deleteCommunity = async (id: string) => {
        // 1. Mock Mode
        const storedMock = localStorage.getItem('mock_communities');
        if (storedMock) {
            try {
                const parsed = JSON.parse(storedMock);
                const filtered = parsed.filter((c: any) => c.id !== id);

                if (filtered.length < parsed.length) {
                    // It was a mock community
                    localStorage.setItem('mock_communities', JSON.stringify(filtered));

                    // Update State
                    setCommunities(prev => prev.filter(c => c.id !== id));
                    setJoinedCommunityIds(prev => prev.filter(cid => cid !== id));

                    // Also remove from joined mock IDs? 
                    // (Re-deriving joined IDs next reload handles this, but live state needs update)
                    return;
                }
            } catch (e) {
                console.error("Error deleting from mock storage", e);
            }
        }

        // 2. Real Mode
        try {
            await communityService.deleteCommunity(id);
            // Update state after successful DB delete
            setCommunities(prev => prev.filter(c => c.id !== id));
            setJoinedCommunityIds(prev => prev.filter(cid => cid !== id));
        } catch (e) {
            console.error("Failed to delete community", e);
            alert("Failed to dissolve community. See console.");
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            profile,
            isLoading,
            refreshProfile,
            joinedCommunityIds,
            createCommunity,
            joinCommunity: (communityId: string) => {
                if (!user || !profile) return false;
                if (!joinedCommunityIds.includes(communityId)) {
                    setJoinedCommunityIds(prev => [...prev, communityId]);
                    setCommunities(prev => prev.map(comm => {
                        if (comm.id !== communityId) return comm;
                        const newMember: Member = {
                            id: user.id,
                            name: profile.display_name || 'User',
                            avatar: profile.avatar_url || 'https://picsum.photos/seed/default/100/100',
                            role: 'Member',
                            location: profile.location || 'Just joined',
                            joinedDate: new Date().toISOString()
                        };
                        return {
                            ...comm,
                            members: [...(comm.members || []), newMember],
                            memberCount: (parseInt(comm.memberCount || '0') + 1).toString()
                        };
                    }));
                    return true;
                }
                return false;
            },
            bookedTripIds,
            communities,
            followingUsernames,
            conversations,
            messages,
            notifications,
            leaveCommunity,
            bookTrip,
            followUser,
            unfollowUser,
            isFollowing,
            sendMessage,
            addMessage,
            markAsRead,
            getConversation,
            getTotalUnreadCount,
            isMember,
            isBooked,
            approveMember,
            declineMember,
            removeMember,
            updateMemberRole,
            updateCommunity,
            addNotification,
            markNotificationsAsRead,
            deleteNotification,
            setTypingStatus,
            updatePresence,
            deleteCommunity,
            debugLogin
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
