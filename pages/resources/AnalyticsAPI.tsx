
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
}

const AnalyticsAPI: React.FC<Props> = ({ onBack }) => {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const mockApiKey = "inspired_live_8kLq2m9P0v5X7w4Z1n6J3y";

  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="px-6 pt-10 pb-6 bg-background-dark/95 backdrop-blur-md border-b border-white/5 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={onBack} className="text-white size-10 flex items-center justify-center hover:bg-white/5 rounded-2xl border border-white/5 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-black text-white italic leading-none">Analytics API</h1>
          <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-black mt-1">Leader Infrastructure</p>
        </div>
      </header>

      <main className="p-6 space-y-6 pb-12">
        <section className="bg-black border border-white/5 rounded-3xl p-6 font-mono overflow-hidden relative shadow-2xl">
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                 <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-emerald-500 text-[10px] uppercase font-bold">API Status: Operational</span>
              </div>
              <span className="text-slate-700 text-[9px] uppercase font-bold">Latency: 42ms</span>
           </div>
           
           <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                 <p className="text-slate-500 text-[10px] mb-2 uppercase font-black">GET /v1/tribe/analytics</p>
                 <div className="text-primary text-xs leading-relaxed">
                   {`{ "reach": 4200, "conversion": "14.2%", "impact_score": 92 }`}
                 </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                 <p className="text-slate-500 text-[10px] mb-2 uppercase font-black">POST /v1/venture/sync</p>
                 <div className="text-slate-400 text-xs">
                   {`// Webhook endpoint active`}
                 </div>
              </div>
           </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-black text-sm uppercase tracking-tight italic">Access Token</h3>
              <button className="text-primary text-[9px] font-black uppercase">Rotate Key</button>
           </div>
           <div className="bg-black/60 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
              <code className="text-[11px] text-slate-400 truncate flex-1">
                 {apiKeyVisible ? mockApiKey : "******************************"}
              </code>
              <button onClick={() => setApiKeyVisible(!apiKeyVisible)} className="text-slate-500 hover:text-white transition-colors">
                 <span className="material-symbols-outlined text-base">
                   {apiKeyVisible ? 'visibility_off' : 'visibility'}
                 </span>
              </button>
           </div>
           <p className="text-[9px] text-slate-600 mt-4 leading-relaxed px-1">
              Never share your API key. It grants full read/write access to your Tribe's roster and financial Venture data.
           </p>
        </section>

        <section className="space-y-4">
           <h3 className="text-white text-sm font-black uppercase tracking-widest px-1">Technical Insights</h3>
           <div className="grid grid-cols-2 gap-4">
              <MetricBox label="API Requests" value="12.4k" icon="terminal" />
              <MetricBox label="Active Hooks" value="3" icon="anchor" />
              <MetricBox label="Uptime" value="99.9%" icon="timer" />
              <MetricBox label="Security Level" value="v4" icon="shield" />
           </div>
        </section>
      </main>
    </div>
  );
};

const MetricBox = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex flex-col items-center text-center">
     <span className="material-symbols-outlined text-primary text-xl mb-2">{icon}</span>
     <span className="text-white font-black text-lg leading-none">{value}</span>
     <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">{label}</span>
  </div>
);

export default AnalyticsAPI;
