import React, { useState } from 'react';
import { TripSuggestion } from '../types';

interface TripSuggestionCardProps {
    suggestion: TripSuggestion;
    onVote: (id: string, dir: 'up' | 'down') => void;
    onAddComment: (id: string, text: string) => void;
}

export const TripSuggestionCard = React.memo<TripSuggestionCardProps>(({ suggestion, onVote, onAddComment }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onAddComment(suggestion.id, commentText);
            setCommentText('');
        }
    };

    return (
        <div className="bg-white border border-primary/10 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300 p-5 group">
            <div className="flex gap-4">
                <div className="flex flex-col items-center bg-primary/5 rounded-2xl border border-primary/10 overflow-hidden shrink-0 h-fit">
                    <button onClick={() => onVote(suggestion.id, 'up')} className={`p-2 transition-all ${suggestion.myVote === 'up' ? 'text-accent' : 'text-primary/40 hover:text-primary'}`}>
                        <span className="material-symbols-outlined font-black">keyboard_arrow_up</span>
                    </button>
                    <span className={`text-xs font-black ${suggestion.myVote === 'up' ? 'text-accent' : suggestion.myVote === 'down' ? 'text-red-400' : 'text-primary'}`}>{suggestion.votes}</span>
                    <button onClick={() => onVote(suggestion.id, 'down')} className={`p-2 transition-all ${suggestion.myVote === 'down' ? 'text-red-400' : 'text-primary/40 hover:text-primary'}`}>
                        <span className="material-symbols-outlined font-black">keyboard_arrow_down</span>
                    </button>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <img src={suggestion.avatar} className="size-5 rounded-full" alt="" />
                            <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{suggestion.suggestedBy}</span>
                        </div>
                        <span className="text-[8px] font-bold text-primary/40 uppercase">{suggestion.timestamp}</span>
                    </div>
                    <h4 className="text-primary font-black text-lg italic tracking-tight leading-none mb-1">{suggestion.destination}</h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <div className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg text-[8px] font-black text-primary uppercase">{suggestion.budget} Budget</div>
                        <div className="bg-white/5 border border-primary/5 px-2 py-0.5 rounded-lg text-[8px] font-black text-slate-400 uppercase">{suggestion.style}</div>
                        <div className="bg-white/5 border border-primary/5 px-2 py-0.5 rounded-lg text-[8px] font-black text-slate-400 uppercase">{suggestion.duration}</div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ingredients</p>
                        <div className="flex flex-wrap gap-1.5">
                            {suggestion.ingredients.map(ing => (
                                <span key={ing} className="bg-primary/5 px-2 py-1 rounded-md text-[10px] text-primary/70 border border-primary/10 leading-none">{ing}</span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-primary/5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <span className="material-symbols-outlined text-xs">flight_takeoff</span>
                            <span className="text-[9px] font-bold">From: {suggestion.travelFrom}</span>
                        </div>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className={`text-[9px] font-black uppercase tracking-widest transition-all ${showComments ? 'text-primary' : 'text-accent hover:underline'}`}
                        >
                            {showComments ? 'Close Discussion' : `Discuss (${suggestion.comments?.length || 0})`}
                        </button>
                    </div>
                </div>
            </div>

            {showComments && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 bg-primary/5 -mx-5 -mb-5 p-5 border-t border-primary/10">
                    <form onSubmit={handleCommentSubmit} className="flex gap-3">
                        <img src="https://picsum.photos/seed/alex/100/100" className="size-8 rounded-full border border-primary/20" alt="Your avatar" />
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full bg-white border border-primary/10 rounded-full px-4 py-2 text-[11px] text-primary focus:border-accent outline-none transition-all placeholder:text-primary/40"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-base">send</span>
                            </button>
                        </div>
                    </form>

                    <div className="space-y-4">
                        {(suggestion.comments || []).map(comment => (
                            <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <img src={comment.avatar} className="size-7 rounded-full shrink-0 border border-primary/10" alt="" />
                                <div className="bg-white rounded-2xl p-3 flex-1 border border-primary/5 shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-[10px] font-black uppercase tracking-tight ${comment.user === 'Alex Sterling' ? 'text-accent' : 'text-primary'}`}>
                                            {comment.user}
                                        </span>
                                        <span className="text-[8px] text-primary/40 font-bold uppercase">{comment.time}</span>
                                    </div>
                                    <p className="text-[11px] text-primary/70 leading-normal">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                        {(!suggestion.comments || suggestion.comments.length === 0) && (
                            <p className="text-center text-[10px] text-primary/40 font-bold uppercase tracking-widest py-4">No comments yet. Be the first to discuss!</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});
