
import React, { useState } from 'react';
import { AppView, Trip, Community } from './types';
import Discovery from './pages/Discovery';
import AllCommunities from './pages/AllCommunities';
import TripDetails from './pages/TripDetails';
import CommunityDetails from './pages/CommunityDetails';
import JoinRequest from './pages/JoinRequest';
import Dashboard from './pages/Dashboard';
import CreateVenture from './pages/CreateVenture';
import CreateCommunity from './pages/CreateCommunity';
import ManageMembers from './pages/ManageMembers';
import MyCommunities from './pages/MyTribes';
import GlobalFeed from './pages/GlobalFeed';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import ChatRoom from './pages/ChatRoom';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import BookingSuccess from './pages/BookingSuccess';
import LeaderSupport from './pages/LeaderSupport';
import ImpactGuide from './pages/resources/ImpactGuide';
import ProtocolViewer from './pages/resources/ProtocolViewer';
import BillingCenter from './pages/resources/BillingCenter';
import AnalyticsAPI from './pages/resources/AnalyticsAPI';
import { MOCK_TRIPS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(MOCK_TRIPS[0]);
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);

  const navigateToChat = (trip: Trip) => {
    setActiveTrip(trip);
    setCurrentView(AppView.CHAT);
  };

  const navigateToDetails = (trip: Trip) => {
    setActiveTrip(trip);
    setCurrentView(AppView.TRIP_DETAILS);
  };

  const navigateToCommunity = (community: Community) => {
    setActiveCommunity(community);
    setCurrentView(AppView.COMMUNITY_DETAILS);
  };

  const handleJoinTribe = (community: Community) => {
    if (community.accessType === 'request') {
      setCurrentView(AppView.JOIN_REQUEST);
    } else {
      setActiveCommunity(community);
      setCurrentView(AppView.COMMUNITY_DETAILS);
    }
  };

  const handleAction = (view: AppView) => {
    setIsPowerMenuOpen(false);
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.ONBOARDING:
        return <Onboarding onComplete={() => setCurrentView(AppView.DISCOVERY)} />;
      case AppView.DISCOVERY:
        return (
          <Discovery 
            onSelectTrip={navigateToDetails} 
            onSelectCommunity={navigateToCommunity}
            onOpenNotifications={() => setCurrentView(AppView.NOTIFICATIONS)}
            onSeeAll={() => setCurrentView(AppView.ALL_COMMUNITIES)}
            onCreateCommunity={() => setCurrentView(AppView.CREATE_COMMUNITY)}
          />
        );
      case AppView.ALL_COMMUNITIES:
        return <AllCommunities onBack={() => setCurrentView(AppView.DISCOVERY)} onSelectTrip={navigateToDetails} onSelectCommunity={navigateToCommunity} />;
      case AppView.TRIP_DETAILS:
        return activeTrip ? (
          <TripDetails 
            trip={activeTrip}
            onBack={() => setCurrentView(AppView.MY_COMMUNITIES)} 
            onBook={() => setCurrentView(AppView.BOOKING_SUCCESS)}
            onOpenChat={() => navigateToChat(activeTrip)}
          />
        ) : null;
      case AppView.COMMUNITY_DETAILS:
        return activeCommunity ? (
          <CommunityDetails 
            community={activeCommunity}
            onBack={() => setCurrentView(AppView.DISCOVERY)}
            onSelectTrip={navigateToDetails}
            onJoin={handleJoinTribe}
            onOpenChat={() => {
              if (activeCommunity.upcomingTrips.length > 0) {
                navigateToChat(activeCommunity.upcomingTrips[0]);
              } else {
                setCurrentView(AppView.MY_COMMUNITIES);
              }
            }}
          />
        ) : null;
      case AppView.JOIN_REQUEST:
        return activeCommunity ? (
          <JoinRequest 
            community={activeCommunity}
            onBack={() => setCurrentView(AppView.COMMUNITY_DETAILS)}
            onSent={() => setCurrentView(AppView.DISCOVERY)}
          />
        ) : null;
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            onOpenNotifications={() => setCurrentView(AppView.NOTIFICATIONS)} 
            onCreate={() => setCurrentView(AppView.CREATE_VENTURE)}
            onManage={() => setCurrentView(AppView.MANAGE_MEMBERS)}
            onContactSupport={() => setCurrentView(AppView.LEADER_SUPPORT)}
          />
        );
      case AppView.CREATE_VENTURE:
        return <CreateVenture onBack={() => setCurrentView(AppView.DASHBOARD)} onComplete={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.CREATE_COMMUNITY:
        return <CreateCommunity onBack={() => setCurrentView(AppView.DISCOVERY)} onComplete={() => setCurrentView(AppView.DISCOVERY)} />;
      case AppView.MANAGE_MEMBERS:
        return <ManageMembers onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.MY_COMMUNITIES:
        return (
          <MyCommunities 
            onSelectCommunity={navigateToCommunity}
            onOpenNotifications={() => setCurrentView(AppView.NOTIFICATIONS)}
            onManage={() => setCurrentView(AppView.DASHBOARD)}
            onLaunch={() => setCurrentView(AppView.CREATE_COMMUNITY)}
          />
        );
      case AppView.GLOBAL_FEED:
        return (
          <GlobalFeed 
            onSelectCommunity={navigateToCommunity}
            onOpenNotifications={() => setCurrentView(AppView.NOTIFICATIONS)}
          />
        );
      case AppView.PROFILE:
        return (
          <Profile 
            onOpenSettings={() => setCurrentView(AppView.SETTINGS)} 
            onBack={() => setCurrentView(AppView.DISCOVERY)}
          />
        );
      case AppView.CHAT:
        return activeTrip ? <ChatRoom trip={activeTrip} onBack={() => setCurrentView(AppView.MY_COMMUNITIES)} /> : null;
      case AppView.NOTIFICATIONS:
        return <Notifications onBack={() => setCurrentView(AppView.DISCOVERY)} />;
      case AppView.SETTINGS:
        return <Settings onBack={() => setCurrentView(AppView.PROFILE)} />;
      case AppView.BOOKING_SUCCESS:
        return <BookingSuccess onDone={() => setCurrentView(AppView.MY_COMMUNITIES)} />;
      case AppView.LEADER_SUPPORT:
        return <LeaderSupport onBack={() => setCurrentView(AppView.DASHBOARD)} onOpenResource={(view) => setCurrentView(view)} />;
      case AppView.IMPACT_GUIDE:
        return <ImpactGuide onBack={() => setCurrentView(AppView.LEADER_SUPPORT)} />;
      case AppView.PROTOCOL_VIEWER:
        return <ProtocolViewer onBack={() => setCurrentView(AppView.LEADER_SUPPORT)} />;
      case AppView.BILLING_CENTER:
        return <BillingCenter onBack={() => setCurrentView(AppView.LEADER_SUPPORT)} />;
      case AppView.ANALYTICS_API:
        return <AnalyticsAPI onBack={() => setCurrentView(AppView.LEADER_SUPPORT)} />;
      default:
        return <Discovery onSelectTrip={navigateToDetails} onSelectCommunity={navigateToCommunity} onOpenNotifications={() => setCurrentView(AppView.NOTIFICATIONS)} onSeeAll={() => setCurrentView(AppView.ALL_COMMUNITIES)} />;
    }
  };

  const hideNavViews = [
    AppView.ONBOARDING, 
    AppView.CHAT, 
    AppView.NOTIFICATIONS, 
    AppView.SETTINGS, 
    AppView.TRIP_DETAILS,
    AppView.COMMUNITY_DETAILS,
    AppView.JOIN_REQUEST,
    AppView.BOOKING_SUCCESS,
    AppView.CREATE_VENTURE,
    AppView.CREATE_COMMUNITY,
    AppView.MANAGE_MEMBERS,
    AppView.LEADER_SUPPORT,
    AppView.IMPACT_GUIDE,
    AppView.PROTOCOL_VIEWER,
    AppView.BILLING_CENTER,
    AppView.ANALYTICS_API
  ];
  const showNav = !hideNavViews.includes(currentView);

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl relative border-x border-white/5">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {renderView()}
      </div>

      {isPowerMenuOpen && (
        <div 
          className="absolute inset-0 z-[60] bg-background-dark/90 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setIsPowerMenuOpen(false)}
        >
          <div className="absolute bottom-32 left-0 right-0 px-8 space-y-4 animate-in slide-in-from-bottom-8 duration-500">
            <h3 className="text-white text-3xl font-black italic tracking-tighter mb-8">What are we <br/><span className="text-primary not-italic tracking-normal">launching?</span></h3>
            
            <PowerMenuItem 
              icon="rocket_launch" 
              title="Start Venture" 
              desc="Create a new trip for your community." 
              onClick={() => handleAction(AppView.CREATE_VENTURE)}
              delay="delay-75"
            />
            <PowerMenuItem 
              icon="groups" 
              title="Launch Community" 
              desc="Build a collective of explorers." 
              onClick={() => handleAction(AppView.CREATE_COMMUNITY)}
              delay="delay-150"
            />
            <PowerMenuItem 
              icon="dynamic_feed" 
              title="Post Pulse" 
              desc="Share an update with your followers." 
              onClick={() => handleAction(AppView.GLOBAL_FEED)}
              delay="delay-200"
            />
          </div>
        </div>
      )}

      {showNav && (
        <nav className="sticky bottom-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-6 pt-3 pb-8 flex justify-between items-center">
          {/* PRIORITY 1: GROUPS */}
          <button 
            onClick={() => { setCurrentView(AppView.MY_COMMUNITIES); setIsPowerMenuOpen(false); }}
            className={`flex flex-col items-center gap-1 transition-colors relative ${currentView === AppView.MY_COMMUNITIES ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${currentView === AppView.MY_COMMUNITIES ? 'fill-1 font-black' : ''}`}>groups</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Groups</span>
            <div className="absolute top-0 right-0 size-2 bg-primary rounded-full border-2 border-background-dark"></div>
          </button>

          {/* PRIORITY 2: EXPLORE */}
          <button 
            onClick={() => { setCurrentView(AppView.DISCOVERY); setIsPowerMenuOpen(false); }}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.DISCOVERY ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${currentView === AppView.DISCOVERY ? 'fill-1 font-black' : ''}`}>explore</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Explore</span>
          </button>
          
          {/* POWER BUTTON */}
          <div className="relative -top-6">
            <button 
              onClick={() => setIsPowerMenuOpen(!isPowerMenuOpen)}
              className={`w-14 h-14 bg-primary text-background-dark rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-300 ${isPowerMenuOpen ? 'rotate-45 scale-110' : 'active:scale-90'}`}
            >
              <span className="material-symbols-outlined text-3xl font-bold">add</span>
            </button>
          </div>

          {/* PRIORITY 3: PULSE */}
          <button 
            onClick={() => { setCurrentView(AppView.GLOBAL_FEED); setIsPowerMenuOpen(false); }}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.GLOBAL_FEED ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${currentView === AppView.GLOBAL_FEED ? 'fill-1 font-black' : ''}`}>dynamic_feed</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Pulse</span>
          </button>

          {/* PRIORITY 4: ME */}
          <button 
            onClick={() => { setCurrentView(AppView.PROFILE); setIsPowerMenuOpen(false); }}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.PROFILE ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${currentView === AppView.PROFILE ? 'fill-1 font-black' : ''}`}>person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Me</span>
          </button>
        </nav>
      )}
    </div>
  );
};

const PowerMenuItem = ({ icon, title, desc, onClick, delay }: { icon: string, title: string, desc: string, onClick: () => void, delay: string }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`w-full bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-4 text-left hover:bg-white/10 transition-all active:scale-[0.98] animate-in slide-in-from-bottom-4 duration-500 ${delay}`}
  >
    <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
      <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
    </div>
    <div>
      <h4 className="text-white font-black text-lg leading-none mb-1">{title}</h4>
      <p className="text-slate-500 text-xs font-medium">{desc}</p>
    </div>
    <span className="material-symbols-outlined text-slate-700 ml-auto">chevron_right</span>
  </button>
);

export default App;
