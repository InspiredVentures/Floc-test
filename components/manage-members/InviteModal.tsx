import React, { useState } from 'react';
import { Invitation } from './types';
import { useToast } from '../../contexts/ToastContext';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: string | undefined;
  onInviteGenerated: (invitation: Invitation) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  communityId,
  onInviteGenerated
}) => {
  const { success, error } = useToast();
  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  if (!isOpen) return null;

  const generateInviteLink = () => {
    if (!inviteEmail.trim()) return;

    const inviteCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/join/${communityId}?invite=${inviteCode}`;

    const newInvitation: Invitation = {
      id: `inv-${Date.now()}`,
      email: inviteEmail,
      inviteCode,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onInviteGenerated(newInvitation);
    setGeneratedLink(link);
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

  const handleClose = () => {
    onClose();
    setInviteEmail('');
    setGeneratedLink('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-background-dark w-full max-w-md rounded-t-[3rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white leading-none">Invite Member</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Share Access</p>
          </div>
          <button onClick={handleClose} className="text-slate-600 hover:text-white transition-colors">
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
                onClick={handleClose}
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
  );
};
