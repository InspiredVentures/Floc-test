
import React from 'react';

interface Props {
  onBack: () => void;
}

const BillingCenter: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="px-6 pt-10 pb-6 bg-background-dark/95 backdrop-blur-md border-b border-white/5 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={onBack} className="text-white size-10 flex items-center justify-center hover:bg-white/5 rounded-2xl border border-white/5 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-black text-white italic leading-none">Billing Center</h1>
          <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-black mt-1">Financial Operations</p>
        </div>
      </header>

      <main className="p-6 space-y-6 pb-12">
        <div className="bg-gradient-to-br from-slate-900 to-black rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6">
              <span className="material-symbols-outlined text-white/10 text-6xl">payments</span>
           </div>
           <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Tribe Funds Balance</p>
              <h2 className="text-white text-4xl font-black tracking-tight mb-6 italic">$14,250<span className="text-primary">.80</span></h2>
              <div className="flex gap-4">
                 <button className="flex-1 bg-primary text-background-dark py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/20">Withdraw</button>
                 <button className="flex-1 bg-white/10 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all border border-white/10">Venture Payouts</button>
              </div>
           </div>
        </div>

        <section className="space-y-4">
           <h3 className="text-white text-sm font-black uppercase tracking-widest px-1">Recent Transactions</h3>
           <TransactionItem 
             title="Bali Mangrove Venture" 
             date="March 12, 2024" 
             amount="+ $8,400.00" 
             status="Settled" 
           />
           <TransactionItem 
             title="Platform Fee (Leader Pack)" 
             date="March 01, 2024" 
             amount="- $49.00" 
             status="Paid" 
           />
           <TransactionItem 
             title="Refund: Alex Sterling" 
             date="Feb 28, 2024" 
             amount="- $240.00" 
             status="Processed" 
           />
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
           <h3 className="text-white font-black text-sm mb-4 uppercase tracking-tight">Active Plan</h3>
           <div className="flex justify-between items-start">
              <div>
                 <h4 className="text-primary font-black text-lg">Tribe Pioneer</h4>
                 <p className="text-slate-500 text-xs mt-1">Unlimited Ventures • Premium AI Cover • Direct Payouts</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-2 py-1 rounded-full uppercase">Active</span>
           </div>
        </section>
      </main>
    </div>
  );
};

const TransactionItem = ({ title, date, amount, status }: { title: string, date: string, amount: string, status: string }) => (
  <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
    <div className="flex-1">
       <h4 className="text-white font-black text-xs uppercase tracking-tight mb-1">{title}</h4>
       <p className="text-slate-600 text-[9px] font-bold">{date} • {status}</p>
    </div>
    <span className={`text-sm font-black ${amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>{amount}</span>
  </div>
);

export default BillingCenter;
