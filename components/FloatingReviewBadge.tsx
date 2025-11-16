import React, { useEffect, useState } from 'react';
import { Review } from '../types';

const StarRow: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex gap-0.5 text-peacock-marigold">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < rating ? 'opacity-100' : 'opacity-30'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.363 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.362-2.44a1 1 0 00-1.176 0l-3.362 2.44c-.783.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69L9.049 2.927z" />
            </svg>
        ))}
    </div>
);

export const FloatingReviewBadge: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (reviews.length === 0) return;
        const timer = setInterval(() => setIndex((prev) => (prev + 1) % reviews.length), 7000);
        return () => clearInterval(timer);
    }, [reviews.length]);

    if (reviews.length === 0) return null;

    const review = reviews[index];

    return (
        <div className="fixed bottom-5 right-5 z-50 w-72 rounded-2xl border border-white/20 bg-white/95 p-4 text-peacock-dark shadow-2xl backdrop-blur-md hidden md:block">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-peacock-sapphire mb-2">
                <span>Community love</span>
                <span>{index + 1}/{reviews.length}</span>
            </div>
            <StarRow rating={review.rating} />
            <p className="mt-3 text-sm text-peacock-dark/80 italic">"{review.text}"</p>
            <p className="mt-3 text-sm font-semibold">{review.author}</p>
            <p className="text-xs text-peacock-dark/60">{review.location}</p>
        </div>
    );
};
