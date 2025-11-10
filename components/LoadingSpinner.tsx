import React from 'react';

export const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-peacock-magenta"></div>
        <p className="text-lg font-semibold text-peacock-dark">Loading...</p>
    </div>
);