import React from "react";

/**
 * Wordmark (text, not an image) with a tiny tagline.
 * Inherits color from parent; tweak colors with Tailwind classes around it.
 * Usage: <LogoWordmark />
 */

type Props = { className?: string };

const LogoWordmark: React.FC<Props> = ({ className }) => (
  <div className={`leading-tight ${className}`}>
    <div className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
      Bharathi’s <span className="text-blue-300">Canvas</span>
    </div>
    <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/60">
      Your Personal Board
    </div>
  </div>
);

export default LogoWordmark;
