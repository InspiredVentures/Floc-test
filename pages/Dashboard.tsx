
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface Props {
  onOpenNotifications: () => void;
}

const Dashboard: React.FC<Props> = ({ onOpenNotifications }) => {
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
            <h1 className="text-xs font-bold uppercase tracking-widest text-primary">Leader Dashboard</h1>
            <p className="text-lg font-bold text-white">Alex Sterling</p>
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

      <section className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
        <p className="text-xs font-medium text-slate-400">Managing Group</p>
        <h2 className="text-xl font-bold text-white mb-4">Eco-Warriors in Bali</h2>
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <img key={i} className="size-8 rounded-full border-2 border-background-dark" src={`https://picsum.photos/seed/${i}/100/100`} alt="Member" />
          ))}
          <div className="size-8 rounded-full border-2 border-background-dark bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">+142</div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">Community Health</h3>
        <div className="bg-gradient-to-br from-slate-900 to-black rounded-xl p-5 border border-slate-800 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-end gap-4">
              <div className="text-4xl font-bold text-white">92<span className="text-primary text-2xl">%</span></div>
              <div className="mb-1 text-xs font-medium text-emerald-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> +4.2% this week
              </div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[92%]"></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-medium">Engagement is high. Your last post reached 88% of members.</p>
          </div>
        </div>
      </section>

      <section className="h-48 bg-slate-900/50 rounded-xl p-4 border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Member Activity</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#13ec5b' }}
            />
            <Bar dataKey="active" fill="#13ec5b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="grid grid-cols-2 gap-4 pb-12">
        <ActionCard icon="add_location_alt" label="Create Venture" />
        <ActionCard icon="group" label="Manage Members" />
      </section>
    </div>
  );
};

const ActionCard = ({ icon, label }: { icon: string, label: string }) => (
  <button className="flex flex-col items-center gap-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all">
    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      <span className="material-symbols-outlined font-bold">{icon}</span>
    </div>
    <span className="text-[11px] font-bold text-center leading-tight text-white">{label}</span>
  </button>
);

export default Dashboard;
