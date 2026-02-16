import React, { useState, useEffect, useCallback } from 'react';
import { Trip, TripSuggestion } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { communityService } from '../services/communityService';
import { TripSuggestionCard } from '../components/TripSuggestionCard';
import { CreateSuggestionModal } from '../components/CreateSuggestionModal';
import { ChatInterface } from '../components/ChatInterface';
import { Feed } from '../components/Feed';
import { SEO } from '../components/SEO';

interface Props {
  trip: Trip;
  onBack: () => void;
  onBook: () => void;
  onOpenChat?: () => void;
  isBooking?: boolean;
}

const TripDetails: React.FC<Props> = ({ trip, onBack, onBook, onOpenChat, isBooking }) => {
  const navigate = useNavigate();
  const { user, profile, bookedTripIds } = useUser();
  const { success } = useToast();
  /* State */
  const [activeView, setActiveView] = useState<'group' | 'chat' | 'docs' | 'lab'>('group');
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestions, setSuggestions] = useState<TripSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Logic to determine if user has access (booked)
  const isBooked = bookedTripIds?.includes(trip.id);

  /* Effects */
  useEffect(() => {
    if (activeView === 'chat' && !isBooked) {
      // If user tries to access chat without booking, switch back to group
      setActiveView('group');
    }
  }, [activeView, isBooked]);

  useEffect(() => {
    if (trip.communityId) {
      loadSuggestions();
    }
  }, [trip.communityId]);

  /* Handlers */
  const loadSuggestions = async () => {
    if (!trip.communityId) return;
    setIsLoadingSuggestions(true);
    try {
      const fetched = await communityService.getSuggestions(trip.communityId, user?.id);
      setSuggestions(fetched);
    } catch (e) {
      console.error("Failed to load suggestions", e);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleVote = useCallback(async (id: string, dir: 'up' | 'down') => {
    if (!user) return;
    const success = await communityService.voteSuggestion(id, user.id, dir);
    if (success) {
      setSuggestions(prev => prev.map(s => {
        if (s.id !== id) return s;
        // Optimistic update logic
        const currentVote = s.myVote;
        let voteChange = 0;
        if (currentVote === dir) {
          voteChange = (dir === 'up' ? -1 : 1); // remove
          return { ...s, myVote: null, votes: s.votes + voteChange };
        } else if (currentVote) {
          voteChange = (dir === 'up' ? 2 : -2); // switch
          return { ...s, myVote: dir, votes: s.votes + voteChange };
        } else {
          voteChange = (dir === 'up' ? 1 : -1); // new
          return { ...s, myVote: dir, votes: s.votes + voteChange };
        }
      }));
    }
  }, [user]);

  const handleAddComment = useCallback(async (id: string, text: string) => {
    if (!user || !profile) return;
    const newComment = await communityService.addSuggestionComment(id, user.id, profile.display_name, profile.avatar_url, text);
    if (newComment) {
      setSuggestions(prev => prev.map(s => {
        if (s.id !== id) return s;
        return { ...s, comments: [...(s.comments || []), newComment] };
      }));
    }
  }, [user, profile]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF5] text-[#14532D] font-body selection:bg-accent selection:text-white">
      <SEO
        title={trip.title}
        description={`Join the ${trip.title} trip to ${trip.destination}.`}
        image={trip.image}
      />
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <button onClick={onBack} className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors active:scale-90 pointer-events-auto">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
      </header>

      <div className="relative h-[45vh] w-full shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(0deg, #FCFBF5 0%, rgba(252, 251, 245,0.4) 40%, transparent 100%), url('${trip.image}')` }}></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-accent/20 backdrop-blur-md text-accent border border-accent/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{trip.status}</span>
            <span className="bg-primary/20 backdrop-blur-md text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{trip.dates}</span>
          </div>
          <h1 className="text-primary text-4xl font-heading font-black leading-tight tracking-tight italic uppercase">{trip.title}</h1>
          <p className="text-primary/60 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {trip.destination}
          </p>
        </div>
      </div>

      <main className="flex-1 flex flex-col gap-6 px-4 pb-40 -mt-2 relative z-10 bg-[#FCFBF5] rounded-t-[2rem] pt-8 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">

        {/* Action Bar */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/global-feed')}
            className="flex flex-col items-center justify-center gap-1 bg-white border border-primary/10 p-4 rounded-2xl shadow-sm hover:border-accent/50 hover:shadow-md transition-all group"
          >
            <span className="material-symbols-outlined text-accent text-2xl group-hover:scale-110 transition-transform">public</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Ask Global Community</span>
          </button>
          <button
            onClick={() => isBooked ? setActiveView('chat') : onBook()}
            disabled={isBooking}
            className={`flex flex-col items-center justify-center gap-1 p-4 rounded-2xl shadow-lg transition-all active:scale-95 ${isBooked ? 'bg-primary text-white shadow-primary/30' : 'bg-accent text-white shadow-accent/30'}`}
          >
            {isBooking ? (
              <span className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined text-2xl">{isBooked ? 'forum' : 'airplane_ticket'}</span>
                <span className="text-[9px] font-black uppercase tracking-widest">{isBooked ? 'Open Team Chat' : 'Reserve Spot'}</span>
              </>
            )}
          </button>
        </div>

        <div className="flex bg-primary/5 p-1 rounded-2xl ring-1 ring-primary/10 overflow-x-auto">
          <button onClick={() => setActiveView('group')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeView === 'group' ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:bg-primary/5'}`}>
            <span className="material-symbols-outlined text-sm">groups</span>
            <span className="hidden sm:inline">The Group</span>
            <span className="sm:hidden">Group</span>
          </button>

          {isBooked && (
            <button onClick={() => setActiveView('chat')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeView === 'chat' ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:bg-primary/5'}`}>
              <span className="material-symbols-outlined text-sm">chat</span>
              Chat
            </button>
          )}

          <button onClick={() => setActiveView('docs')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeView === 'docs' ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:bg-primary/5'}`}>
            <span className="material-symbols-outlined text-sm">description</span>
            <span className="hidden sm:inline">Docs</span>
            <span className="sm:hidden">Docs</span>
          </button>

          <button onClick={() => setActiveView('lab')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeView === 'lab' ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:bg-primary/5'}`}>
            <span className="material-symbols-outlined text-sm">science</span>
            <span className="hidden sm:inline">Lab</span>
            <span className="sm:hidden">Lab</span>
          </button>
        </div>

        {activeView === 'group' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Roster Section */}
            <div>
              <h3 className="text-primary text-xl font-heading font-black italic uppercase tracking-tighter">Squad Roster</h3>
              <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                {isBooked ? `${trip.membersCount} Confirmed Travellers` : 'Join the group to unlock profiles'}
              </p>
            </div>

            {isBooked ? (
              // Unlocked View
              <div className="space-y-8">
                {/* Member Grid - Collapsible or horizontal scroll */}
                <div className="bg-white p-4 rounded-[2rem] border border-primary/5 shadow-sm">
                  <div className="flex -space-x-3 overflow-x-auto pb-2 scrollbar-none">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                      <img key={i} className="inline-block size-12 rounded-full ring-2 ring-white cursor-pointer hover:scale-110 transition-transform hover:z-10" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Member" title={`Member ${i}`} />
                    ))}
                    <div className="size-12 rounded-full bg-primary/10 ring-2 ring-white flex items-center justify-center text-[10px] font-black text-primary">
                      +{trip.membersCount > 7 ? trip.membersCount - 7 : 0}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 px-1">
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Team Online</p>
                    <button onClick={() => setActiveView('chat')} className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline flex items-center gap-1">
                      Open Chat <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Trip Feed */}
                <div>
                  <h3 className="text-primary text-xl font-heading font-black italic uppercase tracking-tighter mb-4">Trip Feed</h3>
                  <Feed
                    context="trip"
                    contextId={trip.id}
                    initialPosts={[
                      {
                        id: 'welcome-post',
                        author: 'Eva Guide',
                        authorAvatar: 'https://i.pravatar.cc/150?img=32',
                        role: 'Lead Guide',
                        content: `Welcome to the official feed for ${trip.title}! This is your space to share excitement, gear tips, and coordinate before we fly. ✈️`,
                        likes: 12,
                        hasLiked: false,
                        comments: [],
                        time: '2 days ago',
                        timestamp: Date.now()
                      }
                    ]}
                  />
                </div>
              </div>
            ) : (
              // Locked View
              <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-primary/5 text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 pattern-grid-lg opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                    <span className="material-symbols-outlined text-3xl">lock</span>
                  </div>
                  <h3 className="text-primary text-lg font-black uppercase italic">Classified Access</h3>
                  <p className="text-primary/60 text-xs font-medium max-w-xs mx-auto leading-relaxed">
                    The roster and dedicated tactical feed are reserved for confirmed team members. Secure your spot to meet your group.
                  </p>
                  <button onClick={onBook} className="mt-2 text-accent text-[10px] font-black uppercase tracking-widest hover:underline">
                    Reserve your spot now
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'chat' && isBooked && (
          <div className="h-[600px] bg-white rounded-[2.5rem] shadow-inner border border-primary/5 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <ChatInterface
              id={trip.id}
              title={`Chat: ${trip.title}`}
              subtitle="Team Channel"
              type="trip"
              embedded={true}
            />
          </div>
        )}

        {activeView === 'docs' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-primary text-xl font-heading font-black italic uppercase tracking-tighter text-glow-accent">Journey Brief</h3>
              <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest mt-1">Pre-departure materials</p>
            </div>

            {isBooked ? (
              <div className="grid gap-4">
                {[
                  { title: 'Mission Protocol', type: 'PDF • 2.4MB', icon: 'shield_with_heart' },
                  { title: 'Packing Strategy', type: 'PDF • 1.1MB', icon: 'hiking' },
                  { title: 'Travel Insurance', type: 'Action Required', icon: 'verified_user', urgent: true },
                  { title: 'Impact Agreement', type: 'Signed', icon: 'assignment_turned_in' }
                ].map((doc, idx) => (
                  <div key={idx} className={`bg-white p-5 rounded-3xl border ${doc.urgent ? 'border-accent/40 bg-accent/5' : 'border-primary/5'} flex items-center gap-4 group hover:border-accent transition-all cursor-pointer`}>
                    <div className={`size-12 rounded-2xl flex items-center justify-center ${doc.urgent ? 'bg-accent/10 text-accent' : 'bg-primary/5 text-primary'}`}>
                      <span className="material-symbols-outlined">{doc.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-primary font-black uppercase italic text-sm">{doc.title}</h4>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${doc.urgent ? 'text-accent' : 'text-primary/40'}`}>{doc.type}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary/20 group-hover:text-accent transition-colors">download</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-primary/5 text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 pattern-lines opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                    <span className="material-symbols-outlined text-3xl">folder_off</span>
                  </div>
                  <h3 className="text-primary text-lg font-black uppercase italic">Documents Locked</h3>
                  <p className="text-primary/60 text-xs font-medium max-w-xs mx-auto leading-relaxed">
                    Mission protocols, packing lists, and insurance uploads will be available here after booking confirmation.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'lab' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-primary text-xl font-heading font-black italic uppercase tracking-tighter">Venture Lab</h3>
                <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest mt-1">Shape future expeditions</p>
              </div>
              <button
                onClick={() => setShowSuggestModal(true)}
                className="bg-primary text-white p-3 rounded-xl shadow-lg border border-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Pitch Idea</span>
              </button>
            </div>

            {isLoadingSuggestions ? (
              <div className="text-center py-10 text-primary/40">Loading ideas...</div>
            ) : (
              <div className="space-y-6">
                {suggestions.map(sug => (
                  <TripSuggestionCard
                    key={sug.id}
                    suggestion={sug}
                    onVote={handleVote}
                    onAddComment={handleAddComment}
                  />
                ))}
                {suggestions.length === 0 && (
                  <div className="text-center py-10 bg-white border border-primary/5 rounded-[2rem]">
                    <span className="material-symbols-outlined text-4xl text-primary/20 mb-2">lightbulb</span>
                    <p className="text-primary/60 text-xs font-bold uppercase tracking-widest">No proposals yet</p>
                    <p className="text-primary/40 text-[10px] mt-1">Be the first to pitch a new adventure!</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        <CreateSuggestionModal
          isOpen={showSuggestModal}
          onClose={() => setShowSuggestModal(false)}
          communityId={trip.communityId}
          onSuggestionCreated={(newSug) => setSuggestions(prev => [newSug, ...prev])}
        />
      </main>
    </div>
  );
};

export default TripDetails;
