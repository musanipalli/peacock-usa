import React from 'react';

export const PeacockLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 160 160"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Peacock Feather Emblem"
  >
    <defs>
      <radialGradient id="emerald" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#1ad4a1" />
        <stop offset="45%" stopColor="#0b8f57" />
        <stop offset="100%" stopColor="#0a5b34" />
      </radialGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fff6c7" />
        <stop offset="40%" stopColor="#f8d46b" />
        <stop offset="70%" stopColor="#e3b442" />
        <stop offset="100%" stopColor="#c08d1c" />
      </linearGradient>
      <linearGradient id="gold-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <filter id="crest-shadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
      </filter>
    </defs>
    <g filter="url(#crest-shadow)">
      <circle cx="80" cy="80" r="74" fill="url(#emerald)" />
      <g transform="translate(24 10) scale(0.75)">
        <path
          d="M80 150C30 115 20 70 46 26c5-8 12-22 16-24 5 2 12 16 16 24 26 44 16 89-8 124z"
          fill="url(#gold)"
          stroke="#c78f1f"
          strokeWidth="1.5"
        />
        <path
          d="M80 83c-19-6-23-31-8-51 2-3 5-8 8-11 3 3 6 9 8 13 12 26 5 43-8 49z"
          fill="#0e6e4d"
        />
        <path
          d="M80 52c-7-2-12-13-6-23 1-3 3-5 4-6 1 1 5 6 7 11 5 12 0 19-5 22z"
          fill="url(#gold)"
        />
        {[-34, -25, -16, -7, 2].map((offset, i) => (
          <path
            key={`left-${i}`}
            d={`M78 144C53 132 30 ${96 + offset} 12 ${70 + offset}`}
            fill="none"
            stroke="url(#gold)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
        {[34, 25, 16, 7, -2].map((offset, i) => (
          <path
            key={`right-${i}`}
            d={`M82 144C107 132 130 ${96 + offset} 148 ${70 + offset}`}
            fill="none"
            stroke="url(#gold)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
        <path
          d="M80 150V18"
          stroke="url(#gold-shadow)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
    </g>
  </svg>
);
