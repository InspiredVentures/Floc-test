
import React, { useState } from 'react';

interface Props {
  onLogin: () => void;
}

const FlocLogo = ({ className = "size-8" }: { className?: string }) => (
  <div className={`flex items-baseline font-black leading-none text-primary ${className}`}>
    <span className="text-[1.1em] tracking-tighter italic">F</span>
    <div className="size-[0.25em] bg-primary rounded-full ml-[0.05em] mb-[0.1em]"></div>
  </div>
);

const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'google' | 'protocol' | null>(null);

  const performLogin = (method: 'email' | 'google' | 'protocol') => {
    setLoginMethod(method);
    setIsLoggingIn(true);
    // Simulated auth delay for protocol verification
    setTimeout(() => {
      onLogin();
    }, 1800);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin('email');
  };

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden bg-background-dark">
      {/* Background with cinematic overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center animate-pulse duration-[10s]" 
          style={{ backgroundImage: `url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80")` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/90 via-background-dark/20 to-background-dark"></div>
      </div>

      {isLoggingIn && (
        <div className="absolute inset-0 z-[100] bg-background-dark/80 backdrop-blur-xl flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
          <div className="relative">
             <div className="size-24 rounded-[2rem] bg-primary/20 border border-primary/40 flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-primary text-5xl animate-spin">sync</span>
             </div>
             <div className="absolute -bottom-2 -right-2 size-8 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                <span className="material-symbols-outlined text-background-dark text-xl font-black">security</span>
             </div>
          </div>
          <div className="text-center">
            <h3 className="text-white font-black text-xl italic tracking-tighter mb-1 uppercase">Verifying Protocol</h3>
            <p className="text-primary text-[8px] font-black uppercase tracking-[0.3em]">Inspired Ventures Secure Node</p>
          </div>
        </div>
      )}

      <main className="relative z-10 flex-1 flex flex-col px-8 pt-24 pb-12">
        <div className="flex flex-col items-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <FlocLogo className="text-8xl drop-shadow-[0_0_30px_rgba(255,107,53,0.4)]" />
          <div className="flex flex-col items-center mt-4">
            <h1 className="text-white font-black text-4xl tracking-tighter leading-none italic uppercase">Floc</h1>
            <p className="text-primary text-[10px] uppercase tracking-[0.4em] font-black mt-2">Inspired Ventures</p>
          </div>
        </div>

        <div className="mt-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="space-y-2">
            <h2 className="text-white text-3xl font-black tracking-tighter leading-none italic">
              Collective travel <br/>for <span className="text-primary not-italic">conscious spirits.</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium">Join the protocol. Find your tribe.</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="relative group">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your explorer email..." 
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                required
                disabled={isLoggingIn}
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-16 bg-white text-background-dark font-black rounded-2xl shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              {isLoggingIn && loginMethod === 'email' ? (
                <div className="size-6 border-4 border-background-dark border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Magic Link Login</span>
                  <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">bolt</span>
                </>
              )}
            </button>
          </form>

          <div className="flex flex-col gap-3">
             <button 
               onClick={() => performLogin('google')}
               disabled={isLoggingIn}
               className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
             >
                <img src="https://www.google.com/favicon.ico" className="size-4 grayscale brightness-200" alt="" />
                {isLoggingIn && loginMethod === 'google' ? 'Authenticating...' : 'Continue with Google'}
             </button>
             <button 
               onClick={() => performLogin('protocol')}
               disabled={isLoggingIn}
               className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50 ring-1 ring-primary/20"
             >
                <span className="material-symbols-outlined text-primary">security</span>
                {isLoggingIn && loginMethod === 'protocol' ? 'Connecting Node...' : 'Inspired Protocol (SSO)'}
             </button>
          </div>
        </div>

        <footer className="mt-12 text-center opacity-30">
           <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.2em]">
             By entering, you agree to the Inspired Protocol
           </p>
        </footer>
      </main>
    </div>
  );
};

export default Login;
