import React, { useState } from 'react';
import { NotificationPreferences } from '../types';
import { dataSeedingService } from '../services/dataSeedingService';
import { useToast } from '../contexts/ToastContext';

interface Props {
  onBack: () => void;
}

const Settings: React.FC<Props> = ({ onBack }) => {
  const { success, error, info } = useToast();
  const [seeding, setSeeding] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    tripUpdates: true,
    chatMessages: true,
    communitySuggestions: false,
    marketingEmails: true
  });

  const handleSeedDatabase = async () => {
    if (!window.confirm('This will attempt to seed the database with initial data. Existing data will be preserved if possible. Continue?')) {
      return;
    }

    setSeeding(true);
    info('Starting database seeding...');

    try {
      const result = await dataSeedingService.seedDatabase((status) => {
        console.log(status);
      });

      if (result.success) {
        success(result.message);
      } else {
        error(result.message);
      }
    } catch (err) {
      error('An unexpected error occurred during seeding.');
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const toggle = (key: keyof NotificationPreferences) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      {/* ... header ... */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-4 pt-8 pb-4 border-b border-slate-800 flex items-center gap-4">
        <button onClick={onBack} className="text-white p-2 hover:bg-white/5 rounded-full">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </header>

      <main className="p-4 space-y-8">
        {/* ... existing sections ... */}

        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">Developer Tools</h2>
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="w-full bg-primary/10 border border-primary/20 text-primary font-bold py-4 rounded-2xl text-sm transition-all active:scale-95 mb-4 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {seeding ? (
              <>
                <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Seeding Database...
              </>
            ) : (
              'Seed Database'
            )}
          </button>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">Danger Zone</h2>
          {/* ... existing danger buttons ... */}
          <button
            onClick={() => {
              throw new Error("Simulated Crash for Testing!");
            }}
            className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl text-sm transition-all active:scale-95 mb-4 hover:bg-white/10"
          >
            Simulate Crash
          </button>
          <button className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-4 rounded-2xl text-sm transition-all active:scale-95">
            Log Out
          </button>
          <button className="w-full text-slate-600 text-[10px] font-bold uppercase tracking-widest text-center">
            Delete Account
          </button>
        </section>
      </main>

      <footer className="mt-auto p-6 text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Version 2.4.1 (Build 121)</p>
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
