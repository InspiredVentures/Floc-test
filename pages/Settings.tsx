
import React, { useState } from 'react';
import { NotificationPreferences } from '../types';

interface Props {
  onBack: () => void;
}

const Settings: React.FC<Props> = ({ onBack }) => {
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    tripUpdates: true,
    chatMessages: true,
    communitySuggestions: false,
    marketingEmails: true
  });

  const toggle = (key: keyof NotificationPreferences) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-4 pt-8 pb-4 border-b border-slate-800 flex items-center gap-4">
        <button onClick={onBack} className="text-white p-2 hover:bg-white/5 rounded-full">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </header>

      <main className="p-4 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-lg">notifications</span>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Notifications</h2>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
            <ToggleRow 
              label="Trip Updates" 
              description="Confirmations, itinerary changes, and departure alerts."
              active={prefs.tripUpdates} 
              onToggle={() => toggle('tripUpdates')} 
            />
            <ToggleRow 
              label="Chat Messages" 
              description="Direct messages and Tribe group chat notifications."
              active={prefs.chatMessages} 
              onToggle={() => toggle('chatMessages')} 
            />
            <ToggleRow 
              label="Community Suggestions" 
              description="When a Tribe member suggests a new activity or votes."
              active={prefs.communitySuggestions} 
              onToggle={() => toggle('communitySuggestions')} 
            />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-lg">mail</span>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Email Marketing</h2>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            <ToggleRow 
              label="Inspired Ventures News" 
              description="New destinations and sustainable travel impact reports."
              active={prefs.marketingEmails} 
              onToggle={() => toggle('marketingEmails')} 
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">Danger Zone</h2>
          <button className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-4 rounded-2xl text-sm transition-all active:scale-95">
            Log Out
          </button>
          <button className="w-full text-slate-600 text-[10px] font-bold uppercase tracking-widest text-center">
            Delete Account
          </button>
        </section>
      </main>
      
      <footer className="mt-auto p-6 text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Version 2.4.0 (Build 120)</p>
        <p className="text-[8px] text-slate-700 font-bold mt-1">Inspired Ventures Travel Platform</p>
      </footer>
    </div>
  );
};

const ToggleRow = ({ label, description, active, onToggle }: { 
  label: string, 
  description: string, 
  active: boolean, 
  onToggle: () => void 
}) => (
  <div className="p-4 flex items-center justify-between gap-4">
    <div className="flex-1">
      <h3 className="text-sm font-bold text-white mb-0.5">{label}</h3>
      <p className="text-[11px] text-slate-500 leading-tight">{description}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${active ? 'bg-primary' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-1 left-1 size-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </button>
  </div>
);

export default Settings;
