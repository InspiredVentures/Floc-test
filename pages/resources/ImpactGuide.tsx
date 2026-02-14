
import React from 'react';

interface Props {
  onBack: () => void;
}

const ImpactGuide: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="px-6 pt-10 pb-6 bg-background-dark/95 backdrop-blur-md border-b border-white/5 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={onBack} className="text-white size-10 flex items-center justify-center hover:bg-white/5 rounded-2xl border border-white/5 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-black text-white italic leading-none">Impact Guide</h1>
          <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-black mt-1">Inspired Methodology</p>
        </div>
      </header>

      <main className="p-6 space-y-8 pb-12">
        <section className="bg-primary/10 border border-primary/20 rounded-[2.5rem] p-8 text-center">
          <div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-background-dark mx-auto mb-4 shadow-xl">
            <span className="material-symbols-outlined text-4xl">eco</span>
          </div>
          <h2 className="text-white text-2xl font-black italic tracking-tight mb-2">Quantifying Good</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Inspired Ventures uses a proprietary algorithm to track and verify the ecological and social impact of every venture your Community launches.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-white text-sm font-black uppercase tracking-widest px-1">Calculation Pillars</h3>
          <ImpactCard
            icon="co2"
            title="CO2 Sequestration"
            desc="Verified carbon credits through local mangrove and rainforest restoration projects."
            percent={92}
          />
          <ImpactCard
            icon="payments"
            title="Local Economic Input"
            desc="Tracking the percentage of venture spend that goes directly to locally-owned businesses."
            percent={85}
          />
          <ImpactCard
            icon="recycling"
            title="Waste Minimization"
            desc="A measure of plastic-free days and waste-diversion success on the ground."
            percent={74}
          />
        </section>

        <section className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5">
          <h3 className="text-white font-black text-lg mb-4 italic">Leader Responsibilities</h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-xs text-slate-400 leading-relaxed">
              <span className="material-symbols-outlined text-primary text-sm">verified</span>
              Submit post-trip impact logs within 7 days of venture completion.
            </li>
            <li className="flex gap-3 text-xs text-slate-400 leading-relaxed">
              <span className="material-symbols-outlined text-primary text-sm">verified</span>
              Verify local partner sustainability certifications through our portal.
            </li>
            <li className="flex gap-3 text-xs text-slate-400 leading-relaxed">
              <span className="material-symbols-outlined text-primary text-sm">verified</span>
              Engage Community members in at least one 'Purpose Session' during trips.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

const ImpactCard = ({ icon, title, desc, percent }: { icon: string, title: string, desc: string, percent: number }) => (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex gap-5">
    <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-white font-black text-sm uppercase tracking-tight">{title}</h4>
        <span className="text-primary text-[10px] font-black">{percent}% Reliability</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{desc}</p>
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  </div>
);

export default ImpactGuide;
