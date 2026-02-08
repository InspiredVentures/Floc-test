
import React from 'react';
import { AppNotification } from '../types';

interface Props {
  onBack: () => void;
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'TRIP',
    title: 'Flight Confirmed!',
    message: 'Your flight to Nairobi for Safari in Kenya is confirmed. View details in your itinerary.',
    timestamp: '2h ago',
    isRead: false
  },
  {
    id: '2',
    type: 'CHAT',
    title: 'New message from Sarah J.',
    message: '“Hey everyone! Just applied for my visa!”',
    timestamp: '4h ago',
    isRead: false
  },
  {
    id: '3',
    type: 'SUGGESTION',
    title: 'New Activity Suggestion',
    message: 'Mike Ross suggested "Sunrise Yoga at Mt. Kenya" for your upcoming trip.',
    timestamp: '1d ago',
    isRead: true
  },
  {
    id: '4',
    type: 'TRIP',
    title: 'Impact Milestone reached!',
    message: 'Your Tribe has successfully offset 5 tons of CO2 this month.',
    timestamp: '2d ago',
    isRead: true
  }
];

const Notifications: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="flex flex-col min-h-full bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-4 pt-8 pb-4 border-b border-slate-800 flex items-center gap-4">
        <button onClick={onBack} className="text-white p-2 hover:bg-white/5 rounded-full">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Notifications</h1>
      </header>

      <main className="p-4 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Recent Activity</span>
          <button className="text-[10px] font-bold text-primary uppercase tracking-widest">Mark all as read</button>
        </div>

        {MOCK_NOTIFICATIONS.map(notification => (
          <div 
            key={notification.id}
            className={`p-4 rounded-2xl border transition-all ${
              notification.isRead 
                ? 'bg-white/5 border-white/5 opacity-70' 
                : 'bg-primary/5 border-primary/20'
            }`}
          >
            <div className="flex gap-4">
              <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                notification.type === 'TRIP' ? 'bg-blue-500/20 text-blue-400' :
                notification.type === 'CHAT' ? 'bg-primary/20 text-primary' :
                'bg-orange-500/20 text-orange-400'
              }`}>
                <span className="material-symbols-outlined text-[20px]">
                  {notification.type === 'TRIP' ? 'flight_takeoff' :
                   notification.type === 'CHAT' ? 'forum' :
                   'lightbulb'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-white truncate">{notification.title}</h3>
                  <span className="text-[9px] text-slate-500 font-bold uppercase whitespace-nowrap">{notification.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{notification.message}</p>
                {!notification.isRead && (
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1.5 bg-primary text-background-dark text-[10px] font-black uppercase rounded-lg">View</button>
                    <button className="px-3 py-1.5 bg-white/10 text-white text-[10px] font-black uppercase rounded-lg">Dismiss</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Notifications;
