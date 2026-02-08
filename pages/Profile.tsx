
import React, { useState } from 'react';

interface Props {
  onOpenSettings: () => void;
  onBack: () => void;
}

type ProfileTab = 'overview' | 'adventures' | 'impact';

const Profile: React.FC<Props> = ({ onOpenSettings, onBack }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  return (
    <div className="flex flex-col pb-24 min-h-full bg-background-dark">
      {/* Header */}
      <header className="flex items-center p-4 justify-between sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={onBack}
          className="text-white flex size-12 shrink-0 items-center justify-start active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h2 className="text-white text-lg font-bold flex-1 text-center font-display tracking-tight">Tribe Member</h2>
        <div className="flex w-12 items-center justify-end">
          <button 
            onClick={onOpenSettings}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex p-6 flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-125 animate-pulse"></div>
          <img 
            alt="Profile" 
            className="relative rounded-full h-32 w-32 border-4 border-primary object-cover shadow-2xl" 
            src="https://picsum.photos/seed/alex/400/400" 
          />
          <div className="absolute bottom-1 right-1 bg-primary text-background-dark size-8 flex items-center justify-center rounded-full border-4 border-background-dark shadow-lg">
            <span className="material-symbols-outlined text-sm font-black">verified</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center text-center">
          <h1 className="text-white text-3xl font-black tracking-tighter">Alex Sterling</h1>
          <div className="flex items-center gap-2 text-primary/80 mt-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <p className="text-xs font-black uppercase tracking-widest">London, United Kingdom</p>
          </div>
          <p className="text-slate-400 text-sm font-medium mt-4 px-8 max-w-sm leading-relaxed">
            Sustainable storyteller & mountain seeker. On a mission to explore 50 countries carbon-neutrally. 🏔️🌱
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-3 px-6 py-4">
        <QuickStat value="12" label="Trips" color="primary" />
        <QuickStat value="8" label="Tribes" color="blue-400" />
        <QuickStat value="2.4t" label="CO2 Off" color="emerald-400" />
      </div>

      {/* Tab Navigation */}
      <div className="flex px-6 border-b border-white/5 mt-4">
        <TabButton 
          active={activeTab === 'overview'} 
          label="Overview" 
          onClick={() => setActiveTab('overview')} 
        />
        <TabButton 
          active={activeTab === 'adventures'} 
          label="Adventures" 
          onClick={() => setActiveTab('adventures')} 
        />
        <TabButton 
          active={activeTab === 'impact'} 
          label="Impact" 
          onClick={() => setActiveTab('impact')} 
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-6 pt-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'adventures' && <AdventuresTab />}
        {activeTab === 'impact' && <ImpactTab />}
      </div>
    </div>
  );
};

/* --- Tab Sub-Components --- */

const OverviewTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-black tracking-tight">Travel DNA</h3>
        <button className="text-primary text-[10px] font-black uppercase tracking-widest">Edit</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <DNATag label="Slow Traveler" icon="potted_plant" />
        <DNATag label="Peak Bagger" icon="landscape" />
        <DNATag label="Hostel Socialite" icon="groups" />
        <DNATag label="Veggie Voyager" icon="nutrition" />
        <DNATag label="Off-Grid" icon="signal_disconnected" />
      </div>
    </section>

    <section>
      <h3 className="text-white text-lg font-black tracking-tight mb-4">Sustainability Focus</h3>
      <div className="grid grid-cols-1 gap-3">
        <FocusCard 
          icon="forest" 
          title="Reforestation" 
          desc="Supporting local tree nurseries in sub-Saharan Africa." 
          active
        />
        <FocusCard 
          icon="water_drop" 
          title="Plastic Free" 
          desc="Campaigning for plastic-free hospitality chains." 
        />
        <FocusCard 
          icon="school" 
          title="Local Education" 
          desc="Funding community-led guides in remote regions." 
          active
        />
      </div>
    </section>

    <section className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <h3 className="text-white text-sm font-black uppercase tracking-widest mb-4">Core Preferences</h3>
      <div className="space-y-4">
        <PreferenceRow label="Climate" value="Prefer Cold/Arctic" icon="ac_unit" />
        <PreferenceRow label="Transport" value="Train & Foot Only" icon="train" />
        <PreferenceRow label="Dietary" value="Strictly Plant-Based" icon="leafy_video" />
        <PreferenceRow label="Budget" value="Mid-Range Conscious" icon="payments" />
      </div>
    </section>
  </div>
);

const AdventuresTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <section>
      <h3 className="text-white text-lg font-black tracking-tight mb-4">Active Tribes</h3>
      <div className="space-y-4">
        <GroupCard title="Patagonia Trekkers" members="1,240" img="https://picsum.photos/seed/pat/800/400" />
        <GroupCard title="Eco-Warriors 2024" members="856" img="https://picsum.photos/seed/eco/800/400" />
      </div>
    </section>

    <section>
      <h3 className="text-white text-lg font-black tracking-tight mb-4">Past Adventures</h3>
      <div className="space-y-4">
        <HistoryItem 
          title="Sahara Expedition" 
          date="Sept 2023" 
          location="Morocco" 
          badge="Gold Impact"
        />
        <HistoryItem 
          title="Andes Peak Climb" 
          date="May 2023" 
          location="Peru" 
          badge="Community Hero"
        />
        <HistoryItem 
          title="Kyoto Zen Retreat" 
          date="Jan 2023" 
          location="Japan" 
          badge="Zero Plastic"
        />
      </div>
    </section>
  </div>
);

const ImpactTab = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="bg-gradient-to-br from-primary/30 to-emerald-900/40 rounded-3xl p-6 border border-primary/20 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 size-48 bg-primary/10 rounded-full blur-3xl"></div>
      <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Lifetime Legacy</p>
      <h3 className="text-white text-3xl font-black mb-6">Giving Back.</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <ImpactStat value="2.4 tons" label="CO2 Offset" />
        <ImpactStat value="45" label="Trees Planted" />
        <ImpactStat value="120 hrs" label="Volunteering" />
        <ImpactStat value="£1.2k" label="Local Support" />
      </div>
    </div>

    <section>
      <h3 className="text-white text-lg font-black tracking-tight mb-4">Supported Projects</h3>
      <div className="space-y-3">
        <ProjectRow title="Saba Bay Turtle Release" status="Active Support" />
        <ProjectRow title="Ubud Reforestation Initiative" status="Completed" />
        <ProjectRow title="Maasai Mara Education Fund" status="Recurring" />
      </div>
    </section>

    <div className="text-center py-4">
      <button className="text-primary text-xs font-black uppercase tracking-widest border-b border-primary/30 pb-1">
        Download Full Impact Report (PDF)
      </button>
    </div>
  </div>
);

/* --- Atomic UI Components --- */

const QuickStat = ({ value, label, color }: { value: string, label: string, color: string }) => (
  <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col items-center text-center">
    <span className={`text-xl font-black text-white`}>{value}</span>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
  </div>
);

const TabButton = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-4 text-sm font-black transition-all relative ${active ? 'text-primary' : 'text-slate-500'}`}
  >
    {label}
    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in zoom-in duration-300"></div>}
  </button>
);

const DNATag = ({ label, icon }: { label: string, icon: string }) => (
  <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl flex items-center gap-2">
    <span className="material-symbols-outlined text-[16px] text-primary">{icon}</span>
    <span className="text-[11px] font-black text-white uppercase tracking-tight">{label}</span>
  </div>
);

const PreferenceRow = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-slate-500 text-[18px]">{icon}</span>
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-[11px] font-black text-white">{value}</span>
  </div>
);

const FocusCard = ({ icon, title, desc, active = false }: { icon: string, title: string, desc: string, active?: boolean }) => (
  <div className={`p-4 rounded-2xl border flex gap-4 transition-all ${active ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/5'}`}>
    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-500'}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-black text-white mb-1">{title}</h4>
      <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
    </div>
    {active && (
      <div className="size-2 bg-primary rounded-full mt-2 animate-pulse"></div>
    )}
  </div>
);

const GroupCard = ({ title, members, img }: { title: string, members: string, img: string }) => (
  <div className="relative overflow-hidden rounded-2xl aspect-[21/9] group cursor-pointer shadow-lg border border-white/5">
    <img src={img} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" alt={title} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-4 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-white text-base font-black tracking-tight">{title}</h4>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{members} Tribe Members</p>
        </div>
        <span className="material-symbols-outlined text-primary text-xl">arrow_forward_ios</span>
      </div>
    </div>
  </div>
);

const HistoryItem = ({ title, date, location, badge }: { title: string, date: string, location: string, badge: string }) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{date}</span>
        <span className="size-1 bg-slate-700 rounded-full"></span>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{location}</span>
      </div>
      <h4 className="text-white font-bold">{title}</h4>
    </div>
    <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
      <span className="text-[9px] font-black text-primary uppercase tracking-tighter">{badge}</span>
    </div>
  </div>
);

const ImpactStat = ({ value, label }: { value: string, label: string }) => (
  <div>
    <p className="text-white text-xl font-black leading-none mb-1">{value}</p>
    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{label}</p>
  </div>
);

const ProjectRow = ({ title, status }: { title: string, status: string }) => (
  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
    <span className="text-xs font-bold text-slate-300">{title}</span>
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{status}</span>
  </div>
);

export default Profile;
