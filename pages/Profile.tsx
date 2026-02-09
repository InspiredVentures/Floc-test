
import React, { useState } from 'react';
import { Community, Trip } from '../types';
import { MOCK_TRIPS } from '../constants';

interface Props {
  onOpenSettings: () => void;
  onBack: () => void;
  onSelectCommunity: (community: Community) => void;
  onOpenImpact: () => void;
  onSelectTrip: (trip: Trip) => void;
}

type ProfileTab = 'DNA' | 'LEGACY';

const Profile: React.FC<Props> = ({ onOpenSettings, onBack, onSelectCommunity, onOpenImpact, onSelectTrip }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('DNA');

  return (
    <div className="flex flex-col pb-32 min-h-full bg-background-dark overflow-hidden">
      {/* Dynamic Background Blur */}
      <div className="fixed top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
      
      {/* Header */}
      <header className="flex items-center p-6 justify-between sticky top-0 z-50 bg-background-dark/60 backdrop-blur-xl border-b border-white/5">
        <button 
          onClick={onBack}
          className="text-white size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
           <h2 className="text-white text-xs font-black uppercase tracking-[0.3em] leading-none">Protocol Node</h2>
           <p className="text-primary text-[7px] font-black uppercase tracking-widest mt-1">ID: #EXPL-99212</p>
        </div>
        <button 
          onClick={onOpenSettings}
          className="text-white size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined text-xl">tune</span>
        </button>
      </header>

      {/* Hero: The Explorer Card */}
      <div className="relative px-6 pt-10 pb-6 flex flex-col items-center z-10">
        <div className="relative mb-8 group cursor-pointer" onClick={onOpenImpact}>
           <div className="absolute inset-0 bg-primary/30 rounded-[3rem] blur-3xl scale-125 opacity-40 group-hover:opacity-70 transition-opacity"></div>
           <div className="relative size-40 p-1.5 rounded-[3rem] bg-gradient-to-tr from-primary via-orange-400 to-primary/20 shadow-2xl">
              <img 
                alt="Profile" 
                className="size-full rounded-[2.5rem] object-cover border-4 border-background-dark" 
                src="https://picsum.photos/seed/alex/500/500" 
              />
              <div className="absolute -bottom-2 -right-2 bg-white text-background-dark size-12 flex items-center justify-center rounded-2xl border-4 border-background-dark shadow-xl ring-1 ring-primary/20">
                <span className="text-sm font-black italic">12</span>
              </div>
           </div>
           
           <div className="absolute top-0 -right-6 animate-bounce">
              <div className="bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg flex items-center gap-1.5">
                 <span className="material-symbols-outlined text-[10px] text-white font-black">verified</span>
                 <span className="text-[8px] font-black text-white uppercase tracking-widest">Active</span>
              </div>
           </div>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-white text-4xl font-black tracking-tighter italic uppercase">Alex Sterling</h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-sm">public</span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">London • Global Citizen</p>
          </div>
        </div>

        {/* Level Progress Ticker */}
        <div 
          onClick={onOpenImpact}
          className="w-full mt-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 group hover:bg-white/10 transition-all cursor-pointer shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <span className="material-symbols-outlined text-6xl">eco</span>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
               <div>
                  <p className="text-primary text-[8px] font-black uppercase tracking-[0.3em] mb-1">Impact Rank</p>
                  <h3 className="text-white text-xl font-black italic uppercase leading-none">Group Guardian</h3>
               </div>
               <span className="text-slate-500 text-[10px] font-black italic tracking-tighter">75% to Level 13</span>
            </div>
            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
               <div className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full w-[75%] shadow-[0_0_15px_rgba(255,107,53,0.6)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 mt-4 z-10">
        {(['DNA', 'LEGACY'] as ProfileTab[]).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-600'}`}
          >
            {tab === 'DNA' ? 'Explorer DNA' : 'Venture Legacy'}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full animate-in fade-in zoom-in duration-300 shadow-[0_0_10px_rgba(255,107,53,0.8)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <main className="flex-1 px-6 pt-8 z-10">
        {activeTab === 'DNA' ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Travel Styles Signature */}
            <section>
              <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-white text-lg font-black italic tracking-tight uppercase">Identity Profile</h3>
                <button onClick={onOpenSettings} className="size-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-sm">edit_square</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <DNACard label="Slow Traveler" icon="potted_plant" score="S-Tier" />
                <DNACard label="Peak Bagger" icon="landscape" score="Gold" />
                <DNACard label="Eco-Centric" icon="eco" score="High" />
                <DNACard label="Social Hub" icon="groups" score="Max" />
              </div>
            </section>

            {/* Conscious Bio */}
            <section className="bg-gradient-to-br from-surface-dark to-background-dark border border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
               <div className="flex items-center gap-3 mb-4">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                     <span className="material-symbols-outlined text-sm font-black">format_quote</span>
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Explorer Manifesto</h4>
               </div>
               <p className="text-slate-300 text-sm italic font-medium leading-relaxed tracking-tight">
                "Mountains are where I find my center. I travel to leave places better than I found them, prioritizing local artisans and slow trails over tourist hubs."
               </p>
            </section>

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-3 gap-3 pb-10">
               <StatBox label="Trips" value="12" icon="flight" onClick={onOpenImpact} />
               <StatBox label="Ties" value="8" icon="diversity_3" onClick={() => setActiveTab('LEGACY')} />
               <StatBox label="CO2 (t)" value="4.2" icon="co2" onClick={onOpenImpact} />
            </section>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Current Adventures */}
             <section>
                <h3 className="text-white text-lg font-black italic tracking-tight uppercase mb-6 px-1">Active Ventures</h3>
                <div className="space-y-4">
                   {MOCK_TRIPS.slice(0, 2).map(trip => (
                     <div 
                        key={trip.id} 
                        onClick={() => onSelectTrip(trip)}
                        className="p-5 bg-white/5 border border-white/5 rounded-[2.5rem] flex gap-5 hover:bg-white/10 transition-all cursor-pointer shadow-xl relative overflow-hidden group"
                     >
                        <img src={trip.image} className="size-24 rounded-[1.5rem] object-cover border border-white/10 group-hover:scale-105 transition-transform" alt="" />
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                           <span className="text-primary text-[8px] font-black uppercase tracking-widest mb-1.5 inline-block">Day 4 of 8</span>
                           <h4 className="text-white font-black text-lg leading-none mb-2 truncate">{trip.title}</h4>
                           <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full w-[50%] animate-pulse"></div>
                           </div>
                        </div>
                        <div className="self-center">
                           <span className="material-symbols-outlined text-slate-700 group-hover:text-white transition-all">chevron_right</span>
                        </div>
                     </div>
                   ))}
                </div>
             </section>

             {/* Historic Legacies */}
             <section className="pb-10">
                <h3 className="text-white text-lg font-black italic tracking-tight uppercase mb-6 px-1">Venture History</h3>
                <div className="space-y-4">
                  {MOCK_TRIPS.slice(2, 5).map((trip, i) => (
                    <div 
                      key={trip.id}
                      onClick={() => onSelectTrip(trip)}
                      className="bg-surface-dark/40 border border-white/5 p-5 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-primary transition-colors border border-white/10">
                          <span className="material-symbols-outlined">{i % 2 === 0 ? 'mountain_flag' : 'temple_buddhist'}</span>
                        </div>
                        <div>
                           <h4 className="text-white font-black text-sm uppercase leading-none mb-1">{trip.destination}</h4>
                           <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{trip.dates.split(' — ')[0]}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-emerald-400 text-[9px] font-black uppercase tracking-tighter">Impact: +1.2t CO2</p>
                         <p className="text-slate-600 text-[8px] font-bold uppercase mt-1">Status: Logged</p>
                      </div>
                    </div>
                  ))}
                </div>
             </section>
          </div>
        )}
      </main>

      {/* Global Impact Bridge Overlay */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-40">
         <button 
          onClick={onOpenImpact}
          className="w-full h-16 bg-white text-background-dark rounded-2xl flex items-center justify-between px-6 shadow-2xl active:scale-95 transition-all group"
         >
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined font-black">public</span>
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sustainability Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black uppercase text-primary">View Score</span>
               <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
         </button>
      </div>
    </div>
  );
};

const DNACard = ({ label, icon, score }: { label: string, icon: string, score: string }) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-3xl group hover:border-primary/40 transition-all">
    <div className="flex items-center justify-between mb-3">
       <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
       <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">{score}</span>
    </div>
    <h4 className="text-white font-black text-[10px] uppercase tracking-[0.1em]">{label}</h4>
  </div>
);

const StatBox = ({ label, value, icon, onClick }: { label: string, value: string, icon: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-surface-dark border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95 shadow-xl"
  >
    <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
    <div className="flex flex-col">
       <span className="text-white font-black text-lg leading-none">{value}</span>
       <span className="text-slate-600 text-[7px] font-black uppercase tracking-widest mt-1">{label}</span>
    </div>
  </button>
);

export default Profile;
