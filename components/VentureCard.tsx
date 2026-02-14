
import React from 'react';
import { Trip } from '../types';

interface VentureCardProps {
    trip: Trip;
    onClick: () => void;
}

const VentureCard: React.FC<VentureCardProps> = ({ trip, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-accent/30 group cursor-pointer"
        >
            <div className="aspect-[16/9] bg-cover bg-center relative" style={{ backgroundImage: `url(${trip.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4">
                    <div className="bg-accent text-white text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow-lg">
                        {trip.status}
                    </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-accent text-sm">location_on</span>
                        <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">{trip.destination}</span>
                    </div>
                    <h3 className="text-white text-xl font-black italic tracking-tighter leading-none group-hover:text-accent transition-colors">{trip.title}</h3>
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-1">Dates</span>
                        <span className="text-white text-[10px] font-bold">{trip.dates}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-1">Price</span>
                        <span className="text-accent text-[10px] font-black">{trip.price}</span>
                    </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-slate-500 text-xs">group</span>
                        <span className="text-slate-400 text-[10px] font-bold">{trip.membersCount} Travelers</span>
                    </div>
                    <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest">ID: {trip.id}</span>
                </div>
            </div>
        </div>
    );
};

export default VentureCard;
