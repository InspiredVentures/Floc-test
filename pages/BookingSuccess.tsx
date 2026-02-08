
import React, { useEffect } from 'react';

interface Props {
  onDone: () => void;
}

const BookingSuccess: React.FC<Props> = ({ onDone }) => {
  useEffect(() => {
    // Optional: Play a sound or trigger haptics here
  }, []);

  return (
    <div className="flex flex-col h-full bg-background-dark p-6 text-center justify-center items-center relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] -z-10">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full bg-primary/20 animate-sparkle-${(i % 4) + 1}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 4}px`,
              height: `${Math.random() * 10 + 4}px`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative mb-8">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(19,236,91,0.5)] animate-bounce">
          <span className="material-symbols-outlined text-background-dark text-5xl font-black">check_circle</span>
        </div>
        <div className="absolute -top-4 -right-4 bg-white text-background-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border-2 border-primary">
          Confirmed
        </div>
      </div>

      <h1 className="text-white text-4xl font-extrabold tracking-tight leading-tight mb-4">
        You're <span className="text-primary italic">In!</span>
      </h1>
      <p className="text-slate-400 text-lg leading-relaxed max-w-[300px] mb-12">
        Welcome to the Tribe. Your venture has been secured and your impact tracking has started.
      </p>

      <div className="w-full space-y-4 max-w-sm">
        <button 
          onClick={onDone}
          className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl text-lg shadow-2xl shadow-primary/30 active:scale-95 transition-all"
        >
          View My Trips
        </button>
        <button 
          onClick={onDone}
          className="w-full bg-white/5 border border-white/10 text-white font-bold py-5 rounded-2xl text-lg hover:bg-white/10 transition-all"
        >
          Back to Discover
        </button>
      </div>

      <div className="mt-16 flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-xl">eco</span>
        </div>
        <div className="text-left">
          <p className="text-white font-bold text-sm">Carbon Offset Started</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Inspired Ventures</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
