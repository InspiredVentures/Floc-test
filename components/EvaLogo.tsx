import React from 'react';

interface EvaLogoProps {
    className?: string;
    color?: string;
}

const EvaLogo: React.FC<EvaLogoProps> = ({ className = "h-10 w-auto", color = "currentColor" }) => {
    return (
        <svg
            viewBox="0 0 600 240"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* E - left and top/bottom bars */}
            <path
                d="M140 60 L50 60 L50 180 L140 180"
                stroke={color}
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* E - middle crossbar (Leaf) */}
            <path
                d="M50 120 Q85 95 120 120 Q85 145 50 120 Z"
                fill={color === "#ffffff" ? "#ffffff" : "#22c55e"} // Leaf green
            />
            {/* Heart Motif */}
            <path
                d="M130 50 C140 40 160 40 160 60 C160 80 140 85 130 80 L130 50 Z"
                fill={color === "#ffffff" ? "#ffffff" : "#bf2761"} // Heart pink unless white mode
            />

            {/* V - Mountain Peak Motif */}
            <path
                d="M200 60 L300 180 L400 60"
                stroke={color}
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M260 132 L300 100 L340 132"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
            />

            {/* A - Wave Motif */}
            <path
                d="M450 180 L525 60 L600 180"
                stroke={color}
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M485 140 Q505 120 525 140 T565 140"
                stroke={color === "#ffffff" ? "#ffffff" : "#63a8d0"} // Keep wave blue unless white mode
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
};

export default EvaLogo;
