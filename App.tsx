
import React, { useState } from 'react';
import { AppView, Trip } from './types';
import Discovery from './pages/Discovery';
import TripDetails from './pages/TripDetails';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import Impact from './pages/Impact';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import ChatRoom from './pages/ChatRoom';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import BookingSuccess from './pages/BookingSuccess';
import { MOCK_TRIPS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(MOCK_TRIPS[0]);

  const navigateToChat = (trip: Trip) => {
    setActiveTrip(trip);
    setCurrentView(AppView.CHAT);
  };

  const navigateToDetails = (trip: Trip) => {
    setActiveTrip(trip);
    setCurrentView(AppView.TRIP_DETAILS);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.ONBOARDING:
        return <Onboarding onComplete={() => setCurrentView(AppView.DISCOVERY)} />;
      case AppView.DISCOVERY:
        return (
          <Discovery 
            onSelectTrip={navigateToDetails} 
            onOpenNotifications={() => setCurrentView(AppView.NOTIFICATIONS)}
          />
        );
      case AppView.TRIP_DETAILS:
        return activeTrip ? (
          <TripDetails 
            trip={activeTrip}
            onBack={() => setCurrentView(AppView.DISCOVERY)} 
            onBook={() => setCurrentView(AppView.BOOKING_SUCCESS)}
          />
        ) : null;
      case AppView.DASHBOARD:
        return <Dashboard onOpenNotifications={() => setCurrentView(AppView.NOTIFICATIONS)} />;
      case AppView.MY_TRIPS:
        return (
          <MyTrips 
            onOpenChat={navigateToChat} 
            onOpenDetails={navigateToDetails}
            onOpenNotifications={() => setCurrentView(AppView.NOTIFICATIONS)}
          />
        );
      case AppView.IMPACT:
        return <Impact />;
      case AppView.PROFILE:
        return (
          <Profile 
            onOpenSettings={() => setCurrentView(AppView.SETTINGS)} 
            onBack={() => setCurrentView(AppView.DISCOVERY)}
          />
        );
      case AppView.CHAT:
        return activeTrip ? <ChatRoom trip={activeTrip} onBack={() => setCurrentView(AppView.MY_TRIPS)} /> : null;
      case AppView.NOTIFICATIONS:
        return <Notifications onBack={() => setCurrentView(AppView.DISCOVERY)} />;
      case AppView.SETTINGS:
        return <Settings onBack={() => setCurrentView(AppView.PROFILE)} />;
      case AppView.BOOKING_SUCCESS:
        return <BookingSuccess onDone={() => setCurrentView(AppView.MY_TRIPS)} />;
      default:
        return <Discovery onSelectTrip={navigateToDetails} onOpenNotifications={() => setCurrentView(AppView.NOTIFICATIONS)} />;
    }
  };

  const hideNavViews = [
    AppView.ONBOARDING, 
    AppView.CHAT, 
    AppView.NOTIFICATIONS, 
    AppView.SETTINGS, 
    AppView.TRIP_DETAILS,
    AppView.BOOKING_SUCCESS
  ];
  const showNav = !hideNavViews.includes(currentView);

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl relative border-x border-white/5">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {renderView()}
      </div>

      {showNav && (
        <nav className="sticky bottom-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-6 pt-3 pb-8 flex justify-between items-center">
          <button 
            onClick={() => setCurrentView(AppView.DISCOVERY)}
            className={`flex flex-col items-center gap-1 ${currentView === AppView.DISCOVERY ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${currentView === AppView.DISCOVERY ? 'fill-1' : ''}`}>explore</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Discover</span>
          </button>
          
          <button 
            onClick={() => setCurrentView(AppView.MY_TRIPS)}
            className={`flex flex-col items-center gap-1 ${currentView === AppView.MY_TRIPS ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${currentView === AppView.MY_TRIPS ? 'fill-1' : ''}`}>travel_explore</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">My Trips</span>
          </button>

          <div className="relative -top-6">
            <button 
              onClick={() => setCurrentView(AppView.DASHBOARD)}
              className="w-14 h-14 bg-primary text-background-dark rounded-full shadow-lg shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-3xl font-bold">add</span>
            </button>
          </div>

          <button 
            onClick={() => setCurrentView(AppView.IMPACT)}
            className={`flex flex-col items-center gap-1 ${currentView === AppView.IMPACT ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${currentView === AppView.IMPACT ? 'fill-1' : ''}`}>monitoring</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Impact</span>
          </button>

          <button 
            onClick={() => setCurrentView(AppView.PROFILE)}
            className={`flex flex-col items-center gap-1 ${currentView === AppView.PROFILE ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${currentView === AppView.PROFILE ? 'fill-1' : ''}`}>person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
