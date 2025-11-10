import React from 'react';

// Icon representing men's clothing (a t-shirt)
export const ManIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v3.75m6 0V4.5m-6 0h6.636a1.5 1.5 0 011.42 2.121l-3.32 6.642a1.5 1.5 0 01-1.42 1.017H9.364a1.5 1.5 0 01-1.42-1.017L4.625 6.621A1.5 1.5 0 016.045 4.5H9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18.75h6" />
  </svg>
);