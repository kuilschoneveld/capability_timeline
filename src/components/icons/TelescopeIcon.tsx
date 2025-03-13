import React from 'react';

interface TelescopeIconProps {
  className?: string;
}

const TelescopeIcon: React.FC<TelescopeIconProps> = ({ className = '' }) => (
  <svg 
    width="100%" 
    height="100%" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Simple telescope design, matching the drawing more closely */}
    <g transform="rotate(-15, 12, 12)">
      {/* Large telescope body */}
      <rect 
        x="12" 
        y="8" 
        width="8" 
        height="4" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="0.5" 
      />
      
      {/* Middle section */}
      <rect 
        x="8" 
        y="9" 
        width="4" 
        height="2" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="0.5" 
      />
      
      {/* Eyepiece */}
      <rect 
        x="4" 
        y="9.5" 
        width="4" 
        height="1" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="0.5" 
      />
      
      {/* Stand */}
      <line 
        x1="10" 
        y1="11" 
        x2="10" 
        y2="16" 
        stroke="currentColor" 
        strokeWidth="1" 
      />
      
      {/* Star */}
      <circle 
        cx="19" 
        cy="6" 
        r="1" 
        fill="currentColor" 
        className="telescope-star star-1" 
      />
    </g>
  </svg>
);

export default TelescopeIcon; 