import React, { useState, useEffect } from 'react';
import { Community, Trip, CommunityEvent, CommunityResource } from '../types';
import { useUser } from '../contexts/UserContext';
import { communityService } from '../services/communityService';
import { Feed } from '../components/Feed';
import { HowItWorks } from '../components/HowItWorks';
import { CommunityEvents } from '../components/CommunityEvents';
import { CommunityResources } from '../components/CommunityResources';
import { useToast } from '../contexts/ToastContext';
import { SEO } from '../components/SEO';

interface Props {
  community: Community;
  onBack: () => void;
  onSelectTrip: (trip: Trip) => void;
  onJoin: (community: Community) => void;
  onOpenChat?: () => void;
  onManage?: () => void;
}

const CommunityDetails: React.FC<Props> = ({ community, onBack, onSelectTrip, onJoin, onOpenChat, onManage }) => {
  const { user, isMember, joinCommunity } = useUser();
  const { error: errorToast } = useToast();
  const [isJoined, setIsJoined] = useState(false);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [resources, setResources] = useState<CommunityResource[]>([]);

  const [feedScope, setFeedScope] = useState<'community' | 'global'>('community');

  useEffect(() => {
    if (community.id) {
      setIsJoined(isMember(community.id));
      loadCommunityData();
    }
  }, [community.id, user?.id, isMember]);

  const loadCommunityData = async () => {
    const [fetchedEvents, fetchedResources] = await Promise.all([
      communityService.getEvents(community.id),
      communityService.getResources(community.id)
    ]);
    setEvents(fetchedEvents);
    setResources(fetchedResources);
  };

  const handleJoinClick = async () => {
    if (community.accessType === 'free') {
      const previousState = isJoined;
      setIsJoined(true);
      try {
        await joinCommunity(community.id);
        onJoin(community);
      } catch (error) {
        console.error("Failed to join community", error);
        setIsJoined(previousState);
        errorToast("Failed to join community. Please try again.");
      }
    } else {
      onJoin(community);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background text-[#14532D] font-body selection:bg-accent selection:text-white">
      <SEO
        title={community.title}
        description={community.description || `Join the ${community.title} community on EVA.`}
        image={community.image}
      />
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <button onClick={onBack} className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors pointer-events-auto">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex gap-2 pointer-events-auto">
          {community.isManaged && onManage && (
            <button
              onClick={onManage}
              className="bg-primary text-white font-black px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 animate-pulse border border-primary/50"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              <span className="text-xs uppercase tracking-widest">Manage Community</span>
            </button>
          )}
          <button className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      <div className="relative h-[280px] w-full overflow-hidden shrink-0">
        <img src={community.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FCFBF5] via-[#FCFBF5]/20 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
              {community.category}
            </span>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
              <span className="text-white text-[8px] font-black uppercase tracking-widest">{Math.floor(Math.random() * 20) + 5} Active Now</span>
            </div>
          </div>
          <h1 className="text-primary text-3xl font-heading font-black leading-tight tracking-tight">{community.title}</h1>
          <p className="text-primary/60 text-xs font-bold uppercase tracking-widest mt-1">{community.memberCount} Members</p>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-10 flex gap-4">
        {!isJoined ? (
          <button
            onClick={handleJoinClick}
            className="flex-1 bg-primary text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">{community.accessType === 'request' ? 'lock' : 'add_circle'}</span>
            {community.accessType === 'request' ? 'Request Access' : 'Join Community'}
          </button>
        ) : (
          <button
            onClick={onOpenChat}
            className="flex-1 bg-white text-primary font-black py-4 rounded-2xl text-sm shadow-sm border border-primary/10 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">forum</span>
            Open Community Chat
          </button>
        )}
      </div>

      <main className="px-6 py-8 pb-32 max-w-7xl mx-auto space-y-8">

        {/* Onboarding Section */}
        <HowItWorks communityName={community.title} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Main Feed (60%) */}
          <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-primary font-heading font-black text-xl uppercase italic tracking-tight">Community Pulse</h2>

              {/* Feed Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFeedScope('community')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${feedScope === 'community' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
                >
                  {community.title} Community
                </button>
                <button
                  onClick={() => setFeedScope('global')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${feedScope === 'global' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
                >
                  Global
                </button>
              </div>
            </div>

            {/* Feed Component */}
            <Feed communityId={feedScope === 'community' ? community.id : undefined} />
          </div>

          {/* RIGHT COLUMN: Sidebar & Tools (40%) */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">

            {/* 1. Quick Access / Connect */}
            <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-6 border border-primary/5 shadow-sm space-y-4">
              <h3 className="text-primary text-xs font-black uppercase tracking-widest mb-2 opacity-60">Connect</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onOpenChat}
                  className="bg-primary/5 hover:bg-primary/10 text-primary p-4 rounded-2xl flex flex-col items-center gap-2 transition-colors border border-primary/10"
                >
                  <span className="material-symbols-outlined text-2xl">forum</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Ask Community</span>
                </button>
                <button
                  onClick={() => errorToast("Direct messaging with the team is coming soon!")}
                  className="bg-white hover:bg-slate-50 text-slate-600 p-4 rounded-2xl flex flex-col items-center gap-2 transition-colors border border-slate-200"
                >
                  <span className="material-symbols-outlined text-2xl">support_agent</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Ask Team</span>
                </button>
              </div>
            </div>

            {/* 2. Upcoming Events */}
            <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-6 border border-primary/5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-primary text-xs font-black uppercase tracking-widest opacity-60">Upcoming Meetups</h3>
                <button className="text-[10px] font-bold text-accent hover:underline">View Calendar</button>
              </div>
              <CommunityEvents
                events={events}
                onRSVP={async (id) => {
                  const success = await communityService.toggleEventRSVP(id, user?.id || 'anon');
                  if (success) {
                    setEvents(prev => prev.map(e =>
                      e.id === id ? {
                        ...e,
                        isAttending: !e.isAttending,
                        attendees: e.isAttending ? e.attendees - 1 : e.attendees + 1
                      } : e
                    ));
                  }
                }}
                onAddEvent={async (newEvent) => {
                  if (community.id) {
                    const created = await communityService.createEvent(community.id, newEvent, user?.id || 'anon');
                    if (created) setEvents([...events, created]);
                  }
                }}
              />
            </div>

            {/* 3. Resources */}
            <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-6 border border-primary/5 shadow-sm space-y-4">
              <h3 className="text-primary text-xs font-black uppercase tracking-widest opacity-60">Community Resources</h3>
              <CommunityResources
                resources={resources}
                onAddResource={async (newRes) => {
                  if (community.id) {
                    const added = await communityService.addResource(community.id, newRes, user?.id || 'anon');
                    if (added) setResources([...resources, added]);
                  }
                }}
              />
            </div>

            {/* 3. Members Preview (with Contactable UI) */}
            <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-6 border border-primary/5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-primary text-xs font-black uppercase tracking-widest opacity-60">Community Members ({community.memberCount})</h3>
                <button className="text-[10px] font-bold text-accent hover:underline">View All</button>
              </div>
              <div className="flex flex-col gap-3">
                {[...Array(Math.min(Number(community.memberCount) || 5, 5))].map((_, i) => (
                  <div key={i} className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-xl transition-colors -mx-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://picsum.photos/seed/member${i}/100/100`}
                        className="size-10 rounded-full border border-white shadow-sm"
                        alt=""
                      />
                      <div>
                        <h4 className="text-primary text-xs font-bold">Member {i + 1}</h4>
                        <p className="text-primary/40 text-[9px] font-bold uppercase">{i === 0 ? 'Owner' : 'Traveler'}</p>
                      </div>
                    </div>
                    {/* Simulator for "Contactable" - random for demo */}
                    {Math.random() > 0.5 ? (
                      <button className="size-8 rounded-full bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">chat</span>
                      </button>
                    ) : (
                      <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Private</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deleted Global Feed Link */}
          </div>

        </div>
      </main>

      {/* Floating Action for Mobile maybe? For now, sticky buttons in Sidebar cover it on Desktop. Mobile stack puts sidebar first/last? Order specific. */}
      {
        isJoined && (
          <button
            onClick={onOpenChat}
            className="fixed bottom-6 right-6 size-14 bg-primary text-white rounded-full shadow-[0_8px_30px_rgba(10,51,44,0.4)] flex items-center justify-center z-50 active:scale-90 transition-transform hover:scale-105 lg:hidden"
          >
            <span className="material-symbols-outlined text-3xl font-black">forum</span>
          </button>
        )
      }
    </div >
  );
};

export default CommunityDetails;
