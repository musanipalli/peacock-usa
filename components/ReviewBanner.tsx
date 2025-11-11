import React, { useState, useEffect } from 'react';
import { Review } from '../types';

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg className={`w-5 h-5 ${filled ? 'text-peacock-marigold' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.363 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.362-2.44a1 1 0 00-1.176 0l-3.362 2.44c-.783.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69L9.049 2.927z" />
    </svg>
);


export const ReviewBanner: React.FC<{reviews: Review[]}> = ({ reviews }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (reviews.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [reviews.length]);

    if (reviews.length === 0) {
        return null;
    }

    return (
        <section className="bg-peacock-emerald/10 py-16">
            <div className="container mx-auto px-4 text-center text-peacock-dark">
                <h2 className="text-3xl font-bold font-serif text-center mb-10 text-peacock-dark">What Our Customers Say</h2>
                <div className="relative overflow-hidden h-64 flex items-center justify-center">
                    {reviews.map((review, index) => (
                        <div
                            key={review.id}
                            className={`absolute w-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <div className="flex justify-center mb-4">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} />)}
                            </div>
                            <p className="text-xl md:text-2xl font-serif italic mb-4 max-w-3xl mx-auto">"{review.text}"</p>
                            <p className="font-bold text-lg">{review.author}</p>
                            <p className="text-sm text-peacock-dark/70">{review.location}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};