import React, { useState } from 'react';
import { CommunityPost } from '../types';

interface PostCardProps {
    post: CommunityPost;
    onLike: (post: CommunityPost) => void;
    onComment: (postId: string, text: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleCommentSubmit = () => {
        if (commentText.trim()) {
            onComment(post.id, commentText);
            setCommentText('');
        }
    };

    // Detect if this is a pitch announcement (simple heuristic)
    const isPitchPost = post.content.includes('Just pitched a trip to') || post.content.includes('🚀');

    return (
        <div
            className={`bg-white rounded-3xl p-5 border border-primary/5 space-y-4 shadow-sm ${isPitchPost ? 'cursor-pointer hover:border-accent transition-all' : ''}`}
            onClick={(e) => {
                // Prevent detailed navigation if clicking interactive elements
                if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;

                if (isPitchPost) {
                    // Optional: handle pitch post click if needed globally
                    // For now, parent can handle it via a prop if we need custom click behavior
                    // But strict clicking logic was: setActiveTab('ventures'). 
                    // We might need an onPostClick prop for that. 
                    // Let's implement onPostClick later if strictly needed for this specific interactions.
                    // For now, we'll keep the visual style but maybe not the tab switching unless passed down.
                    const venturesSection = document.querySelector('[data-ventures-section]');
                    if (venturesSection) {
                        venturesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }}
        >
            {post.isPinned && (
                <div className="flex items-center gap-2 text-accent text-[9px] font-black uppercase tracking-widest mb-2">
                    <span className="material-symbols-outlined text-sm rotate-45">push_pin</span>
                    <span>Pinned by Admin</span>
                </div>
            )}

            {isPitchPost && (
                <div className="flex items-center gap-2 text-primary text-[9px] font-black uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                    <span>New Venture Proposal</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3">
                <img src={post.authorAvatar} className="w-10 h-10 rounded-full bg-white/10" alt="" />
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-primary font-black text-sm">{post.author}</span>
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase">{post.role}</span>
                    </div>
                    <span className="text-slate-500 text-xs font-medium">{post.time}</span>
                </div>
            </div>

            {/* Content */}
            <p className="text-primary/80 text-sm leading-relaxed">{post.content}</p>
            {post.image && (
                <img src={post.image} className="w-full h-48 object-cover rounded-2xl" alt="" />
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                <button
                    onClick={() => onLike(post)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${post.hasLiked ? 'text-red-500' : 'text-slate-500 hover:text-primary'}`}
                >
                    <span className={`material-symbols-outlined text-[18px] ${post.hasLiked ? 'fill-current' : ''}`}>favorite</span>
                    {post.likes}
                </button>
                <button
                    onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isCommentsOpen ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                    {post.comments?.length || 0}
                </button>
            </div>

            {/* Comments Section */}
            {isCommentsOpen && (
                <div className="pt-4 space-y-4 animate-fadeIn">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {(post.comments || []).map(comment => (
                            <div key={comment.id} className="flex gap-3">
                                <img src={comment.avatar} className="size-8 rounded-full" alt="" />
                                <div className="bg-slate-50 rounded-2xl p-3 flex-1 border border-primary/5">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-primary text-xs font-bold">{comment.user}</span>
                                        <span className="text-slate-500 text-[10px]">{comment.time}</span>
                                    </div>
                                    <p className="text-slate-600 text-xs">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                        {(!post.comments || post.comments.length === 0) && (
                            <p className="text-center text-slate-600 text-xs py-2 italic">No comments yet. Be the first!</p>
                        )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="flex-1 bg-slate-50 border border-primary/10 rounded-xl px-4 py-2 text-xs text-primary placeholder:text-slate-400 focus:border-primary outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                        />
                        <button
                            onClick={handleCommentSubmit}
                            disabled={!commentText.trim()}
                            className="size-9 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
