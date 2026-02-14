import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, CommunityPost, Community, Trip } from '../types';
import { useUser } from '../contexts/UserContext';
import { FollowButton } from '../components/FollowButton';

// Mock user data
const MOCK_USERS: Record<string, User> = {
    'elena-vance': {
        id: 'u1',
        username: 'elena-vance',
        displayName: 'Elena Vance',
        avatar: 'https://picsum.photos/seed/elena/400/400',
        bio: '🌱 Environmental activist & sustainability advocate. Planting trees and changing minds, one journey at a time.',
        location: 'Bali, Indonesia',
        joinedDate: 'January 2024',
        stats: {
            trips: 12,
            communities: 5,
            followers: 2847,
            following: 342
        }
    },
    'alex-sterling': {
        id: 'u2',
        username: 'alex-sterling',
        displayName: 'Alex Sterling',
        avatar: 'https://picsum.photos/seed/alex/400/400',
        bio: '📸 Street photographer & cultural explorer. Finding beauty in the unnoticed corners of the world.',
        location: 'Paris, France',
        joinedDate: 'March 2024',
        stats: {
            trips: 8,
            communities: 4,
            followers: 1523,
            following: 289
        }
    },
    'sarah-jenkins': {
        id: 'u3',
        username: 'sarah-jenkins',
        displayName: 'Sarah Jenkins',
        avatar: 'https://picsum.photos/seed/sarah/400/400',
        bio: '🦜 Wildlife conservationist working to protect endangered species. Adventure seeker with a purpose.',
        location: 'Amazon Rainforest',
        joinedDate: 'February 2024',
        stats: {
            trips: 15,
            communities: 6,
            followers: 3921,
            following: 156
        }
    }
};

const UserProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { communities } = useUser();
    const [activeTab, setActiveTab] = useState<'posts' | 'trips' | 'communities' | 'about'>('posts');

    const user = username ? MOCK_USERS[username] : null;
    // Check if this is the current user's own profile (for demo, using username check)
    const isOwnProfile = username === 'alex-sterling'; // In real app, compare with logged-in user

    if (!user) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl text-red-500">person_off</span>
                    </div>
                    <h2 className="text-white font-black text-2xl mb-2">User Not Found</h2>
                    <p className="text-slate-400 text-sm mb-6">We couldn't find a user with that username.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-primary text-background-dark rounded-xl font-bold text-sm"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Mock data for demonstration
    const userCommunities = communities.slice(0, 3);
    const userPosts: CommunityPost[] = [
        {
            id: 'p1',
            author: user.displayName,
            authorAvatar: user.avatar,
            communityName: 'Eco-Warriors',
            content: 'Just finished an amazing restoration project! 🌱',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&w=800&q=80',
            likes: 156,
            hasLiked: false,
            comments: [],
            time: '2h ago',
            timestamp: Date.now() - 7200000
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark pb-32">
            {/* Header with back button */}
            <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
                <div className="px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                        <span className="material-symbols-outlined text-white text-[20px]">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-white font-black text-xl tracking-tight">{user.displayName}</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">@{user.username}</p>
                    </div>
                </div>
            </header>

            <main className="px-6">
                {/* Profile Header */}
                <section className="py-8">
                    <div className="flex items-start gap-6">
                        <img
                            src={user.avatar}
                            alt={user.displayName}
                            className="size-24 rounded-3xl border-4 border-white/10 shadow-2xl"
                        />
                        <div className="flex-1">
                            <h2 className="text-white font-black text-2xl mb-1">{user.displayName}</h2>
                            <p className="text-slate-400 text-sm mb-3">@{user.username}</p>
                            {user.location && (
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
                                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                                    <span>{user.location}</span>
                                </div>
                            )}
                            <p className="text-slate-300 text-sm leading-relaxed mb-4">{user.bio}</p>
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                                <span>Joined {user.joinedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-surface-dark/40 border border-white/5 rounded-2xl p-4 text-center">
                            <div className="text-primary font-black text-2xl">{user.stats.trips}</div>
                            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Trips</div>
                        </div>
                        <div className="bg-surface-dark/40 border border-white/5 rounded-2xl p-4 text-center">
                            <div className="text-primary font-black text-2xl">{user.stats.communities}</div>
                            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Communities</div>
                        </div>
                        <div className="bg-surface-dark/40 border border-white/5 rounded-2xl p-4 text-center">
                            <div className="text-primary font-black text-2xl">{user.stats.followers}</div>
                            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Followers</div>
                        </div>
                        <div className="bg-surface-dark/40 border border-white/5 rounded-2xl p-4 text-center">
                            <div className="text-primary font-black text-2xl">{user.stats.following}</div>
                            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Following</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <FollowButton
                            username={user.username}
                            isOwnProfile={isOwnProfile}
                            className="flex-1"
                        />
                        {!isOwnProfile && (
                            <button
                                onClick={() => navigate(`/messages/${user.username}`)}
                                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Message
                            </button>
                        )}
                    </div>
                </section>

                {/* Tabs */}
                <section className="mb-6">
                    <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === 'posts' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'
                                }`}
                        >
                            Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('trips')}
                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === 'trips' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'
                                }`}
                        >
                            Trips
                        </button>
                        <button
                            onClick={() => setActiveTab('communities')}
                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === 'communities' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'
                                }`}
                        >
                            Communities
                        </button>
                        <button
                            onClick={() => setActiveTab('about')}
                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === 'about' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'
                                }`}
                        >
                            About
                        </button>
                    </div>
                </section>

                {/* Tab Content */}
                <section>
                    {activeTab === 'posts' && (
                        <div className="space-y-6">
                            {userPosts.length > 0 ? (
                                userPosts.map(post => (
                                    <div key={post.id} className="bg-surface-dark/40 border border-white/5 rounded-3xl overflow-hidden">
                                        <div className="p-6">
                                            <p className="text-slate-200 text-sm leading-relaxed mb-4">{post.content}</p>
                                            {post.image && (
                                                <img src={post.image} alt="" className="w-full h-64 object-cover rounded-2xl mb-4" />
                                            )}
                                            <div className="flex items-center gap-6 text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-lg">favorite</span>
                                                    <span className="text-xs font-bold">{post.likes}</span>
                                                </div>
                                                <span className="text-xs">{post.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20">
                                    <span className="material-symbols-outlined text-6xl text-slate-700">post_add</span>
                                    <p className="text-slate-500 text-sm mt-4">No posts yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'trips' && (
                        <div className="grid grid-cols-1 gap-4">
                            <div className="text-center py-20">
                                <span className="material-symbols-outlined text-6xl text-slate-700">luggage</span>
                                <p className="text-slate-500 text-sm mt-4">{user.stats.trips} trips completed</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'communities' && (
                        <div className="space-y-4">
                            {userCommunities.map(community => (
                                <div
                                    key={community.id}
                                    onClick={() => navigate(`/community/${community.id}`)}
                                    className="bg-surface-dark/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all"
                                >
                                    <img src={community.image} alt={community.title} className="size-16 rounded-xl object-cover" />
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold text-sm">{community.title}</h3>
                                        <p className="text-slate-500 text-xs mt-0.5">{community.memberCount} members</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-600">chevron_right</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="bg-surface-dark/40 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-white font-black text-lg mb-4">About {user.displayName}</h3>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">{user.bio}</p>
                            {user.location && (
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    <div>
                                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Location</div>
                                        <div className="text-white text-sm font-medium">{user.location}</div>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">calendar_month</span>
                                <div>
                                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Joined</div>
                                    <div className="text-white text-sm font-medium">{user.joinedDate}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default UserProfile;
