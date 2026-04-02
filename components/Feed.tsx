import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { communityService } from '../services/communityService';
import { aiService } from '../services/aiService';
import { CommunityPost } from '../types';
import { Virtuoso } from 'react-virtuoso';
import { PostCard } from './PostCard';
import { Skeleton } from './Skeleton';
import { CreatePostWidget } from './CreatePostWidget';

interface FeedProps {
    communityId?: string; // Optional: if null, shows Global Feed
    limit?: number;
    posts?: CommunityPost[];
    initialPosts?: CommunityPost[];
    context?: string;
    contextId?: string;
}

export const Feed: React.FC<FeedProps> = ({ communityId, limit, posts: propPosts, initialPosts }) => {
    const { user, profile } = useUser();

    const [posts, setPosts] = useState<CommunityPost[]>(propPosts || initialPosts || []);
    const [isLoadingPosts, setIsLoadingPosts] = useState(!propPosts && !initialPosts);

    useEffect(() => {
        if (propPosts || initialPosts) {
            setPosts(propPosts || initialPosts || []);
            setIsLoadingPosts(false);
        } else {
            loadPosts();
        }
    }, [communityId, user?.id, propPosts, initialPosts]);

    const loadPosts = async () => {
        if (!user) return;
        setIsLoadingPosts(true);
        try {
            let fetchedPosts: CommunityPost[];

            if (communityId) {
                fetchedPosts = await communityService.getPosts(communityId, user.id);
            } else {
                fetchedPosts = await communityService.getGlobalFeed(user.id);
            }

            if (limit) {
                fetchedPosts = fetchedPosts.slice(0, limit);
            }

            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Failed to load posts', error);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    const handlePostCreated = (post: CommunityPost) => {
        setPosts([post, ...posts]);
    };

    const handleLike = async (post: CommunityPost) => {
        if (!user) return;

        // Optimistic update
        const newLikedState = !post.hasLiked;
        const newLikesCount = newLikedState ? post.likes + 1 : Math.max(0, post.likes - 1);

        setPosts(prev => prev.map(p =>
            p.id === post.id
                ? { ...p, hasLiked: newLikedState, likes: newLikesCount }
                : p
        ));

        await communityService.toggleLike(post.id, user.id, post.likes, post.hasLiked);
    };

    const handleCommentSubmit = async (postId: string, text: string) => {
        if (!user) return;

        // Optimistic Update
        const tempId = `temp-${Date.now()}`;
        const tempComment = {
            id: tempId,
            user: profile?.display_name || user.email?.split('@')[0] || 'Member',
            avatar: profile?.avatar_url || 'https://picsum.photos/seed/default/100/100',
            text: text,
            time: 'Just now'
        };

        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return { ...p, comments: [tempComment, ...(p.comments || [])] };
            }
            return p;
        }));

        try {
            const newComment = await communityService.addComment(
                postId,
                user.id,
                profile?.display_name || user.email?.split('@')[0] || 'Member',
                profile?.avatar_url || 'https://picsum.photos/seed/default/100/100',
                text
            );

            if (newComment) {
                // Replace temp comment
                setPosts(prev => prev.map(p => {
                    if (p.id === postId) {
                        return {
                            ...p,
                            comments: p.comments.map(c => c.id === tempId ? newComment : c)
                        };
                    }
                    return p;
                }));
            }
        } catch (err) {
            console.error("Failed to add comment", err);
            // Revert
        }
    };

    return (
        <div className="space-y-6">
            {/* Create Post Widget - Only show if in a specific community */}
            {communityId && (
                <CreatePostWidget communityId={communityId} onPostCreated={handlePostCreated} />
            )}

            {isLoadingPosts ? (
                <div className="space-y-6">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white/5 rounded-3xl p-5 border border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-10 !rounded-full shrink-0" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-32 mb-2" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-48 w-full !rounded-2xl" />
                        </div>
                    ))}
                </div>
            ) : limit ? (
                posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onComment={handleCommentSubmit}
                    />
                ))
            ) : (
                <Virtuoso
                    useWindowScroll
                    data={posts}
                    itemContent={(index, post) => (
                        <div className="pb-6">
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={handleLike}
                                onComment={handleCommentSubmit}
                            />
                        </div>
                    )}
                />
            )}

            {!isLoadingPosts && posts.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    {communityId ? 'No posts yet. Be the first to share!' : 'Your feed is empty. Join some communities!'}
                </div>
            )}
        </div>
    );
};
