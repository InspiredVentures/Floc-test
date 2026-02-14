
import React from 'react';
import { MOCK_TRIPS } from '../constants';
import { Trip } from '../types';

interface Props {
  onOpenChat: (trip: Trip) => void;
  onOpenDetails: (trip: Trip) => void;
  onOpenNotifications: () => void;
}

const MyTrips: React.FC<Props> = ({ onOpenChat, onOpenDetails, onOpenNotifications }) => {
  return (
    <div className="flex flex-col min-h-full bg-[#FCFBF5] text-[#14532D]">
      <header className="sticky top-0 z-50 bg-[#FCFBF5]/80 backdrop-blur-md px-4 pt-8 pb-4 border-b border-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </div>
            <div>
              <h1 className="text-xl font-heading font-black text-primary tracking-tight uppercase italic">My Trips</h1>
              <p className="text-xs text-primary/60 font-bold tracking-wider">Welcome back, Explorer</p>
            </div>
          </div>
          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-primary/10 relative shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-primary">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-accent rounded-full animate-pulse"></span>
          </button>
        </div>
        <div className="mt-6 flex bg-primary/5 p-1 rounded-xl">
          <button className="flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg bg-white shadow-sm text-primary">Upcoming</button>
          <button className="flex-1 py-2 text-xs font-black uppercase tracking-widest text-primary/40 hover:text-primary">Past</button>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {MOCK_TRIPS.map(trip => (
          <div key={trip.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-primary/10 group hover:border-accent/30 transition-all">
            <div
              className="relative h-48 w-full bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: `url(${trip.image})` }}
              onClick={() => onOpenDetails(trip)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-4 right-4">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md ${trip.status === 'CONFIRMED' ? 'bg-primary/90 text-white' : 'bg-accent/90 text-white'
                  }`}>
                  {trip.status === 'CONFIRMED' ? 'Confirmed' : 'Planning'}
                </span>
              </div>
              <div className="absolute bottom-4 left-6 right-6">
                <p className="text-white/80 text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  {trip.destination}
                </p>
                <h3 className="text-white text-2xl font-heading font-black uppercase italic tracking-tighter leading-none">{trip.title}</h3>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2 text-primary/70">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{trip.dates}</span>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="size-6 rounded-full border-2 border-white bg-gray-200">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-full h-full rounded-full" alt="" />
                    </div>
                  ))}
                  <div className="size-6 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[8px] font-black">
                    +{trip.membersCount - 3}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onOpenDetails(trip)}
                  className="flex-1 bg-primary text-white font-black uppercase tracking-widest py-3 rounded-xl text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-primary/20 hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-base">map</span>
                  Details
                </button>
                <button
                  onClick={() => onOpenChat(trip)}
                  className="flex-1 bg-white text-primary border border-primary/10 font-black uppercase tracking-widest py-3 rounded-xl text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-primary/5"
                >
                  <span className="material-symbols-outlined text-base">forum</span>
                  Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default MyTrips;
