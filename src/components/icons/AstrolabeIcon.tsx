import React from 'react';

interface AstrolabeIconProps {
  className?: string;
}

const AstrolabeIcon: React.FC<AstrolabeIconProps> = ({ className = '' }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 120 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Main astrolabe circular body */}
    <circle 
      cx="20" 
      cy="20" 
      r="18" 
      fill="none" 
      stroke="#0A93FF" 
      strokeWidth="1"
    />
    
    {/* Inner circle */}
    <circle 
      cx="20" 
      cy="20" 
      r="15" 
      fill="none" 
      stroke="#0A93FF" 
      strokeWidth="0.5" 
      strokeOpacity="0.8"
    />
    
    {/* Crosshairs */}
    <line 
      x1="2" 
      y1="20" 
      x2="38" 
      y2="20" 
      stroke="#0A93FF" 
      strokeWidth="0.5" 
    />
    <line 
      x1="20" 
      y1="2" 
      x2="20" 
      y2="38" 
      stroke="#0A93FF" 
      strokeWidth="0.5" 
    />
    
    {/* Diagonal lines */}
    <line 
      x1="6" 
      y1="6" 
      x2="34" 
      y2="34" 
      stroke="#0A93FF" 
      strokeWidth="0.5" 
      strokeOpacity="0.6" 
    />
    <line 
      x1="34" 
      y1="6" 
      x2="6" 
      y2="34" 
      stroke="#0A93FF" 
      strokeWidth="0.5" 
      strokeOpacity="0.6" 
    />
    
    {/* Degree markings around the edge */}
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1={20 + 18 * Math.cos((i * 15 * Math.PI) / 180)}
        y1={20 + 18 * Math.sin((i * 15 * Math.PI) / 180)}
        x2={20 + 16 * Math.cos((i * 15 * Math.PI) / 180)}
        y2={20 + 16 * Math.sin((i * 15 * Math.PI) / 180)}
        stroke="#0A93FF"
        strokeWidth="0.5"
      />
    ))}
    
    {/* Rotating arm */}
    <line 
      x1="20" 
      y1="20" 
      x2="20" 
      y2="5" 
      stroke="#0A93FF" 
      strokeWidth="1.5" 
    />
    <circle 
      cx="20" 
      cy="5" 
      r="1" 
      fill="#0A93FF" 
    />
    
    {/* Astrolabe handle */}
    <path 
      d="M20 38 L20 44 A3 3 0 0 0 23 47 H30 A3 3 0 0 0 33 44 V42" 
      stroke="#0A93FF" 
      strokeWidth="1" 
      fill="none" 
    />
    
    {/* Banner extension with stars */}
    <line 
      x1="40" 
      y1="20" 
      x2="120" 
      y2="20" 
      stroke="#0A93FF" 
      strokeWidth="0.5" 
      strokeDasharray="2 2" 
    />
    
    {/* Stars along the banner */}
    <circle cx="50" cy="15" r="1" fill="#0A93FF" className="twinkle-star" />
    <circle cx="70" cy="25" r="1" fill="#0A93FF" className="twinkle-star" />
    <circle cx="90" cy="15" r="1" fill="#0A93FF" className="twinkle-star" />
    <circle cx="110" cy="25" r="1" fill="#0A93FF" className="twinkle-star" />
    
    {/* Constellation lines */}
    <line x1="50" y1="15" x2="70" y2="25" stroke="#0A93FF" strokeWidth="0.2" strokeOpacity="0.5" />
    <line x1="70" y1="25" x2="90" y2="15" stroke="#0A93FF" strokeWidth="0.2" strokeOpacity="0.5" />
    <line x1="90" y1="15" x2="110" y2="25" stroke="#0A93FF" strokeWidth="0.2" strokeOpacity="0.5" />
  </svg>
);

export default AstrolabeIcon; 