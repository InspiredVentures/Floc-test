
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Community } from '../types';
import { useUser } from '../contexts/UserContext';
import { COLORS } from '../constants';
import { CommunitySwitcher } from '../components/CommunitySwitcher';
import { StatCard } from '../components/StatCard';
import { ActionTile } from '../components/ActionTile';
import { ActivityChart } from '../components/ActivityChart';
import { Feed } from '../components/Feed';
import { calculateCommunityMetrics } from '../lib/dashboardUtils';

interface Props {
  communities: Community[];
  onOpenNotifications: () => void;
  onCreate: () => void;
  onManage: () => void;
  onContactSupport: () => void;
  onSelectCommunity: (community: Community) => void;
  onOpenInsights: () => void;
  onOpenSettings: () => void;
}

const Dashboard: React.FC<Props> = ({
  communities,
  onOpenNotifications,
  onCreate,
  onManage,
  onContactSupport,
  onSelectCommunity,
  onOpenInsights,
  onOpenSettings
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMember, notifications, user, profile } = useUser();

  // 1. Identify Managed Communities
  const managedCommunities = communities.filter(c => c.isManaged);

  // 2. Determine Active Community
  const [activeCommunityId, setActiveCommunityId] = useState<string>('');

  useEffect(() => {
    if (location.state?.communityId) {
      setActiveCommunityId(location.state.communityId);
    } else if (managedCommunities.length > 0 && !activeCommunityId) {
      setActiveCommunityId(managedCommunities[0].id);
    }
  }, [location.state, managedCommunities, activeCommunityId]);

  const activeCommunity = managedCommunities.find(c => c.id === activeCommunityId) || managedCommunities[0];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 3. Dynamic Stats
  const { memberCount, healthScore, weeklyGrowth, activityData } = calculateCommunityMetrics(activeCommunity);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden font-sans text-[#14532D]">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-background opacity-20 pointer-events-none"></div>

      {/* Top Navigation Bar */}
      <header className="px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5">
            <img
              src={profile?.avatar_url || "https://picsum.photos/seed/alex/100/100"}
              className="w-full h-full rounded-full border-2 border-white object-cover"
              alt="Profile"
            />
          </div>
          <div>
            <h1 className="text-primary font-heading font-black text-lg leading-none italic uppercase">
              {profile?.display_name || 'Leader'}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-widest">
                Commander
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onOpenNotifications}
            className="size-10 rounded-xl bg-white border border-primary/10 flex items-center justify-center relative hover:bg-primary/5 transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-primary">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 size-2 bg-accent rounded-full border border-white"></span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 pb-24 space-y-8 relative z-10 overflow-y-auto">

        {/* Active Community Switcher / Hero */}
        <section className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeCommunity ? (
            <CommunitySwitcher
              communities={managedCommunities}
              activeCommunityId={activeCommunityId}
              onSelectCommunity={setActiveCommunityId}
              onNavigate={onSelectCommunity}
              weeklyGrowth={weeklyGrowth}
              memberCount={memberCount}
            />
          ) : (
            <div className="bg-white border border-primary/10 border-dashed rounded-[2rem] p-8 text-center shadow-sm">
              <p className="text-primary/40 text-sm mb-4 font-bold uppercase tracking-widest">You are not leading any communities yet.</p>
              <button onClick={onCreate} className="text-accent font-black uppercase tracking-widest text-xs hover:underline">
                Launch your first community
              </button>
            </div>
          )}
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          {/* Health Dial Card */}
          <StatCard
            label="Community Health"
            value={healthScore}
            subtext="Top 5% of communities utilizing this protocol."
            icon="ecg_heart"
            color="text-green-500"
          />

          {/* Quick Actions Grid (Nested) */}
          <div className="grid grid-rows-2 gap-3">
            <button
              onClick={onCreate}
              className="bg-primary hover:bg-primary/90 rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-95 group shadow-lg shadow-primary/20"
            >
              <div className="size-8 rounded-lg bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-lg">add</span>
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-black uppercase tracking-widest text-white">New Venture</span>
              </div>
            </button>

            <button
              onClick={onManage}
              className="bg-white hover:bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-95 group shadow-sm"
            >
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-lg">group</span>
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-black uppercase tracking-widest text-primary/60 group-hover:text-primary">Members</span>
              </div>
            </button>
          </div>
        </section>



        {/* Global Feed */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Global Feed</h3>
            <button className="text-[10px] font-bold text-primary hover:underline">View All</button>
          </div>

          <Feed limit={5} />
        </section>

        {/* Analytics Chart */}
        <ActivityChart data={activityData} onOpenInsights={onOpenInsights} />


        {/* Advanced Tools */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-4 px-2">Commander Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            <ActionTile icon="manage_accounts" label="Roles & Permissions" active={false} onClick={onManage} />
            <ActionTile icon="settings_suggest" label="Protocol Settings" active={false} onClick={onOpenSettings} />
            <ActionTile icon="campaign" label="Broadcast" active={false} onClick={() => { }} />
            <ActionTile icon="diamond" label="Treasury" active={false} onClick={() => { }} />
          </div>
        </section>

      </main>
    </div >
  );
};

export default Dashboard;
