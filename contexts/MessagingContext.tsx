import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Conversation, Message, DirectMessage } from '../types';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

export interface MessagingContextType {
    conversations: Conversation[];
    messages: DirectMessage[]; // UserContext used DirectMessage[], but logic used Message. DirectMessage extends Message? Let's check.
    // In UserContext interface: messages: DirectMessage[];
    // In state: messages: Message[]
    // I should check types.ts. Assuming DirectMessage is the correct type for the list.
    sendMessage: (recipientId: string, recipientName: string, recipientAvatar: string, content: string, conversationId?: string, type?: 'direct' | 'group') => void;
    addMessage: (conversationId: string, senderId: string, senderName: string, senderAvatar: string, content: string) => void;
    markAsRead: (conversationId: string) => void;
    getConversation: (participantUsername: string) => Conversation | undefined;
    getTotalUnreadCount: () => number;
    setTypingStatus: (conversationId: string, isTyping: boolean) => void;
    updatePresence: (username: string, isOnline: boolean) => void;
}

// Check types usage in UserContext:
// const [messages, setMessages] = useState<Message[]>(...)
// Interface: messages: DirectMessage[]
// It seems Message and DirectMessage are used interchangeably or one extends another.
// I will import both and use Message for state to match UserContext implementation logic, but export DirectMessage in interface if that matches.

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, profile } = useAuth();
    const { addNotification } = useNotification();

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

    // Save logic
    useEffect(() => {
        try {
            localStorage.setItem('floc_conversations', JSON.stringify(conversations));
        } catch (e) {
             console.error('Failed to save conversations:', e);
        }
    }, [conversations]);

    useEffect(() => {
        try {
            localStorage.setItem('floc_messages', JSON.stringify(messages));
        } catch (e) {
             console.error('Failed to save messages:', e);
        }
    }, [messages]);

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
                participants: type === 'direct' ? [currentUser, recipientId] : [currentUser],
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
            read: true,
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
            read: false,
            status: 'read'
        };
        setMessages(prev => [...prev, newMessage]);
    };

    // Sync unread counts and last message when messages change
    useEffect(() => {
        setConversations(prevConvs => {
            let hasChanges = false;
            const updatedConvs = prevConvs.map(conv => {
                const convMessages = messages.filter(m => m.conversationId === conv.id);
                const unread = convMessages.filter(m => !m.read && m.senderId !== 'alex-sterling').length; // Hardcoded 'alex-sterling' used in original code
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

    const getConversation = (participantUsername: string) => {
        return conversations.find(conv => conv.participants.includes(participantUsername));
    };

    return (
        <MessagingContext.Provider value={{
            conversations,
            messages,
            sendMessage,
            addMessage,
            markAsRead,
            getConversation,
            getTotalUnreadCount,
            setTypingStatus,
            updatePresence
        }}>
            {children}
        </MessagingContext.Provider>
    );
};

export const useMessaging = () => {
    const context = useContext(MessagingContext);
    if (context === undefined) {
        throw new Error('useMessaging must be used within a MessagingProvider');
    }
    return context;
};
