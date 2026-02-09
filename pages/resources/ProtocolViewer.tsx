
import React from 'react';

interface Props {
  onBack: () => void;
}

const ProtocolViewer: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="px-6 pt-10 pb-6 bg-background-dark/95 backdrop-blur-md border-b border-white/5 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={onBack} className="text-white size-10 flex items-center justify-center hover:bg-white/5 rounded-2xl border border-white/5 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-black text-white italic leading-none">Protocol PDF</h1>
          <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-black mt-1">Official Governance</p>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-white rounded-[1rem] p-8 text-background-dark shadow-2xl space-y-8 font-serif">
           <div className="border-b-2 border-slate-200 pb-6 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2 font-display">Official Document v2.4</p>
              <h2 className="text-3xl font-black italic tracking-tighter mb-1">The Inspired Protocol</h2>
              <p className="text-xs text-slate-400 italic">Effective January 2024</p>
           </div>

           <section>
              <h3 className="text-sm font-black uppercase tracking-widest mb-3 border-l-4 border-primary pl-3 font-display">1. Member Safety</h3>
              <p className="text-sm leading-relaxed text-slate-700">
                Tribe Leaders are the ultimate guardians of member safety during physical ventures. This includes, but is not limited to, the verification of local transport, high-quality medical kits, and reliable emergency communication channels (sat-comms).
              </p>
           </section>

           <section>
              <h3 className="text-sm font-black uppercase tracking-widest mb-3 border-l-4 border-primary pl-3 font-display">2. Ethical Discovery</h3>
              <p className="text-sm leading-relaxed text-slate-700">
                Inspired Ventures promotes a "Leave No Trace" philosophy. All ventures must adhere to strict waste management protocols and prioritize cultural sensitivity when engaging with indigenous populations or sacred heritage sites.
              </p>
           </section>

           <section>
              <h3 className="text-sm font-black uppercase tracking-widest mb-3 border-l-4 border-primary pl-3 font-display">3. Leader Conduct</h3>
              <p className="text-sm leading-relaxed text-slate-700">
                Leaders must maintain professional conduct on the Pulse feed and in private Tribe chats. Any form of discrimination or unethical promotion will result in immediate dissolution of the Tribe and permanent suspension of the Leader.
              </p>
           </section>

           <div className="pt-8 text-center border-t border-slate-100">
              <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 mx-auto font-display">
                 <span className="material-symbols-outlined text-base">download</span>
                 Download PDF Copy
              </button>
           </div>
        </div>
        
        <p className="text-[9px] text-slate-700 font-bold text-center mt-10 uppercase tracking-[0.2em]">
          Inspired Ventures Legal Compliance Unit
        </p>
      </main>
    </div>
  );
};

export default ProtocolViewer;
