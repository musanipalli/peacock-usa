import React, { useState } from 'react';
import { Product, CartAction, Review } from '../types';

const StarIcon: React.FC<{ filled: boolean, className?: string, onClick?: () => void }> = ({ filled, className = 'w-5 h-5', onClick }) => (
    <svg className={`${className} ${filled ? 'text-peacock-marigold' : 'text-gray-300'} ${onClick ? 'cursor-pointer' : ''}`} fill="currentColor" viewBox="0 0 20 20" onClick={onClick}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.363 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.362-2.44a1 1 0 00-1.176 0l-3.362 2.44c-.783.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69L9.049 2.927z" />
    </svg>
);

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    reviews: Review[];
    onAddToCart: (product: Product, action: CartAction) => void;
    onAddReview: (productId: number, rating: number, text: string) => void;
    isReviewAllowed: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product, reviews, onAddToCart, onAddReview, isReviewAllowed }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [newReviewRating, setNewReviewRating] = useState(0);
    const [newReviewText, setNewReviewText] = useState('');

    if (!isOpen) return null;

    const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReviewRating > 0 && newReviewText.trim()) {
            onAddReview(product.id, newReviewRating, newReviewText);
            setNewReviewRating(0);
            setNewReviewText('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-in" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image Gallery */}
                        <div>
                            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                <img src={product.imageUrls[activeIndex]} alt={`${product.name} view ${activeIndex + 1}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex justify-center space-x-2 mt-4">
                                {product.imageUrls.map((url, index) => (
                                    <button key={index} onClick={() => setActiveIndex(index)} className={`w-16 h-16 rounded-md overflow-hidden border-2 ${index === activeIndex ? 'border-peacock-magenta' : 'border-transparent'}`}>
                                        <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-peacock-dark">{product.name}</h2>
                            <div className="flex items-center my-3">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < averageRating} />)}
                                </div>
                                <span className="text-gray-500 text-sm ml-2">({reviews.length} reviews)</span>
                            </div>
                            <p className="text-gray-600 mt-2">{product.description}</p>
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => onAddToCart(product, CartAction.Rent)}
                                    className="w-full bg-peacock-emerald text-white py-3 rounded-full hover:bg-peacock-sapphire transition-colors duration-300 font-bold flex justify-between items-center px-6"
                                >
                                    <span>Rent Now</span>
                                    <span className="text-lg">${product.rentPrice}</span>
                                </button>
                                <button
                                    onClick={() => onAddToCart(product, CartAction.Buy)}
                                    className="w-full bg-peacock-marigold text-white py-3 rounded-full hover:bg-peacock-magenta transition-colors duration-300 font-bold flex justify-between items-center px-6"
                                >
                                    <span>Buy Now</span>
                                    <span className="text-lg">${product.buyPrice}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-10 pt-6 border-t">
                        <h3 className="text-2xl font-serif font-bold text-peacock-dark mb-4">Customer Reviews</h3>
                        {isReviewAllowed && (
                             <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold mb-2">Leave a Review</h4>
                                <div className="flex items-center mb-2">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < newReviewRating} className="w-6 h-6" onClick={() => setNewReviewRating(i + 1)} />)}
                                </div>
                                <textarea 
                                    value={newReviewText} 
                                    onChange={(e) => setNewReviewText(e.target.value)}
                                    className="w-full p-2 border rounded-md" 
                                    placeholder="Share your thoughts..." 
                                    rows={3}
                                    required
                                ></textarea>
                                <button type="submit" className="mt-2 bg-peacock-magenta text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-peacock-sapphire">Submit Review</button>
                            </form>
                        )}
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {reviews.length > 0 ? reviews.map(review => (
                                <div key={review.id} className="border-b pb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} />)}
                                    </div>
                                    <p className="my-2 text-gray-700">"{review.text}"</p>
                                    <p className="text-sm font-semibold text-gray-800">{review.author} <span className="font-normal text-gray-500">- {review.location}</span></p>
                                </div>
                            )) : <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};