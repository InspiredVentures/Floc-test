
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlocLogo } from '../src/components/FlocLogo';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';

interface Interest {
  id: string;
  label: string;
  icon: string;
}

const INTERESTS: Interest[] = [
  { id: 'hiking', label: 'Hiking', icon: 'mountain_flag' },
  { id: 'photography', label: 'Photography', icon: 'photo_camera' },
  { id: 'eco', label: 'Eco-Travel', icon: 'eco' },
  { id: 'solo', label: 'Solo Travel', icon: 'person_pin_circle' },
  { id: 'foodie', label: 'Foodie', icon: 'restaurant' },
  { id: 'adventure', label: 'Adventure', icon: 'explore' },
  { id: 'cultural', label: 'Cultural', icon: 'museum' },
  { id: 'vanlife', label: 'Van Life', icon: 'airport_shuttle' },
  { id: 'wellness', label: 'Wellness', icon: 'spa' },
  { id: 'luxury', label: 'Luxury', icon: 'diamond' },
  { id: 'budget', label: 'Budget', icon: 'payments' },
  { id: 'hidden', label: 'Hidden Gems', icon: 'map' },
];

const ValueStep = ({ num, text }: { num: string; text: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-[10px] font-black text-accent tracking-tighter">{num}</span>
    <span className="text-primary/60 text-xs font-bold leading-tight">{text}</span>
  </div>
);

interface Props {
  onComplete?: () => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useUser();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Profile creation state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/user/400/400');

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(prev => prev.filter(i => i !== id));
    } else {
      setSelectedInterests(prev => [...prev, id]);
    }
  };

  const handleCompleteProfile = async () => {
    if (!user) {
      navigate('/discovery');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({
        display_name: displayName,
        bio: bio,
        location: location,
        avatar_url: avatarUrl,
        interests: selectedInterests
      }).eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      if (onComplete) {
        onComplete();
      } else {
        navigate('/discovery');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (step === 1) {
    return (
      <div className="relative h-screen w-full flex flex-col overflow-hidden bg-[#FCFBF5]">
        {/* Background Texture/Gradient */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>

        <header className="relative z-10 flex items-center justify-between px-6 pt-12">
          <div className="flex items-center gap-3">
            <FlocLogo className="text-6xl text-primary drop-shadow-lg" />
            <div className="flex flex-col ml-1 pt-4">
              <span className="text-primary font-black text-xl tracking-tighter leading-none italic uppercase">EVA</span>
              <span className="text-accent text-[8px] font-black uppercase tracking-[0.3em] font-black mt-0.5">by Inspired</span>
            </div>
          </div>
          <button onClick={() => navigate('/discovery')} className="text-primary/40 text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-full border border-primary/10 hover:bg-primary/5 transition-colors">Skip Intro</button>
        </header>

        <div className="relative z-10 mt-auto flex flex-col px-8 pb-12">
          <div className="space-y-4 mb-4">
            <h1 className="text-primary text-5xl font-heading font-black tracking-tighter leading-[0.9] italic uppercase">
              Find your <span className="text-accent not-italic">Community.</span><br />
              Launch your <span className="text-primary/80 not-italic">Impact.</span>
            </h1>
            <p className="text-primary/60 text-sm leading-relaxed font-medium max-w-md">
              EVA is the hub for collective travel for the vibrant over-50s community. Join niche groups, launch sustainable journeys, and track your global impact.
            </p>

            <div className="space-y-4 pt-4 border-l border-primary/10 pl-4 mb-6">
              <ValueStep num="01" text="Join a Community that matches your passion" />
              <ValueStep num="02" text="Launch journeys with absolute confidence" />
              <ValueStep num="03" text="Track real impact on every single journey" />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group hover:bg-primary/90"
            >
              <span>Explore Communities</span>
              <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>

            <p className="text-center mt-6 text-[9px] text-primary/30 font-bold uppercase tracking-[0.2em]">
              Trust & Safety by Inspired Ventures Protocol
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#FCFBF5] p-6 flex flex-col relative overflow-hidden">
        <div className="fixed -top-20 -left-20 size-80 bg-primary/5 rounded-full blur-[100px] -z-10"></div>

        <header className="flex items-center justify-between py-4 relative z-10">
          <button onClick={() => setStep(2)} className="flex items-center justify-center size-10 rounded-full bg-white border border-primary/10 text-primary active:scale-90 transition-all shadow-sm hover:bg-primary/5">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Final Step</span>
          </div>
          <button onClick={() => navigate('/discovery')} className="text-accent text-[9px] font-black uppercase tracking-widest hover:underline">Skip</button>
        </header>

        <div className="mt-8 mb-10 relative z-10">
          <h2 className="text-primary text-4xl font-heading font-black tracking-tight leading-tight italic uppercase">
            Your <br /><span className="text-accent not-italic">Profile</span>
          </h2>
          <p className="mt-3 text-primary/60 text-sm font-medium leading-relaxed">
            How do you want fellow travelers to know you?
          </p>
        </div>

        <div className="flex-grow overflow-y-auto hide-scrollbar space-y-6 pb-40 relative z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="size-32 rounded-3xl border-4 border-white object-cover shadow-xl shadow-primary/10"
              />
              <button
                onClick={() => setAvatarUrl(`https://picsum.photos/seed/${Date.now()}/400/400`)}
                className="absolute bottom-0 right-0 size-10 bg-accent text-white rounded-xl border-4 border-[#FCFBF5] flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-accent/90"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest">Tap to change avatar</p>
          </div>

          <div className="space-y-2">
            <label className="text-primary/60 text-xs font-bold uppercase tracking-widest px-1">Display Name *</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Sterling"
              className="w-full bg-white border border-primary/10 rounded-2xl px-6 py-4 text-primary placeholder:text-primary/30 focus:border-accent outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-primary/60 text-xs font-bold uppercase tracking-widest px-1">Location</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary/40">location_on</span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="London, UK"
                className="w-full bg-white border border-primary/10 rounded-2xl pl-14 pr-6 py-4 text-primary placeholder:text-primary/30 focus:border-accent outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-primary/60 text-xs font-bold uppercase tracking-widest px-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your travel style and passions..."
              rows={4}
              maxLength={200}
              className="w-full bg-white border border-primary/10 rounded-2xl px-6 py-4 text-primary placeholder:text-primary/30 focus:border-accent outline-none transition-all resize-none shadow-sm"
            />
            <div className="text-right">
              <span className="text-primary/40 text-[10px] font-bold">{bio.length}/200</span>
            </div>
          </div>

          <div className="space-y-3 bg-white border border-primary/5 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-sm">verified</span>
              <h4 className="text-primary text-xs font-black uppercase tracking-widest">Your Interests</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map(id => {
                const interest = INTERESTS.find(i => i.id === id);
                return interest ? (
                  <div key={id} className="bg-accent/10 border border-accent/20 text-accent px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[12px]">{interest.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">{interest.label}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#FCFBF5] via-[#FCFBF5]/95 to-transparent z-20">
          <div className="max-w-md mx-auto">
            <button
              disabled={!displayName.trim() || isSaving}
              onClick={handleCompleteProfile}
              className={`w-full font-black py-5 rounded-2xl text-lg transition-all shadow-xl flex items-center justify-center gap-3 group ${displayName.trim()
                ? 'bg-accent text-white shadow-accent/30 hover:bg-accent/90'
                : 'bg-primary/5 text-primary/30 cursor-not-allowed border border-primary/5'
                }`}
            >
              {isSaving ? (
                <>
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Complete Profile</span>
                  <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">done_all</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF5] p-6 flex flex-col relative overflow-hidden">
      <div className="fixed -top-20 -right-20 size-80 bg-accent/5 rounded-full blur-[100px] -z-10"></div>

      <header className="flex items-center justify-between py-4 relative z-10">
        <button onClick={() => setStep(1)} className="flex items-center justify-center size-10 rounded-full bg-white border border-primary/10 text-primary active:scale-90 transition-all shadow-sm hover:bg-primary/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Curate Experiences</span>
        </div>
        <div className="size-10"></div>
      </header>

      <div className="mt-8 mb-10 relative z-10">
        <h2 className="text-primary text-4xl font-heading font-black tracking-tight leading-tight italic uppercase">
          Your <br /><span className="text-accent not-italic">Vibe?</span>
        </h2>
        <p className="mt-3 text-primary/60 text-sm font-medium leading-relaxed">
          We'll surface Communities and Trips that align with your travel DNA.
        </p>
      </div>

      <div className="flex-grow overflow-y-auto hide-scrollbar relative z-10">
        <div className="grid grid-cols-2 gap-3 pb-32">
          {INTERESTS.map(interest => (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`flex flex-col items-center justify-center gap-3 px-4 py-6 rounded-3xl border transition-all duration-300 shadow-sm ${selectedInterests.includes(interest.id)
                ? 'bg-accent border-accent text-white shadow-xl shadow-accent/20 scale-[1.02]'
                : 'bg-white border-primary/5 text-primary/40 hover:border-accent/30 hover:text-primary hover:shadow-md'
                }`}
            >
              <span className="material-symbols-outlined text-[32px]">{interest.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{interest.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#FCFBF5] via-[#FCFBF5]/95 to-transparent z-20">
        <div className="max-w-md mx-auto">
          <button
            disabled={selectedInterests.length < 3}
            onClick={() => setStep(3)}
            className={`w-full font-black py-5 rounded-2xl text-lg transition-all shadow-xl ${selectedInterests.length >= 3
              ? 'bg-accent text-white shadow-accent/30 hover:bg-accent/90'
              : 'bg-primary/5 text-primary/30 cursor-not-allowed border border-primary/5'
              }`}
          >
            {selectedInterests.length < 3 ? `Pick ${3 - selectedInterests.length} More` : 'Create Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
