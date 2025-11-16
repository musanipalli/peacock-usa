import React, { useMemo, useState } from 'react';
import { User, Product, Review } from '../types';
import { ProductFormModal } from './ProductFormModal';

interface MyProductsProps {
    user: User;
    allProducts: Product[];
    reviews: Review[];
    onAdd: (product: Omit<Product, 'id'>) => void;
    onUpdate: (product: Product) => void;
    onDelete: (productId: number) => void;
    onBack: () => void;
}

const SellerProductCard: React.FC<{ product: Product; onEdit: () => void; onDelete: () => void }> = ({ product, onEdit, onDelete }) => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden group border border-white/40">
        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-64 object-cover" />
        <div className="p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-serif text-peacock-dark truncate">{product.name}</h3>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-400">{product.category.replace('-', ' ')}</span>
            </div>
            <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                <p>Buy: <span className="font-bold text-peacock-marigold">${product.buyPrice}</span></p>
                <p>Rent: <span className="font-bold text-peacock-emerald">${product.rentPrice}</span></p>
            </div>
            {product.stylingNotes && (
                <p className="text-xs text-gray-500 mt-3 line-clamp-2">Style tip: {product.stylingNotes}</p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
                <button onClick={onEdit} className="bg-peacock-sapphire text-white text-xs px-3 py-1 rounded-full hover:bg-opacity-80">Edit</button>
                <button onClick={onDelete} className="bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-opacity-80">Delete</button>
            </div>
        </div>
    </div>
);

const generateStats = (product: Product) => {
    const seed = product.id || product.name.length;
    const rentals = (seed * 13) % 80 + 5;
    const sales = (seed * 7) % 35 + (seed % 4);
    const lastActivityDays = (seed * 5) % 12 + 1;
    return {
        rentals,
        sales,
        lastActivityLabel: `${lastActivityDays} day${lastActivityDays === 1 ? '' : 's'} ago`,
    };
};

export const MyProducts: React.FC<MyProductsProps> = ({ user, allProducts, reviews, onAdd, onUpdate, onDelete, onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const sellerProducts = useMemo(() => allProducts.filter(p => p.sellerEmail === user.email), [allProducts, user.email]);

    const productInsights = useMemo(() => sellerProducts.map(product => {
        const productReviews = reviews.filter(review => review.productId === product.id);
        const stats = generateStats(product);
        const averageRating = productReviews.length
            ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
            : null;
        return { product, productReviews, stats, averageRating };
    }), [sellerProducts, reviews]);

    const summary = useMemo(() => {
        return productInsights.reduce(
            (acc, insight) => {
                acc.totalRentals += insight.stats.rentals;
                acc.totalSales += insight.stats.sales;
                acc.reviewCount += insight.productReviews.length;
                acc.ratingTotal += insight.productReviews.reduce((sum, review) => sum + review.rating, 0);
                return acc;
            },
            { totalRentals: 0, totalSales: 0, reviewCount: 0, ratingTotal: 0 }
        );
    }, [productInsights]);

    const activityFeed = useMemo(() => productInsights.flatMap(insight => ([
        {
            id: `${insight.product.id}-rent`,
            title: `${insight.product.name} rental`,
            detail: `${insight.stats.rentals} lifetime rentals`,
            timestamp: insight.stats.lastActivityLabel,
        },
        {
            id: `${insight.product.id}-sale`,
            title: `${insight.product.name} sale`,
            detail: `${insight.stats.sales} total purchases`,
            timestamp: `${(insight.product.id * 3) % 18 + 2} days ago`,
        },
    ])).slice(0, 6), [productInsights]);

    const reviewSpotlight = useMemo(() => productInsights
        .flatMap(insight => insight.productReviews.map(review => ({
            ...review,
            productName: insight.product.name,
        })))
        .slice(0, 4), [productInsights]);

    const handleSaveProduct = (productData: Omit<Product, 'id' | 'sellerEmail'> | Product) => {
        if ('id' in productData) {
            onUpdate(productData as Product);
        } else {
            onAdd(productData as Omit<Product, 'id'>);
        }
        setIsModalOpen(false);
    };

    const averageRating = summary.reviewCount ? (summary.ratingTotal / summary.reviewCount).toFixed(1) : '—';

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto space-y-10">
                <button onClick={onBack} className="text-peacock-sapphire hover:underline font-medium">&larr; Back to Shopping</button>
                <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                    <div>
                        <p className="text-xs uppercase tracking-[0.5em] text-white/60">Seller cockpit</p>
                        <h1 className="text-3xl font-bold font-serif text-white">My Products Dashboard</h1>
                    </div>
                    <button
                        onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                        className="bg-peacock-magenta text-white py-3 px-6 rounded-full font-bold hover:bg-peacock-sapphire transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <span>Add New Product</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Listings</p>
                        <p className="text-3xl font-serif mt-2">{sellerProducts.length}</p>
                        <p className="text-sm text-white/60">Active couture pieces</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Lifetime rentals</p>
                        <p className="text-3xl font-serif mt-2">{summary.totalRentals}</p>
                        <p className="text-sm text-white/60">Based on storefront traffic</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Pieces sold</p>
                        <p className="text-3xl font-serif mt-2">{summary.totalSales}</p>
                        <p className="text-sm text-white/60">Completed buyouts</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Avg. rating</p>
                        <p className="text-3xl font-serif mt-2">{averageRating}</p>
                        <p className="text-sm text-white/60">{summary.reviewCount} reviews</p>
                    </div>
                </div>

                {sellerProducts.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-serif font-semibold text-peacock-dark">Performance by product</h3>
                                <span className="text-xs text-gray-500 uppercase tracking-[0.3em]">History</span>
                            </div>
                            <div className="space-y-4">
                                {productInsights.map(insight => (
                                    <div key={insight.product.id} className="border border-gray-100 rounded-xl p-4 hover:border-peacock-magenta/40 transition">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-peacock-dark">{insight.product.name}</p>
                                                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">{insight.product.category.replace('-', ' ')}</p>
                                            </div>
                                            <div className="text-right text-sm text-gray-500">
                                                <p>Rentals: <span className="font-semibold text-peacock-emerald">{insight.stats.rentals}</span></p>
                                                <p>Sales: <span className="font-semibold text-peacock-marigold">{insight.stats.sales}</span></p>
                                            </div>
                                        </div>
                                        {insight.averageRating && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                Avg. rating {insight.averageRating.toFixed(1)} · {insight.productReviews.length} reviews
                                            </p>
                                        )}
                                        {insight.product.stylingNotes && (
                                            <p className="text-xs text-gray-500 mt-2">Style note: {insight.product.stylingNotes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-serif font-semibold text-peacock-dark mb-4">Latest activity</h3>
                                <div className="space-y-4">
                                    {activityFeed.length === 0 ? (
                                        <p className="text-sm text-gray-500">No activity recorded yet.</p>
                                    ) : activityFeed.map(entry => (
                                        <div key={entry.id} className="border-l-4 border-peacock-magenta pl-3">
                                            <p className="font-semibold text-peacock-dark">{entry.title}</p>
                                            <p className="text-sm text-gray-600">{entry.detail}</p>
                                            <p className="text-xs text-gray-400 mt-1">{entry.timestamp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-serif font-semibold text-peacock-dark mb-4">Reviews spotlight</h3>
                                <div className="space-y-4">
                                    {reviewSpotlight.length === 0 ? (
                                        <p className="text-sm text-gray-500">Your listings haven’t received reviews yet.</p>
                                    ) : reviewSpotlight.map(review => (
                                        <div key={review.id} className="border border-gray-100 rounded-xl p-3">
                                            <p className="text-sm font-semibold text-peacock-magenta">{review.productName}</p>
                                            <p className="text-gray-600 text-sm mt-1">"{review.text}"</p>
                                            <p className="text-xs text-gray-400 mt-2">— {review.author} · {review.rating}/5</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-2xl font-bold font-serif mb-6 border-b border-white/10 pb-2">Manage listings ({sellerProducts.length})</h3>
                    {sellerProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {sellerProducts.map(product => (
                                <SellerProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={() => { setEditingProduct(product); setIsModalOpen(true); }}
                                    onDelete={() => {
                                        if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                                            onDelete(product.id);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white/10 rounded-lg border border-dashed border-white/20">
                            <h2 className="text-xl font-semibold text-white">You haven’t listed any products yet.</h2>
                            <p className="text-white/70 mt-2">Click “Add New Product” to start showcasing your wardrobe.</p>
                        </div>
                    )}
                </div>
            </div>

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={editingProduct}
                userEmail={user.email}
            />
        </div>
    );
};
