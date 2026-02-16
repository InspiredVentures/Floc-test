import React from 'react';
import { PendingMember } from './types';

interface DeclinedMemberItemProps {
  member: PendingMember;
  handleActionRequest: (id: string, action: 'approve' | 'decline') => void;
}

export const DeclinedMemberItem: React.FC<DeclinedMemberItemProps> = ({
  member,
  handleActionRequest
}) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-4 opacity-75 hover:opacity-100 transition-opacity">
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
  );
};
