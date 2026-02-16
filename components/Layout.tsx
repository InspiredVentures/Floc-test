import React from 'react';
import { ActionFunction, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { FlocLogo } from './FlocLogo';
import { PowerMenuItem } from './PowerMenuItem';
import { PageTransition } from './PageTransition';
import { ErrorBoundary } from './ErrorBoundary';

export const Layout: React.FC = () => {
    const [isPowerMenuOpen, setIsPowerMenuOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname;

    const handleAction = (path: string) => {
        setIsPowerMenuOpen(false);
        navigate(path);
    };

    // Paths where the bottom navigation should be HIDDEN
    const hideNavPaths = [
        '/login',
        '/onboarding',
        '/chat',
        '/notifications',
        '/settings',
        '/trip',
        '/community',
        '/join-request',
        '/booking-success',
        '/create-venture',
        '/create-community',
        '/manage-members',
        '/leader-support',
        '/impact-guide',
        '/protocol-viewer',
        '/billing-center',
        '/analytics-api',
        '/impact'
    ];

    const showNav = !hideNavPaths.some(path => {
        if (path === '/chat' || path === '/trip' || path === '/community') {
            return currentPath.startsWith(path);
        }
        return currentPath === path;
    });

    const isActive = (path: string) => {
        if (path === '/') return currentPath === '/';
        return currentPath.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-background shadow-2xl relative">
            <div className="mx-auto flex h-screen max-w-7xl flex-col overflow-hidden border-x border-primary/5 bg-background shadow-2xl">
                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    <AnimatePresence mode="wait">
                        <PageTransition key={location.pathname}>
                            <ErrorBoundary>
                                <Outlet />
                            </ErrorBoundary>
                        </PageTransition>
                    </AnimatePresence>
                </div>

                {isPowerMenuOpen && (
                    <div
                        className="absolute inset-0 z-[60] bg-background-dark/90 backdrop-blur-xl animate-in fade-in duration-300"
                        onClick={() => setIsPowerMenuOpen(false)}
                    >
                        <div className="absolute bottom-32 left-0 right-0 px-8 space-y-4 animate-in slide-in-from-bottom-8 duration-500 max-h-[70vh] overflow-y-auto hide-scrollbar">
                            <div className="mb-4">
                                <FlocLogo className="text-6xl drop-shadow-[0_0_30px_rgba(255,107,53,0.3)]" />
                            </div>
                            <h3 className="text-white text-3xl font-black italic tracking-tighter mb-8">What are we <br /><span className="text-primary not-italic tracking-normal">launching?</span></h3>

                            <PowerMenuItem
                                icon="rocket_launch"
                                title="Start Venture"
                                desc="Create a new trip for your community."
                                onClick={() => handleAction('/create-venture')}
                                delay="delay-75"
                            />
                            <PowerMenuItem
                                icon="groups"
                                title="Launch Community"
                                desc="Build a collective of explorers."
                                onClick={() => handleAction('/create-community')}
                                delay="delay-150"
                            />
                            <PowerMenuItem
                                icon="support_agent"
                                title="Leader Concierge"
                                desc="Get exclusive platform support."
                                onClick={() => handleAction('/leader-support')}
                                delay="delay-200"
                            />
                            <PowerMenuItem
                                icon="dynamic_feed"
                                title="Post Pulse"
                                desc="Share an update with your followers."
                                onClick={() => handleAction('/global-feed')}
                                delay="delay-[250ms]"
                            />
                        </div>
                    </div>
                )}

                {showNav && (
                    <div className="sticky bottom-0 z-50 bg-primary border-t border-primary/10 w-full">
                        <nav className="mx-auto max-w-7xl px-6 pt-3 pb-8 flex justify-between items-center text-white">
                            <button
                                onClick={() => { navigate('/my-communities'); setIsPowerMenuOpen(false); }}
                                className={`flex flex-col items-center gap-1 transition-all ${isActive('/my-communities') ? 'text-accent scale-110' : 'text-white/60 hover:text-white'}`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${isActive('/my-communities') ? 'fill-1 font-black' : ''}`}>groups</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Groups</span>
                            </button>

                            <button
                                onClick={() => { navigate('/discover'); setIsPowerMenuOpen(false); }}
                                className={`flex flex-col items-center gap-1 transition-all ${isActive('/discover') ? 'text-accent scale-110' : 'text-white/60 hover:text-white'}`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${isActive('/discover') ? 'fill-1 font-black' : ''}`}>explore</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Explore</span>
                            </button>

                            <div className="relative -top-6">
                                <button
                                    onClick={() => setIsPowerMenuOpen(!isPowerMenuOpen)}
                                    className={`w-14 h-14 bg-white text-primary rounded-full shadow-lg shadow-black/20 flex items-center justify-center transition-all duration-300 ${isPowerMenuOpen ? 'rotate-45 scale-110' : 'active:scale-90'}`}
                                >
                                    <span className="material-symbols-outlined text-3xl font-bold">add</span>
                                </button>
                            </div>

                            <button
                                onClick={() => { navigate('/global-feed'); setIsPowerMenuOpen(false); }}
                                className={`flex flex-col items-center gap-1 transition-all ${isActive('/global-feed') ? 'text-accent scale-110' : 'text-white/60 hover:text-white'}`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${isActive('/global-feed') ? 'fill-1 font-black' : ''}`}>dynamic_feed</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Pulse</span>
                            </button>

                            <button
                                onClick={() => { navigate('/profile'); setIsPowerMenuOpen(false); }}
                                className={`flex flex-col items-center gap-1 transition-all ${isActive('/profile') ? 'text-accent scale-110' : 'text-white/40 hover:text-white'}`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${isActive('/profile') ? 'fill-1 font-black' : ''}`}>person</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Me</span>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};
