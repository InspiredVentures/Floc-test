
import React, { useState, useEffect, useMemo } from 'react';
import { Trip, TribePost, TribeComment, TripSuggestion } from '../types';

interface Props {
  trip: Trip;
  onBack: () => void;
  onBook: () => void;
  onOpenChat?: () => void;
}

interface ItineraryDay {
  day: number;
  title: string;
  content: string;
  tags: string[];
  completed: boolean;
}

const DEFAULT_ITINERARY: ItineraryDay[] = [
  { 
    day: 1, 
    title: "Arrival & Welcome", 
    content: `Arrive at the destination. Private transfer to our locally managed resort. Evening welcome circle and traditional dinner.`,
    tags: ["Dinner Included", "Transfer"],
    completed: true 
  },
  { 
    day: 2, 
    title: "Local Heritage Trek", 
    content: "A moderate 4-hour trek through historic sites and nature trails. Experience authentic local life and have lunch with a village family.",
    tags: ["Lunch Included", "Active"],
    completed: false 
  },
  { 
    day: 3, 
    title: "Community Workshop", 
    content: "Spend the day at a local center. Learn about heritage and help with local community projects.",
    tags: ["Volunteering", "Culture"],
    completed: false 
  },
  { 
    day: 4, 
    title: "Nature Photography", 
    content: "Journey to hidden natural wonders. Visit three of the area's most beautiful spots and stay in a community-run lodge.",
    tags: ["Nature", "Photography"],
    completed: false 
  },
];

const TripDetails: React.FC<Props> = ({ trip, onBack, onBook, onOpenChat }) => {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(DEFAULT_ITINERARY);
  const [activeView, setActiveView] = useState<'timeline' | 'lab'>('timeline');
  const [pulsingDay, setPulsingDay] = useState<number | null>(null);

  const toggleComplete = (dayNum: number) => {
    setItinerary(prev => prev.map(item => {
      if (item.day === dayNum) {
        const isNowCompleted = !item.completed;
        if (isNowCompleted) setPulsingDay(dayNum);
        return { ...item, completed: isNowCompleted };
      }
      return item;
    }));
  };

  const handlePulseProgress = (day: ItineraryDay) => {
    // This would typically navigate to GlobalFeed with prefilled state
    // For now, we simulate the action and clear the highlight
    setPulsingDay(null);
    alert(`Success! We've shared Day ${day.day} of "${trip.title}" to the Pulse Feed!`);
  };

  const completedCount = itinerary.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / itinerary.length) * 100);

  return (
    <div className="relative flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onBack} className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors active:scale-90">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
      </header>

      <div className="relative h-[380px] w-full shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(0deg, rgba(22,13,8,1) 0%, rgba(22,13,8,0.4) 40%, rgba(22,13,8,0) 100%), url('${trip.image}')` }}></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-white text-4xl font-black leading-tight tracking-tight italic uppercase">{trip.title}</h1>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2">{trip.destination}</p>
        </div>
      </div>

      <main className="flex-1 flex flex-col gap-8 px-4 pb-40 -mt-2 relative z-10 bg-background-dark rounded-t-[2rem] pt-8 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10">
          <button onClick={() => setActiveView('timeline')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeView === 'timeline' ? 'bg-white text-background-dark shadow-lg' : 'text-slate-500'}`}><span className="material-symbols-outlined text-sm">route</span>Timeline</button>
          <button onClick={() => setActiveView('lab')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeView === 'lab' ? 'bg-white text-background-dark shadow-lg' : 'text-slate-500'}`}><span className="material-symbols-outlined text-sm">rocket_launch</span>Venture Lab</button>
        </div>

        {activeView === 'timeline' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-[2.5rem] p-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Live Progress</p>
                  <h3 className="text-white text-2xl font-black mb-1 italic">Journey Log</h3>
                  <p className="text-slate-400 text-xs font-medium">{completedCount} of {itinerary.length} days completed</p>
                </div>
                <div className="relative size-20 shrink-0 flex items-center justify-center">
                  <svg className="size-full -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-white/5 fill-none" strokeWidth="6" />
                    <circle cx="40" cy="40" r="34" className="stroke-primary fill-none transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,107,53,0.5)]" strokeWidth="6" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * progressPercent / 100)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-sm font-black text-white italic">{progressPercent}%</span></div>
                </div>
              </div>
            </div>

            <section className="relative pl-4 space-y-4">
               {itinerary.map((item, idx) => (
                 <ItineraryItem 
                   key={item.day} 
                   item={item} 
                   onToggleComplete={() => toggleComplete(item.day)} 
                   isPulsing={pulsingDay === item.day}
                   onPulse={() => handlePulseProgress(item)}
                 />
               ))}
            </section>
          </div>
        )}

        {activeView === 'lab' && (
          <div className="py-20 text-center animate-in fade-in zoom-in-95 duration-500">
             <div className="size-20 bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-slate-700 text-4xl font-black">rocket_launch</span>
             </div>
             <h3 className="text-white text-xl font-black italic tracking-tighter">Venture Planning Lab</h3>
             <p className="text-slate-500 text-xs mt-3 max-w-[240px] mx-auto leading-relaxed">
               Collaborate on trip extensions and post-venture activities with other explorers.
             </p>
             <button className="mt-8 bg-primary/10 border border-primary/20 text-primary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Post a Suggestion</button>
          </div>
        )}
      </main>

      <section className="fixed bottom-0 left-0 right-0 z-[60] p-6 pb-10 bg-background-dark/95 backdrop-blur-3xl border-t border-white/5 max-w-md mx-auto">
         <button onClick={onBook} className="w-full bg-primary text-background-dark h-16 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3">
            <span>Secure Spot</span>
            <span className="material-symbols-outlined font-black">arrow_forward</span>
         </button>
      </section>
    </div>
  );
};

const ItineraryItem: React.FC<{ item: ItineraryDay; onToggleComplete: () => void; isPulsing: boolean; onPulse: () => void }> = ({ item, onToggleComplete, isPulsing, onPulse }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="relative mb-6 last:mb-0 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className={`absolute left-[16px] top-4 flex items-center justify-center size-8 rounded-full z-10 transition-all ${item.completed ? 'bg-primary scale-110 shadow-lg shadow-primary/30' : 'bg-slate-800 border border-white/10'}`}>
        {item.completed ? <span className="material-symbols-outlined text-background-dark text-base font-black">check</span> : <span className="text-[10px] font-black text-slate-500">{item.day}</span>}
      </div>
      <div className={`ml-14 transition-all rounded-[2rem] p-6 border cursor-pointer group ${expanded ? 'bg-primary/5 border-primary/30 shadow-2xl' : 'bg-white/5 border-white/5 hover:border-white/20'}`} onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
             <h3 className={`font-black text-sm transition-all truncate ${item.completed && !expanded ? 'text-slate-600 line-through' : 'text-white italic uppercase'}`}>{item.title}</h3>
             {isPulsing && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onPulse(); }}
                  className="mt-3 bg-primary text-background-dark px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest animate-bounce flex items-center gap-2 shadow-lg"
                >
                   <span className="material-symbols-outlined text-[10px]">dynamic_feed</span>
                   Pulse this milestone
                </button>
             )}
          </div>
          <button onClick={(e) => { e.stopPropagation(); onToggleComplete(); }} className={`size-9 rounded-xl transition-all flex items-center justify-center shrink-0 ${item.completed ? 'bg-primary text-background-dark' : 'bg-white/5 text-slate-700 border border-white/10'}`}>
            <span className="material-symbols-outlined text-xl font-black">{item.completed ? 'task_alt' : 'circle'}</span>
          </button>
        </div>
        {expanded && (
          <div className="mt-5 animate-in fade-in slide-in-from-top-3 duration-400 space-y-4">
             <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.content}</p>
             <div className="flex flex-wrap gap-2">
               {item.tags.map(tag => (
                 <span key={tag} className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-[8px] uppercase font-black tracking-widest text-slate-500">{tag}</span>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
