import React from 'react';
import { useUser } from '../contexts/UserContext';

interface FollowButtonProps {
    username: string;
    isOwnProfile: boolean;
    className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
    username,
    isOwnProfile,
    className = ''
}) => {
    const { followUser, unfollowUser, isFollowing } = useUser();
    const following = isFollowing(username);

    const handleClick = () => {
        if (following) {
            unfollowUser(username);
        } else {
            followUser(username);
        }
    };

    if (isOwnProfile) {
        return null; // Don't show button on own profile
    }

    return (
        <button
            onClick={handleClick}
            className={`
        px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest
        transition-all active:scale-95
        ${following
                    ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary/30'
                    : 'bg-primary text-background-dark hover:scale-105 shadow-lg shadow-primary/20'
                }
        ${className}
      `}
        >
            {following ? 'Following' : 'Follow'}
        </button>
    );
};
