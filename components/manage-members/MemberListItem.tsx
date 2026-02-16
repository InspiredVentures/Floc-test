import React from 'react';
import { Member } from './types';
import { ROLE_DEFAULTS } from './constants';

interface MemberListItemProps {
  member: Member;
  setEditingMember: (member: Member) => void;
  handleRemoveMember: (id: string, name: string) => void;
}

export const MemberListItem: React.FC<MemberListItemProps> = ({
  member,
  setEditingMember,
  handleRemoveMember
}) => {
  return (
    <div
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
  );
};
