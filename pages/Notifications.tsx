
import React, { useState, useMemo } from 'react';
import { AppNotification } from '../types';

interface Props {
  onBack: () => void;
  onNavigateToTrip?: (id: string) => void;
  onNavigateToChat?: (id: string) => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'TRIP',
    title: 'Flight Confirmed!',
    message: 'Your flight to Nairobi for Safari in Kenya is confirmed. View details in your itinerary.',
    timestamp: '10:42 AM',
    isRead: false,
    relatedId: '1'
  },
  {
    id: '2',
    type: 'CHAT',
    title: 'Sarah Jenkins',
    message: '“Hey everyone! Just applied for my visa!”',
    timestamp: '09:15 AM',
    isRead: false,
    relatedId: '1'
  },
  {
    id: '3',
    type: 'SUGGESTION',
    title: 'New Activity Lab',
    message: 'Mike Ross suggested "Sunrise Yoga at Mt. Kenya" for your upcoming trip.',
    timestamp: 'Yesterday',
    isRead: true,
    relatedId: '1'
  },
  {
    id: '4',
    type: 'TRIP',
    title: 'Impact Milestone!',
    message: 'Your Tribe has successfully offset 5 tons of CO2 this month. Legend status approaching!',
    timestamp: 'Yesterday',
    isRead: true
  },
  {
    id: '5',
    type: 'SUGGESTION',
    title: 'Tribe Discovery',
    message: 'Based on your interest in "Eco-Travel", you might like the Amazonian Guardians tribe.',
    timestamp: '2 days ago',
    isRead: true
  }
];

type FilterType = 'ALL' | 'TRIP' | 'CHAT' | 'SUGGESTION';

const Notifications: React.FC<Props> = ({ onBack, onNavigateToTrip, onNavigateToChat }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'ALL') return notifications;
    return notifications.filter(n => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: !n.isRead } : n
    ));
  };

  const handleAction = (notification: AppNotification) => {
    if (notification.type === 'TRIP' && notification.relatedId) {
      onNavigateToTrip?.(notification.relatedId);
    } else if (notification.type === 'CHAT' && notification.relatedId) {
      onNavigateToChat?.(notification.relatedId);
    }
    // Mark as read when acting
    toggleRead(notification.id);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex flex-col min-h-full bg-background-dark pb-20">
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-xl px-6 pt-10 pb-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white size-10 flex items-center justify-center hover:bg-white/5 rounded-2xl transition-all active:scale-90 border border-white/5">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter italic leading-none">Inbox</h1>
            <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-black mt-1">
              {unreadCount > 0 ? `${unreadCount} New Updates` : 'All caught up'}
            </p>
          </div>
        </div>
        
        {notifications.length > 0 && (
          <button 
            onClick={markAllRead}
            className="size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-primary transition-all active:scale-90"
            title="Mark all as read"
          >
            <span className="material-symbols-outlined text-[20px]">done_all</span>
          </button>
        )}
      </header>

      <main className="p-6">
        {/* Filter Chips */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8">
          {(['ALL', 'TRIP', 'CHAT', 'SUGGESTION'] as FilterType[]).map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeFilter === type 
                  ? 'bg-primary border-primary text-background-dark shadow-lg shadow-primary/20' 
                  : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
              }`}
            >
              {type === 'SUGGESTION' ? 'Lab' : type}
            </button>
          ))}
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id}
                className={`relative group p-5 rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                  notification.isRead 
                    ? 'bg-white/[0.02] border-white/5' 
                    : 'bg-white/[0.05] border-primary/20 shadow-xl shadow-primary/5'
                }`}
              >
                {!notification.isRead && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_10px_rgba(255,107,53,0.5)]"></div>
                )}
                
                <div className="flex gap-4">
                  <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    notification.type === 'TRIP' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    notification.type === 'CHAT' ? 'bg-primary/10 text-primary border border-primary/20' :
                    'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">
                      {notification.type === 'TRIP' ? 'flight_takeoff' :
                       notification.type === 'CHAT' ? 'forum' :
                       'auto_awesome'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className={`text-sm font-black tracking-tight truncate ${notification.isRead ? 'text-slate-400' : 'text-white'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-tighter whitespace-nowrap ml-2">
                        {notification.timestamp}
                      </span>
                    </div>
                    
                    <p className={`text-xs leading-relaxed line-clamp-2 ${notification.isRead ? 'text-slate-600 font-medium' : 'text-slate-400 font-semibold'}`}>
                      {notification.message}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <button 
                        onClick={() => handleAction(notification)}
                        className="px-5 py-2 bg-white text-background-dark text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all"
                      >
                        {notification.type === 'CHAT' ? 'Open Chat' : 'View Details'}
                      </button>
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="size-8 flex items-center justify-center rounded-xl bg-white/5 text-slate-700 hover:text-red-400 transition-all border border-white/5"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-8 text-center">
               <button 
                 onClick={clearAll}
                 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] hover:text-white transition-colors"
               >
                 Clear all notifications
               </button>
            </div>
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
             <div className="relative size-32 mb-8">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-150 animate-pulse"></div>
                <div className="relative size-full bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center rotate-3 shadow-2xl">
                   <span className="material-symbols-outlined text-slate-700 text-5xl">notifications_off</span>
                </div>
                <div className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background-dark shadow-lg -rotate-12">
                   <span className="material-symbols-outlined text-background-dark text-xl font-black">check</span>
                </div>
             </div>
             <h3 className="text-white text-2xl font-black italic tracking-tighter mb-2">Zero Distractions</h3>
             <p className="text-slate-500 text-sm font-medium max-w-[240px] leading-relaxed">
                You're completely caught up. New venture updates and tribe messages will appear here.
             </p>
             <button 
               onClick={onBack}
               className="mt-10 px-8 py-4 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all active:scale-95"
             >
               Go back to Discover
             </button>
          </div>
        )}
      </main>

      {/* Inspired Footer Signature */}
      <footer className="mt-auto p-10 text-center">
         <div className="flex items-center justify-center gap-2 opacity-20">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Inspired Ventures Secure Protocol</span>
         </div>
      </footer>
    </div>
  );
};

export default Notifications;
