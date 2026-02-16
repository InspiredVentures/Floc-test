import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { communityService } from '../services/communityService';
import { aiService } from '../services/aiService';
import { CommunityPost } from '../types';
import { PostCard } from './PostCard';
import { Skeleton } from './Skeleton';

interface FeedProps {
    communityId?: string; // Optional: if null, shows Global Feed
    limit?: number;
}

export const Feed: React.FC<FeedProps> = ({ communityId, limit }) => {
    const { user, profile } = useUser();

    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    // Create Post State
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [isPolishing, setIsPolishing] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadPosts();
    }, [communityId, user?.id]);

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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setNewPostImage(''); // Clear URL input if file is selected
            setShowImageInput(true); // Show the preview area
        }
    };

    const handleAiPolish = async () => {
        if (!newPostContent.trim()) return;
        setIsPolishing(true);
        try {
            const polished = await aiService.polishText(newPostContent);
            setNewPostContent(polished);
        } catch (error) {
            console.error('Failed to polish text', error);
        } finally {
            setIsPolishing(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newPostContent.trim() && !selectedFile && !newPostImage) || !user) return;

        // Safety check: Global Feed posting currently disabled (or requires selecting a community)
        // For now, we only allow posting if communityId is present.
        if (!communityId) {
            alert("Please go to a specific community to post.");
            return;
        }

        setIsPosting(true);
        try {
            let finalImageUrl = newPostImage;

            if (selectedFile) {
                const uploadedUrl = await communityService.uploadImage(selectedFile);
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                } else {
                    alert("Image upload failed! Please make sure you have allowed 'INSERT' access in your storage bucket policies.");
                    setIsPosting(false);
                    return;
                }
            }

            const post = await communityService.createPost(
                communityId,
                newPostContent,
                user.id,
                profile?.display_name || user.email?.split('@')[0] || 'Member',
                profile?.avatar_url || 'https://picsum.photos/seed/default/100/100',
                finalImageUrl
            );

            if (post) {
                setPosts([post, ...posts]);
                setNewPostContent('');
                setNewPostImage('');
                setSelectedFile(null);
                setPreviewUrl(null);
                setShowImageInput(false);
                setShowEmojiPicker(false);
            }
        } catch (err) {
            console.error('Error creating post:', err);
            // errorToast('Failed to create post. Please try again.');
        } finally {
            setIsPosting(false);
        }
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
                <div className="space-y-4">
                    <form onSubmit={handleCreatePost} className="bg-white border border-primary/10 rounded-2xl p-4 flex gap-3 shadow-md">
                        <img src={profile?.avatar_url || "https://picsum.photos/seed/default/100/100"} className="size-10 rounded-full border border-primary/10" alt="" />
                        <div className="flex-1">
                            <input
                                type="text"
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="Share updates, photos, or ask the community..."
                                className="w-full bg-transparent border-none outline-none text-primary text-sm placeholder:text-primary/40 mb-2"
                            />

                            {/* Image Input Area */}
                            {showImageInput && (
                                <div className="mb-3 animate-in fade-in slide-in-from-top-2 space-y-2">
                                    {/* Preview */}
                                    {previewUrl && (
                                        <div className="relative w-fit">
                                            <img src={previewUrl} alt="Preview" className="h-20 rounded-lg border border-white/10" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreviewUrl(null);
                                                }}
                                                className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5"
                                            >
                                                <span className="material-symbols-outlined text-xs">close</span>
                                            </button>
                                        </div>
                                    )}

                                    {!previewUrl && (
                                        <input
                                            type="text"
                                            value={newPostImage}
                                            onChange={(e) => setNewPostImage(e.target.value)}
                                            placeholder="Paste image URL..."
                                            className="w-full bg-slate-50 border border-primary/10 rounded-xl px-3 py-2 text-xs text-primary focus:border-primary outline-none"
                                            autoFocus
                                        />
                                    )}

                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">OR</span>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg text-slate-300 transition-colors"
                                        >
                                            Upload File
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Emoji Picker */}
                            {showEmojiPicker && (
                                <div className="absolute z-50 bg-white border border-primary/10 rounded-2xl shadow-xl p-3 grid grid-cols-6 gap-2 mt-2 w-64">
                                    {['😀', '😂', '😍', '🔥', '🙌', '👍', '🎉', '✈️', '🌍', '📸', '🥥', '🌊'].map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => {
                                                setNewPostContent(prev => prev + emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                            className="text-xl hover:bg-primary/5 p-1 rounded-lg transition-colors"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                <div className="flex gap-2 text-slate-500 relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowImageInput(!showImageInput)}
                                        className={`hover:text-primary transition-colors ${showImageInput ? 'text-primary' : ''}`}
                                    >
                                        <span className="material-symbols-outlined text-lg">image</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className={`hover:text-primary transition-colors ${showEmojiPicker ? 'text-primary' : ''}`}
                                    >
                                        <span className="material-symbols-outlined text-lg">sentiment_satisfied</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAiPolish}
                                        disabled={isPolishing || !newPostContent.trim()}
                                        className={`hover:text-primary transition-colors ${isPolishing ? 'text-primary animate-pulse' : ''} disabled:opacity-50`}
                                        title="Polish with AI"
                                    >
                                        <span className="material-symbols-outlined text-lg">auto_awesome</span>
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={(!newPostContent.trim() && !selectedFile && !newPostImage) || isPosting || isPolishing}
                                    className="bg-primary text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                                >
                                    {isPosting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
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
            ) : posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleCommentSubmit}
                />
            ))}

            {!isLoadingPosts && posts.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    {communityId ? 'No posts yet. Be the first to share!' : 'Your feed is empty. Join some communities!'}
                </div>
            )}
        </div>
    );
};
