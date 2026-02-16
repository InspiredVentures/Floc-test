import React, { useState, useEffect } from 'react';
import { Member, UserRole } from './types';
import { ROLE_DEFAULTS, PERMISSIONS } from './constants';

interface EditMemberModalProps {
  editingMember: Member | null;
  onClose: () => void;
  onSave: (member: Member, role: UserRole, permissions: string[]) => void;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  editingMember,
  onClose,
  onSave
}) => {
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

  if (!editingMember || !tempRole) return null;

  const togglePermission = (permId: string) => {
    setTempPerms(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleRoleSelect = (role: UserRole) => {
    setTempRole(role);
    setTempPerms(ROLE_DEFAULTS[role].permissions);
  };

  const handleApply = () => {
    onSave(editingMember, tempRole, tempPerms);
  };

  return (
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
          <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors">
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
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-white/10"
            >
              Discard
            </button>
            <button
              onClick={handleApply}
              className="flex-[2] py-4 bg-primary text-background-dark font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
            >
              Apply Authority
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
