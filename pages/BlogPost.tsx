import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';
import { JOURNAL_POSTS } from '../data/journal_posts';
import { sanitizeHTML } from '../lib/sanitizer';

const BlogPost: React.FC = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const post = JOURNAL_POSTS.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">Article Not Found</h2>
                    <button onClick={() => navigate('/blog')} className="text-accent hover:underline">
                        Return to Journal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div data-theme="eva" className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-accent selection:text-white">
            <WebsiteNav />

            {/* Hero Section */}
            <header className="relative h-[60vh] min-h-[500px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 pb-20 pt-32 bg-gradient-to-t from-background to-transparent">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <button
                                onClick={() => navigate('/blog')}
                                className="flex items-center gap-2 text-white/80 hover:text-accent transition-colors text-xs font-black uppercase tracking-widest mb-8"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Journal
                            </button>

                            <span className="inline-block px-4 py-1.5 bg-accent/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                {post.category}
                            </span>

                            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex items-center gap-8 text-white/80 text-sm font-bold">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {post.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {post.author}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="py-20 container mx-auto px-6 max-w-3xl">
                <article
                    className="prose prose-lg prose-p:text-primary/70 prose-headings:font-heading prose-headings:font-bold prose-headings:text-primary prose-a:text-accent max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
                />

                {/* Share / Footer */}
                <div className="mt-20 pt-10 border-t border-primary/10 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/blog')}
                        className="text-primary/40 font-bold hover:text-accent transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Stories
                    </button>

                    <button className="flex items-center gap-2 text-primary/40 font-bold hover:text-accent transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share Article
                    </button>
                </div>
            </main>

            <footer className="py-20 text-center text-primary/40 text-sm border-t border-primary/5 mt-20">
                <p>© 2026 EVA by Inspired. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default BlogPost;
