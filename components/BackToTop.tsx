import React, { useState, useEffect } from 'react';

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-50 size-12 flex items-center justify-center rounded-full bg-primary text-background-dark shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all animate-in fade-in zoom-in duration-300"
            aria-label="Back to top"
        >
            <span className="material-symbols-outlined text-xl font-black">arrow_upward</span>
        </button>
    );
};

export default BackToTop;
