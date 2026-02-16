import React from 'react';

export const FlocLogo = ({ className = "size-8" }: { className?: string }) => (
    <div className={`flex items-baseline font-black leading-none text-primary ${className}`}>
        <span className="text-[1.1em] tracking-tighter italic">F</span>
        <div className="size-[0.25em] bg-primary rounded-full ml-[0.05em] mb-[0.1em]"></div>
    </div>
);
