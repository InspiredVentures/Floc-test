import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { Community } from '../types';

interface Props {
  onBack?: () => void;
  onComplete?: () => void;
}

const STEPS = [
  { id: 'identity', label: 'Identity', icon: 'fingerprint' },
  { id: 'vibe', label: 'Vibe', icon: 'palette' },
  { id: 'protocol', label: 'Protocol', icon: 'security' },
  { id: 'features', label: 'Modules', icon: 'extension' },
  { id: 'launch', label: 'Launch', icon: 'rocket_launch' },
];

const CATEGORIES = ['Adventure', 'Eco-Travel', 'Wellness', 'Photography', 'Cultural', 'Trip', 'Digital Nomad'];

const FEATURE_MODULES = [
  { id: 'chat', label: 'Community Chat', icon: 'forum', desc: 'Real-time discussion channels' },
  { id: 'events', label: 'Events Calendar', icon: 'event', desc: 'Schedule meetups & trips' },
  { id: 'shop', label: 'Marketplace', icon: 'storefront', desc: 'Sell gear & merch' },
  { id: 'voting', label: 'Governance', icon: 'how_to_vote', desc: 'Member voting rights' },
];

const CreateCommunity: React.FC<Props> = ({ onBack, onComplete }) => {
  const navigate = useNavigate();
  const { createCommunity } = useUser();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-community-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      if (data.image) {
        setFormData(prev => ({ ...prev, image: data.image }));
        toast.success('Cover image generated!');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Type-safe form data
  const [formData, setFormData] = useState<Omit<Community, 'id' | 'memberCount' | 'upcomingTrips' | 'meta' | 'accessType' | 'isManaged' | 'unreadCount'> & { image: string, entryQuestions: string[], enabledFeatures: string[] }>({
    title: '',
    category: '',
    description: '',
    image: '',
    entryQuestions: ['Why do you want to join this tribe?', 'What is your travel style?'],
    enabledFeatures: ['chat', 'events']
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const startLaunch = () => {
    handleLaunch();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      if (onBack) onBack();
      else navigate(-1);
    }
  };

  const handleLaunch = async () => {
    setIsMinting(true);
    try {
      const community = await createCommunity({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        image: formData.image || 'https://images.unsplash.com/photo-1528696892704-5e1122852276?auto=format&fit=crop&w=800&q=80', // Default fallback
        meta: `${formData.category} • 1 member`,
        entryQuestions: formData.entryQuestions,
        enabledFeatures: formData.enabledFeatures,
        accessType: 'request'
      });



      if (community) {

        toast.success(`Welcome to ${community.title}!`);
        if (onComplete) {

          onComplete();
        } else {

          navigate('/dashboard', { state: { communityId: community.id } });
        }
      } else {
        console.error('[CreateCommunity] Community creation failed (returned null/undefined)');
        toast.error('Failed to create community. Please try again.');
      }
    } catch (error) {
      console.error("Failed to create community", error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsMinting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Identity
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest">Community Name</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-primary outline-none transition-all placeholder:text-slate-600"
                placeholder="e.g. Arctic Explorers"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.category === cat ? 'bg-primary border-primary text-background-dark' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest">Mission</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-medium focus:border-primary outline-none transition-all placeholder:text-slate-600 h-32 resize-none"
                placeholder="What brings us together?"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        );
      case 1: // Vibe
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest">Cover Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-primary outline-none transition-all placeholder:text-slate-600"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !formData.category}
                  className="bg-primary/10 text-primary border border-primary/20 rounded-2xl px-4 font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                >
                  {isGenerating ? (
                    <span className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  )}
                  {isGenerating ? 'Generating' : 'Generate'}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">Leave empty for a random Unsplash image.</p>
            </div>
            {formData.image && (
              <div className="h-48 w-full rounded-3xl bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${formData.image})` }}></div>
            )}
          </div>
        );
      case 2: // Protocol
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="space-y-4">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest">Entry Questions</label>
              {formData.entryQuestions.map((q, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-primary font-black pt-3 min-w-[20px]">{i + 1}.</span>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-medium focus:border-primary outline-none transition-all"
                    value={q}
                    onChange={e => {
                      const newQuestions = [...formData.entryQuestions];
                      newQuestions[i] = e.target.value;
                      setFormData({ ...formData, entryQuestions: newQuestions });
                    }}
                  />
                  <button
                    onClick={() => {
                      const newQuestions = formData.entryQuestions.filter((_, idx) => idx !== i);
                      setFormData({ ...formData, entryQuestions: newQuestions });
                    }}
                    className="bg-white/5 p-3 rounded-xl text-slate-500 hover:text-white transition-colors h-14 w-14 flex items-center justify-center shrink-0"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
              <button
                onClick={() => setFormData({ ...formData, entryQuestions: [...formData.entryQuestions, ''] })}
                className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Question
              </button>
            </div>
          </div>
        );
      case 3: // Modules
        return (
          <div className="space-y-4 animate-in slide-in-from-right duration-500">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 block">Enable Features</label>
            <div className="grid grid-cols-1 gap-3">
              {FEATURE_MODULES.map(feature => {
                const isEnabled = formData.enabledFeatures.includes(feature.id);
                return (
                  <button
                    key={feature.id}
                    onClick={() => {
                      if (isEnabled) {
                        setFormData({ ...formData, enabledFeatures: formData.enabledFeatures.filter(f => f !== feature.id) });
                      } else {
                        setFormData({ ...formData, enabledFeatures: [...formData.enabledFeatures, feature.id] });
                      }
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${isEnabled ? 'bg-primary/10 border-primary text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                  >
                    <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${isEnabled ? 'bg-primary text-background-dark' : 'bg-background-dark text-slate-500 group-hover:text-white'}`}>
                      <span className="material-symbols-outlined">{feature.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-black uppercase tracking-widest text-[10px] ${isEnabled ? 'text-primary' : 'text-slate-300 group-hover:text-white'}`}>{feature.label}</h4>
                      <p className="text-[10px] font-medium opacity-70">{feature.desc}</p>
                    </div>
                    <div className={`size-6 rounded-full border flex items-center justify-center transition-all ${isEnabled ? 'bg-primary border-primary' : 'border-slate-600 group-hover:border-slate-400'}`}>
                      {isEnabled && <span className="material-symbols-outlined text-background-dark text-sm font-black">check</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 4: // Launch
        return (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="size-24 rounded-[2.5rem] bg-gradient-to-br from-primary to-accent mx-auto mb-8 shadow-[0_0_40px_rgba(0,127,255,0.4)] flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-white text-5xl">rocket_launch</span>
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2">Ready for Liftoff?</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
              You are about to mint <strong>{formData.title}</strong> on the Inspired Ventures Protocol.
            </p>

            <div className="bg-white/5 rounded-2xl p-6 text-left max-w-xs mx-auto space-y-4 border border-white/10">
              <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-slate-500 font-bold uppercase tracking-widest">Type</span>
                <span className="text-white font-bold">{formData.category}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-slate-500 font-bold uppercase tracking-widest">Modules</span>
                <span className="text-white font-bold">{formData.enabledFeatures.length} Active</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-widest">Entry Protocol</span>
                <span className="text-white font-bold">{formData.entryQuestions.length} Questions</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isMinting) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="relative z-10 text-center animate-in fade-in duration-1000">
          <div className="size-24 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-2xl shadow-primary/20"></div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4">Minting Community...</h2>

          <div className="space-y-2">
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Establishing Governance</p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Deploying Modules</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between border-b border-white/5 relative z-50">
        <button onClick={handleBack} className="size-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-md">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-white font-black text-sm uppercase tracking-widest">Create Community</span>
          <div className="flex gap-1 mt-1.5">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-6 bg-primary' : i < currentStep ? 'w-2 bg-primary/50' : 'w-1 bg-white/10'}`}></div>
            ))}
          </div>
        </div>
        <div className="size-10"></div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8 overflow-y-auto pb-32">
        <div className="max-w-md mx-auto">
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">{STEPS[currentStep].label}</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Step {currentStep + 1} of {STEPS.length}</p>
          </div>

          {renderStepContent()}
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 border-t border-white/5 bg-background-dark/95 backdrop-blur-xl z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={currentStep === STEPS.length - 1 ? startLaunch : handleNext}
            disabled={currentStep === 0 && !formData.title}
            className="w-full bg-primary text-background-dark py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {currentStep === STEPS.length - 1 ? 'Launch Protocol' : 'Continue'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CreateCommunity;
