
import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const INTERESTS = [
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

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(prev => prev.filter(i => i !== id));
    } else {
      setSelectedInterests(prev => [...prev, id]);
    }
  };

  if (step === 1) {
    return (
      <div className="relative h-screen w-full flex flex-col group overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCekcHitMOI6ZCeeci4asnbh4kuNeNQktU0h3eEQ1nmtnlv7DgDfdq-4OESjFGRi0vXjSF_RjbvvG_irE7hqoFbmTINBRq3UUNJfEJCEwGI8XSpIj0rN8uDplqCjTyYYBMHHfMUmnS25N2SX_sgPUlA2ZVK1TomnVuszxoAVh7Aj4Xl-iOYZAGbeDp-97cpC9mIfc2ldXf1pT5P3VUvmBwKlC6vJSluniFVxi2WKLC3bnDpb4Jw0lt51iW7DoIzcniH6trMD1TeVzbw")` }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/95"></div>
        </div>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-12">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="material-symbols-outlined text-white font-bold">flight</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-xl tracking-tight leading-none italic">Floc</span>
              <span className="text-white/80 text-[10px] uppercase tracking-widest leading-none font-semibold">by Inspired</span>
            </div>
          </div>
          <button onClick={onComplete} className="text-white/80 text-sm font-semibold py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">Skip</button>
        </header>

        <div className="relative z-10 mt-auto flex flex-col items-center px-6 pb-12">
          <div className="w-full text-center space-y-3 mb-10">
            <h1 className="text-white text-4xl font-extrabold tracking-tight leading-tight">
              Travel with <br/><span className="text-primary italic">your Tribe.</span>
            </h1>
            <p className="text-white/90 text-base font-medium leading-relaxed max-w-[320px] mx-auto">
              Join special interest groups and find your next adventure with like-minded travelers.
            </p>
          </div>
          <div className="flex gap-2.5 mb-8">
            <div className="h-1.5 w-8 rounded-full bg-primary"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
          </div>
          <button 
            onClick={() => setStep(2)}
            className="w-full h-14 bg-primary text-white text-lg font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Next</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark p-6 flex flex-col relative overflow-hidden">
      <div className="fixed -top-20 -right-20 size-80 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      
      <header className="flex items-center justify-between py-4">
        <button onClick={() => setStep(1)} className="flex items-center justify-center size-10 rounded-full bg-surface-dark/50 text-white">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold text-white">Floc</span>
          <span className="text-[8px] uppercase tracking-[0.2em] text-primary">by Inspired</span>
        </div>
        <div className="size-10"></div>
      </header>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-xs font-semibold opacity-60 text-white">Step 2 of 2</span>
          <span className="text-xs font-bold text-primary">{selectedInterests.length}/3 Selected</span>
        </div>
        <div className="w-full h-1.5 bg-surface-dark rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(selectedInterests.length / 3) * 100}%` }}></div>
        </div>
      </div>

      <div className="mt-8 mb-6 text-white">
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
          What inspires <br/><span className="text-primary">you?</span>
        </h1>
        <p className="mt-3 text-slate-400 leading-relaxed">
          Pick at least 3 interests to help us build your custom Floc feed.
        </p>
      </div>

      <div className="flex-grow">
        <div className="flex flex-wrap gap-3 pb-32">
          {INTERESTS.map(interest => (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all ${
                selectedInterests.includes(interest.id) 
                ? 'bg-primary border-primary text-background-dark shadow-lg shadow-primary/20' 
                : 'bg-surface-dark border-white/5 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{interest.icon}</span>
              <span className="text-sm font-bold">{interest.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent">
        <div className="max-w-md mx-auto">
          <button 
            disabled={selectedInterests.length < 3}
            onClick={onComplete}
            className={`w-full font-bold py-5 rounded-full text-lg transition-all ${
              selectedInterests.length >= 3 
              ? 'bg-primary text-background-dark shadow-lg' 
              : 'bg-primary/20 text-white/30 cursor-not-allowed border border-primary/10'
            }`}
          >
            Get Started
          </button>
          {selectedInterests.length < 3 && (
            <p className="text-center mt-4 text-xs font-medium text-slate-500">
              Please select {3 - selectedInterests.length} more {3 - selectedInterests.length === 1 ? 'interest' : 'interests'} to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
