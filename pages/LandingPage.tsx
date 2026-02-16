import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    Users,
    Palmtree,
    MapPin,
    Sparkles,
    Megaphone,
    ChevronRight,
    ArrowRight,
    Globe,
    Camera,
    MessageCircle,
    Menu,
    X
} from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';
import { SEO } from '../components/SEO';

// Animation Variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const floatingVariants: any = {
    initial: { y: 0 },
    animate: (i: number) => ({
        y: [0, -15, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut"
        }
    })
};

const heroImages = [
    "/images/eva/whale-shark-hero.jpg",
    "/images/eva/sa-conservation-hero.jpg",
    "/images/eva/group_travel_safari.png",
    "/images/eva/living-mountain-hero.jpg",
];

const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Handle initial hash scroll
    useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, []);

    const trips = [
        {
            id: 'borneo',
            title: "The Safari Journey",
            tags: "Borneo / 2026",
            img: "/images/eva/whale-shark-hero.jpg",
            desc: "A high-impact biodiversity journey in the heart of Malaysian Borneo. Partner with local rangers to support ethical wildlife conservation and community development."
        },
        {
            id: 'nepal',
            title: "Nepal Tiger Tracking",
            tags: "Nepal / 2026",
            img: "/images/trips/nepal-tiger.jpg",
            desc: "Track tigers and leopards in Nepal, helping the Nepal Tiger Trust to support and protect the big cat populations in the Himalayan foothills."
        },
        {
            id: 'morocco',
            title: "Atlas Range Ascent",
            tags: "Morocco / 2026",
            img: "/images/eva/living-mountain-hero.jpg",
            desc: "Supporting Berber mountain communities while navigating the majestic Atlas peaks. A journey of cultural synergy, earthquake restoration, and high-altitude photography."
        },
        {
            id: 'tanzania',
            title: "Tanzania Kinship",
            tags: "Tanzania / 2026",
            img: "https://images.unsplash.com/photo-1489914169085-9b54fdd8f2a2?auto=format&fit=crop&q=80&w=800",
            desc: "Safari through the Serengeti and Ngorongoro Crater, and build sustainable chicken coops for kinship-care families in Moshi."
        },
        {
            id: 'bhutan',
            title: "Bhutanese Mindfulness",
            tags: "Bhutan / 2026",
            img: "/images/trips/bhutan-tigers-nest.jpg",
            desc: "Immerse into a living Himalayan kingdom where tradition is preserved. Cross Dochula Pass and walk the ancient Trans-Bhutan Trail."
        },
        {
            id: 'uganda-rwanda',
            title: "Uganda & Rwanda",
            tags: "East Africa / 2026",
            img: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&q=80&w=800",
            desc: "Sit among mountain gorillas in Uganda then track chimps across the border in Rwanda. A journey of primate conservation and community support."
        }
    ];

    return (
        <div data-theme="eva" className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-accent selection:text-white">
            <SEO
                title="Home"
                description="Vibrant 'give back' travel for the young at heart. Connect, contribute, and celebrate your third act with EVA by Inspired."
                image="/images/eva/whale-shark-hero.jpg"
            />
            <WebsiteNav transparentInitial={true} />

            {/* Hero Section */}
            <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Slideshow with Overlay */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <img
                                src={heroImages[currentImageIndex]}
                                alt="Adventure Backdrop"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-primary/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-primary/40"></div>
                </div>

                <div className="container relative z-10 px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="flex flex-col items-center"
                    >
                        {/* Custom SVG Logotype Layer from original branding */}
                        <div className="group relative select-none w-full max-w-[500px] md:max-w-[700px] transition-transform duration-700 hover:scale-105">
                            <svg
                                viewBox="0 0 600 240"
                                className="w-full h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                                style={{ filter: "drop-shadow(0 0 20px rgba(0, 127, 255, 0.4))" }}
                            >
                                {/* E - with Leaf Motif */}
                                <motion.g custom={0} variants={floatingVariants} initial="initial" animate="animate">
                                    <motion.path
                                        d="M140 60 H50 V180 H140 M50 120 H120"
                                        stroke="white"
                                        strokeWidth="24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                    />
                                    <motion.path
                                        d="M130 50 C140 40 160 40 160 60 C160 80 140 85 130 80 L130 50"
                                        fill="#14532D"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1, duration: 0.5 }}
                                    />
                                </motion.g>

                                {/* V - Mountain Peak Motif */}
                                <motion.g custom={1} variants={floatingVariants} initial="initial" animate="animate">
                                    <motion.path
                                        d="M200 60 L300 180 L400 60"
                                        stroke="white"
                                        strokeWidth="24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                                    />
                                    <motion.path
                                        d="M260 132 L300 100 L340 132"
                                        stroke="white"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        fill="none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        transition={{ delay: 1.5 }}
                                    />
                                </motion.g>

                                {/* A - Wave Motif */}
                                <motion.g custom={2} variants={floatingVariants} initial="initial" animate="animate">
                                    <motion.path
                                        d="M450 180 L525 60 L600 180"
                                        stroke="white"
                                        strokeWidth="24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.6 }}
                                    />
                                    <motion.path
                                        d="M485 140 Q525 120 565 140"
                                        stroke="#007FFF"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                        fill="none"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ delay: 2, duration: 1 }}
                                    />
                                </motion.g>
                            </svg>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-xl md:text-3xl font-heading text-white mb-6 tracking-wide drop-shadow-lg">
                            Travel with purpose, see the world, <br className="hidden md:block" /> and leave a positive impact.
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                            <button
                                onClick={() => navigate('/discover')}
                                className="w-full sm:w-auto px-10 py-5 bg-accent text-white rounded-full font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-2xl shadow-accent/40"
                            >
                                Start Your Adventure
                            </button>
                            <button
                                onClick={() => navigate('/community')}
                                className="w-full sm:w-auto px-10 py-5 bg-white text-primary rounded-full font-bold text-lg hover:bg-background transition-all shadow-xl"
                            >
                                Join the Community
                            </button>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Philosophy / Message Section */}
            <section id="about" className="py-32 bg-secondary/30 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-primary/5">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="text-center"
                        >
                            <motion.div variants={fadeIn}>
                                <Heart className="w-16 h-16 text-accent mx-auto mb-8 animate-pulse" />
                                <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-8 underline decoration-accent/30 decoration-8 underline-offset-8">
                                    Welcome to EVA Travel
                                </h2>
                                <div className="space-y-6 text-lg md:text-xl text-primary/80 leading-relaxed font-body">
                                    <p>
                                        Welcome to EVA travel, a vibrant home for everyone who wants to travel with purpose and give back a little to make a big difference.
                                    </p>
                                    <p>
                                        EVA Travel isn't just a tour company. We're a community of like-minded travellers who recognise the value in getting out of your comfort zone to experience the real people and authentic parts of the places that you visit.
                                    </p>
                                    <p>
                                        Most of our guests arrive as solo travellers but leave as a firm part of the EVA community. Our groups are largely comprised of people over 40 (the "young at heart") who want to travel in a sustainable way and leave a positive impact.
                                    </p>
                                </div>

                                <div className="mt-12 pt-12 border-t border-primary/10 flex flex-col items-center">
                                    <p className="italic text-xl text-primary/70 mb-2">Warm regards,</p>
                                    <p className="font-heading font-bold text-3xl text-primary tracking-tight">Sheila Fitzgerald</p>
                                    <p className="text-accent font-bold mt-2">Founder, EVA by Inspired</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trips Grid */}
            <section id="trips" className="py-32 bg-background">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="space-y-4">
                            <span className="text-accent text-sm font-bold uppercase tracking-[0.3em]">Upcoming Trips</span>
                            <h2 className="text-5xl md:text-8xl font-heading font-bold text-primary tracking-tighter uppercase leading-none">Our <span className="text-accent italic inline-block rotate-1">Trips.</span></h2>
                        </div>
                        <p className="max-w-xs text-foreground/50 font-semibold uppercase text-xs tracking-[0.2em] leading-loose">
                            Every trip is led by specialized experts and limited to small, social groups.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {trips.map((trip, i) => (
                            <motion.div
                                key={i}
                                variants={fadeIn}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                whileHover={{ y: -10 }}
                                onClick={() => navigate(`/trip/${trip.id}`)}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
                                    <img
                                        src={trip.img}
                                        alt={trip.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                        <span className="text-xs font-bold uppercase tracking-widest bg-accent px-3 py-1 rounded-full mb-3 inline-block">
                                            {trip.tags}
                                        </span>
                                        <h4 className="text-2xl font-heading font-bold mb-2">{trip.title}</h4>
                                    </div>
                                </div>
                                <p className="text-primary/60 px-2 line-clamp-3 font-medium text-xs leading-relaxed italic">
                                    {trip.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <button
                            onClick={() => navigate('/discover')}
                            className="inline-flex items-center gap-4 text-sm font-black uppercase tracking-widest text-primary hover:text-accent transition-all group"
                        >
                            View All 2026 Journeys
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Global Impact CTA */}
            <section id="community" className="py-40 bg-primary text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] -translate-x-1/3 translate-y-1/3"></div>

                <div className="container relative z-10 mx-auto px-6 text-center max-w-4xl space-y-12">
                    <div className="space-y-6">
                        <span className="text-accent text-sm font-bold uppercase tracking-[0.4em] italic mb-4 block">Ready for your third act?</span>
                        <h2 className="text-6xl md:text-9xl font-heading font-bold leading-[0.85] tracking-tight uppercase">
                            Join the <br /> <span className="text-accent italic inline-block -rotate-2">Community.</span>
                        </h2>
                        <p className="text-white/60 max-w-xl mx-auto text-xl font-light italic leading-loose">
                            Join a community where adventure has no age limit and impact knows no bounds. The world is waiting for your energy.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-10">
                        <button
                            onClick={() => navigate('/discover')}
                            className="bg-accent text-white px-16 py-8 rounded-full text-base font-bold uppercase tracking-[0.3em] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-none hover:scale-110 active:scale-95 transition-all hover:bg-white hover:text-accent"
                        >
                            Start Your Journey
                        </button>
                        <div className="h-px w-32 bg-white/20"></div>
                        <p className="text-[10px] uppercase tracking-[0.6em] text-white/30 font-bold italic">EVA — Purpose / People / Planet</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-background border-t border-secondary">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 text-sm">
                        <div className="col-span-2 space-y-8">
                            <span className="text-4xl font-heading font-bold text-primary tracking-tighter uppercase italic">EVA.</span>
                            <p className="max-w-xs text-foreground/50 leading-loose">
                                Ethical Volunteer Adventures is a travel brand dedicated to purposeful exploration for the vibrant over-50s community.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-black uppercase tracking-widest text-[10px]">Navigate</h4>
                            <ul className="space-y-4 text-foreground/60">
                                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-accent font-medium">Home</button></li>
                                <li><button onClick={() => document.getElementById('trips')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-accent font-medium">Our Trips</button></li>
                                <li><button onClick={() => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-accent font-medium">Impact Philosophy</button></li>
                                <li><button onClick={() => navigate('/blog')} className="hover:text-accent font-medium">Journal</button></li>
                                <li><button onClick={() => navigate('/reviews')} className="hover:text-accent font-medium">Reviews</button></li>
                                <li><button onClick={() => navigate('/about')} className="hover:text-accent font-medium">About Us</button></li>
                                <li><button onClick={() => navigate('/contact')} className="hover:text-accent font-medium">Contact Us</button></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-black uppercase tracking-widest text-[10px]">Follow the Journey</h4>
                            <ul className="space-y-4 text-foreground/60">
                                <li><a href="#" className="hover:text-accent font-medium">Instagram</a></li>
                                <li><a href="#" className="hover:text-accent font-medium">Facebook Group</a></li>
                                <li><a href="#" className="hover:text-accent font-medium">LinkedIn</a></li>
                                <li><a href="#" className="hover:text-accent font-medium">YouTube</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-secondary flex flex-col md:flex-row justify-between gap-6 opacity-40">
                        <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 EVA by Inspired. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="/privacy" className="text-[10px] font-bold uppercase tracking-widest hover:text-accent">Privacy Policy</a>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Part of the Inspired Ventures Group</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
