
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
  onComplete: () => void;
}

const CATEGORIES = ['Photography', 'Eco-Travel', 'Expedition', 'Culinary', 'Wellness', 'Digital Nomad'];

const CreateCommunity: React.FC<Props> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [accessType, setAccessType] = useState<'free' | 'request'>('free');

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="px-4 pt-10 pb-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-50">
        <button onClick={onBack} className="text-white p-2">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-black text-white tracking-tight italic">Launch Tribe</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Management Setup</p>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-10 flex gap-2">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary shadow-[0_0_10px_rgba(255,107,53,0.5)]' : 'bg-white/10'}`}
            ></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <h2 className="text-3xl font-black text-white leading-tight">Define the <span className="text-primary italic">Identity.</span></h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Tribe Name</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Andean Alpinists"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Tribe Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        category === cat ? 'bg-primary border-primary text-background-dark' : 'bg-white/5 border-white/5 text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Tribe Mission</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What brings this tribe together?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none transition-all resize-none text-sm"
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <h2 className="text-3xl font-black text-white leading-tight">Set the <span className="text-primary italic">Governance.</span></h2>
            <div className="space-y-4">
              <AccessOption 
                active={accessType === 'free'} 
                title="Open Community" 
                desc="Anyone can join instantly. Great for growing fast." 
                icon="public" 
                onClick={() => setAccessType('free')}
              />
              <AccessOption 
                active={accessType === 'request'} 
                title="Vetted Tribe" 
                desc="Users must apply to join. You review all applications." 
                icon="verified_user" 
                onClick={() => setAccessType('request')}
              />
            </div>
            <div className="p-5 bg-primary/5 border border-primary/20 rounded-3xl">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <span className="material-symbols-outlined text-sm">info</span>
                <p className="text-[9px] font-black uppercase tracking-widest">Protocol Tip</p>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Vetted Tribes often have 3x higher engagement during ventures as members share a curated mission.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 text-center flex-1 flex flex-col justify-center">
            <div className="relative size-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="size-full bg-primary rounded-[2.5rem] flex items-center justify-center rotate-6 shadow-2xl shadow-primary/30 relative z-10">
                <span className="material-symbols-outlined text-background-dark text-5xl font-black">gavel</span>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white leading-tight mb-2">Final Protocol Check</h2>
              <p className="text-slate-400 text-sm max-w-[280px] mx-auto">By creating this tribe, you agree to the Inspired Ventures safety protocol and code of conduct.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 text-left space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tribe Name</span>
                <span className="text-xs font-bold text-white italic">{title || 'Unnamed Tribe'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Leadership Role</span>
                <div className="flex items-center gap-1">
                   <span className="material-symbols-outlined text-primary text-xs">stars</span>
                   <span className="text-[10px] font-black text-primary uppercase">Community Manager</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Mode</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{accessType === 'free' ? 'Public' : 'Approval Required'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-10">
          <button 
            disabled={step === 1 && (!title || !category)}
            onClick={step === 3 ? onComplete : nextStep}
            className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl text-lg shadow-2xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {step === 3 ? 'Establish Tribe' : 'Next Step'}
          </button>
          <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-4">
            Secured by Inspired Ventures Protocol
          </p>
        </div>
      </div>
    </div>
  );
};

const AccessOption = ({ active, title, desc, icon, onClick }: { active: boolean, title: string, desc: string, icon: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[2rem] border text-left flex gap-5 transition-all ${active ? 'bg-primary border-primary shadow-xl shadow-primary/10' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
  >
    <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${active ? 'bg-background-dark text-primary shadow-lg' : 'bg-white/5 text-slate-500'}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div className="flex-1">
      <h4 className={`font-black text-sm mb-1 uppercase tracking-tight ${active ? 'text-background-dark' : 'text-white'}`}>{title}</h4>
      <p className={`text-[11px] leading-tight font-medium ${active ? 'text-background-dark/70' : 'text-slate-500'}`}>{desc}</p>
    </div>
  </button>
);

export default CreateCommunity;
