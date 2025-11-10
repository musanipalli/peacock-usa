import React from 'react';

// Icon representing Pooja Items (a diya lamp)
export const PoojaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214C14.252 5.042 13.12 4.93 12 4.93c-1.259 0-2.5.124-3.678.355M15.362 5.214a3 3 0 01.83 2.18" />
  </svg>
);