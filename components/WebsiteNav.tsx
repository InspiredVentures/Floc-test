
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { MOCK_TRIPS } from '../constants';
import EvaLogo from './EvaLogo';

interface WebsiteNavProps {
    transparentInitial?: boolean;
}

const WebsiteNav: React.FC<WebsiteNavProps> = ({ transparentInitial = false }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [tripsDropdownOpen, setTripsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    interface NavLink {
        name: string;
        path: string;
        isHash?: boolean;
    }

    const navLinks: NavLink[] = [
        { name: 'Our Story', path: '/about' },
        { name: 'Reviews', path: '/reviews' },
        { name: 'Journal', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    const handleLinkClick = (path: string, isHash?: boolean) => {
        setMobileMenuOpen(false);
        if (isHash && location.pathname === '/') {
            const id = path.split('#')[1];
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        } else if (isHash) {
            navigate(path);
        } else {
            navigate(path);
        }
    };

    const isTransparent = transparentInitial && !isScrolled;

    return (
        <>
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isTransparent ? 'bg-transparent py-6' : 'bg-[#14532D]/95 backdrop-blur-md py-4 shadow-sm border-b border-white/10'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        {/* EVA Hero Logo */}
                        <EvaLogo
                            className="h-10 w-auto"
                            color="#ffffff"
                        />
                        <span className="text-sm font-heading font-bold text-white tracking-tight italic pt-2">by</span>
                        {/* Inspired Logo */}
                        <img
                            src="/images/Inspired-logo.avif"
                            alt="Inspired Logo"
                            className="h-6 w-auto object-contain transition-opacity duration-300 pt-1 brightness-0 invert opacity-90"
                        />
                    </div>

                    <div className="hidden lg:flex items-center gap-8 text-white">
                        <div
                            className="relative group"
                            onMouseEnter={() => setTripsDropdownOpen(true)}
                            onMouseLeave={() => setTripsDropdownOpen(false)}
                        >
                            <button
                                className="flex items-center gap-1 font-medium hover:text-accent transition-colors py-2 uppercase tracking-widest text-xs font-bold"
                                onClick={() => navigate('/trips')}
                            >
                                Our Trips <ChevronDown size={14} className={`transition-transform duration-300 ${tripsDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {tripsDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full -left-12 pt-4 w-64"
                                    >
                                        <div className="bg-white rounded-2xl shadow-xl border border-primary/5 overflow-hidden p-2">
                                            {MOCK_TRIPS.map(trip => (
                                                <div
                                                    key={trip.id}
                                                    onClick={() => {
                                                        navigate(`/trip/${trip.id}`);
                                                        setTripsDropdownOpen(false);
                                                    }}
                                                    className="flex items-center gap-3 p-3 hover:bg-primary/5 rounded-xl cursor-pointer group transition-colors"
                                                >
                                                    <img src={trip.image} className="w-10 h-10 rounded-lg object-cover" alt={trip.title} />
                                                    <div className="space-y-0.5">
                                                        <p className="text-[#14532D] font-bold text-xs uppercase leading-none group-hover:text-accent transition-colors">{trip.destination}</p>
                                                        <p className="text-[#14532D]/50 text-[10px] uppercase tracking-wider">{trip.title}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleLinkClick(link.path, link.isHash)}
                                className="font-medium hover:text-accent transition-colors uppercase tracking-widest text-xs font-bold"
                            >
                                {link.name}
                            </button>
                        ))}
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-accent text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[#14532D] transition-all hover:scale-105 shadow-md"
                        >
                            Join Us
                        </button>
                    </div>

                    <button className="text-white lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[110] bg-[#14532D] p-8 flex flex-col items-center justify-center gap-8 text-white"
                    >
                        <button className="absolute top-8 right-8 text-white/60 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                            <X className="w-8 h-8" />
                        </button>

                        <div className="flex flex-col items-center gap-6">
                            <button
                                onClick={() => handleLinkClick('/trips')}
                                className="text-2xl font-heading font-bold uppercase tracking-widest hover:text-accent transition-colors"
                            >
                                Our Trips
                            </button>
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleLinkClick(link.path, link.isHash)}
                                    className="text-2xl font-heading font-bold uppercase tracking-widest hover:text-accent transition-colors"
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                            className="bg-accent text-white px-12 py-4 rounded-full text-lg font-bold shadow-xl shadow-accent/20 active:scale-95 transition-all mt-8"
                        >
                            Join Us
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default WebsiteNav;
