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
            {/* E - with Leaf Motif */}
            <path
                d="M140 60 H50 V180 H140 M50 120 H120"
                stroke={color}
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M130 50 C140 40 160 40 160 60 C160 80 140 85 130 80 L130 50"
                fill={color === "#ffffff" ? "#ffffff" : "#14532D"} // Keep leaf green unless white mode
                style={{ opacity: 0.8 }}
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
                d="M485 140 Q525 120 565 140"
                stroke={color === "#ffffff" ? "#ffffff" : "#007FFF"} // Keep wave blue unless white mode
                strokeWidth="12"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default EvaLogo;
