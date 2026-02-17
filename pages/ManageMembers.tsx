import React, { useState, useMemo, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { communityService } from '../services/communityService';
import { Member, PendingMember } from '../types';

interface Props {
  onBack: () => void;
}

type UserRole = Member['role'];

interface Permission {
  id: string;
  icon: string;
  label: string;
  description: string;
}

const PERMISSIONS: Permission[] = [
  { id: 'settings', icon: 'admin_panel_settings', label: 'Community Settings', description: 'Modify community name, branding, and visibility.' },
  { id: 'edit', icon: 'edit_square', label: 'Edit Ventures', description: 'Create, modify, and cancel tribe trips.' },
  { id: 'manage', icon: 'group_add', label: 'Manage Roster', description: 'Approve applicants and adjust member roles.' },
  { id: 'delete', icon: 'delete_forever', label: 'Dissolve Community', description: 'Permanently remove the community from the network.' },
];

interface Invitation {
  id: string;
  email: string;
  inviteCode: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: 'approved' | 'declined' | 'removed' | 'roleChanged' | 'permissionUpdated';
  actor: string; // User who performed the action
  target: string; // User affected by the action
  details?: string; // Additional context
}

const ROLE_DEFAULTS: Record<UserRole, {
  color: string;
  badge: string;
  permissions: string[];
  desc: string;
}> = {
  'Owner': {
    color: 'text-primary border-primary/30 bg-primary/10',
    badge: 'bg-primary text-background-dark',
    permissions: ['settings', 'edit', 'manage', 'delete'],
    desc: 'Community Owner'
  },
  'Admin': {
    color: 'text-primary border-primary/30 bg-primary/10',
    badge: 'bg-primary text-background-dark',
    permissions: ['settings', 'edit', 'manage', 'delete'],
    desc: 'Founding member with absolute authority over Community operations.'
  },
  'Co-Leader': {
    color: 'text-primary border-primary/30 bg-primary/10',
    badge: 'bg-primary text-white',
    permissions: ['edit', 'manage'],
    desc: 'Trusted partner who can modify ventures and approve members.'
  },
  'Member': {
    color: 'text-slate-400 border-white/10 bg-white/5',
    badge: 'bg-slate-700 text-white',
    permissions: [],
    desc: 'Standard member with access to chats, voting, and the venture timeline.'
  },

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
  const { communities, user } = useUser();
  const { success, error, info } = useToast();
  const [activeTab, setActiveTab] = useState<'joined' | 'pending' | 'declined' | 'invites' | 'activity'>('joined');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [filterRole, setFilterRole] = useState<UserRole | 'All'>('All');
  const [filterJoinDate, setFilterJoinDate] = useState<'all' | '7days' | '30days'>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest' | 'role'>('name-asc');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [selectedPending, setSelectedPending] = useState<Set<string>>(new Set());

  // For demo, we manage the first managed community found
  const community = communities.find(c => c.isManaged) || communities[0];

  // Local state for members to avoid relying on UserContext/global state which is being optimized
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      if (community?.id) {
        setIsLoadingMembers(true);
        const fetched = await communityService.getMembers(community.id);
        setMembersList(fetched);
        setIsLoadingMembers(false);
      }
    };
    loadMembers();
  }, [community?.id]);

  const allMembers = useMemo(() => membersList, [membersList]);

  const members = useMemo(() => allMembers.filter(m => m.status === 'approved' || !m.status), [allMembers]);
  // Map standard members to PendingMember shape with defaults for missing fields
  const pendingMembers = useMemo<PendingMember[]>(() =>
    allMembers.filter(m => m.status === 'pending').map(m => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      reason: m.answer || "Applying to join",
      timestamp: new Date(m.joinedDate).toLocaleDateString(),
      category: m.category || 'General'
    })),
    [allMembers]);

  const declinedMembers = useMemo<PendingMember[]>(() =>
    allMembers.filter(m => m.status === 'rejected' || m.status === 'banned').map(m => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      reason: "Application declined",
      timestamp: new Date(m.joinedDate).toLocaleDateString(),
      category: 'General'
    })),
    [allMembers]);

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [tempRole, setTempRole] = useState<UserRole | null>(null);
  const [tempPerms, setTempPerms] = useState<string[]>([]);

  useEffect(() => {
    if (editingMember) {
      setTempRole(editingMember.role as UserRole);
      // Ensure we have a fallback if role defaults are missing
      const defaults = ROLE_DEFAULTS[editingMember.role as UserRole];
      setTempPerms(editingMember.customPermissions || (defaults ? defaults.permissions : []));
    }
  }, [editingMember]);

  const filteredJoinedMembers = useMemo(() => {
    let filtered = members.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Filter by role
    if (filterRole !== 'All') {
      filtered = filtered.filter(m => m.role === filterRole);
    }

    // Filter by join date
    if (filterJoinDate !== 'all') {
      const now = new Date();
      const daysAgo = filterJoinDate === '7days' ? 7 : 30;
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(m => {
        const joinDate = new Date(m.joinedDate);
        return joinDate >= cutoffDate;
      });
    }

    // Sort members
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-newest':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        case 'date-oldest':
          return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
        case 'role':
          const roleOrder = { 'Owner': 0, 'Admin': 1, 'Co-Leader': 2, 'Member': 3 };
          return roleOrder[a.role] - roleOrder[b.role];
        default:
          return 0;
      }
    });

    return filtered;
  }, [members, searchQuery, filterRole, filterJoinDate, sortBy]);

  const filteredPendingMembers = useMemo(() => {
    return pendingMembers.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, pendingMembers]);

  const filteredDeclinedMembers = useMemo(() => {
    return declinedMembers.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, declinedMembers]);

  const handleSaveMember = async () => {
    if (editingMember && tempRole && community) {
      const oldRole = editingMember.role;
      const successResult = await communityService.updateMemberRole(community.id, editingMember.id, tempRole, tempPerms);

      if (successResult) {
        setMembersList(prev => prev.map(m =>
          m.id === editingMember.id ? { ...m, role: tempRole, customPermissions: tempPerms } : m
        ));

        // Log activity
        if (oldRole !== tempRole) {
          logActivity('roleChanged', editingMember.name, `Changed role from ${oldRole} to ${tempRole}`);
          success(`Updated ${editingMember.name}'s role to ${tempRole}`);
        } else {
          logActivity('permissionUpdated', editingMember.name, 'Updated permissions');
          success(`Updated permissions for ${editingMember.name}`);
        }

        setEditingMember(null);
      } else {
        error("Failed to update role");
      }
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

  const handleActionRequest = async (id: string, action: 'approve' | 'decline') => {
    if (!community) return;
    const member = pendingMembers.find(m => m.id === id);
    if (!member) return;

    if (action === 'approve') {
      const isSuccess = await communityService.approveMember(community.id, id);
      if (isSuccess) {
        setMembersList(prev => prev.map(m => m.id === id ? { ...m, status: 'approved' } : m));
        logActivity('approved', member.name, 'Approved to join the tribe');
        success(`Welcome to the tribe, ${member.name}!`);
      }
    } else {
      const isSuccess = await communityService.declineMember(community.id, id);
      if (isSuccess) {
        setMembersList(prev => prev.map(m => m.id === id ? { ...m, status: 'rejected' } : m));
        logActivity('declined', member.name, 'Join request declined');
        info(`Declined join request for ${member.name}`);
      }
    }
  };

  const handleRemoveMember = async (id: string, name: string) => {
    if (community) {
      if (window.confirm(`Are you sure you want to remove ${name} from the tribe? They will be moved to the declined list.`)) {
        const isSuccess = await communityService.removeMember(community.id, id);
        if (isSuccess) {
          setMembersList(prev => prev.map(m => m.id === id ? { ...m, status: 'rejected' } : m));
          logActivity('removed', name, 'Removed from the tribe');
          success(`${name} has been removed from the tribe`);
        }
      }
    }
  };

  const logActivity = (action: ActivityLog['action'], targetName: string, details?: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      actor: user?.email || 'Admin',
      target: targetName,
      details
    };

    setActivityLogs(prev => [newLog, ...prev]);

    // Store in localStorage for persistence
    if (community) {
      const stored = JSON.parse(localStorage.getItem(`activity_${community.id}`) || '[]');
      localStorage.setItem(`activity_${community.id}`, JSON.stringify([newLog, ...stored]));
    }
  };

  const generateInviteLink = () => {
    if (!inviteEmail.trim()) return;

    const inviteCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/join/${community?.id}?invite=${inviteCode}`;

    const newInvitation: Invitation = {
      id: `inv-${Date.now()}`,
      email: inviteEmail,
      inviteCode,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setInvitations([...invitations, newInvitation]);
    setGeneratedLink(link);

    // Store in localStorage for persistence
    if (community) {
      const stored = JSON.parse(localStorage.getItem(`invitations_${community.id}`) || '[]');
      localStorage.setItem(`invitations_${community.id}`, JSON.stringify([...stored, newInvitation]));
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      success('Invite link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      error('Failed to copy link to clipboard');
    }
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
    setInviteEmail('');
    setGeneratedLink('');
  };

  // Load invitations and activity logs on mount
  useEffect(() => {
    if (community) {
      const storedInvites = JSON.parse(localStorage.getItem(`invitations_${community.id}`) || '[]');
      setInvitations(storedInvites);

      const storedActivity = JSON.parse(localStorage.getItem(`activity_${community.id}`) || '[]');
      setActivityLogs(storedActivity);
    }
  }, [community]);

  return (
    <div className="flex flex-col min-h-full bg-background-dark relative">
      <header className="px-4 pt-10 pb-6 flex items-center gap-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-50 border-b border-white/5">
        <button onClick={onBack} className="text-white p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-black text-white tracking-tight leading-none">Community Roster</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Inspired Management</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-primary text-background-dark p-2 rounded-full transition-all hover:scale-110 active:scale-95"
        >
          <span className="material-symbols-outlined">person_add</span>
        </button>
      </header>

      <div className="p-4 space-y-6">
        <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex-1 py-3.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'joined' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
          >
            Active ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'pending' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
          >
            Pending ({pendingMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('declined')}
            className={`flex-1 py-3.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'declined' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
          >
            Declined ({declinedMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`flex-1 py-3.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'invites' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
          >
            Invites ({invitations.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'activity' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
          >
            Activity ({activityLogs.length})
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

        {/* Filter & Sort Controls - Only show for joined tab */}
        {activeTab === 'joined' && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | 'All')}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer hover:bg-white/10"
            >
              <option value="All">All Roles</option>
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
              <option value="Co-Leader">Co-Leader</option>
              <option value="Member">Member</option>
            </select>

            {/* Join Date Filter */}
            <select
              value={filterJoinDate}
              onChange={(e) => setFilterJoinDate(e.target.value as 'all' | '7days' | '30days')}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer hover:bg-white/10"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer hover:bg-white/10"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="date-newest">Newest First</option>
              <option value="date-oldest">Oldest First</option>
              <option value="role">By Authority</option>
            </select>

            {/* Active Filter Indicator */}
            {(filterRole !== 'All' || filterJoinDate !== 'all' || sortBy !== 'name-asc') && (
              <button
                onClick={() => {
                  setFilterRole('All');
                  setFilterJoinDate('all');
                  setSortBy('name-asc');
                }}
                className="bg-primary/20 text-primary border border-primary/30 rounded-xl px-3 py-2 text-xs font-black uppercase flex items-center gap-1 hover:bg-primary/30 transition-all whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                Clear
              </button>
            )}
          </div>
        )}

        <div className="space-y-4 pb-32">
          {activeTab === 'joined' && (
            filteredJoinedMembers.map(member => (
              <div
                key={member.id}
                className="p-5 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-4 hover:bg-white/10 transition-all group"
              >
                <img src={member.avatar} className="size-14 rounded-2xl border-2 border-white/10" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-black text-lg tracking-tight truncate leading-none mb-1">{member.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${ROLE_DEFAULTS[member.role]?.color || ROLE_DEFAULTS['Member'].color}`}>
                      {member.role}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold">{member.location}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-primary transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">tune</span>
                  </button>
                  {member.role !== 'Admin' && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-red-400 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">person_remove</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {activeTab === 'pending' && (
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

          {activeTab === 'declined' && (
            filteredDeclinedMembers.map(member => (
              <div key={member.id} className="p-5 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-4 opacity-75 hover:opacity-100 transition-opacity">
                <img src={member.avatar} className="size-14 rounded-2xl border-2 border-white/10 grayscale" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-slate-400 font-black text-lg tracking-tight truncate leading-none mb-1">{member.name}</h4>
                  <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Declined</span>
                </div>
                <button
                  onClick={() => handleActionRequest(member.id, 'approve')}
                  className="px-4 py-2 bg-white/5 hover:bg-primary hover:text-background-dark text-slate-500 font-black text-[9px] uppercase rounded-xl transition-all"
                >
                  Reconsider
                </button>
              </div>
            ))
          )}

          {activeTab === 'invites' && (
            invitations.map(invite => (
              <div key={invite.id} className="p-5 bg-white/5 border border-white/5 rounded-[2rem] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-black text-sm truncate mb-1">{invite.email}</h4>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${invite.status === 'pending' ? 'text-primary' :
                      invite.status === 'accepted' ? 'text-primary' : 'text-red-400'
                      }`}>
                      {invite.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-500 font-medium">Expires</p>
                    <p className="text-[10px] text-white font-black">{new Date(invite.expiresAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      const link = `${window.location.origin}/join/${community?.id}?invite=${invite.inviteCode}`;
                      navigator.clipboard.writeText(link);
                      success('Invite link copied!');
                    }}
                    className="flex-1 bg-white/5 text-primary font-black py-2 rounded-xl text-[9px] uppercase hover:bg-white/10 transition-all"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => {
                      setInvitations(invitations.filter(i => i.id !== invite.id));
                      if (community) {
                        const updated = invitations.filter(i => i.id !== invite.id);
                        localStorage.setItem(`invitations_${community.id}`, JSON.stringify(updated));
                        success('Invitation revoked');
                      }
                    }}
                    className="px-4 bg-white/5 text-slate-500 font-black py-2 rounded-xl text-[9px] uppercase hover:text-red-400 transition-all"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))
          )}

          {activeTab === 'activity' && (
            activityLogs.length === 0 ? (
              <div className="text-center py-16">
                <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <span className="material-symbols-outlined text-slate-500 text-4xl">history</span>
                </div>
                <h4 className="text-white font-black text-xl mb-2">No Activity Yet</h4>
                <p className="text-slate-500 text-sm">Member management actions will appear here</p>
              </div>
            ) : (
              activityLogs.map(log => {
                const actionConfig = {
                  approved: { icon: 'check_circle', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
                  declined: { icon: 'cancel', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
                  removed: { icon: 'person_remove', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
                  roleChanged: { icon: 'swap_horiz', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
                  permissionUpdated: { icon: 'admin_panel_settings', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
                }[log.action];

                const diff = Date.now() - new Date(log.timestamp).getTime();
                const minutes = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                const timeAgo = days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ago` : minutes > 0 ? `${minutes}m ago` : 'Just now';

                return (
                  <div key={log.id} className={`p-5 border rounded-[2rem] ${actionConfig.bg} ${actionConfig.border}`}>
                    <div className="flex items-start gap-4">
                      <div className={`size-12 rounded-xl flex items-center justify-center ${actionConfig.bg} ${actionConfig.border} border-2`}>
                        <span className={`material-symbols-outlined ${actionConfig.color} text-xl`}>{actionConfig.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-black text-sm truncate">{log.target}</h4>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${actionConfig.bg} ${actionConfig.color}`}>
                            {log.action.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        {log.details && <p className="text-slate-400 text-xs mb-2">{log.details}</p>}
                        <div className="flex items-center gap-3 text-[9px] text-slate-600">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">person</span>
                            {log.actor}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {timeAgo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-background-dark w-full max-w-md rounded-t-[3rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-white leading-none">Invite Member</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Share Access</p>
              </div>
              <button onClick={closeInviteModal} className="text-slate-600 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {!generatedLink ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="member@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <button
                  onClick={generateInviteLink}
                  disabled={!inviteEmail.trim()}
                  className="w-full bg-primary text-background-dark font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Invite Link
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Shareable Link</p>
                  <p className="text-xs text-white break-all font-mono">{generatedLink}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyInviteLink}
                    className="flex-1 bg-primary text-background-dark font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={closeInviteModal}
                    className="px-6 bg-white/5 text-slate-500 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest border border-white/10 active:scale-95 transition-all"
                  >
                    Done
                  </button>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase">Expires in 7 days</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Link will be invalid after expiration</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${tempRole === role ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/5'
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
                  <div className="bg-primary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded uppercase">Adjustable</div>
                </div>
                <div className="space-y-2">
                  {PERMISSIONS.map(perm => {
                    const isActive = tempPerms.includes(perm.id);
                    return (
                      <div
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all ${isActive ? 'bg-white/[0.08] border-white/20' : 'bg-white/5 border-white/5 opacity-50'
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
