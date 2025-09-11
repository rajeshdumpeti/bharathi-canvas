import React from "react";

/**
 * Circular monogram “BC”
 * Usage: <LogoMonogram className="h-8 w-8 text-white" />
 */
const LogoMonogram = ({ className = "h-8 w-8 text-white", title = "Bharathi's Canvas" }) => (
    <svg
        viewBox="0 0 48 48"
        role="img"
        aria-label={title}
        className={className}
    >
        <circle cx="24" cy="24" r="22" className="fill-current/10" />
        <circle cx="24" cy="24" r="18" className="stroke-current" strokeWidth="2" fill="none" />
        <path
            d="M18 30V18h5.5c2.8 0 4.5 1.7 4.5 4 0 2.4-1.7 4-4.5 4H18m10-8h3c2.5 0 4 1.5 4 4s-1.5 4-4 4h-3"
            className="stroke-current"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);

export default LogoMonogram;
