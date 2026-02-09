
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface Props {
  onOpenNotifications: () => void;
  onCreate: () => void;
  onManage: () => void;
  onContactSupport: () => void;
}

const Dashboard: React.FC<Props> = ({ onOpenNotifications, onCreate, onManage, onContactSupport }) => {
  const data = [
    { name: 'Mon', active: 40 },
    { name: 'Tue', active: 30 },
    { name: 'Wed', active: 45 },
    { name: 'Thu', active: 55 },
    { name: 'Fri', active: 70 },
    { name: 'Sat', active: 90 },
    { name: 'Sun', active: 85 },
  ];

  return (
    <div className="flex flex-col p-4 pt-10 gap-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="https://picsum.photos/seed/alex/100/100" className="size-12 rounded-full border-2 border-primary" alt="Alex" />
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5 border-2 border-background-dark">
              <span className="material-symbols-outlined text-[14px] font-bold text-background-dark">verified</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-black uppercase tracking-widest text-primary">Leader</h1>
              <span className="text-white/40 text-[10px] lowercase font-medium">by</span>
              <span className="text-white/60 text-[10px] font-black uppercase italic tracking-tighter">Inspired</span>
            </div>
            <p className="text-lg font-black text-white leading-tight tracking-tight">Alex Sterling</p>
          </div>
        </div>
        <button 
          onClick={onOpenNotifications}
          className="size-10 flex items-center justify-center rounded-full bg-slate-800 relative"
        >
          <span className="material-symbols-outlined text-white">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-slate-800"></span>
        </button>
      </header>

      <section className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Active Tribe</p>
        <h2 className="text-xl font-black text-white mb-4 tracking-tight">Eco-Warriors in Bali</h2>
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <img key={i} className="size-8 rounded-full border-2 border-background-dark" src={`https://picsum.photos/seed/${i+10}/100/100`} alt="Member" />
          ))}
          <div className="size-8 rounded-full border-2 border-background-dark bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">+142</div>
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 px-1">Tribe Health</h3>
        <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl p-6 border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-end gap-4">
              <div className="text-4xl font-black text-white tracking-tighter">92<span className="text-primary text-2xl">%</span></div>
              <div className="mb-1 text-[10px] font-black text-emerald-400 flex items-center gap-1 uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">trending_up</span> +4.2% week
              </div>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full mt-5 overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[92%] shadow-[0_0_10px_rgba(255,107,53,0.5)]"></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 font-medium leading-relaxed">Engagement is peaking. Your last expedition post reached 88% of members.</p>
          </div>
        </div>
      </section>

      <section className="h-48 bg-white/5 rounded-3xl p-5 border border-white/5 shadow-xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Activity Index</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }}
              itemStyle={{ color: '#FF6B35', fontWeight: 'bold' }}
            />
            <Bar dataKey="active" fill="#FF6B35" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="grid grid-cols-2 gap-4 pb-12">
        <ActionCard icon="add_location_alt" label="Start Venture" onClick={onCreate} />
        <ActionCard icon="group" label="Tribe Roster" onClick={onManage} />
        <ActionCard icon="support_agent" label="Leader Concierge" onClick={onContactSupport} />
        <ActionCard icon="auto_awesome" label="Platform Insights" onClick={() => {}} />
      </section>
    </div>
  );
};

const ActionCard = ({ icon, label, onClick }: { icon: string, label: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-3 bg-white/5 p-5 rounded-3xl border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all active:scale-95 shadow-lg group"
  >
    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
      <span className="material-symbols-outlined font-black text-2xl">{icon}</span>
    </div>
    <span className="text-[10px] font-black text-center leading-tight text-white uppercase tracking-widest">{label}</span>
  </button>
);

export default Dashboard;
