import React, { useState, useMemo, useEffect } from 'react';

interface Props {
  onBack: () => void;
}

type UserRole = 'Admin' | 'Co-Leader' | 'Member';

interface Permission {
  id: string;
  icon: string;
  label: string;
  description: string;
}

const PERMISSIONS: Permission[] = [
  { id: 'settings', icon: 'admin_panel_settings', label: 'Tribe Settings', description: 'Modify tribe name, branding, and visibility.' },
  { id: 'edit', icon: 'edit_square', label: 'Edit Ventures', description: 'Create, modify, and cancel tribe trips.' },
  { id: 'manage', icon: 'group_add', label: 'Manage Roster', description: 'Approve applicants and adjust member roles.' },
  { id: 'delete', icon: 'delete_forever', label: 'Dissolve Tribe', description: 'Permanently remove the tribe from the network.' },
];

interface Member {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  location: string;
  joinedDate: string;
  customPermissions?: string[];
}

interface PendingMember {
  id: string;
  name: string;
  avatar: string;
  reason: string;
  timestamp: string;
  category: 'Eco' | 'Adventure' | 'Social' | 'Creative';
}

const ROLE_DEFAULTS: Record<UserRole, {
  color: string;
  badge: string;
  permissions: string[];
  desc: string;
}> = {
  'Admin': {
    color: 'text-primary border-primary/30 bg-primary/10',
    badge: 'bg-primary text-background-dark',
    permissions: ['settings', 'edit', 'manage', 'delete'],
    desc: 'Founding member with absolute authority over Tribe operations.'
  },
  'Co-Leader': {
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    badge: 'bg-emerald-500 text-background-dark',
    permissions: ['edit', 'manage'],
    desc: 'Trusted partner who can modify ventures and approve members.'
  },
  'Member': {
    color: 'text-slate-400 border-white/10 bg-white/5',
    badge: 'bg-slate-700 text-white',
    permissions: [],
    desc: 'Standard member with access to chats, voting, and the venture timeline.'
  }
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Eco': ['eco', 'sustainability', 'green', 'conservation', 'nature', 'planet', 'ocean'],
  'Adventure': ['hike', 'trek', 'climb', 'expedition', 'adventure', 'mountain', 'wilderness'],
  'Social': ['community', 'meet', 'people', 'share', 'connect', 'group', 'together'],
  'Creative': ['photography', 'camera', 'photo', 'guide', 'skill', 'storyteller', 'content'],
};

const MOCK_PENDING: PendingMember[] = [
  { id: 'p1', name: "Marcus Aurelius", avatar: "https://picsum.photos/seed/mar/100/100", reason: "Passionate about ocean conservation and eco-travel. I want to help with the beach cleanups!", timestamp: "2h ago", category: 'Eco' },
  { id: 'p2', name: "Sophie Turner", avatar: "https://picsum.photos/seed/sop/100/100", reason: "Looking to travel with purpose. I'm an avid trekker and mountain lover.", timestamp: "5h ago", category: 'Adventure' },
  { id: 'p3', name: "David Chen", avatar: "https://picsum.photos/seed/dav/100/100", reason: "Professional photographer looking for a tribe to capture sustainable adventures with.", timestamp: "1d ago", category: 'Creative' },
];

const ManageMembers: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'joined' | 'pending'>('joined');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: "Alex Sterling", role: 'Admin', avatar: "https://picsum.photos/seed/alex/100/100", location: "London, UK", joinedDate: "Jan 2024" },
    { id: '2', name: "Sarah Jenkins", role: 'Co-Leader', avatar: "https://picsum.photos/seed/sarah/100/100", location: "Seattle, USA", joinedDate: "Feb 2024" },
    { id: '3', name: "Mike Ross", role: 'Member', avatar: "https://picsum.photos/seed/mike/100/100", location: "Toronto, CAN", joinedDate: "Mar 2024" },
    { id: '4', name: "Elena Vance", role: 'Member', avatar: "https://picsum.photos/seed/elena/100/100", location: "Berlin, DE", joinedDate: "Mar 2024" },
  ]);

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [tempRole, setTempRole] = useState<UserRole | null>(null);
  const [tempPerms, setTempPerms] = useState<string[]>([]);

  useEffect(() => {
    if (editingMember) {
      setTempRole(editingMember.role);
      setTempPerms(editingMember.customPermissions || ROLE_DEFAULTS[editingMember.role].permissions);
    }
  }, [editingMember]);

  const filteredJoinedMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const filteredPendingMembers = useMemo(() => {
    return pendingMembers.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!selectedCategory) return matchesSearch;
      return m.category === selectedCategory;
    });
  }, [searchQuery, selectedCategory, pendingMembers]);

  useEffect(() => {
    setPendingMembers(MOCK_PENDING);
  }, []);

  const handleSaveMember = () => {
    if (editingMember && tempRole) {
      setMembers(prev => prev.map(m => 
        m.id === editingMember.id 
          ? { ...m, role: tempRole, customPermissions: tempPerms } 
          : m
      ));
      setEditingMember(null);
    }
  };

  const togglePermission = (permId: string) => {
    setTempPerms(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleRoleSelect = (role: UserRole) => {
    setTempRole(role);
    setTempPerms(ROLE_DEFAULTS[role].permissions);
  };

  const handleActionRequest = (id: string, action: 'approve' | 'decline') => {
    setPendingMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="flex flex-col min-h-full bg-background-dark relative">
      <header className="px-4 pt-10 pb-6 flex items-center gap-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-50 border-b border-white/5">
        <button onClick={onBack} className="text-white p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white tracking-tight leading-none">Tribe Roster</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Inspired Management</p>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10">
          <button 
            onClick={() => setActiveTab('joined')}
            className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'joined' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
          >
            Active ({members.length})
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'pending' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
          >
            Pending ({pendingMembers.length})
          </button>
        </div>

        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roster..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-slate-600 shadow-inner"
          />
        </div>

        <div className="space-y-4 pb-32">
          {activeTab === 'joined' ? (
            filteredJoinedMembers.map(member => (
              <div 
                key={member.id} 
                className="p-5 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-4 hover:bg-white/10 transition-all group"
              >
                <img src={member.avatar} className="size-14 rounded-2xl border-2 border-white/10" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-black text-lg tracking-tight truncate leading-none mb-1">{member.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${ROLE_DEFAULTS[member.role].color}`}>
                      {member.role}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold">{member.location}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingMember(member)}
                  className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-primary transition-all"
                >
                  <span className="material-symbols-outlined text-xl">tune</span>
                </button>
              </div>
            ))
          ) : (
            filteredPendingMembers.map(member => (
              <div key={member.id} className="p-6 bg-surface-dark border border-white/5 rounded-[2.5rem] space-y-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <img src={member.avatar} className="size-16 rounded-[1.5rem]" alt="" />
                  <div>
                    <h4 className="text-white font-black text-xl leading-none mb-1">{member.name}</h4>
                    <span className="text-[10px] text-primary font-black uppercase tracking-widest">{member.category} Match</span>
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 italic text-xs text-slate-400">
                  "{member.reason}"
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleActionRequest(member.id, 'approve')} className="flex-1 bg-primary text-background-dark font-black py-3 rounded-xl text-[10px] uppercase">Approve</button>
                  <button onClick={() => handleActionRequest(member.id, 'decline')} className="px-4 bg-white/5 text-slate-500 font-black py-3 rounded-xl text-[10px] uppercase">Decline</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Advanced Permission Modal */}
      {editingMember && tempRole && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-background-dark w-full max-w-md rounded-t-[3rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <img src={editingMember.avatar} className="size-10 rounded-full" alt="" />
                 <div>
                    <h2 className="text-xl font-black text-white leading-none">Authority Lab</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Configuring {editingMember.name}</p>
                 </div>
              </div>
              <button onClick={() => setEditingMember(null)} className="text-slate-600 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Role Switcher */}
            <div className="space-y-6">
              <section>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Primary Mandate</h3>
                <div className="grid grid-cols-1 gap-2">
                  {(['Admin', 'Co-Leader', 'Member'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        tempRole === role ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <div>
                        <span className={`text-xs font-black uppercase tracking-widest ${tempRole === role ? 'text-primary' : 'text-white'}`}>{role}</span>
                        <p className="text-[10px] text-slate-500 leading-tight mt-1">{ROLE_DEFAULTS[role].desc}</p>
                      </div>
                      {tempRole === role && <span className="material-symbols-outlined text-primary text-sm">verified</span>}
                    </button>
                  ))}
                </div>
              </section>

              {/* Specific Permissions */}
              <section>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Granular Controls</h3>
                  <div className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-2 py-0.5 rounded uppercase">Adjustable</div>
                </div>
                <div className="space-y-2">
                  {PERMISSIONS.map(perm => {
                    const isActive = tempPerms.includes(perm.id);
                    return (
                      <div 
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all ${
                          isActive ? 'bg-white/[0.08] border-white/20' : 'bg-white/5 border-white/5 opacity-50'
                        }`}
                      >
                        <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-primary text-background-dark' : 'bg-white/10 text-slate-600'}`}>
                          <span className="material-symbols-outlined text-xl">{perm.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-xs font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-slate-500'}`}>{perm.label}</h4>
                          <p className="text-[10px] text-slate-600 font-medium leading-tight">{perm.description}</p>
                        </div>
                        <div className={`size-5 rounded-full border-2 transition-all flex items-center justify-center ${isActive ? 'bg-primary border-primary' : 'border-slate-800'}`}>
                          {isActive && <span className="material-symbols-outlined text-[14px] text-background-dark font-black">check</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <div className="pt-4 flex gap-3">
                 <button 
                  onClick={() => setEditingMember(null)}
                  className="flex-1 py-4 bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-white/10"
                 >
                   Discard
                 </button>
                 <button 
                  onClick={handleSaveMember}
                  className="flex-[2] py-4 bg-primary text-background-dark font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
                 >
                   Apply Authority
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
