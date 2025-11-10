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
import { Product, Review, CartItem, User, UserType, CartAction, Category, ShippingDetails } from './types';
import { backend } from './services/backend';

type Page = 'home' | 'checkout' | 'orderHistory' | 'profile' | 'myProducts' | 'videoGenerator';

const App: React.FC = () => {
    // State management
    const [page, setPage] = useState<Page>('home');
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [user, setUser] = useState<User | null>(null);
    const [userType, setUserType] = useState<UserType | null>(null);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [toast, setToast] = useState({ show: false, message: '' });

    // Data fetching
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [productsData, reviewsData] = await Promise.all([
                backend.getProducts(),
                backend.getReviews()
            ]);
            setProducts(productsData);
            setReviews(reviewsData);
        } catch (err: any) {
            const errorMessage = 'Failed to fetch data. Please ensure the backend server is running and accessible.';
            setError(errorMessage);
            showToast(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handlers
    const showToast = (message: string) => {
        setToast({ show: true, message });
    };

    const handleLoginSuccess = (loggedInUser: User, type: UserType) => {
        setUser(loggedInUser);
        setUserType(type);
        showToast(`Welcome, ${loggedInUser.name}!`);
    };
    
    const handleLogout = () => {
        setUser(null);
        setUserType(null);
        setPage('home');
        showToast('You have been logged out.');
    };
    
    const handleUpdateProfile = async (updatedUser: User) => {
        if (!user) return;
        try {
            const result = await backend.updateUser(user.email, updatedUser);
            if (result) {
                setUser(result);
                showToast('Profile updated successfully!');
                setPage('home');
            }
        } catch (err) {
            showToast('Failed to update profile.');
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
        if (!user) {
            showToast('Please log in to proceed to checkout.');
            setIsLoginModalOpen(true);
            return;
        }
        setIsCartOpen(false);
        setPage('checkout');
    };

    const handlePaymentSuccess = async (shippingDetails: ShippingDetails) => {
        if (!user) return;
        const total = cartItems.reduce((sum, item) => sum + (item.action === 'buy' ? item.product.buyPrice : item.product.rentPrice) * item.quantity, 0) * 1.08;
        try {
            await backend.addOrder(user.email, cartItems, total, shippingDetails);
            setCartItems([]);
            // The success UI is in the Checkout component, which will then call onBack.
        } catch (err) {
            showToast('There was an error placing your order.');
        }
    };

    const handleAddReview = async (productId: number, rating: number, text: string) => {
        if (!user) {
            showToast('You must be logged in to leave a review.');
            return;
        }
        try {
            const newReview = await backend.addReview({
                productId,
                rating,
                text,
                author: user.name,
                location: 'Online',
            });
            setReviews(prev => [...prev, newReview]);
            showToast('Thank you for your review!');
        } catch (err) {
            showToast('Failed to submit review.');
        }
    };

    const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
        try {
            const newProduct = await backend.addProduct(productData);
            setProducts(prev => [...prev, newProduct]);
            showToast('Product added successfully!');
        } catch(err) {
            showToast('Failed to add product.');
        }
    };
    
    const handleUpdateProduct = async (updatedProduct: Product) => {
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
        if (error) return <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg max-w-2xl mx-auto mt-10"><h3 className="font-bold">Connection Error</h3><p>{error}</p></div>;

        switch (page) {
            case 'checkout':
                return <Checkout items={cartItems} onBack={() => setPage('home')} onPaymentSuccess={handlePaymentSuccess} />;
            case 'orderHistory':
                return user ? <OrderHistory user={user} onBack={() => setPage('home')} /> : null;
            case 'profile':
                return user && userType ? <Profile user={user} userType={userType} onUpdateProfile={handleUpdateProfile} onBack={() => setPage('home')} /> : null;
            case 'myProducts':
                return user ? <MyProducts user={user} allProducts={products} onAdd={handleAddProduct} onUpdate={handleUpdateProduct} onDelete={handleDeleteProduct} onBack={() => setPage('home')} /> : null;
            case 'videoGenerator':
                return <VideoGenerator onBack={() => setPage('home')} />;
            case 'home':
            default:
                return (
                    <>
                        <Hero />
                        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <h2 className="text-3xl font-bold font-serif text-center mb-10 text-peacock-dark capitalize">
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
                        <ReviewBanner />
                    </>
                );
        }
    };
    
    const isReviewAllowed = (productId: number) => {
        // This is a simplified check. A real app would check order history.
        // For this demo, we'll allow logged-in users to review anything.
        return !!user;
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
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
            />

            {selectedProduct && (
                <ProductDetailModal 
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    product={selectedProduct}
                    reviews={reviews.filter(r => r.productId === selectedProduct.id)}
                    onAddToCart={handleAddToCart}
                    onAddReview={handleAddReview}
                    isReviewAllowed={isReviewAllowed(selectedProduct.id)}
                />
            )}

            <Toast 
                message={toast.message}
                show={toast.show}
                onClose={() => setToast({ show: false, message: '' })}
            />

            <footer className="bg-peacock-dark text-white py-8 mt-16">
                <div className="container mx-auto text-center text-sm">
                    &copy; {new Date().getFullYear()} Peacock. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

export default App;
