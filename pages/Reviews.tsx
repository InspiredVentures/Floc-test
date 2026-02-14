
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowLeft, MessageSquare } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

const Reviews: React.FC = () => {
    const navigate = useNavigate();

    const testimonials = [
        {
            name: "Sarah J.",
            trip: "Tanzania Tour 2025",
            text: "An absolutely life-changing experience. Connecting with the local community in Tanzania while enjoying the breathtaking landscapes was more than I ever expected. The group was wonderful and the support was top-notch.",
            stars: 5
        },
        {
            name: "Mark T.",
            trip: "Northern Ireland Tour 2024",
            text: "The 'Nooks and Crannies' tour was a delight. Authentic, personal, and perfectly paced for those of us who want to see the real parts of a place without the tourist traps. Highly recommended!",
            stars: 5
        },
        {
            name: "Linda M.",
            trip: "Borneo Highlights",
            text: "I was nervous about traveling as a solo woman over 50, but EVA made me feel at home immediately. I've made friends for life and the impact we had in Borneo will stay with me forever.",
            stars: 5
        }
    ];

    return (
        <div data-theme="eva" className="min-h-screen bg-[#FCFBF5] text-[#14532D] font-body antialiased selection:bg-accent selection:text-white">
            <WebsiteNav />

            <header className="pt-32 pb-20 bg-secondary/30">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                        <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Traveler Stories</span>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-[#14532D] mb-8 tracking-tighter uppercase whitespace-pre-line">
                            What Our {'\n'}<span className="text-accent italic">Community</span> Says.
                        </h1>
                        <p className="text-xl text-[#14532D]/70 font-medium italic">
                            Real stories from the people who make EVA special.
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="py-24 container mx-auto px-6 max-w-6xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-10 rounded-[3rem] shadow-xl border border-[#14532D]/5 relative group hover:shadow-2xl transition-all"
                        >
                            <Quote className="absolute top-8 right-8 w-12 h-12 text-[#14532D]/5 group-hover:text-accent/10 transition-colors" />
                            <div className="flex gap-1 mb-6">
                                {[...Array(review.stars)].map((_, s) => (
                                    <Star key={s} className="w-5 h-5 fill-accent text-accent" />
                                ))}
                            </div>
                            <p className="text-[#14532D]/80 leading-relaxed mb-8 italic">"{review.text}"</p>
                            <div className="pt-6 border-t border-[#14532D]/10">
                                <h4 className="font-bold text-[#14532D] text-lg">{review.name}</h4>
                                <p className="text-accent text-sm font-bold uppercase tracking-widest">{review.trip}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter-style CTA */}
                <section className="mt-40 bg-[#14532D] text-white rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10">
                        <MessageSquare className="w-16 h-16 text-accent mx-auto mb-8" />
                        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight uppercase">Inspired by You.</h2>
                        <p className="text-white/70 max-w-2xl mx-auto text-lg mb-10 italic leading-relaxed">
                            Our community is built on authentic shared experiences. Every journey becomes a story that connects us.
                        </p>
                        <button className="bg-accent text-white px-10 py-5 rounded-full font-bold text-lg uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-xl">
                            Submit Your Review
                        </button>
                    </div>
                </section>
            </main>

            <footer className="py-20 text-center text-[#14532D]/40 text-sm">
                <p>© 2026 EVA by Inspired. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Reviews;
