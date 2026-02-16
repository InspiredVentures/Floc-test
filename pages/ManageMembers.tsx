import React, { useState, useMemo, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { UserRole, Member, PendingMember, Invitation, ActivityLog } from '../components/manage-members/types';
import { MemberTabs } from '../components/manage-members/MemberTabs';
import { MemberFilters } from '../components/manage-members/MemberFilters';
import { MemberListItem } from '../components/manage-members/MemberListItem';
import { PendingMemberItem } from '../components/manage-members/PendingMemberItem';
import { DeclinedMemberItem } from '../components/manage-members/DeclinedMemberItem';
import { InvitationItem } from '../components/manage-members/InvitationItem';
import { ActivityLogItem } from '../components/manage-members/ActivityLogItem';
import { MemberActivityEmptyState } from '../components/manage-members/MemberActivityEmptyState';
import { InviteModal } from '../components/manage-members/InviteModal';
import { EditMemberModal } from '../components/manage-members/EditMemberModal';

interface Props {
  onBack: () => void;
}

const ManageMembers: React.FC<Props> = ({ onBack }) => {
  const { communities, approveMember, declineMember, removeMember, updateMemberRole, user } = useUser();
  const { success, info } = useToast();
  const [activeTab, setActiveTab] = useState<'joined' | 'pending' | 'declined' | 'invites' | 'activity'>('joined');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [filterRole, setFilterRole] = useState<UserRole | 'All'>('All');
  const [filterJoinDate, setFilterJoinDate] = useState<'all' | '7days' | '30days'>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest' | 'role'>('name-asc');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // For demo, we manage the first managed community found
  const community = communities.find(c => c.isManaged) || communities[0];

  const allMembers = useMemo(() => community?.members || [], [community]);

  const members = useMemo(() => allMembers.filter(m => m.status === 'approved' || !m.status), [allMembers]);

  // Map standard members to PendingMember shape with defaults for missing fields
  const pendingMembers = useMemo<PendingMember[]>(() =>
    allMembers.filter(m => m.status === 'pending').map(m => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      reason: m.answer || "Applying to join",
      timestamp: new Date(m.joinedDate).toLocaleDateString(),
      category: (m.category as PendingMember['category']) || 'General'
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
          return roleOrder[a.role as UserRole] - roleOrder[b.role as UserRole];
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

  const handleSaveMember = (member: Member, role: UserRole, permissions: string[]) => {
    if (community) {
      const oldRole = member.role;
      updateMemberRole(community.id, member.id, role, permissions);

      // Log activity
      if (oldRole !== role) {
        logActivity('roleChanged', member.name, `Changed role from ${oldRole} to ${role}`);
        success(`Updated ${member.name}'s role to ${role}`);
      } else {
        logActivity('permissionUpdated', member.name, 'Updated permissions');
        success(`Updated permissions for ${member.name}`);
      }

      setEditingMember(null);
    }
  };

  const handleActionRequest = (id: string, action: 'approve' | 'decline') => {
    if (!community) return;
    const member = pendingMembers.find(m => m.id === id);
    if (!member) return;

    if (action === 'approve') {
      approveMember(community.id, id);
      logActivity('approved', member.name, 'Approved to join the tribe');
      success(`Welcome to the tribe, ${member.name}!`);
    } else {
      declineMember(community.id, id);
      logActivity('declined', member.name, 'Join request declined');
      info(`Declined join request for ${member.name}`);
    }
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (community) {
      if (window.confirm(`Are you sure you want to remove ${name} from the tribe? They will be moved to the declined list.`)) {
        removeMember(community.id, id);
        logActivity('removed', name, 'Removed from the tribe');
        success(`${name} has been removed from the tribe`);
      }
    }
  };

  const handleInviteGenerated = (invitation: Invitation) => {
    setInvitations(prev => [...prev, invitation]);
    if (community) {
       const stored = JSON.parse(localStorage.getItem(`invitations_${community.id}`) || '[]');
       localStorage.setItem(`invitations_${community.id}`, JSON.stringify([...stored, invitation]));
    }
  };

  const handleRevokeInvite = (id: string) => {
      setInvitations(prev => prev.filter(i => i.id !== id));
      if (community) {
        const updated = invitations.filter(i => i.id !== id);
        localStorage.setItem(`invitations_${community.id}`, JSON.stringify(updated));
        success('Invitation revoked');
      }
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
        <MemberTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            joinedCount={members.length}
            pendingCount={pendingMembers.length}
            declinedCount={declinedMembers.length}
            invitesCount={invitations.length}
            activityCount={activityLogs.length}
        />

        <MemberFilters
            activeTab={activeTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterRole={filterRole}
            setFilterRole={setFilterRole}
            filterJoinDate={filterJoinDate}
            setFilterJoinDate={setFilterJoinDate}
            sortBy={sortBy}
            setSortBy={setSortBy}
        />

        <div className="space-y-4 pb-32">
          {activeTab === 'joined' && (
            filteredJoinedMembers.map(member => (
              <MemberListItem
                key={member.id}
                member={member as Member}
                setEditingMember={setEditingMember}
                handleRemoveMember={handleRemoveMember}
              />
            ))
          )}

          {activeTab === 'pending' && (
            filteredPendingMembers.map(member => (
              <PendingMemberItem
                key={member.id}
                member={member}
                handleActionRequest={handleActionRequest}
              />
            ))
          )}

          {activeTab === 'declined' && (
            filteredDeclinedMembers.map(member => (
              <DeclinedMemberItem
                key={member.id}
                member={member}
                handleActionRequest={handleActionRequest}
              />
            ))
          )}

          {activeTab === 'invites' && (
            invitations.map(invite => (
              <InvitationItem
                key={invite.id}
                invite={invite}
                communityId={community?.id}
                onRevoke={handleRevokeInvite}
              />
            ))
          )}

          {activeTab === 'activity' && (
            activityLogs.length === 0 ? (
              <MemberActivityEmptyState />
            ) : (
              activityLogs.map(log => (
                <ActivityLogItem key={log.id} log={log} />
              ))
            )
          )}
        </div>
      </div>

      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        communityId={community?.id}
        onInviteGenerated={handleInviteGenerated}
      />

      <EditMemberModal
        editingMember={editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleSaveMember}
      />
    </div>
  );
};

export default ManageMembers;
