import React, { useState } from 'react';

interface HowItWorksProps {
    communityName?: string;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ communityName }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-white border border-primary/10 rounded-3xl p-6 relative overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors"
            >
                <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="size-16 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-primary font-black text-lg mb-1">Welcome to the {communityName || 'Community'} Community</h3>
                    <p className="text-slate-500 text-sm max-w-xl">
                        This is your space to connect, share faster, and travel together.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                    { icon: 'forum', title: '1. Join the Community', desc: 'Connect with like-minded travelers in our exclusive chat.' },
                    { icon: 'flight_takeoff', title: '2. Travel Together', desc: 'Book your spot on confirmed trips and explore the world.' }
                ].map((step, i) => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-primary/5 flex items-center gap-3">
                        <div className="size-8 bg-white border border-primary/10 rounded-full flex items-center justify-center text-primary font-bold shadow-sm shrink-0">
                            {i + 1}
                        </div>
                        <div>
                            <h4 className="text-primary text-xs font-black uppercase tracking-wider">{step.title}</h4>
                            <p className="text-slate-500 text-[10px] leading-tight mt-0.5">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
