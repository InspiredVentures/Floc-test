
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trip } from '../types';
import { supabaseService } from '../services/supabaseService';
import { MOCK_TRIPS } from '../constants';
import WebsiteNav from '../components/WebsiteNav';
import { Skeleton } from '../components/Skeleton';
import { motion } from 'framer-motion';
import { Globe, MapPin, Calendar, ArrowRight } from 'lucide-react';

const AllTrips: React.FC = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTrips = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedTrips = await supabaseService.getTrips();
                setTrips(fetchedTrips);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };
        loadTrips();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FCFBF5] pb-32">
                <header className="px-6 py-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <Skeleton className="h-10 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </header>
                <main className="px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden h-[400px]">
                                <Skeleton className="h-full w-full" />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FCFBF5] flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                    </div>
                    <p className="text-primary text-lg font-black uppercase italic tracking-tighter mb-2">Error Loading Trips</p>
                    <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-8 px-8 py-4 bg-accent text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Retry Mission</button>
                </div>
            </div>
        );
    }

    return (
        <div data-theme="eva" className="min-h-screen bg-[#FCFBF5] text-[#14532D] font-body antialiased selection:bg-accent selection:text-white">
            <WebsiteNav />

            <header className="pt-32 pb-20 bg-primary/5 border-b border-primary/5 relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Our Trips</span>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-8 tracking-tighter">
                            Your Next <span className="text-accent italic">Mission.</span>
                        </h1>
                        <p className="text-xl text-primary/70 leading-relaxed font-medium">
                            Join high-impact journeys designed for explorers over 40. Every trip supports local conservation and community development.
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="py-24 container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {MOCK_TRIPS.map((trip, i) => (
                        <motion.div
                            key={trip.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                            onClick={() => navigate(`/trip/${trip.id}`)}
                        >
                            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl mb-8">
                                <img
                                    src={trip.image}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={trip.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <span className="inline-block px-4 py-1.5 bg-accent/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                        {trip.destination}
                                    </span>
                                    <h3 className="text-2xl font-heading font-bold leading-tight">{trip.title}</h3>
                                </div>
                            </div>
                            <div className="px-4 space-y-4">
                                <div className="flex items-center justify-between text-primary/60 text-sm font-bold">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{trip.dates}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        <span>Impact Mission</span>
                                    </div>
                                </div>
                                <p className="text-primary/70 line-clamp-2 leading-relaxed">
                                    {trip.title} impact mission in {trip.destination}.
                                </p>
                                <div className="flex items-center gap-2 text-accent font-black uppercase tracking-widest text-xs pt-2 group-hover:gap-4 transition-all">
                                    Explore Trip <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            <footer className="py-20 text-center text-primary/40 text-sm">
                <p>© 2026 EVA by Inspired. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AllTrips;
