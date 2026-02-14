import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Community } from '../types';
import { Skeleton } from '../components/Skeleton';
import { useUser } from '../contexts/UserContext';



const MyCommunities: React.FC = () => {
  const navigate = useNavigate();
  const { joinedCommunityIds, communities, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<'all' | 'managed'>('all');

  // DEBUG LOG
  console.log('[MyCommunities] Render Info:', {
    joinedIDs: joinedCommunityIds,
    totalCommunities: communities.length,
    firstCommunityId: communities[0]?.id
  });

  const joinedCommunities = communities.filter(c => joinedCommunityIds.includes(c.id)).map(c => ({
    ...c,
    unreadCount: c.unreadCount || 0,
    isManaged: c.isManaged || false,
    upcomingTrips: c.upcomingTrips || [],
    accessType: c.accessType || 'free'
  }));

  const filteredCommunities = joinedCommunities.filter(comm =>
    activeTab === 'all' ? true : comm.isManaged
  );

  const displayTitle = joinedCommunities.length === 1 ? 'My Community' : 'My Communities';

  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md px-6 pt-10 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter italic">{displayTitle}</h1>
            <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-black">Your active collectives</p>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 relative ios-blur hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-white text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-1.5 bg-primary rounded-full border-2 border-background-dark"></span>
          </button>
        </div>
      </header>

      <main className="p-6 pb-32 space-y-6">
        <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'all' ? 'bg-white text-background-dark shadow-xl shadow-white/5' : 'text-slate-500 hover:text-white'}`}
          >
            All Circles
          </button>
          <button
            onClick={() => setActiveTab('managed')}
            className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'managed' ? 'bg-white text-background-dark shadow-xl shadow-white/5' : 'text-slate-500 hover:text-white'}`}
          >
            Managed by Me
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden h-[300px]">
                <Skeleton className="h-40 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-12 w-full !rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between pt-4 border-t border-white/5">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCommunities.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredCommunities.map(community => (
              <div
                key={community.id}
                className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/40 transition-all shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/* ... existing card content ... */}
                <div
                  className="relative h-40 cursor-pointer"
                  onClick={() => navigate(`/community/${community.id}`)}
                >
                  <img src={community.image} className="size-full object-cover transition-transform group-hover:scale-105 duration-1000" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                  {community.unreadCount !== undefined && community.unreadCount > 0 && (
                    <div className="absolute top-4 right-6 size-2.5 bg-primary rounded-full animate-notification-pulse shadow-lg border border-background-dark/20"></div>
                  )}

                  {community.isManaged && (
                    <div className="absolute top-4 left-6">
                      <div className="bg-primary/90 backdrop-blur-md text-background-dark text-[8px] font-black px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
                        <span className="material-symbols-outlined text--[10px]">stars</span>
                        Admin
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 inline-block mb-1">{community.category}</span>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white text-xl font-black italic tracking-tight leading-none truncate">{community.title}</h3>
                        {community.unreadCount !== undefined && community.unreadCount > 0 && (
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Glowing Dot Indicator */}
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            {/* Numeric Badge */}
                            <div className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-primary text-background-dark text-[9px] font-black rounded-lg shadow-[0_4px_10px_rgba(255,107,53,0.4)] border border-white/20">
                              {community.unreadCount}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex -space-x-2 shrink-0 ml-4">
                      {[1, 2, 3].map(i => (
                        <img key={i} src={`https://picsum.photos/seed/${community.id}${i}/40/40`} className="size-6 rounded-full border-2 border-background-dark" alt="" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {community.upcomingTrips.length > 0 ? (
                    <div
                      onClick={() => navigate(`/community/${community.id}`)}
                      className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between group/status cursor-pointer active:scale-95 transition-all hover:bg-primary/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                          <span className="material-symbols-outlined text-background-dark font-black">travel_explore</span>
                        </div>
                        <div>
                          <p className="text-primary text-[8px] font-black uppercase tracking-widest leading-none mb-1">Live Venture</p>
                          <h4 className="text-white text-xs font-bold">{community.upcomingTrips[0].title}</h4>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary group-hover/status:translate-x-1 transition-transform">chevron_right</span>
                    </div>
                  ) : (
                    <div
                      onClick={() => navigate(`/community/${community.id}`)}
                      className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between text-slate-500 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">Explore Community Activity</p>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </div>
                  )}

                  {/* Community Mission Snippet */}
                  <p className="mt-4 text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 px-1">
                    {community.description}
                  </p>

                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigate(`/community/${community.id}`)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors"
                      >
                        <span className={`material-symbols-outlined text-sm ${community.unreadCount && community.unreadCount > 0 ? 'text-primary fill-1' : ''}`}>forum</span>
                        <span className={`text-[9px] font-black tracking-widest ${community.unreadCount && community.unreadCount > 0 ? 'text-white' : ''}`}>
                          {community.unreadCount && community.unreadCount > 0 ? 'NEW' : '12'}
                        </span>
                      </button>
                      <div className="flex items-center gap-1 text-slate-500">
                        <span className="material-symbols-outlined text-sm">person</span>
                        <span className="text-[10px] font-black">{community.memberCount}</span>
                      </div>
                    </div>
                    {community.isManaged ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/dashboard', { state: { communityId: community.id } }); }}
                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-90"
                      >
                        <span className="material-symbols-outlined text-xs">tune</span>
                        Manage Community
                      </button>
                    ) : (
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Joined Jan 2024</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="size-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="material-symbols-outlined text-slate-600 text-4xl">folder_off</span>
            </div>
            <h3 className="text-white text-xl font-black italic mb-2 tracking-tight">No Communities Found</h3>
            <p className="text-slate-500 text-xs font-medium max-w-[220px] mx-auto leading-relaxed">
              {activeTab === 'managed'
                ? "You haven't launched any communities yet. Ready to lead the pack?"
                : "You aren't a member of any communities yet. Explore to find your circle."}
            </p>
          </div>
        )}

        {/* Managed-specific CTA */}
        {activeTab === 'managed' && !isLoading && (
          <div
            onClick={() => navigate('/create-community')}
            className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/20 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group hover:border-primary/40 transition-all cursor-pointer animate-in slide-in-from-bottom-4 duration-700"
          >
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary shadow-inner transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              <span className="material-symbols-outlined text-primary group-hover:text-background-dark transition-colors font-black text-3xl">add_circle</span>
            </div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Launch New Community</h4>
            <p className="text-slate-600 text-[10px] font-medium leading-relaxed max-w-[200px]">Establish your mission and invite explorers to co-create ventures.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCommunities;
