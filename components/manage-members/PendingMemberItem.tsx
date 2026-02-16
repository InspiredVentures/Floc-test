import React from 'react';
import { PendingMember } from './types';

interface PendingMemberItemProps {
  member: PendingMember;
  handleActionRequest: (id: string, action: 'approve' | 'decline') => void;
}

export const PendingMemberItem: React.FC<PendingMemberItemProps> = ({
  member,
  handleActionRequest
}) => {
  return (
    <div className="p-6 bg-surface-dark border border-white/5 rounded-[2.5rem] space-y-4 shadow-xl">
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
  );
};
