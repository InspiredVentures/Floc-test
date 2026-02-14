import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, Globe, ArrowLeft, ArrowRight } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

const About: React.FC = () => {
    const navigate = useNavigate();

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div data-theme="eva" className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-accent selection:text-white">
            <WebsiteNav />

            {/* Hero Section */}
            <header className="pt-32 pb-20 bg-secondary/30 relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4 block">The EVA Story</span>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-8 tracking-tighter">
                            Adventure with <span className="text-accent italic">Purpose.</span>
                        </h1>
                        <p className="text-xl text-primary/70 leading-relaxed font-medium">
                            EVA (Ethical Volunteer Adventures) was born from a simple belief: that travel should be as much about what you leave behind as what you take away.
                        </p>
                    </motion.div>
                </div>
                {/* Decorative SVG elements */}
                <div className="absolute top-20 left-10 opacity-10 animate-pulse">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                        <path d="M50 20 C60 10 80 10 80 30 C80 50 60 55 50 50 L50 20" fill="#14532D" />
                    </svg>
                </div>
            </header>

            {/* Content Sections */}
            <main className="py-20 container mx-auto px-6 max-w-5xl space-y-32">
                {/* Origins */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <h2 className="text-3xl font-heading font-bold text-primary mb-6">Our Origins</h2>
                        <div className="space-y-4 text-primary/80 leading-relaxed">
                            <p>
                                Founded by Sheila Fitzgerald, EVA (Ethical Volunteer Adventures) by Inspired is the culmination of decades of experience in the travel industry and a lifelong passion for community development.
                            </p>
                            <p>
                                We recognized that the "young at heart" community—those over 40 and 50—were looking for more than just sightseeing. They wanted connection, authenticity, and the chance to contribute their skills to meaningful journeys. Most of our guests arrive as solo travellers but leave as a firm part of the EVA community.
                            </p>
                        </div>
                    </motion.div>
                    <div className="relative">
                        <img
                            src="/images/eva/sa-conservation-hero.jpg"
                            alt="Origins"
                            className="rounded-[3rem] shadow-2xl skew-y-2"
                        />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-full -z-10 blur-2xl opacity-20"></div>
                    </div>
                </section>

                {/* Financial Protection & Trust */}
                <section className="bg-white rounded-[4rem] p-12 md:p-20 shadow-xl border border-primary/5 text-center">
                    <Shield className="w-16 h-16 text-accent mx-auto mb-8" />
                    <h2 className="text-3xl font-heading font-bold text-primary mb-6">Your Trust, Our Priority</h2>
                    <p className="text-lg text-primary/70 max-w-2xl mx-auto mb-10">
                        EVA by Inspired is a trading name of Inspired Ventures Limited (Company No: 08343883). We ensure full financial protection for our travellers through independent trust accounts.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                        <div className="bg-primary/5 px-6 py-3 rounded-xl font-bold text-primary italic">Inspired Ventures Partners</div>
                        <div className="bg-primary/5 px-6 py-3 rounded-xl font-bold text-primary italic">Financial Protection Guaranteed</div>
                    </div>
                </section>

                {/* Core Pillars */}
                <section className="space-y-12">
                    <h2 className="text-4xl font-heading font-bold text-primary text-center">What Makes Us EVA</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Users className="w-8 h-8" />,
                                title: "Social Connection",
                                desc: "Arrive as a solo traveler, leave as part of a lifelong community. Our trips are designed for the vibrant over-40s who value meaningful human connection."
                            },
                            {
                                icon: <Heart className="w-8 h-8" />,
                                title: "Purposeful Impact",
                                desc: "Every trip includes hands-on volunteering. Whether it's building coops or tracking tigers, you'll leave a positive, lasting legacy."
                            },
                            {
                                icon: <Globe className="w-8 h-8" />,
                                title: "Authentic Discovery",
                                desc: "Get off the beaten track. We prioritize local homestays, indigenous-led tours, and genuine cultural immersion over generic tourism."
                            }
                        ].map((pillar, i) => (
                            <div key={i} className="bg-secondary/20 p-10 rounded-[2.5rem] border border-primary/5 hover:bg-white hover:shadow-xl transition-all group">
                                <div className="text-accent mb-6 group-hover:scale-110 transition-transform">{pillar.icon}</div>
                                <h3 className="text-xl font-heading font-bold text-primary mb-4">{pillar.title}</h3>
                                <p className="text-primary/70">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Call to Action */}
            <section className="bg-primary text-white py-24 rounded-[5rem] mx-6 mb-20 overflow-hidden relative">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8">Ready to Write Your <br /> <span className="text-accent italic">Next Chapter?</span></h2>
                    <button
                        onClick={() => navigate('/discover')}
                        className="w-full py-5 bg-accent rounded-2xl font-black text-white uppercase tracking-widest shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span>Start Your Adventure</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="absolute inset-0 opacity-10">
                    <img src="/images/eva/whale-shark-hero.jpg" className="w-full h-full object-cover" alt="Background" />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 text-center text-primary/40 text-sm">
                <p>© 2026 EVA by Inspired. All rights reserved.</p>
                <div className="mt-4 flex justify-center gap-6 font-bold uppercase tracking-tighter">
                    <a href="/privacy" className="hover:text-accent">Privacy Policy</a>
                    <a href="/contact" className="hover:text-accent">Contact</a>
                </div>
            </footer>
        </div>
    );
};

export default About;
