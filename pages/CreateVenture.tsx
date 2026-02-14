
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  onBack: () => void;
  onComplete: () => void;
}

const CreateVenture: React.FC<Props> = ({ onBack, onComplete }) => {
  const location = useLocation();
  const initialData = location.state?.proposal || {};

  const [step, setStep] = useState(initialData.destination ? 2 : 1);
  const [title, setTitle] = useState(initialData.destination ? `Trip to ${initialData.destination}` : '');
  const [destination, setDestination] = useState(initialData.destination || '');
  const [budget, setBudget] = useState(initialData.budget?.toLowerCase() || 'eco'); // eco, mid, luxury

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="px-4 pt-8 pb-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={onBack} className="text-white p-2">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-black text-white tracking-tight italic">New Venture</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Powered by Inspired</p>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-10 flex gap-2">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary shadow-[0_0_10px_rgba(19,236,91,0.5)]' : 'bg-white/10'}`}
            ></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <h2 className="text-3xl font-black text-white leading-tight">What's the <span className="text-primary italic">purpose?</span></h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Venture Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Amazon River Cleanup Journey"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are we heading?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <h2 className="text-3xl font-black text-white leading-tight">Choose the <span className="text-primary italic">Vibe.</span></h2>
            <div className="grid grid-cols-1 gap-4">
              <VibeOption
                active={budget === 'eco'}
                title="Conscious & Raw"
                desc="Back to basics, maximum local impact."
                icon="eco"
                onClick={() => setBudget('eco')}
              />
              <VibeOption
                active={budget === 'mid'}
                title="Comfort Seekers"
                desc="Boutique eco-stays with local charm."
                icon="hotel"
                onClick={() => setBudget('mid')}
              />
              <VibeOption
                active={budget === 'luxury'}
                title="Impact Luxury"
                desc="High-end villas with net-zero footprint."
                icon="diamond"
                onClick={() => setBudget('luxury')}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 text-center flex-1 flex flex-col justify-center">
            <div className="size-20 bg-primary rounded-3xl mx-auto flex items-center justify-center rotate-12 shadow-2xl shadow-primary/20">
              <span className="material-symbols-outlined text-background-dark text-4xl font-black">rocket_launch</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white leading-tight mb-2">Ready for Lift Off!</h2>
              <p className="text-slate-400 text-sm">Review your venture details. Once posted, Community members can apply to join.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Name</span>
                <span className="text-xs font-bold text-white">{title || 'Amazon Journey'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dest.</span>
                <span className="text-xs font-bold text-white">{destination || 'Brazil'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vibe</span>
                <span className="text-xs font-bold text-primary uppercase">{budget} Impact</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-10">
          <button
            onClick={step === 3 ? onComplete : nextStep}
            className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl text-lg shadow-2xl shadow-primary/20 active:scale-95 transition-all"
          >
            {step === 3 ? 'Launch Venture' : 'Continue'}
          </button>
          <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-4">
            Secured by Inspired Ventures Protocol
          </p>
        </div>
      </div>
    </div>
  );
};

const VibeOption = ({ active, title, desc, icon, onClick }: { active: boolean, title: string, desc: string, icon: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-3xl border text-left flex gap-4 transition-all ${active ? 'bg-primary border-primary shadow-xl shadow-primary/10' : 'bg-white/5 border-white/10'}`}
  >
    <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${active ? 'bg-background-dark text-primary' : 'bg-white/5 text-slate-500'}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <h4 className={`font-black text-sm mb-1 ${active ? 'text-background-dark' : 'text-white'}`}>{title}</h4>
      <p className={`text-[11px] leading-tight ${active ? 'text-background-dark/70 font-medium' : 'text-slate-500'}`}>{desc}</p>
    </div>
  </button>
);

export default CreateVenture;
