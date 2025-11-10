import React from 'react';

// A high-fidelity vector representation of the golden peacock feather logo.
// This version uses multiple layers, detailed paths, and complex gradients
// to mimic the 3D, metallic appearance of the provided image.
export const PeacockLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-label="Peacock Feather Logo">
    <defs>
      <linearGradient id="gold-main" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFEEA1" />
        <stop offset="30%" stopColor="#FAD65D" />
        <stop offset="60%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
      <linearGradient id="gold-highlight" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7"/>
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="cream-main" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FEFDD5" />
        <stop offset="100%" stopColor="#FDF4B9" />
      </linearGradient>
       <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
      </filter>
    </defs>
    <g filter="url(#soft-shadow)">
        {/* Base Feather Shape */}
        <path fill="url(#gold-main)" d="M60 115.5C22.2 88.5 28.2 55.5 54.6 15.9 56.4 12.3 58.2 6.3 60 4.5c1.8 1.8 3.6 7.8 5.4 11.4 26.4 39.6 32.4 72.6-4.8 99.6z"/>
        
        {/* Dark Teal Eye */}
        <path fill="#046355" d="M60 55.5c-15.6-4.8-19.2-25.2-6.6-40.8 1.2-1.2 3-4.8 4.2-6.6 2.4 3.6 4.8 9 6 12 10.8 21.6 4.8 40.8-3.6 45.4z"/>
        
        {/* Cream Center */}
        <path fill="url(#cream-main)" d="M60 34.5c-6-1.2-9.6-10.8-4.8-19.2 1.2-2.4 2.4-3.6 3-4.2.6.6 3 4.2 4.2 7.2 4.8 10.8.6 18-2.4 20.4z"/>
        
        {/* Feather Barbs with stroke for definition */}
        <g stroke="#A9811A" strokeWidth="0.5" fill="url(#gold-main)">
            {/* Left */}
            <path d="M59.5 112C44.5 106, 29.5 94, 14.5 76z"/>
            <path d="M59.5 103C44.5 97, 29.5 85, 14.5 67z"/>
            <path d="M59.5 94C44.5 88, 29.5 76, 17.5 58z"/>
            <path d="M59.5 85C44.5 79, 32.5 67, 23.5 52z"/>
            <path d="M59.5 76C44.5 70, 35.5 61, 29.5 49z"/>
            {/* Right */}
            <path d="M60.5 112C75.5 106, 90.5 94, 105.5 76z"/>
            <path d="M60.5 103C75.5 97, 90.5 85, 105.5 67z"/>
            <path d="M60.5 94C75.5 88, 90.5 76, 102.5 58z"/>
            <path d="M60.5 85C75.5 79, 87.5 67, 96.5 52z"/>
            <path d="M60.5 76C75.5 70, 84.5 61, 90.5 49z"/>
        </g>
        
        {/* Central Rachis/Stem Highlight */}
        <path fill="url(#gold-highlight)" d="M60 115.5C58.2 88.5 58.2 55.5 60 15.9V4.5c1.8 11.4 1.8 44.4 0 71.4V115.5z" opacity="0.8"/>
    </g>
  </svg>
);
