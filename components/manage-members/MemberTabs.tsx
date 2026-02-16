import React from 'react';

interface MemberTabsProps {
  activeTab: 'joined' | 'pending' | 'declined' | 'invites' | 'activity';
  setActiveTab: (tab: 'joined' | 'pending' | 'declined' | 'invites' | 'activity') => void;
  joinedCount: number;
  pendingCount: number;
  declinedCount: number;
  invitesCount: number;
  activityCount: number;
}

export const MemberTabs: React.FC<MemberTabsProps> = ({
  activeTab,
  setActiveTab,
  joinedCount,
  pendingCount,
  declinedCount,
  invitesCount,
  activityCount
}) => {
  return (
    <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10 overflow-x-auto hide-scrollbar">
      <button
        onClick={() => setActiveTab('joined')}
        className={`flex-1 py-3.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'joined' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
      >
        Active ({joinedCount})
      </button>
      <button
        onClick={() => setActiveTab('pending')}
        className={`flex-1 py-3.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'pending' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
      >
        Pending ({pendingCount})
      </button>
      <button
        onClick={() => setActiveTab('declined')}
        className={`flex-1 py-3.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'declined' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
      >
        Declined ({declinedCount})
      </button>
      <button
        onClick={() => setActiveTab('invites')}
        className={`flex-1 py-3.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'invites' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
      >
        Invites ({invitesCount})
      </button>
      <button
        onClick={() => setActiveTab('activity')}
        className={`flex-1 py-3.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'activity' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
      >
        Activity ({activityCount})
      </button>
    </div>
  );
};
