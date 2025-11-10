import React from 'react';

export const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l-2.257-4.286a.75.75 0 00-1.342-.244l-3.17 6.34a.75.75 0 00.244 1.342l6.838 2.28a.75.75 0 00.956-.516l1.3-5.22a.75.75 0 00-.516-.956z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21.75a3.375 3.375 0 01-3.375-3.375V6.75A3.375 3.375 0 013.75 3.375h1.5a3.375 3.375 0 013.375 3.375v1.5a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75V6.75a1.875 1.875 0 00-1.875-1.875H3.75A1.875 1.875 0 001.875 6.75v11.625c0 1.036.84 1.875 1.875 1.875h16.5A1.875 1.875 0 0022.125 18.375v-5.25a.75.75 0 011.5 0v5.25A3.375 3.375 0 0120.25 21.75H3.75z" />
  </svg>
);