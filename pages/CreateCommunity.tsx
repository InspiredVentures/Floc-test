
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
  onComplete: () => void;
}

const CATEGORIES = ['Photography', 'Eco-Travel', 'Expedition', 'Culinary', 'Wellness', 'Digital Nomad'];

const THEMES = [
  { id: 'nature', label: 'Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80' },
  { id: 'city', label: 'Urban', url: 'https://images.unsplash.com/photo-1449156001933-468b7bb2596a?auto=format&fit=crop&w=400&q=80' },
  { id: 'ocean', label: 'Ocean', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
  { id: 'mountain', label: 'Alpine', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' },
];

const CreateCommunity: React.FC<Props> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [coverUrl, setCoverUrl] = useState(THEMES[0].url);
  const [accessType, setAccessType] = useState<'free' | 'request'>('free');
  
  // Feature Toggles
  const [features, setFeatures] = useState({
    feed: true,
    ventures: true,
    directory: true,
    aiGuide: true
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="px-4 pt-10 pb-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md z-50">
        <button onClick={step === 1 ? onBack : prevStep} className="text-white p-2 active:scale-90 transition-transform">
          <span className="material-symbols-outlined">{step === 1 ? 'close' : 'arrow_back'}</span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-black text-white tracking-tight italic">Tribe Architecture</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Step {step} of 5</p>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="p-6 flex-1 flex flex-col">
        {/* Glowing Progress Bar */}
        <div className="mb-10 flex gap-2">
          {[1, 2, 3, 4, 5].map(s => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${
                step >= s 
                  ? 'bg-primary shadow-[0_0_15px_rgba(255,107,53,0.6)]' 
                  : 'bg-white/10'
              }`}
            ></div>
          ))}
        </div>

        {/* STEP 1: IDENTITY */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white leading-tight">What's the <span className="text-primary italic">Soul</span> of this Tribe?</h2>
              <p className="text-slate-500 text-xs mt-2 font-medium">Define the core mission that will attract like-minded explorers.</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Tribe Name</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Nordic Nomad Collective"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        category === cat 
                          ? 'bg-primary border-primary text-background-dark shadow-lg shadow-primary/20' 
                          : 'bg-white/5 border-white/5 text-slate-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Mission Statement</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what this tribe values most..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none transition-all resize-none text-sm placeholder:text-slate-700 min-h-[120px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BRANDING */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white leading-tight">Visual <span className="text-primary italic">Signature.</span></h2>
              <p className="text-slate-500 text-xs mt-2 font-medium">Choose a theme that represents the visual spirit of your community.</p>
            </div>
            
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl group">
               <img src={coverUrl} className="w-full h-full object-cover" alt="Preview" />
               <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
               <div className="absolute bottom-6 left-6">
                  <h3 className="text-white font-black text-2xl italic tracking-tight">{title || 'Your Tribe Name'}</h3>
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{category || 'Category'}</p>
               </div>
               <div className="absolute top-4 right-4 bg-background-dark/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-primary">visibility</span>
                  <span className="text-white text-[9px] font-black uppercase tracking-widest">Live Preview</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {THEMES.map(theme => (
                <button 
                  key={theme.id}
                  onClick={() => setCoverUrl(theme.url)}
                  className={`relative h-20 rounded-2xl overflow-hidden border-2 transition-all ${coverUrl === theme.url ? 'border-primary' : 'border-white/5'}`}
                >
                   <img src={theme.url} className="w-full h-full object-cover" alt="" />
                   <div className={`absolute inset-0 flex items-center justify-center transition-all ${coverUrl === theme.url ? 'bg-primary/20' : 'bg-black/40'}`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${coverUrl === theme.url ? 'text-white' : 'text-white/60'}`}>{theme.label}</span>
                   </div>
                </button>
              ))}
              <button className="h-20 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1 group hover:border-primary/40 transition-all">
                 <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">upload_file</span>
                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Custom Upload</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FEATURES */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white leading-tight">Engine <span className="text-primary italic">Architecture.</span></h2>
              <p className="text-slate-500 text-xs mt-2 font-medium">Select the power tools available to your Tribe members.</p>
            </div>

            <div className="space-y-3">
              <FeatureToggle 
                icon="dynamic_feed" 
                title="Pulse Social Feed" 
                desc="Allow members to post updates and media." 
                active={features.feed} 
                onToggle={() => toggleFeature('feed')} 
              />
              <FeatureToggle 
                icon="travel_explore" 
                title="Venture Engine" 
                desc="Plan and book group trips collaboratively." 
                active={features.ventures} 
                onToggle={() => toggleFeature('ventures')} 
              />
              <FeatureToggle 
                icon="group" 
                title="Member Directory" 
                desc="Visibility of profiles for social networking." 
                active={features.directory} 
                onToggle={() => toggleFeature('directory')} 
              />
              <FeatureToggle 
                icon="auto_awesome" 
                title="Gemini Tribe Guide" 
                desc="AI assistant for travel tips and scheduling." 
                active={features.aiGuide} 
                onToggle={() => toggleFeature('aiGuide')} 
              />
            </div>
          </div>
        )}

        {/* STEP 4: ACCESS */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white leading-tight">Governance <span className="text-primary italic">Mode.</span></h2>
              <p className="text-slate-500 text-xs mt-2 font-medium">Control how explorers discover and join your inner circle.</p>
            </div>
            
            <div className="space-y-4">
              <AccessCard 
                active={accessType === 'free'} 
                title="Open Frontier" 
                desc="Universal access. Perfect for scaling communities rapidly." 
                icon="public" 
                onClick={() => setAccessType('free')}
              />
              <AccessCard 
                active={accessType === 'request'} 
                title="Vetted Sanctum" 
                desc="Member vetting required. You review every application." 
                icon="verified_user" 
                onClick={() => setAccessType('request')}
              />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-5">
               <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary text-xl">gavel</span>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Inspired Protocol</h4>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed">
                  As the architect, you are responsible for maintaining Tribe safety. 
                  Vetted communities show 40% higher engagement on global ventures.
               </p>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 text-center flex-1 flex flex-col justify-center">
            <div className="relative size-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="size-full bg-primary rounded-[2.5rem] flex items-center justify-center rotate-6 shadow-2xl shadow-primary/30 relative z-10">
                <span className="material-symbols-outlined text-background-dark text-5xl font-black">celebration</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-black text-white leading-tight mb-2">Ready to <span className="text-primary italic">Live.</span></h2>
              <p className="text-slate-400 text-sm max-w-[280px] mx-auto font-medium leading-relaxed">Your Tribe is configured for success. One last check before deployment.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 text-left space-y-5 shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tribe Architecture</span>
                <span className="text-xs font-bold text-white italic truncate ml-4">{title || 'Unnamed Tribe'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enabled Engines</span>
                <div className="flex gap-1.5">
                   {Object.entries(features).filter(([_,v]) => v).map(([k]) => (
                     <div key={k} className="size-5 rounded bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[10px] text-primary">
                          {k === 'feed' ? 'dynamic_feed' : k === 'ventures' ? 'travel_explore' : k === 'directory' ? 'group' : 'auto_awesome'}
                        </span>
                     </div>
                   ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Manager</span>
                <div className="flex items-center gap-1.5">
                   <img src="https://picsum.photos/seed/alex/50/50" className="size-4 rounded-full" alt="" />
                   <span className="text-[10px] font-black text-primary uppercase">You (Admin)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-10">
          <button 
            disabled={step === 1 && (!title || !category)}
            onClick={step === 5 ? onComplete : nextStep}
            className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl text-lg shadow-2xl shadow-primary/30 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
          >
            {step === 5 ? 'Launch Tribe' : 'Proceed to Next Step'}
          </button>
          <p className="text-center text-[9px] text-slate-700 font-bold uppercase tracking-[0.2em] mt-4">
            Secured by Inspired Ventures Protocol
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureToggle = ({ icon, title, desc, active, onToggle }: { icon: string, title: string, desc: string, active: boolean, onToggle: () => void }) => (
  <button 
    onClick={onToggle}
    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
      active ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 opacity-50'
    }`}
  >
    <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-primary text-background-dark' : 'bg-white/10 text-slate-600'}`}>
       <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <div className="flex-1">
      <h4 className={`text-xs font-black uppercase tracking-tight ${active ? 'text-white' : 'text-slate-500'}`}>{title}</h4>
      <p className="text-[9px] text-slate-600 font-bold leading-tight mt-0.5">{desc}</p>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-primary' : 'bg-slate-800'}`}>
       <div className={`absolute top-1 size-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`}></div>
    </div>
  </button>
);

const AccessCard = ({ active, title, desc, icon, onClick }: { active: boolean, title: string, desc: string, icon: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[2rem] border text-left flex gap-5 transition-all ${
      active 
        ? 'bg-primary border-primary shadow-xl shadow-primary/10' 
        : 'bg-white/5 border-white/10 hover:border-white/20'
    }`}
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
