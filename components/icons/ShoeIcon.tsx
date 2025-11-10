import React from 'react';

// Icon representing shoes
export const ShoeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V8.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75l9-3.75 9 3.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75v5.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375" />
    </svg>
);