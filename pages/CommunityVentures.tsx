import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Community, Trip } from '../types';
import { useUser } from '../contexts/UserContext';
import { communityService } from '../services/communityService';
import { TripSuggestionCard } from '../components/TripSuggestionCard';
import { CreateSuggestionModal } from '../components/CreateSuggestionModal';
import { useToast } from '../contexts/ToastContext';
import BackToTop from '../components/BackToTop';

interface Props {
    community: Community;
    onBack: () => void;
    onSelectTrip: (trip: Trip) => void;
}

const CommunityVentures: React.FC<Props> = ({ community, onBack, onSelectTrip }) => {
    const { user } = useUser();
    const { error: errorToast } = useToast();
    const [showSuggestModal, setShowSuggestModal] = useState(false);

    // Venture Lab State
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [isVoting, setIsVoting] = useState<string | null>(null);
    const [budgetFilter, setBudgetFilter] = useState<'all' | 'Eco' | 'Mid' | 'Luxury'>('all');
    const [sortBy, setSortBy] = useState<'votes' | 'recent' | 'discussed'>('votes');

    // Trips State
    const [trips, setTrips] = useState<Trip[]>(() => {
        // If we have full trip data (e.g. image is present), use it initially
        if (community.upcomingTrips && community.upcomingTrips.length > 0 && community.upcomingTrips[0].image) {
            return community.upcomingTrips;
        }
        return [];
    });
    const [isLoadingTrips, setIsLoadingTrips] = useState(false);

    // Keep suggestions in a ref to use in callbacks without triggering re-renders or recreating callbacks
    const suggestionsRef = useRef(suggestions);
    useEffect(() => {
        suggestionsRef.current = suggestions;
    }, [suggestions]);

    useEffect(() => {
        if (community.id) {
            loadSuggestions();
            loadTrips();
        }
    }, [community.id, user?.id]);

    const loadSuggestions = async () => {
        setIsLoadingSuggestions(true);
        const currentUserId = user?.id;
        const fetchedSuggestions = await communityService.getSuggestions(community.id, currentUserId);
        setSuggestions(fetchedSuggestions);
        setIsLoadingSuggestions(false);
    };

    const loadTrips = async () => {
        // If we already have trips populated from props (and they look complete), we might skip?
        // But refreshing is safer.
        setIsLoadingTrips(true);
        const fetchedTrips = await communityService.getCommunityTrips(community.id);
        if (fetchedTrips && fetchedTrips.length > 0) {
            setTrips(fetchedTrips);
        }
        setIsLoadingTrips(false);
    };

    const handleVote = useCallback(async (id: string, dir: 'up' | 'down') => {
        if (!user || isVoting) return;

        setIsVoting(id);

        // Optimistic Update
        const previousSuggestions = [...suggestionsRef.current];
        setSuggestions(prev => prev.map(s => {
            if (s.id === id) {
                let newVotes = s.votes || 0;
                let newMyVote: 'up' | 'down' | null = dir;

                if (s.myVote === dir) {
                    // Toggling off
                    newVotes -= (dir === 'up' ? 1 : -1);
                    newMyVote = null;
                } else if (s.myVote) {
                    // Switching
                    newVotes += (dir === 'up' ? 2 : -2);
                } else {
                    // New vote
                    newVotes += (dir === 'up' ? 1 : -1);
                }

                return { ...s, votes: newVotes, myVote: newMyVote };
            }
            return s;
        }));

        try {
            await communityService.voteSuggestion(id, user.id, dir);
        } catch (error) {
            console.error("Voting failed", error);
            // Revert on error
            setSuggestions(previousSuggestions);
            errorToast("Failed to vote. Please try again.");
        } finally {
            setIsVoting(null);
        }
    }, [user, isVoting, errorToast]); // removed suggestions dependency

    const handleAddCommentToSuggestion = useCallback(async (suggestionId: string, text: string) => {
        if (!user) return;

        // Optimistic Update
        const tempId = `temp-${Date.now()}`;
        const tempComment = {
            id: tempId,
            user: user.email?.split('@')[0] || 'Member',
            avatar: 'https://picsum.photos/seed/user/100/100',
            text: text,
            time: 'Just now'
        };

        setSuggestions(prev => prev.map(s => {
            if (s.id === suggestionId) {
                return { ...s, comments: [tempComment, ...s.comments] };
            }
            return s;
        }));

        try {
            const newComment = await communityService.addSuggestionComment(
                suggestionId,
                user.id,
                user.email?.split('@')[0] || 'Member',
                'https://picsum.photos/seed/user/100/100',
                text
            );

            if (newComment) {
                // Replace temp comment with real one
                setSuggestions(prev => prev.map(s => {
                    if (s.id === suggestionId) {
                        return {
                            ...s,
                            comments: s.comments.map(c => c.id === tempId ? newComment : c)
                        };
                    }
                    return s;
                }));
            }
        } catch (err) {
            console.error('Error adding suggestion comment:', err);
            // Revert
            setSuggestions(prev => prev.map(s => {
                if (s.id === suggestionId) {
                    return { ...s, comments: s.comments.filter(c => c.id !== tempId) };
                }
                return s;
            }));
            errorToast('Failed to add comment.');
        }
    }, [user, errorToast]); // removed suggestions dependency

    // Filter and sort suggestions based on user selections
    const filteredSuggestions = useMemo(() => {
        let filtered = [...suggestions];

        // Filter by budget tier
        if (budgetFilter !== 'all') {
            filtered = filtered.filter(sug => sug.budgetTier === budgetFilter);
        }

        // Sort suggestions
        if (sortBy === 'votes') {
            filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        } else if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime());
        } else if (sortBy === 'discussed') {
            filtered.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        }

        return filtered;
    }, [suggestions, budgetFilter, sortBy]);

    return (
        <div className="flex flex-col min-h-full bg-background text-[#14532D] font-body selection:bg-accent selection:text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-white/90 to-transparent backdrop-blur-sm">
                <button onClick={onBack} className="bg-white text-primary p-2 rounded-full flex items-center justify-center hover:bg-primary/5 transition-colors border border-primary/10 shadow-sm">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h1 className="text-primary font-heading font-black text-lg tracking-tight uppercase">{community.title} Ventures</h1>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            <main className="px-6 pt-24 pb-32 max-w-5xl mx-auto w-full space-y-8">

                {/* Intro / Action */}
                <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-9xl">rocket_launch</span>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-primary font-heading font-black text-3xl uppercase italic tracking-tight mb-2">The Venture Lab</h2>
                        <p className="text-primary/70 text-sm font-medium max-w-lg mb-6">
                            This is where our next journey looks like. Pitch your dream destination, vote on community proposals, and shape the future of our travel tribe.
                        </p>
                        <button
                            onClick={() => setShowSuggestModal(true)}
                            className="bg-primary text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            <span className="material-symbols-outlined text-xl">add_circle</span>
                            Pitch a New Trip
                        </button>
                    </div>
                </div>

                {/* Confirmed Trips Section */}
                {(isLoadingTrips || trips.length > 0) && (
                    <div>
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <span className="material-symbols-outlined text-primary">verified</span>
                            <h3 className="text-primary text-sm font-black uppercase tracking-widest">Locked & Loaded (Confirmed)</h3>
                        </div>
                        {isLoadingTrips && trips.length === 0 ? (
                             <div className="py-10 text-center text-slate-500 text-xs">Loading trips...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(trips || []).map(trip => (
                                    <div
                                        key={trip.id}
                                        onClick={() => onSelectTrip(trip)}
                                        className="bg-white border border-primary/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all active:scale-98 shadow-sm cursor-pointer group flex"
                                    >
                                        <div className="w-32 relative">
                                            <img src={trip.image} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute inset-0 bg-black/10"></div>
                                        </div>
                                        <div className="flex-1 p-5 flex flex-col justify-center">
                                            <div className="bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md self-start mb-2 border border-green-200">Confirmed</div>
                                            <h3 className="text-primary font-bold text-lg leading-tight mb-2 group-hover:text-accent transition-colors">{trip.title}</h3>
                                            <div className="flex flex-col gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> {trip.dates}</span>
                                                <span className="flex items-center gap-1 text-primary"><span className="material-symbols-outlined text-sm">payments</span> {trip.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Filters */}
                <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md py-4 border-b border-primary/5 -mx-6 px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap shrink-0">Budget:</span>
                            {(['all', 'Eco', 'Mid', 'Luxury'] as const).map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => setBudgetFilter(tier)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border shrink-0 ${budgetFilter === tier ? 'bg-primary border-primary text-white' : 'bg-white/5 border-primary/10 text-slate-500 hover:text-primary hover:border-primary/30'}`}
                                >
                                    {tier === 'all' ? 'All' : tier}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap shrink-0">Sort:</span>
                            {(['votes', 'recent', 'discussed'] as const).map(option => (
                                <button
                                    key={option}
                                    onClick={() => setSortBy(option)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap border shrink-0 transition-all ${sortBy === option ? 'bg-primary border-primary text-white' : 'bg-white/5 border-primary/10 text-slate-500 hover:text-primary hover:border-primary/30'}`}
                                >
                                    {option === 'votes' ? 'Most Votes' : option === 'recent' ? 'Newest' : 'Hot'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Proposals List */}
                {isLoadingSuggestions ? (
                    <div className="py-20 text-center">
                        <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading proposals...</p>
                    </div>
                ) : suggestions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredSuggestions.map(sug => (
                            <TripSuggestionCard
                                key={sug.id}
                                suggestion={sug}
                                onVote={handleVote}
                                onAddComment={handleAddCommentToSuggestion}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-primary/10">
                        <div className="size-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-primary/40 text-4xl">add_location_alt</span>
                        </div>
                        <p className="text-primary text-sm font-black uppercase tracking-widest">No pitches yet</p>
                        <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto">The lab is empty. Be the visionary who suggests the first adventure!</p>
                    </div>
                )}

                <BackToTop />
            </main>

            <CreateSuggestionModal
                isOpen={showSuggestModal}
                onClose={() => setShowSuggestModal(false)}
                communityId={community.id}
                onSuggestionCreated={(newSug) => setSuggestions(prev => [newSug, ...prev])}
            />
        </div>
    );
};

export default CommunityVentures;
