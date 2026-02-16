import React from 'react';
import { Invitation } from './types';
import { useToast } from '../../contexts/ToastContext';

interface InvitationItemProps {
  invite: Invitation;
  communityId: string | undefined;
  onRevoke: (id: string) => void;
}

export const InvitationItem: React.FC<InvitationItemProps> = ({
  invite,
  communityId,
  onRevoke
}) => {
  const { success } = useToast();

  const handleCopyLink = () => {
    const link = `${window.location.origin}/join/${communityId}?invite=${invite.inviteCode}`;
    navigator.clipboard.writeText(link);
    success('Invite link copied!');
  };

  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-[2rem] space-y-3">
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
          onClick={handleCopyLink}
          className="flex-1 bg-white/5 text-primary font-black py-2 rounded-xl text-[9px] uppercase hover:bg-white/10 transition-all"
        >
          Copy Link
        </button>
        <button
          onClick={() => onRevoke(invite.id)}
          className="px-4 bg-white/5 text-slate-500 font-black py-2 rounded-xl text-[9px] uppercase hover:text-red-400 transition-all"
        >
          Revoke
        </button>
      </div>
    </div>
  );
};
