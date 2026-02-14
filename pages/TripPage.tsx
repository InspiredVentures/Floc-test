
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, MapPin, Users, DollarSign, ArrowRight, Shield, Zap, CheckCircle2, XCircle } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';
import { MOCK_TRIPS } from '../constants';
import { Trip } from '../types';
import { TRIP_CONTENT, TripDate } from '../data/trips_itineraries';
import { useUser } from '../contexts/UserContext';
import { SEO } from '../components/SEO';

const TripPage: React.FC = () => {
    const { id } = useParams(); // Keep one
    const navigate = useNavigate();
    const { isBooked, bookTrip, isMember, joinCommunity } = useUser();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const [selectedDate, setSelectedDate] = useState<TripDate | null>(null);

    const content = id ? TRIP_CONTENT[id] : null;

    useEffect(() => {
        const found = MOCK_TRIPS.find(t => t.id === id);
        if (found) setTrip(found);
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (content?.dates && content.dates.length > 0) {
            setSelectedDate(content.dates[0]);
        }
    }, [content]);

    if (!trip) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary">
                <h2 className="text-4xl font-heading font-bold mb-4 uppercase">Trip Not Found</h2>
                <button onClick={() => navigate('/')} className="text-accent underline font-bold uppercase tracking-widest">Return to Home</button>
            </div>
        );
    }

    const sections = [
        { id: 'overview', label: 'Overview' },
        { id: 'itinerary', label: 'The Journey' },
        { id: 'impact', label: 'The Legacy' },
    ];

    return (
        <div className="min-h-screen bg-background text-[#14532D] selection:bg-accent selection:text-white">
            {trip && (
                <SEO
                    title={trip.title}
                    description={content?.mission || trip.description || `Explore ${trip.destination} with EVA.`}
                    image={trip.image}
                />
            )}
            <WebsiteNav />
            {/* Signature Trip Hero Section */}
            <header className="relative h-[85vh] w-full overflow-hidden flex items-end pb-32">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <img src={trip.image} className="w-full h-full object-cover" alt={trip.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FCFBF5] via-[#FCFBF5]/20 to-transparent"></div>
                </motion.div>

                <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-50">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-6 py-3 rounded-full text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-primary transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Home
                    </button>
                    <div className="flex items-center gap-4">
                        {isBooked(trip.id) && (
                            <button
                                onClick={() => navigate(`/trip/${trip.id}/hub`)}
                                className="hidden md:flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-accent transition-all shadow-lg shadow-accent/20 animate-in fade-in slide-in-from-top-4"
                            >
                                <Zap className="w-4 h-4 fill-current" /> Access Member Hub
                            </button>
                        )}
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.4em] italic">Inspired / {trip.id}</span>
                        <div className="size-2 bg-accent rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-4xl space-y-6"
                    >
                        <h1 className="text-7xl md:text-9xl font-heading font-black leading-none tracking-tighter uppercase text-white drop-shadow-lg">
                            {trip.title}
                        </h1>
                        <p className="text-xl md:text-2xl font-light italic text-white/90 drop-shadow-md max-w-2xl">
                            {trip.id === 'borneo' ? "A 10-day immersive conservation journey. Swim with giants. Contribute to citizen science. Experience the wild." : `A ${content?.dates?.[0]?.start && content?.dates?.[0]?.end ? '12-15' : '10'}-day immersive journey through ${trip.destination}. Experience the wild with purpose.`}
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Navigation Strip */}
            <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-primary/5">
                <div className="container mx-auto px-6 flex justify-center gap-8 md:gap-16">
                    {sections.map(s => (
                        <button
                            key={s.id}
                            onClick={() => {
                                setActiveSection(s.id);
                                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeSection === s.id ? 'text-accent' : 'text-primary/40 hover:text-primary'}`}
                        >
                            {s.label}
                            {activeSection === s.id && (
                                <motion.div layoutId="activeSection" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            <main className="space-y-0">
                {/* 01. Overview Section - Split Layout */}
                <section id="overview" className="container mx-auto px-6 py-24">
                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Left: Mission & Details */}
                        <div className="lg:w-1/2 space-y-12">
                            <div className="space-y-6">
                                <span className="text-accent text-sm font-black uppercase tracking-[0.5em] italic block">The Mission</span>
                                <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase leading-[0.9] text-primary">
                                    Why this <br /> <span className="text-accent italic">Matters.</span>
                                </h2>
                                <p className="text-xl leading-relaxed font-light text-primary/80">
                                    {content?.mission || trip.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-8 pt-8 border-t border-primary/10">
                                {content?.whyJoin?.map((point, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <span className="text-4xl font-heading font-black text-accent/20 group-hover:text-accent transition-colors">0{i + 1}</span>
                                        <p className="text-sm font-bold uppercase tracking-wide leading-relaxed pt-2 text-primary/70">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Quick Stats & Booking Card */}
                        <aside className="lg:w-1/2 lg:pl-12 space-y-8 sticky top-32 h-fit">
                            <div className="bg-white px-10 py-12 rounded-[3rem] shadow-2xl border border-primary/5 space-y-10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Zap className="w-32 h-32" />
                                </div>

                                <div className="flex items-center justify-between border-b border-primary/5 pb-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[10px] font-bold uppercase text-primary/40">Total Price:</span>
                                        <span className="text-6xl font-heading font-black text-primary">{trip.price}</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[10px] font-bold uppercase text-accent">Deposit:</span>
                                        <span className="text-2xl font-black italic text-accent">£500</span>
                                    </div>
                                </div>
                                <p className="text-[11px] font-bold text-primary/30 uppercase tracking-widest italic">Includes all meals, transfers & local support.</p>

                                {/* DEV ONLY: Simulation Button */}
                                {!isBooked(trip.id) && (
                                    <button
                                        onClick={() => bookTrip(trip.id)}
                                        className="w-full bg-red-100 text-red-600 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-200 transition-colors border border-red-200"
                                    >
                                        [Dev] Simulate Successful Webhook
                                    </button>
                                )}
                            </div>

                            <div className="space-y-8 py-8 border-y border-primary/5">
                                <div className="flex items-start gap-6">
                                    <div className="size-14 bg-accent/5 rounded-2xl flex items-center justify-center text-accent shrink-0">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2 w-full">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/30 italic">Choose Date</h4>
                                        {content?.dates && content.dates.length > 0 ? (
                                            <div className="relative">
                                                <select
                                                    value={selectedDate ? JSON.stringify(selectedDate) : ''}
                                                    onChange={(e) => e.target.value && setSelectedDate(JSON.parse(e.target.value))}
                                                    className="w-full appearance-none bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-sm font-bold uppercase text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer hover:bg-primary/10 transition-colors"
                                                >
                                                    {content.dates.map((date: TripDate, i: number) => (
                                                        <option key={i} value={JSON.stringify(date)}>
                                                            {date.start} - {date.end} {date.year} ({date.availability || 'Open'})
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronLeft className="w-4 h-4 -rotate-90 text-primary/40" />
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-base font-bold uppercase text-primary/60">Dates on Request</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="size-14 bg-accent/5 rounded-2xl flex items-center justify-center text-accent">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/30 italic">Group Size</h4>
                                        <p className="text-base font-bold uppercase">Max {trip.id === 'borneo' ? '10' : '12'} Travellers</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="size-14 bg-accent/5 rounded-2xl flex items-center justify-center text-accent">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/30 italic">Destination</h4>
                                        <p className="text-base font-bold uppercase">{trip.destination}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        if (selectedDate?.bookingLink) {
                                            window.open(selectedDate.bookingLink, '_blank');
                                        } else {
                                            window.location.href = `mailto:hello@inspiredventures.co.uk?subject=Inquiry for ${trip.title}`;
                                        }
                                    }}
                                    disabled={selectedDate?.availability === 'Sold Out'}
                                    className={`w-full py-8 rounded-full text-sm font-black uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 ${selectedDate?.availability === 'Sold Out' ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-primary text-white'}`}
                                >
                                    {selectedDate?.availability === 'Sold Out' ? 'Sold Out' : 'Book This Journey'}
                                </button>
                                <button
                                    onClick={async () => {
                                        if (isMember(trip.communityId)) {
                                            navigate(`/community/${trip.communityId}`);
                                        } else {
                                            setIsJoining(true);
                                            await joinCommunity(trip.communityId);
                                            setIsJoining(false);
                                            navigate(`/community/${trip.communityId}`);
                                        }
                                    }}
                                    disabled={isJoining}
                                    className="w-full bg-primary text-white py-6 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {isJoining ? (
                                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Users className="w-4 h-4" />
                                            {isMember(trip.communityId) ? 'Open Community Chat' : 'Join Trip Community'}
                                        </>
                                    )}
                                </button>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-center text-primary/20 pt-4">
                                    Hosted by Inspired Ventures • Expert Led • Carbon Conscious
                                </p>
                            </div>
                        </aside>
                    </div>

                    <div className="pt-20 space-y-16">
                        {/* 02. Impact & Experience */}
                        <section id="impact" className="space-y-24">
                            {/* Giving Back Section */}
                            {content?.givingBack && (
                                <div className="bg-[#14532D] p-16 rounded-[4rem] text-white space-y-10 relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 p-12 opacity-10">
                                        <Shield className="size-64" />
                                    </div>
                                    <div className="space-y-6 relative z-10">
                                        <span className="text-accent text-sm font-black uppercase tracking-[0.5em] italic block">The Giving Back Story</span>
                                        <h3 className="text-5xl font-heading font-black uppercase leading-tight italic">
                                            Leaving a <span className="text-accent">Lasting Legacy.</span>
                                        </h3>
                                    </div>
                                    <p className="text-2xl font-light italic leading-relaxed text-white/80 max-w-3xl relative z-10">
                                        {content.givingBack}
                                    </p>
                                </div>
                            )}

                            {/* Inclusions & Exclusions Card */}
                            <div className="bg-white border border-primary/5 rounded-[3rem] p-10 shadow-3xl space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-accent">What's Included</h4>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {(content?.inclusions || []).map((inc, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-primary/70 uppercase tracking-widest italic leading-relaxed">
                                                <CheckCircle2 className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                                                {inc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="pt-6 border-t border-primary/5 space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-primary/40">Exclusions</h4>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {(content?.exclusions || []).map((ex, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-primary/40 uppercase tracking-widest italic leading-relaxed">
                                                <XCircle className="w-3 h-3 text-primary/20 shrink-0 mt-0.5" />
                                                {ex}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                </section>

                <section id="itinerary" className="w-full py-24 space-y-0">
                    <div className="space-y-6 container mx-auto px-6 mb-24">
                        <span className="text-accent text-sm font-black uppercase tracking-[0.5em] italic block">The Chronology</span>
                        <h2 className="text-6xl md:text-9xl font-heading font-black tracking-tighter uppercase">The <br /> <span className="text-accent italic">Journey.</span></h2>
                    </div>

                    <div className="space-y-0 w-full">
                        {(content?.itinerary || []).map((item, idx) => (
                            <div key={idx} className="flex flex-col lg:flex-row w-full min-h-screen border-t border-primary/5">
                                {/* Text Content (40%) */}
                                <div className="w-full lg:w-[40%] p-8 lg:p-24 flex flex-col justify-center space-y-8 bg-background">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent italic">Day {item.day}</span>
                                        <h3 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tight leading-none text-primary">{item.title}</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-lg md:text-xl font-light leading-relaxed text-primary/80">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Image Content (60%) */}
                                <div className="w-full lg:w-[60%] relative h-[50vh] lg:h-auto overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-20 transition-opacity duration-700 z-10 mix-blend-multiply"></div>
                                    <img
                                        src={item.image || `https://images.unsplash.com/photo-${1550000000000 + idx}?auto=format&fit=crop&q=80&w=2000`}
                                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                                        alt={item.title}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 04. You Might Also Like */}
                <section className="container mx-auto px-6 py-24 space-y-12 border-t border-primary/5">
                    <h3 className="text-3xl font-heading font-black uppercase tracking-widest text-center">You Might Also Like</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {MOCK_TRIPS.filter(t => t.id !== trip.id).slice(0, 3).map((otherTrip, i) => (
                            <div key={i} onClick={() => navigate(`/trip/${otherTrip.id}`)} className="group cursor-pointer space-y-4">
                                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden relative">
                                    <img src={otherTrip.image} alt={otherTrip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-heading font-bold uppercase leading-none group-hover:text-accent transition-colors">{otherTrip.title}</h4>
                                    <p className="text-xs font-bold uppercase tracking-widest text-primary/40">{otherTrip.destination}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Final Footer CTA */}
            <footer className="py-40 bg-[#14532D] text-white text-center space-y-12">
                <h2 className="text-6xl md:text-8xl font-heading font-bold uppercase italic leading-none">
                    Unleash your <br /> <span className="text-accent">third act.</span>
                </h2>
                <button
                    onClick={() => navigate('/contact')}
                    className="group inline-flex items-center gap-8 text-sm font-black uppercase tracking-[0.4em] text-white hover:text-accent transition-all"
                >
                    Speak with a Specialist <ArrowRight className="group-hover:translate-x-4 transition-transform" />
                </button>
            </footer>
        </div>
    );
};

export default TripPage;
