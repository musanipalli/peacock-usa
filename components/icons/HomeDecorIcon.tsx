import React from 'react';

// Icon representing Home Decor (a vase)
export const HomeDecorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 3v18m-4.5-4.5v-1.5a4.5 4.5 0 014.5-4.5h3a4.5 4.5 0 014.5 4.5v1.5m-4.5-4.5h3" />
  </svg>
);