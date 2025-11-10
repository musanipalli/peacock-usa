import React from 'react';
import { CartItem, CartAction } from '../types';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemoveItem: (productId: number, action: CartAction) => void;
    onCheckout: () => void;
}

const CartItemRow: React.FC<{ item: CartItem; onRemove: (productId: number, action: CartAction) => void }> = ({ item, onRemove }) => (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-200">
        <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-16 h-20 object-cover rounded-md" />
        <div className="flex-grow">
            <h4 className="font-semibold">{item.product.name}</h4>
            <p className="text-sm text-gray-500 capitalize">{item.action}</p>
            <p className="text-sm font-bold text-peacock-emerald">
                ${item.action === CartAction.Buy ? item.product.buyPrice : item.product.rentPrice}
            </p>
        </div>
        <button onClick={() => onRemove(item.product.id, item.action)} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);


export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemoveItem, onCheckout }) => {
    if (!isOpen) return null;

    const subtotal = items.reduce((sum, item) => {
        const price = item.action === CartAction.Buy ? item.product.buyPrice : item.product.rentPrice;
        return sum + price * item.quantity;
    }, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" onClick={onClose}>
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-2xl font-serif font-bold">Your Cart</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-5">
                    {items.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
                    ) : (
                        items.map((item, index) => <CartItemRow key={`${item.product.id}-${item.action}-${index}`} item={item} onRemove={onRemoveItem} />)
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-5 border-t">
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={onCheckout}
                            className="w-full bg-peacock-magenta text-white py-3 rounded-full hover:bg-peacock-sapphire transition-colors duration-300 font-bold"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};