import React from 'react';
import { ActionFunction, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './PageTransition';
import { ErrorBoundary } from './ErrorBoundary';

export const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname;

    const handleAction = (path: string) => {
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

                {showNav && (
                    <div className="sticky bottom-0 z-50 bg-primary border-t border-primary/10 w-full">
                        <nav className="mx-auto max-w-7xl px-6 pt-3 pb-8 flex justify-between items-center text-white">
                            <button
                                onClick={() => { navigate('/my-communities'); }}
                                className={`flex flex-col items-center gap-1 transition-all ${isActive('/my-communities') ? 'text-accent scale-110' : 'text-white/60 hover:text-white'}`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${isActive('/my-communities') ? 'fill-1 font-black' : ''}`}>groups</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Groups</span>
                            </button>

                            <button
                                onClick={() => { navigate('/discover'); }}
                                className={`flex flex-col items-center gap-1 transition-all ${isActive('/discover') ? 'text-accent scale-110' : 'text-white/60 hover:text-white'}`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${isActive('/discover') ? 'fill-1 font-black' : ''}`}>explore</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Explore</span>
                            </button>

                            <button
                                onClick={() => { navigate('/global-feed'); }}
                                className={`flex flex-col items-center gap-1 transition-all ${isActive('/global-feed') ? 'text-accent scale-110' : 'text-white/60 hover:text-white'}`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${isActive('/global-feed') ? 'fill-1 font-black' : ''}`}>dynamic_feed</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Pulse</span>
                            </button>

                            <button
                                onClick={() => { navigate('/profile'); }}
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
