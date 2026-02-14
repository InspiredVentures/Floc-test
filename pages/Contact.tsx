import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

const Contact: React.FC = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div data-theme="eva" className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-accent selection:text-white">
            <WebsiteNav />

            <header className="pt-32 pb-20 bg-secondary/30">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                        <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Get in Touch</span>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-8 tracking-tighter">
                            Let's Talk <span className="text-accent italic">Impact.</span>
                        </h1>
                        <p className="text-xl text-primary/70 font-medium">
                            Have questions about our trips or community? We're here to help.
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="py-24 container mx-auto px-6 max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-primary/5"
                    >
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-widest text-primary/60">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-secondary/10 border-none rounded-2xl focus:ring-2 focus:ring-accent focus:bg-white transition-all outline-none"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-widest text-primary/60">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-6 py-4 bg-secondary/10 border-none rounded-2xl focus:ring-2 focus:ring-accent focus:bg-white transition-all outline-none"
                                        placeholder="jane@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-widest text-primary/60">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="w-full px-6 py-4 bg-secondary/10 border-none rounded-2xl focus:ring-2 focus:ring-accent focus:bg-white transition-all outline-none resize-none"
                                        placeholder="Tell us about your interests..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-accent text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-primary transition-all shadow-lg flex items-center justify-center gap-3"
                                >
                                    <span>Send Message</span>
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-20 space-y-6">
                                <CheckCircle className="w-20 h-20 text-accent mx-auto" />
                                <h3 className="text-3xl font-heading font-bold text-primary">Message Sent!</h3>
                                <p className="text-primary/60 text-lg">Thank you for reaching out. Sheila or a member of the team will get back to you shortly.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-accent font-bold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Contact Info */}
                    <div className="space-y-12 py-8">
                        <div>
                            <h2 className="text-3xl font-heading font-bold text-primary mb-8 underline decoration-accent/30 decoration-4 underline-offset-8">Contact Info</h2>
                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="w-14 h-14 bg-secondary/30 rounded-2xl flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary text-lg">Email Us</h4>
                                        <p className="text-primary/60">info@evatravel.uk</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-14 h-14 bg-secondary/30 rounded-2xl flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary text-lg">Call Us</h4>
                                        <p className="text-primary/60">+44 (0) 123 456 789</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-14 h-14 bg-secondary/30 rounded-2xl flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary text-lg">Our Base</h4>
                                        <p className="text-primary/60">London / Global Office <br /> Part of Inspired Ventures Limited</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-accent/5 p-8 rounded-[2.5rem] border border-accent/10">
                            <h4 className="font-heading font-bold text-accent mb-4">Financial Protection</h4>
                            <p className="text-primary/70 text-sm leading-relaxed">
                                EVA Traves is a trading name of Inspired Ventures Limited. All funds are securely managed through independent trust accounts for your peace of mind.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-20 text-center text-primary/40 text-sm">
                <p>© 2026 EVA by Inspired. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Contact;
