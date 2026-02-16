
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/AuthGuard';
import { Skeleton } from './components/Skeleton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MOCK_TRIPS, MOCK_COMMUNITIES } from './constants';
import { Trip, AppView } from './types';
import { useUser } from './contexts/UserContext';
import { WeTravelService } from './services/WeTravelService';
import { supabaseService } from './services/supabaseService';
import { useToast } from './contexts/ToastContext';

// Lazy Load Pages
const Login = lazy(() => import('./pages/Login'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Discovery = lazy(() => import('./pages/Discovery'));
const AllCommunities = lazy(() => import('./pages/AllCommunities'));
const AllTrips = lazy(() => import('./pages/AllTrips'));
const TripDetails = lazy(() => import('./pages/TripDetails'));
const CommunityDetails = lazy(() => import('./pages/CommunityDetails'));
const CommunityVentures = lazy(() => import('./pages/CommunityVentures'));
const JoinRequest = lazy(() => import('./pages/JoinRequest'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateVenture = lazy(() => import('./pages/CreateVenture'));
const CreateCommunity = lazy(() => import('./pages/CreateCommunity'));
const ManageMembers = lazy(() => import('./pages/ManageMembers'));
const CommunitySettings = lazy(() => import('./pages/CommunitySettings'));
const MyCommunities = lazy(() => import('./pages/MyCommunities'));
const GlobalFeed = lazy(() => import('./pages/GlobalFeed'));
const Profile = lazy(() => import('./pages/Profile'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Messages = lazy(() => import('./pages/Messages'));
const MessageThread = lazy(() => import('./pages/MessageThread'));
const ChatRoom = lazy(() => import('./pages/ChatRoom'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));
const LeaderSupport = lazy(() => import('./pages/LeaderSupport'));
const ImpactGuide = lazy(() => import('./pages/resources/ImpactGuide'));
const ProtocolViewer = lazy(() => import('./pages/resources/ProtocolViewer'));
const BillingCenter = lazy(() => import('./pages/resources/BillingCenter'));
const AnalyticsAPI = lazy(() => import('./pages/resources/AnalyticsAPI'));
const Impact = lazy(() => import('./pages/Impact'));
const ImportTrips = lazy(() => import('./pages/ImportTrips'));
const About = lazy(() => import('./pages/About'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CommunityGuidelines = lazy(() => import('./pages/CommunityGuidelines'));
const TripPage = lazy(() => import('./pages/TripPage'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background-dark">
    <div className="flex flex-col items-center gap-4">
      <div className="size-12 border-4 border-primary/20 border-t-accent rounded-full animate-spin"></div>
      <p className="text-primary/60 text-xs font-black uppercase tracking-widest animate-pulse">Loading Mission...</p>
    </div>
  </div>
);

// Wrappers for pages that expect props
const LoginWrapper = () => <Login />;

const OnboardingWrapper = () => {
  return <Onboarding />;
};

const DiscoveryWrapper = () => {
  return <Discovery />;
};

const AllCommunitiesWrapper = () => {
  const navigate = useNavigate();
  return (
    <AllCommunities
      onBack={() => navigate('/')}
      onSelectTrip={(trip) => navigate(`/trip/${trip.id}`)}
      onSelectCommunity={(comm) => navigate(`/community/${comm.id}`)}
    />
  );
};

const TripDetailsWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error: toastError } = useToast();
  const [isBooking, setIsBooking] = React.useState(false);
  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadTrip = async () => {
      if (!id) return;
      console.log('[TripDetails] Loading trip with ID:', id);
      setLoading(true);
      setError(null);
      try {
        const fetchedTrip = await supabaseService.getTrip(id);
        console.log('[TripDetails] Fetched trip:', fetchedTrip);
        setTrip(fetchedTrip);
      } catch (err) {
        console.error('[TripDetails] Error loading trip:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    loadTrip();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <Skeleton className="h-[380px] w-full !rounded-none" />
      <div className="p-4 space-y-8 -mt-8 relative z-10 bg-background-dark rounded-t-[2rem]">
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full !rounded-[2.5rem]" />
          <div className="pl-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <Skeleton className="size-8 !rounded-full shrink-0" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  if (error) return <div className="p-10 text-white text-center">Error: {error}</div>;
  if (!trip) return <div className="p-10 text-white text-center">Trip not found</div>;

  const handleBooking = async () => {
    setIsBooking(true);
    // Simulate WeTravel booking flow
    const response = await WeTravelService.createBooking({
      tripId: trip.id,
      traveler: { firstName: 'Demo', lastName: 'User', email: 'demo@floc.app' }
    });

    setIsBooking(false);

    if (response.success) {
      navigate('/booking-success');
    } else {
      toastError('Booking failed. Please try again.');
    }
  };

  return (
    <ErrorBoundary>
      <TripDetails
        trip={trip}
        onBack={() => navigate(-1)}
        onBook={handleBooking}
        onOpenChat={() => navigate(`/chat/trip/${trip.id}`)}
        isBooking={isBooking}
      />
    </ErrorBoundary>
  );
};

const CommunityDetailsWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { communities } = useUser();

  const userComm = communities.find(c => c.id === id);
  const mockComm = MOCK_COMMUNITIES.find(c => c.id === id);

  const community = userComm
    ? (mockComm?.isManaged ? { ...userComm, isManaged: true } : userComm)
    : mockComm;

  if (!community) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center p-10">
        <div className="text-center">
          <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <span className="material-symbols-outlined text-slate-500 text-4xl">search_off</span>
          </div>
          <h2 className="text-white text-xl font-black mb-2">Community Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">The community you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/my-communities')}
            className="bg-primary text-background-dark px-6 py-3 rounded-xl font-black text-sm hover:scale-105 transition-transform"
          >
            View My Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <CommunityDetails
        community={community}
        onBack={() => navigate('/')}
        onSelectTrip={(trip) => navigate(`/trip/${trip.id}`)}
        onJoin={(comm) => {
          if (comm.accessType === 'request') {
            navigate(`/community/${comm.id}/join`);
          } else {
            navigate(`/community/${comm.id}`);
          }
        }}
        onOpenChat={() => {
          if (community.upcomingTrips.length > 0) {
            navigate(`/chat/trip/${community.upcomingTrips[0].id}`);
          } else {
            navigate(`/chat/community/${community.id}`);
          }
        }}
        onManage={() => navigate('/dashboard', { state: { communityId: community.id } })}
      />
    </ErrorBoundary>
  );
};

const CommunityVenturesWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { communities } = useUser();

  const userComm = communities.find(c => c.id === id);
  const mockComm = MOCK_COMMUNITIES.find(c => c.id === id);
  const community = userComm
    ? (mockComm?.isManaged ? { ...userComm, isManaged: true } : userComm)
    : mockComm;

  if (!community) return <div>Community not found</div>;

  return (
    <ErrorBoundary>
      <CommunityVentures
        community={community}
        onBack={() => navigate(`/community/${id}`)}
        onSelectTrip={(trip) => navigate(`/trip/${trip.id}`)}
      />
    </ErrorBoundary>
  );
};

const JoinRequestWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { communities } = useUser();

  const community = communities.find(c => c.id === id) || MOCK_COMMUNITIES.find(c => c.id === id);

  if (!community) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center p-10">
        <div className="text-center">
          <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <span className="material-symbols-outlined text-slate-500 text-4xl">search_off</span>
          </div>
          <h2 className="text-white text-xl font-black mb-2">Community Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">The community you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/my-communities')}
            className="bg-primary text-background-dark px-6 py-3 rounded-xl font-black text-sm hover:scale-105 transition-transform"
          >
            View My Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <JoinRequest
      community={community}
      onBack={() => navigate(`/community/${id}`)}
      onSent={() => navigate('/')}
    />
  );
};

const DashboardWrapper = () => {
  const navigate = useNavigate();
  const { communities } = useUser();

  return (
    <Dashboard
      communities={communities}
      onOpenNotifications={() => navigate('/notifications')}
      onCreate={() => navigate('/create-venture')}
      onManage={() => navigate('/manage-members')}
      onContactSupport={() => navigate('/leader-support')}
      onSelectCommunity={(comm) => navigate(`/community/${comm.id}`)}
      onOpenInsights={() => navigate('/resources/analytics-api')}
      onOpenSettings={() => navigate('/community/settings')}
    />
  );
};

const MyCommunitiesWrapper = () => {
  return <MyCommunities />;
};

const ChatRoomWrapper = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { communities } = useUser();

  if (type === 'trip') {
    const trip = MOCK_TRIPS.find(t => t.id === id);
    if (!trip) return <div className="p-10 text-white">Trip chat not found</div>;
    return <ChatRoom id={trip.id} title={trip.title} subtitle={`${trip.membersCount} travelers`} onBack={() => navigate(-1)} />;
  } else if (type === 'community') {
    const community = communities.find(c => c.id === id) || MOCK_COMMUNITIES.find(c => c.id === id);
    if (!community) return <div className="p-10 text-white">Community chat not found</div>;
    return <ChatRoom id={community.id} title={community.title} subtitle={`${community.memberCount} members`} onBack={() => navigate(-1)} />;
  }

  return <div className="p-10 text-white">Invalid chat type</div>;
};

const NotificationsWrapper = () => {
  const navigate = useNavigate();
  return (
    <Notifications
      onBack={() => navigate('/dashboard')}
      onNavigateToTrip={(id) => navigate(`/trip/${id}`)}
      onNavigateToChat={(id, type) => navigate(`/chat/${type}/${id}`)}
    />
  );
};

const CreateVentureWrapper = () => {
  const navigate = useNavigate();
  return <CreateVenture onBack={() => navigate('/dashboard')} onComplete={() => navigate('/dashboard')} />;
}

const CreateCommunityWrapper = () => {
  const navigate = useNavigate();
  return <CreateCommunity onBack={() => navigate('/')} onComplete={() => navigate('/my-communities')} />;
}

const LeaderSupportWrapper = () => {
  const navigate = useNavigate();
  const handleOpenResource = (view: AppView) => {
    switch (view) {
      case AppView.IMPACT_GUIDE: navigate('/resources/impact-guide'); break;
      case AppView.PROTOCOL_VIEWER: navigate('/resources/protocol-viewer'); break;
      case AppView.BILLING_CENTER: navigate('/resources/billing-center'); break;
      case AppView.ANALYTICS_API: navigate('/resources/analytics-api'); break;
      default: console.warn('Unknown resource view:', view);
    }
  };

  return (
    <LeaderSupport
      onBack={() => navigate('/dashboard')}
      onOpenResource={handleOpenResource}
    />
  );
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/trip/:id" element={<TripPage />} />
          <Route path="/trip/:id/hub" element={<TripDetailsWrapper />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/trips" element={<AllTrips />} />

          {/* Public Routes with App Layout */}
          {/* <Route element={<Layout />}>
            <Route path="/trip/:id" element={<TripDetailsWrapper />} />
          </Route> */}

          <Route element={<AuthGuard><Layout /></AuthGuard>}>
            <Route path="/onboarding" element={<OnboardingWrapper />} />
            <Route path="/discover" element={<DiscoveryWrapper />} />
            <Route path="/communities" element={<AllCommunitiesWrapper />} />
            <Route path="/communities" element={<AllCommunitiesWrapper />} />
            {/* <Route path="/trip/:id" element={<TripDetailsWrapper />} /> Moved to public layout below */}
            <Route path="/community/:id" element={<CommunityDetailsWrapper />} />
            <Route path="/community/:id/ventures" element={<CommunityVenturesWrapper />} />
            <Route path="/community/:id/join" element={<JoinRequestWrapper />} />

            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/create-venture" element={<CreateVentureWrapper />} />
            <Route path="/create-community" element={<CreateCommunityWrapper />} />
            <Route path="/manage-members" element={<ManageMembers onBack={() => window.history.back()} />} />
            <Route path="/community/settings" element={<CommunitySettings onBack={() => window.history.back()} />} />
            <Route path="/my-communities" element={<MyCommunitiesWrapper />} />

            <Route path="/global-feed" element={<GlobalFeed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:username" element={<MessageThread />} />
            <Route path="/chat/:type/:id" element={<ChatRoomWrapper />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings onBack={() => window.history.back()} />} />
            <Route path="/booking-success" element={<BookingSuccess onDone={() => window.location.href = '/my-communities'} />} />

            <Route path="/leader-support" element={<LeaderSupportWrapper />} />
            <Route path="/resources/impact-guide" element={<ImpactGuide onBack={() => window.history.back()} />} />
            <Route path="/resources/protocol-viewer" element={<ProtocolViewer onBack={() => window.history.back()} />} />
            <Route path="/resources/billing-center" element={<BillingCenter onBack={() => window.history.back()} />} />
            <Route path="/resources/analytics-api" element={<AnalyticsAPI onBack={() => window.history.back()} />} />

            <Route path="/import-trips" element={<ImportTrips />} />
            <Route path="/guidelines" element={<CommunityGuidelines />} />
            <Route path="/impact" element={<Impact onBack={() => window.history.back()} />} />

            {/* Wix Redirects */}
            <Route path="/about-us" element={<Navigate to="/about" replace />} />
            <Route path="/our-trips" element={<Navigate to="/trips" replace />} />
            <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
            <Route path="/blog-1" element={<Navigate to="/blog" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
