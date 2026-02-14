import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

const variants = {
    initial: { opacity: 0, y: 15, filter: 'blur(5px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -15, filter: 'blur(5px)' }
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Custom "Apple-like" ease
            className={`size-full ${className}`}
        >
            {children}
        </motion.div>
    );
};
