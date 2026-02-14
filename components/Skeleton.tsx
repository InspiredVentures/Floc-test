import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
    const baseClasses = "animate-pulse bg-white/5";
    const variantClasses = {
        rectangular: "rounded-xl",
        circular: "rounded-full",
        text: "rounded-md h-4"
    }[variant];

    return <div className={`${baseClasses} ${variantClasses} ${className}`} />;
};
