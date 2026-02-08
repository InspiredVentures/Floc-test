
import React from 'react';
import { MOCK_IMPACT } from '../constants';

const Impact: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 p-4 pt-12">
      <header className="flex flex-col items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-white">Sustainability Impact</h2>
        <p className="text-primary text-xs font-semibold tracking-wider uppercase">Floc, by Inspired</p>
        <div className="mt-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">group</span>
          <span className="text-primary text-xs font-bold">Eco-Warriors in Bali</span>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4">
        <MetricCard icon="co2" label="CO2 Offset" value={MOCK_IMPACT.co2Offset} trend="+12%" />
        <MetricCard icon="forest" label="Trees" value={MOCK_IMPACT.trees} trend="85 new" />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-white text-xl font-bold">Impact Breakdown</h3>
        <div className="grid grid-cols-2 gap-4">
          <RingProgress value={85} label="Local Economy Support" />
          <RingProgress value={70} label="Plastic-Free Days" subtext="18/21" />
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-slate-400 text-sm font-medium">Wildlife Protection Funding</p>
            <p className="text-2xl font-bold text-white">£4,500</p>
          </div>
          <p className="text-primary text-sm font-bold">90% of Goal</p>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 mb-2">
          <div className="bg-primary h-3 rounded-full" style={{ width: '90%' }}></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>£0</span>
          <span>Goal: £5,000</span>
        </div>
      </section>

      <div className="mt-4 mb-8 text-center flex flex-col items-center gap-4">
        <button className="w-full bg-white/5 border border-white/10 py-3 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2">
          How we calculate impact
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </button>
        <div className="flex items-center gap-2 opacity-50">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white">Verified by Inspired Ventures</span>
          <span className="material-symbols-outlined text-[16px] text-white">verified</span>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, trend }: any) => (
  <div className="flex flex-col gap-2 rounded-xl p-5 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
    <div className="flex items-center gap-2 text-primary">
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <p className="text-xs font-bold uppercase tracking-wider">{label}</p>
    </div>
    <p className="text-white tracking-tight text-2xl font-bold">{value}</p>
    <div className="flex items-center gap-1 text-primary">
      <span className="material-symbols-outlined text-sm">trending_up</span>
      <p className="text-xs font-bold">{trend}</p>
    </div>
  </div>
);

const RingProgress = ({ value, label, subtext }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center">
    <div className="relative flex items-center justify-center mb-3">
      <svg className="w-24 h-24">
        <circle className="text-white/10" cx="48" cy="48" fill="transparent" r="38" stroke="currentColor" strokeWidth="8"></circle>
        <circle className="text-primary" cx="48" cy="48" fill="transparent" r="38" stroke="currentColor" strokeDasharray="238.76" strokeDashoffset={238.76 - (238.76 * value / 100)} strokeLinecap="round" strokeWidth="8" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}></circle>
      </svg>
      <span className="absolute text-lg font-bold text-white">{subtext || `${value}%`}</span>
    </div>
    <p className="text-sm font-semibold text-slate-300">{label}</p>
  </div>
);

export default Impact;
