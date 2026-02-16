import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Community, Member } from '../types';
import { MOCK_COMMUNITIES } from '../constants';
import { communityService } from '../services/communityService';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from './AuthContext';

export interface CommunityContextType {
    joinedCommunityIds: string[];
    communities: Community[];
    joinCommunity: (id: string) => void;
    leaveCommunity: (id: string) => void;
    createCommunity: (data: Omit<Community, 'id' | 'memberCount' | 'upcomingTrips'>) => Promise<Community | undefined>;
    isMember: (id: string) => boolean;
    approveMember: (communityId: string, memberId: string) => void;
    declineMember: (communityId: string, memberId: string) => void;
    removeMember: (communityId: string, memberId: string) => void;
    updateMemberRole: (communityId: string, memberId: string, role: Member['role'], permissions?: string[]) => void;
    updateCommunity: (id: string, updates: Partial<Community>) => void;
    deleteCommunity: (id: string) => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, profile } = useAuth();
    const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>(['1', 'c1']);
    const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);

    // Fetch communities
    useEffect(() => {
        const fetchCommunities = async () => {
            // CHECK LOCAL STORAGE FOR MOCK DATA FIRST
            const storedMock = localStorage.getItem('mock_communities');
            if (storedMock) {
                try {
                    const parsed = JSON.parse(storedMock);
                    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                        console.log('[CommunityContext] Loaded mock communities from localStorage:', parsed.length);
                        setCommunities(parsed);
                    }
                } catch (e) {
                    console.error('[CommunityContext] Failed to parse local mock data', e);
                }
            }

            try {
                const data = await supabaseService.getCommunities();
                if (data && data.length > 0) {
                    setCommunities(data);
                } else {
                    // Force restore from LocalStorage if DB is empty
                    const storedMock = localStorage.getItem('mock_communities');
                    if (storedMock) {
                        const parsed = JSON.parse(storedMock);
                        setCommunities(parsed);
                    }
                }
            } catch (error) {
                console.error('[CommunityContext] Failed to fetch communities:', error);
            }
        };

        fetchCommunities();
    }, []);

    // Sync joinedCommunityIds with User
    useEffect(() => {
        if (!user) {
            setJoinedCommunityIds([]); // Clear on logout
            return;
        }

        // Restore Mock User Logic
        if (user.id === 'dev-user-id') {
            const storedMockCommunities = localStorage.getItem('mock_communities');
            if (storedMockCommunities) {
                try {
                    const parsed = JSON.parse(storedMockCommunities);
                    const mockIds = parsed
                        .filter((c: any) => c.members?.some((m: any) => m.id === 'dev-user-id'))
                        .map((c: any) => c.id);

                    if (mockIds.length === 0 && parsed.length > 0) {
                         // Fallback logic from UserContext
                        const allIds = parsed.map((c: any) => c.id);
                        setJoinedCommunityIds(allIds);
                    } else {
                        setJoinedCommunityIds(mockIds);
                    }
                } catch (e) {
                    console.error('[CommunityContext] Error parsing mock communities for joined IDs:', e);
                }
            }
        }
        // If not mock user, we stick with defaults or could implement real fetching here
    }, [user]);


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
            // Optimistically update membership in community list
            setCommunities(prev => prev.map(comm => {
                if (comm.id !== id) return comm;
                const newMember: Member = {
                    id: user.id,
                    name: profile?.display_name || 'User',
                    avatar: profile?.avatar_url || 'https://picsum.photos/seed/default/100/100',
                    role: 'Member',
                    location: profile?.location || 'Just joined',
                    joinedDate: new Date().toISOString()
                };
                return {
                    ...comm,
                    members: [...(comm.members || []), newMember],
                    memberCount: (parseInt(comm.memberCount || '0') + 1).toString()
                };
            }));
        }
    };

    const leaveCommunity = (id: string) => {
        setJoinedCommunityIds(prev => prev.filter(communityId => communityId !== id));
    };

    const createCommunity = async (data: Omit<Community, 'id' | 'memberCount' | 'upcomingTrips'>) => {
        if (!user || !profile) {
            console.error('[CommunityContext] Cannot create community: User not logged in');
            return;
        }

        // HANDLE DEV OWNER
        if (user.id === 'dev-user-id') {
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

            setCommunities(prev => {
                const updated = [newCommunity, ...prev];
                try {
                    localStorage.setItem('mock_communities', JSON.stringify(updated));
                } catch (e) {
                    console.error('Failed to save to localStorage', e);
                }
                return updated;
            });

            setJoinedCommunityIds(prev => [...prev, newCommunity.id]);
            return newCommunity;
        }

        // Create in database
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

        if (!newCommunity) return;

        await supabaseService.addMemberToCommunity(newCommunity.id, user.id, {
            name: profile.display_name || 'Owner',
            avatar: profile.avatar_url || 'https://picsum.photos/seed/default/100/100',
            role: 'Owner'
        });

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

        return fullCommunity;
    };

    const isMember = (id: string) => joinedCommunityIds.includes(id);

    const approveMember = async (communityId: string, memberId: string) => {
        const success = await communityService.approveMember(communityId, memberId);
        if (success) {
            setCommunities(prev => prev.map(comm => {
                if (comm.id !== communityId) return comm;

                const pending = comm.pendingMembers || [];
                const declined = comm.declinedMembers || [];
                let userToApprove = pending.find(m => m.id === memberId);

                if (!userToApprove) {
                    userToApprove = declined.find(m => m.id === memberId);
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
        // Mock Mode
        const storedMock = localStorage.getItem('mock_communities');
        if (storedMock) {
            try {
                const parsed = JSON.parse(storedMock);
                const filtered = parsed.filter((c: any) => c.id !== id);

                if (filtered.length < parsed.length) {
                    localStorage.setItem('mock_communities', JSON.stringify(filtered));
                    setCommunities(prev => prev.filter(c => c.id !== id));
                    setJoinedCommunityIds(prev => prev.filter(cid => cid !== id));
                    return;
                }
            } catch (e) {
                console.error("Error deleting from mock storage", e);
            }
        }

        // Real Mode
        try {
            await communityService.deleteCommunity(id);
            setCommunities(prev => prev.filter(c => c.id !== id));
            setJoinedCommunityIds(prev => prev.filter(cid => cid !== id));
        } catch (e) {
            console.error("Failed to delete community", e);
            alert("Failed to dissolve community. See console.");
        }
    };

    return (
        <CommunityContext.Provider value={{
            joinedCommunityIds,
            communities,
            joinCommunity,
            leaveCommunity,
            createCommunity,
            isMember,
            approveMember,
            declineMember,
            removeMember,
            updateMemberRole,
            updateCommunity,
            deleteCommunity
        }}>
            {children}
        </CommunityContext.Provider>
    );
};

export const useCommunity = () => {
    const context = useContext(CommunityContext);
    if (context === undefined) {
        throw new Error('useCommunity must be used within a CommunityProvider');
    }
    return context;
};
