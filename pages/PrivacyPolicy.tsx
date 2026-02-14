import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, ArrowLeft } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div data-theme="eva" className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-accent selection:text-white">
            <WebsiteNav />

            <header className="pt-32 pb-20 bg-secondary/30">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                        <Shield className="w-16 h-16 text-accent mx-auto mb-8" />
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-8 tracking-tighter">
                            Data <span className="text-accent italic">Privacy.</span>
                        </h1>
                        <p className="text-xl text-primary/70 font-medium">
                            How we protect your information at EVA Travel.
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="py-24 container mx-auto px-6 max-w-4xl space-y-12">
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-primary">1. Overview</h2>
                    <p className="text-primary/70 leading-relaxed">
                        At EVA Travel (trading name of Inspired Ventures Limited), we are committed to protecting and respecting your privacy. This policy explains how we collect and use your personal data.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-primary">2. Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-4 text-primary/70">
                        <li>Contact details (Name, Email, Phone Number)</li>
                        <li>Travel preferences and health information relevant to your trip</li>
                        <li>Emergency contact information</li>
                        <li>Passport and visa details (when required for trip documentation)</li>
                    </ul>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-primary">3. How We Use Your Data</h2>
                    <p className="text-primary/70 leading-relaxed">
                        We use your data to facilitate your bookings, ensure your safety during trips, and communicate community updates. We do NOT sell your data to third parties.
                    </p>
                </section>

                <section className="bg-accent/5 p-10 rounded-[3rem] border border-accent/10 space-y-4">
                    <h3 className="font-bold text-accent text-xl flex items-center gap-3">
                        <Lock className="w-6 h-6" /> Security Standards
                    </h3>
                    <p className="text-primary/70 text-sm leading-relaxed">
                        We use industry-standard encryption and secure storage systems. All financial transactions are protected through our partnership with independent trust accounts via Inspired Ventures.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-primary">4. Your Rights</h2>
                    <p className="text-primary/70 leading-relaxed">
                        You have the right to access, correct, or delete your personal information at any time. For any data-related inquiries, please contact us at info@evatravel.uk.
                    </p>
                </section>
            </main>

            <footer className="py-20 text-center text-primary/40 text-sm">
                <p>© 2026 EVA by Inspired. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
