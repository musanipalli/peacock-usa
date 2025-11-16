import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { LoginModal } from './components/LoginModal';
import { OrderHistory } from './components/OrderHistory';
import { Profile } from './components/Profile';
import { MyProducts } from './components/MyProducts';
import { VideoGenerator } from './components/VideoGenerator';
import { ReviewBanner } from './components/ReviewBanner';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Toast } from './components/Toast';
import { Hero } from './components/Hero';
import { BrandShowcase } from './components/BrandShowcase';
import { FloatingReviewBadge } from './components/FloatingReviewBadge';
import { Product, Review, CartItem, User, UserType, CartAction, Category, ShippingDetails } from './types';
import { backend } from './services/backend';
import { PRODUCTS as SAMPLE_PRODUCTS, REVIEWS as SAMPLE_REVIEWS } from './constants';

type Page = 'home' | 'checkout' | 'orderHistory' | 'profile' | 'myProducts' | 'videoGenerator';

const App: React.FC = () => {
    // State management
    const [page, setPage] = useState<Page>('home');
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [user, setUser] = useState<User | null>(null);
    const [userType, setUserType] = useState<UserType | null>(null);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [toast, setToast] = useState({ show: false, message: '' });
    const [isOfflineMode, setIsOfflineMode] = useState(false);
    const [connectionWarning, setConnectionWarning] = useState<string | null>(null);

    const showToast = useCallback((message: string) => {
        setToast({ show: true, message });
    }, []);

    const loadSampleData = useCallback(() => {
        setProducts(SAMPLE_PRODUCTS);
        setReviews(SAMPLE_REVIEWS);
    }, []);

    const ensureOnline = useCallback(() => {
        if (!isOfflineMode) return true;
        showToast('This feature is unavailable while using sample data.');
        return false;
    }, [isOfflineMode, showToast]);

    // Data fetching
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setIsOfflineMode(false);
            setConnectionWarning(null);
            const [productsData, reviewsData] = await Promise.all([
                backend.getProducts(),
                backend.getReviews()
            ]);
            setProducts(productsData);
            setReviews(reviewsData);
        } catch (err: any) {
            const warningMessage = 'Unable to reach the backend. Showing sample catalog data instead.';
            loadSampleData();
            setIsOfflineMode(true);
            setConnectionWarning(warningMessage);
            showToast(warningMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [loadSampleData, showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLoginSuccess = (loggedInUser: User, type: UserType) => {
        setUser(loggedInUser);
        setUserType(type);
        setSelectedCategory(null);
        setPage(type === 'seller' ? 'myProducts' : 'home');
        showToast(`Welcome, ${loggedInUser.name}!`);
    };
    
    const handleLogout = () => {
        setUser(null);
        setUserType(null);
        setPage('home');
        showToast('You have been logged out.');
    };
    
    const handleUpdateProfile = async (updatedUser: Omit<User, 'password' | 'email'>) => {
        if (!user) return;
        if (!ensureOnline()) return;
        try {
            const result = await backend.updateUser(user.email, updatedUser);
            if (result) {
                setUser(prevUser => ({ ...prevUser, ...result }));
                showToast('Profile updated successfully!');
                setPage('home');
            }
        } catch (err: any) {
            showToast(err.message || 'Failed to update profile.');
        }
    };
    
    const handleAddToCart = (product: Product, action: CartAction) => {
        setCartItems(prev => [...prev, { product, quantity: 1, action }]);
        showToast(`${product.name} added to cart!`);
        setIsCartOpen(true);
    };

    const handleRemoveFromCart = (productId: number, action: CartAction) => {
        setCartItems(prev => {
            const itemIndex = prev.findIndex(item => item.product.id === productId && item.action === action);
            if (itemIndex > -1) {
                const newCart = [...prev];
                newCart.splice(itemIndex, 1);
                return newCart;
            }
            return prev;
        });
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            showToast('Your cart is empty.');
            return;
        }
        setIsCartOpen(false);
        setPage('checkout');
    };

    const handlePaymentSuccess = async (shippingDetails: ShippingDetails) => {
        const purchaserEmail = user?.email || shippingDetails.email || 'guest@peacock.com';
        if (!ensureOnline()) {
            showToast('Order confirmed in demo mode. Confirmation email will be sent once online.');
            setCartItems([]);
            setPage('home');
            return;
        }
        const total = cartItems.reduce((sum, item) => sum + (item.action === 'buy' ? item.product.buyPrice : item.product.rentPrice) * item.quantity, 0) * 1.08;
        try {
            await backend.addOrder(purchaserEmail, cartItems, total, shippingDetails);
            setCartItems([]);
            // The success UI is in the Checkout component, which will then call onBack.
        } catch (err) {
            showToast('There was an error placing your order.');
        }
    };

    const handleAddReview = async (productId: number, rating: number, text: string, guestName?: string, guestLocation?: string) => {
        if (!ensureOnline()) return;
        try {
            const newReview = await backend.addReview({
                productId,
                rating,
                text,
                author: user?.name || guestName || 'Guest stylist',
                location: user?.email ? 'Verified member' : (guestLocation || 'Community'),
            });
            setReviews(prev => [...prev, newReview]);
            showToast('Thank you for your review!');
        } catch (err) {
            showToast('Failed to submit review.');
        }
    };

    const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
        if (!ensureOnline()) return;
        try {
            const newProduct = await backend.addProduct(productData);
            setProducts(prev => [...prev, newProduct]);
            showToast('Product added successfully!');
        } catch(err) {
            showToast('Failed to add product.');
        }
    };
    
    const handleUpdateProduct = async (updatedProduct: Product) => {
        if (!ensureOnline()) return;
        try {
            const result = await backend.updateProduct(updatedProduct);
            if (result) {
                setProducts(prev => prev.map(p => p.id === result.id ? result : p));
                showToast('Product updated successfully!');
            }
        } catch(err) {
            showToast('Failed to update product.');
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        if (!ensureOnline()) return;
        try {
            const success = await backend.deleteProduct(productId);
            if (success) {
                setProducts(prev => prev.filter(p => p.id !== productId));
                showToast('Product deleted successfully!');
            }
        } catch(err) {
            showToast('Failed to delete product.');
        }
    };

    const filteredProducts = selectedCategory ? products.filter(p => p.category === selectedCategory) : products;

    // Render logic
    const renderPage = () => {
        if (isLoading) return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;

        switch (page) {
            case 'checkout':
                return <Checkout items={cartItems} onBack={() => setPage('home')} onPaymentSuccess={handlePaymentSuccess} />;
            case 'orderHistory':
                return user ? (
                    <OrderHistory user={user} onBack={() => setPage('home')} />
                ) : (
                    renderProtectedMessage('Track bespoke orders', 'Sign in to view your curated rentals and purchases.')
                );
            case 'profile':
                return user && userType ? (
                    <Profile user={user} userType={userType} onUpdateProfile={handleUpdateProfile} onBack={() => setPage('home')} />
                ) : (
                    renderProtectedMessage('Personalize your atelier', 'Log in to edit preferences, addresses, and celebration reminders.')
                );
            case 'myProducts':
                return user ? (
                    <MyProducts user={user} allProducts={products} reviews={reviews} onAdd={handleAddProduct} onUpdate={handleUpdateProduct} onDelete={handleDeleteProduct} onBack={() => setPage('home')} />
                ) : (
                    renderProtectedMessage('Share your wardrobe', 'Only verified hosts can upload or update couture listings.')
                );
            case 'videoGenerator':
                return <VideoGenerator onBack={() => setPage('home')} />;
            case 'home':
            default:
                return (
                    <>
                        <Hero />
                        <BrandShowcase />
                        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <h2 className="text-3xl font-bold font-serif text-center mb-10 text-white capitalize">
                                {selectedCategory ? `${selectedCategory.replace('-', ' ')} Collection` : 'Featured Collection'}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {filteredProducts.map(product => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        onQuickView={setSelectedProduct} 
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>
                        </main>
                        <ReviewBanner reviews={reviews} />
                    </>
                );
        }
    };
    
    const renderProtectedMessage = (title: string, description: string) => (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
            <h2 className="text-3xl font-serif mb-4">{title}</h2>
            <p className="text-white/70 max-w-2xl mx-auto">{description}</p>
            <button
                onClick={() => setIsLoginModalOpen(true)}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-peacock-magenta px-6 py-3 font-semibold text-white hover:bg-peacock-sapphire"
            >
                Login to continue
            </button>
        </div>
    );

    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-[#010a07] via-[#06231a] to-[#010205] text-white">
            <Header 
                cartItemCount={cartItems.length}
                user={user}
                userType={userType}
                onCartClick={() => setIsCartOpen(true)}
                onLoginClick={() => setIsLoginModalOpen(true)}
                onLogout={handleLogout}
                onOrderHistoryClick={() => setPage('orderHistory')}
                onProfileClick={() => setPage('profile')}
                onMyProductsClick={() => setPage('myProducts')}
                onVideoGeneratorClick={() => setPage('videoGenerator')}
                onGoHome={() => { setPage('home'); setSelectedCategory(null); }}
                onSelectCategory={(cat) => { setPage('home'); setSelectedCategory(cat); }}
            />

            {connectionWarning && (
                <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 text-amber-900 rounded-md px-4 py-3 mt-4">
                    <p className="text-sm">{connectionWarning}</p>
                </div>
            )}

            {renderPage()}
            
            <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <Cart 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={handleCheckout}
                onLoginRequest={() => {
                    setIsCartOpen(false);
                    setIsLoginModalOpen(true);
                }}
            />

            {selectedProduct && (
                <ProductDetailModal 
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    product={selectedProduct}
                    reviews={reviews.filter(r => r.productId === selectedProduct.id)}
                    onAddToCart={handleAddToCart}
                    onAddReview={handleAddReview}
                    isReviewAllowed
                    currentUser={user}
                />
            )}

            <Toast 
                message={toast.message}
                show={toast.show}
                onClose={() => setToast({ show: false, message: '' })}
            />

            <FloatingReviewBadge reviews={reviews} />

            <footer className="bg-peacock-dark text-white py-8 mt-16">
                <div className="container mx-auto text-center text-sm">
                    &copy; {new Date().getFullYear()} Peacock. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

export default App;
