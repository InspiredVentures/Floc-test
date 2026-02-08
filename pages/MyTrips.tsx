
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
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-4 pt-8 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">account_circle</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">My Trips</h1>
              <p className="text-xs text-slate-400">Welcome back, Explorer</p>
            </div>
          </div>
          <button 
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 relative"
          >
            <span className="material-symbols-outlined text-white">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-slate-800"></span>
          </button>
        </div>
        <div className="mt-6 flex bg-slate-800 p-1 rounded-xl">
          <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-background-dark shadow-sm text-primary">Upcoming</button>
          <button className="flex-1 py-2 text-sm font-semibold text-slate-400">Past</button>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-12">
        {MOCK_TRIPS.map(trip => (
          <div key={trip.id} className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
            <div 
              className="relative h-48 w-full bg-cover bg-center cursor-pointer" 
              style={{ backgroundImage: `url(${trip.image})` }}
              onClick={() => onOpenDetails(trip)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute top-4 right-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                  trip.status === 'CONFIRMED' ? 'bg-primary text-background-dark' : 'bg-orange-500 text-white'
                }`}>
                  {trip.status === 'CONFIRMED' ? 'Booking Confirmed' : 'Planning in Progress'}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">Venture</p>
                <h3 className="text-white text-xl font-bold">{trip.title}</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span className="text-sm font-medium">{trip.dates}</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-300"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-400"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-primary/30 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-primary">+{trip.membersCount - 2}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => onOpenDetails(trip)}
                  className="flex-1 bg-primary text-background-dark font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-lg">map</span>
                  Itinerary
                </button>
                <button 
                  onClick={() => onOpenChat(trip)}
                  className="flex-1 bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-lg">forum</span>
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
