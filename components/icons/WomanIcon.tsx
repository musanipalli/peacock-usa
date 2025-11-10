import React from 'react';

// Icon representing women's clothing (a dress)
export const WomanIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5c0-1.02.83-1.85 1.85-1.85h1.3a1.85 1.85 0 001.85-1.85V7.5a2.25 2.25 0 00-2.25-2.25H7.75A2.25 2.25 0 005.5 7.5v2.3c0 1.02.83 1.85 1.85 1.85h1.3c1.02 0 1.85.83 1.85 1.85V21" />
  </svg>
);