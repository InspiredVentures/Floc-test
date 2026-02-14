import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

import { JOURNAL_POSTS } from '../data/journal_posts';

const Blog: React.FC = () => {
    const navigate = useNavigate();
    const posts = JOURNAL_POSTS;

    return (
        <div data-theme="eva" className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-accent selection:text-white">
            <WebsiteNav />

            <header className="pt-32 pb-20 bg-secondary/30">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                        <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4 block">The EVA Journal</span>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-8 tracking-tighter">
                            Stories of <span className="text-accent italic">Journey.</span>
                        </h1>
                        <p className="text-xl text-primary/70 font-medium">
                            Weekly updates, travel tips, and community impact stories.
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="py-24 container mx-auto px-6 max-w-6xl">
                <div className="space-y-20">
                    {posts.map((post, i) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            className="flex flex-col md:flex-row gap-12 items-center group cursor-pointer"
                        >
                            <div className="w-full md:w-2/5 aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                                <img
                                    src={post.img}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={post.title}
                                />
                            </div>
                            <div className="w-full md:w-3/5 space-y-6">
                                <span className="text-accent text-xs font-black uppercase tracking-[0.2em]">{post.category}</span>
                                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary hover:text-accent transition-colors">
                                    {post.title}
                                </h2>
                                <div className="flex items-center gap-6 text-sm text-primary/50 font-bold">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {post.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Sheila Fitzgerald
                                    </div>
                                </div>
                                <p className="text-primary/70 text-lg leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <button
                                    onClick={() => navigate(`/blog/${post.slug}`)}
                                    className="flex items-center gap-2 text-accent font-black uppercase tracking-widest text-sm group-hover:gap-4 transition-all"
                                >
                                    Read Full Story
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Newsletter */}
                <section className="mt-40 bg-secondary/30 rounded-[4rem] p-12 md:p-20 text-center">
                    <h3 className="text-3xl font-heading font-bold text-primary mb-6">Stay in the Loop</h3>
                    <p className="text-primary/60 max-w-xl mx-auto mb-10">
                        Join 2,000+ other travelers receiving weekly stories and impact updates.
                    </p>
                    <form className="max-w-md mx-auto flex gap-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="flex-1 px-8 py-4 rounded-full border-none focus:ring-2 focus:ring-accent outline-none"
                        />
                        <button className="bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-primary transition-all">
                            Join
                        </button>
                    </form>
                </section>
            </main>

            <footer className="py-20 text-center text-primary/40 text-sm">
                <p>© 2026 EVA by Inspired. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Blog;
