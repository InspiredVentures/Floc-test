
import React, { useState } from 'react';
import { Community } from '../types';
import { useUser } from '../contexts/UserContext';
import { communityService } from '../services/communityService';

interface Props {
  community: Community;
  onBack: () => void;
  onSent: () => void;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Eco': ['eco', 'sustainability', 'green', 'conservation', 'nature', 'planet', 'ocean'],
  'Adventure': ['hike', 'trek', 'climb', 'expedition', 'adventure', 'mountain', 'wilderness'],
  'Social': ['community', 'meet', 'people', 'share', 'connect', 'group', 'together'],
  'Creative': ['photography', 'camera', 'photo', 'guide', 'skill', 'storyteller', 'content'],
};

const MAX_CHARS = 500;

const JoinRequest: React.FC<Props> = ({ community, onBack, onSent }) => {
  const { user, profile } = useUser();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const detectCategory = (text: string): 'Eco' | 'Adventure' | 'Social' | 'Creative' => {
    const lowercase = text.toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(k => lowercase.includes(k))) return cat as any;
    }
    return 'Social'; // Default
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSending(true);

    const category = detectCategory(message);
    const userDetails = {
      name: profile?.display_name || user.email?.split('@')[0] || 'User',
      avatar: profile?.avatar_url || 'https://picsum.photos/seed/default/100/100'
    };

    try {
        const success = await communityService.createJoinRequest(
            community.id,
            user.id,
            userDetails,
            message,
            category
        );

        if (success) {
            onSent();
        } else {
            console.error("Failed to submit request (service returned false)");
            // Ideally show a toast here, but for now console error is better than silent failure
        }
    } catch (error) {
        console.error("Failed to submit request", error);
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background-dark animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-4 pt-8 pb-4 border-b border-white/5 flex items-center gap-4">
        <button onClick={onBack} className="text-white p-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black text-white tracking-tight italic">Join the Community</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Requesting access</p>
        </div>
      </header>

      <main className="p-6 flex flex-col gap-8 flex-1">
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
          <img src={community.image} className="size-16 rounded-2xl object-cover shrink-0 shadow-lg" alt="" />
          <div>
            <h2 className="text-white font-black text-xl leading-tight">{community.title}</h2>
            <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">Managed by Community Admin</p>
          </div>
        </div>

        <section className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-white text-3xl font-black leading-tight">
              Why do you want <br />to join <span className="text-primary italic">this Community?</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              This community is "Request Only". Introduce yourself to the admin and explain what you can bring to the collective.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Your Introduction</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Hi! I'm Alex and I've been trekking for 5 years. I'd love to share my stories and learn from this group..."
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none leading-relaxed text-sm"
                maxLength={MAX_CHARS}
                required
              />
              <div className="absolute bottom-4 right-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                {message.length} / {MAX_CHARS} characters
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
              <span className="material-symbols-outlined text-primary text-xl">info</span>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-relaxed">
                Admins usually respond within 24 hours. You'll be notified if your application is approved.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl text-lg shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
            >
              {isSending ? (
                <>
                  <span className="size-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></span>
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <span className="material-symbols-outlined font-black">send</span>
                </>
              )}
            </button>
          </form>
        </section>
      </main>

      <footer className="p-6 text-center">
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          Powered by Inspired Ventures Community Protocol
        </p>
      </footer>
    </div>
  );
};

export default JoinRequest;
