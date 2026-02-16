import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface SocialContextType {
    followingUsernames: string[];
    followUser: (username: string) => void;
    unfollowUser: (username: string) => void;
    isFollowing: (username: string) => boolean;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

    // Save following to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('floc_following_users', JSON.stringify(followingUsernames));
        } catch (e) {
            console.error('Failed to save following to localStorage:', e);
        }
    }, [followingUsernames]);

    const followUser = (username: string) => {
        if (!followingUsernames.includes(username)) {
            setFollowingUsernames(prev => [...prev, username]);
            console.log('[SocialContext] Followed user:', username);
        }
    };

    const unfollowUser = (username: string) => {
        setFollowingUsernames(prev => prev.filter(u => u !== username));
        console.log('[SocialContext] Unfollowed user:', username);
    };

    const isFollowing = (username: string) => followingUsernames.includes(username);

    return (
        <SocialContext.Provider value={{
            followingUsernames,
            followUser,
            unfollowUser,
            isFollowing
        }}>
            {children}
        </SocialContext.Provider>
    );
};

export const useSocial = () => {
    const context = useContext(SocialContext);
    if (context === undefined) {
        throw new Error('useSocial must be used within a SocialProvider');
    }
    return context;
};
