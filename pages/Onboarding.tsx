
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
      <div className="relative h-screen w-full flex flex-col overflow-hidden bg-background-dark">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-[10s] hover:scale-110" style={{ backgroundImage: `url("https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80")` }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/90 via-background-dark/40 to-background-dark"></div>
        </div>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-12">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-2xl shadow-primary/40 rotate-6">
              <span className="text-white font-black text-2xl font-display leading-none">F</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-tighter leading-none italic">Floc</span>
              <span className="text-primary text-[7px] uppercase tracking-[0.3em] font-black mt-0.5">Inspired Ventures</span>
            </div>
          </div>
          <button onClick={onComplete} className="text-white/40 text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-full border border-white/5 backdrop-blur-md">Skip Intro</button>
        </header>

        <div className="relative z-10 mt-auto flex flex-col px-8 pb-12">
          <div className="space-y-6 mb-10">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-primary text-sm">public</span>
              <span className="text-white/80 text-[9px] font-black uppercase tracking-widest">Global Conscious Network</span>
            </div>
            
            <h1 className="text-white text-5xl font-black tracking-tighter leading-[0.85] italic">
              Find your <span className="text-primary not-italic">Tribe.</span><br/>
              Plan with <span className="text-white not-italic">Purpose.</span>
            </h1>
            
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px]">
              Floc is the hub for collective travel. Join niche communities, launch sustainable ventures, and track your global footprint.
            </p>

            <div className="space-y-4 pt-4 border-l border-white/10 pl-4">
              <ValueStep num="01" text="Join a Tribe that matches your passion" />
              <ValueStep num="02" text="Co-create Ventures with active members" />
              <ValueStep num="03" text="Track CO2 & community impact live" />
            </div>
          </div>

          <button 
            onClick={() => setStep(2)}
            className="w-full h-16 bg-primary text-background-dark text-base font-black rounded-2xl shadow-2xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            <span>Explore Tribes</span>
            <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          
          <p className="text-center mt-6 text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">
            Trust & Safety by Inspired Ventures Protocol
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark p-6 flex flex-col relative overflow-hidden">
      <div className="fixed -top-20 -right-20 size-80 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      
      <header className="flex items-center justify-between py-4">
        <button onClick={() => setStep(1)} className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-white active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Curate Experiences</span>
        </div>
        <div className="size-10"></div>
      </header>

      <div className="mt-8 mb-10">
        <h2 className="text-white text-4xl font-black tracking-tight leading-tight italic">
          Your <br/><span className="text-primary not-italic">Vibe?</span>
        </h2>
        <p className="mt-3 text-slate-500 text-sm font-medium leading-relaxed">
          We'll surface Tribes and Ventures that align with your travel DNA.
        </p>
      </div>

      <div className="flex-grow overflow-y-auto hide-scrollbar">
        <div className="grid grid-cols-2 gap-3 pb-32">
          {INTERESTS.map(interest => (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`flex flex-col items-center justify-center gap-3 px-4 py-6 rounded-3xl border transition-all duration-300 ${
                selectedInterests.includes(interest.id) 
                ? 'bg-primary border-primary text-background-dark shadow-xl shadow-primary/20 scale-[1.02]' 
                : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[32px]">{interest.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{interest.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent">
        <div className="max-w-md mx-auto">
          <button 
            disabled={selectedInterests.length < 3}
            onClick={onComplete}
            className={`w-full font-black py-5 rounded-2xl text-lg transition-all shadow-2xl ${
              selectedInterests.length >= 3 
              ? 'bg-primary text-background-dark shadow-primary/30' 
              : 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
            }`}
          >
            {selectedInterests.length < 3 ? `Pick ${3 - selectedInterests.length} More` : 'Enter Discovery'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ValueStep = ({ num, text }: { num: string; text: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-[10px] font-black text-primary/40 tracking-tighter">{num}</span>
    <span className="text-white/60 text-xs font-bold leading-tight">{text}</span>
  </div>
);

export default Onboarding;
