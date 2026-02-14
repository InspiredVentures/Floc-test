import React from 'react';

interface StatCardProps {
    label: string;
    value: number;
    subtext?: string;
    icon?: string;
    color?: string; // e.g. 'text-green-500'
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, icon = 'ecg_heart', color = 'text-green-500' }) => {
    // Logic for gauge
    const strokeDasharray = 251.2;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * value) / 100;

    return (
        <div className="bg-white p-5 rounded-3xl border border-primary/5 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">{label}</span>
                <span className={`material-symbols-outlined ${color} text-lg`}>{icon}</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
                {/* Visual Gauge Ring */}
                <svg className="size-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-primary/5" />
                    <circle
                        cx="48" cy="48" r="40"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className={`${color} transition-all duration-1000 ease-out`}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-heading font-black text-primary">{value}</span>
                    <span className="text-[8px] uppercase font-bold text-primary/40">Score</span>
                </div>
            </div>
            {subtext && <p className="text-[9px] text-center text-primary/40 mt-2 font-medium">{subtext}</p>}
        </div>
    );
};
