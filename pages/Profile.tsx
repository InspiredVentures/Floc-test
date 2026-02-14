import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Community, Trip } from '../types';
import { MOCK_TRIPS } from '../constants';
import { useUser } from '../contexts/UserContext';
import { Skeleton } from '../components/Skeleton';

type ProfileTab = 'DNA' | 'LEGACY';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading, communities, joinedCommunityIds, bookedTripIds, followingUsernames } = useUser();
  const [activeTab, setActiveTab] = useState<ProfileTab>('DNA');

  // Filter Data
  const myCommunities = communities.filter(c => joinedCommunityIds.includes(c.id));
  const myTrips = MOCK_TRIPS.filter(t => bookedTripIds.includes(t.id));

  // Default Stats if filtering fails or is empty
  const stats = {
    trips: myTrips.length,
    communities: myCommunities.length,
    followers: 847, // Placeholder until we have a real follower system
    following: followingUsernames.length
  };

  if (isLoading) {
    return (
      <div className="flex flex-col pb-32 min-h-full bg-[#FCFBF5] overflow-hidden">
        {/* Header Skeleton */}
        <div className="p-6 flex justify-between items-center border-b border-primary/5">
          <Skeleton className="size-10 !rounded-2xl" />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
          <Skeleton className="size-10 !rounded-2xl" />
        </div>

        <div className="p-6 flex flex-col items-center space-y-6">
          {/* Hero Skeleton */}
          <Skeleton className="size-32 !rounded-[2.5rem]" />
          <div className="space-y-2 flex flex-col items-center w-full">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64 mt-2" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full !rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
  }

  // Fallback for missing profile
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FCFBF5] text-center p-6">
        <div className="size-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-primary/40">person_off</span>
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">Profile Not Found</h2>
        <p className="text-primary/60 mb-6">Please log in to view your profile.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white font-black px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-32 min-h-full bg-[#FCFBF5] overflow-hidden text-[#14532D]">
      {/* Header */}
      <header className="flex items-center p-6 justify-between sticky top-0 z-50 bg-[#FCFBF5]/80 backdrop-blur-xl border-b border-primary/5">
        <button
          onClick={() => navigate(-1)}
          className="text-primary size-10 flex items-center justify-center rounded-2xl bg-white border border-primary/10 active:scale-90 transition-all hover:bg-primary/5"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-primary text-xs font-black uppercase tracking-[0.3em] leading-none">Protocol Node</h2>
          <p className="text-accent text-[7px] font-black uppercase tracking-widest mt-1">ID: #{user?.id.substring(0, 8).toUpperCase()}</p>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="text-primary size-10 flex items-center justify-center rounded-2xl bg-white border border-primary/10 active:scale-90 transition-all hover:bg-primary/5"
        >
          <span className="material-symbols-outlined text-xl">tune</span>
        </button>
      </header>

      {/* Hero: The Explorer Card */}
      <div className="relative px-6 pt-10 pb-6 flex flex-col items-center z-10">
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-primary/10 rounded-[3rem] blur-3xl scale-125 opacity-40 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative size-32 p-1.5 rounded-[3rem] bg-gradient-to-tr from-primary via-accent to-primary/20 shadow-xl">
            <img
              alt="Profile"
              className="size-full rounded-[2.5rem] object-cover border-4 border-[#FCFBF5]"
              src={profile.avatar_url}
            />
          </div>
        </div>

        <div className="text-center space-y-3 mb-6">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-primary text-4xl font-black tracking-tighter italic">{profile.display_name}</h1>
            <div className="size-6 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-accent text-[14px] font-black">verified</span>
            </div>
          </div>
          <p className="text-primary/60 text-sm max-w-xs mx-auto leading-relaxed font-medium">
            {profile.bio || 'No bio yet.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-primary/5 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-primary font-black text-2xl">{stats.trips}</div>
            <div className="text-primary/40 text-[10px] font-bold uppercase tracking-widest mt-1">Trips</div>
          </div>
          <div className="bg-white border border-primary/5 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-primary font-black text-2xl">{stats.communities}</div>
            <div className="text-primary/40 text-[10px] font-bold uppercase tracking-widest mt-1">Communities</div>
          </div>
          <div className="bg-white border border-primary/5 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-primary font-black text-2xl">{stats.followers}</div>
            <div className="text-primary/40 text-[10px] font-bold uppercase tracking-widest mt-1">Followers</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 mt-4 z-10 gap-3">
        <button
          onClick={() => setActiveTab('DNA')}
          className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'DNA' ? 'bg-primary text-white shadow-xl hover:bg-primary/90' : 'bg-primary/5 text-primary/40 hover:bg-primary/10'}`}
        >
          Communities
        </button>
        <button
          onClick={() => setActiveTab('LEGACY')}
          className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'LEGACY' ? 'bg-primary text-white shadow-xl hover:bg-primary/90' : 'bg-primary/5 text-primary/40 hover:bg-primary/10'}`}
        >
          Trips
        </button>
      </div>

      {/* Tab Content */}
      <main className="flex-1 px-6 pt-8 pb-32 z-10">
        {activeTab === 'DNA' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* My Communities */}
            <section>
              <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-primary text-lg font-black italic tracking-tight">My Communities</h3>
                <button
                  onClick={() => navigate('/my-communities')}
                  className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {myCommunities.length > 0 ? (
                  myCommunities.map(community => (
                    <div
                      key={community.id}
                      onClick={() => navigate(`/community/${community.id}`)}
                      className="bg-white border border-primary/5 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-accent/30 hover:shadow-lg transition-all group shadow-sm"
                    >
                      <img
                        src={community.image}
                        alt={community.title}
                        className="size-16 rounded-xl object-cover border border-primary/10 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-primary font-black text-sm leading-tight mb-1 truncate">{community.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-primary/40 text-[10px] font-bold uppercase tracking-widest">{community.memberCount} members</span>
                          <span className="text-accent text-[9px] font-black uppercase tracking-widest">{community.category}</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary/20 group-hover:text-accent transition-colors">chevron_right</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">No communities joined yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Recent Trips */}
            <section>
              <h3 className="text-primary text-lg font-black italic tracking-tight mb-6 px-1">Recent Trips</h3>
              <div className="space-y-4">
                {myTrips.length > 0 ? (
                  myTrips.map(trip => (
                    <div
                      key={trip.id}
                      onClick={() => navigate(`/trip/${trip.id}`)}
                      className="p-5 bg-white border border-primary/5 rounded-2xl flex gap-5 hover:border-accent/30 hover:shadow-lg transition-all cursor-pointer group shadow-sm"
                    >
                      <img src={trip.image} className="size-20 rounded-xl object-cover border border-primary/10 group-hover:scale-105 transition-transform" alt="" />
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-primary font-black text-sm leading-tight mb-2 truncate">{trip.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-primary/40 text-[10px] font-bold uppercase tracking-widest">{trip.destination}</span>
                          <span className="text-accent text-[9px] font-black uppercase tracking-widest">{trip.status}</span>
                        </div>
                      </div>
                      <div className="self-center">
                        <span className="material-symbols-outlined text-primary/20 group-hover:text-accent transition-colors">chevron_right</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">No trips booked yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
