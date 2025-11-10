import React from 'react';
import { Product, CartAction } from '../types';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, action: CartAction) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onAddToCart }) => {
  const handleRentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, CartAction.Rent);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, CartAction.Buy);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 animate-slide-in">
      <div className="relative">
        <img src={product.imageUrls[0] || 'https://picsum.photos/seed/placeholder/400/500'} alt={product.name} className="w-full h-80 object-cover" />

        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button 
                onClick={handleRentClick}
                className="relative group/tooltip bg-white/80 backdrop-blur-sm p-2 rounded-full text-peacock-emerald hover:bg-peacock-emerald hover:text-white transition-colors"
                aria-label="Rent Now"
            >
                <CalendarIcon className="w-5 h-5" />
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-max px-2 py-1 bg-peacock-dark text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
                    Rent Now
                </span>
            </button>
            <button 
                onClick={handleBuyClick}
                className="relative group/tooltip bg-white/80 backdrop-blur-sm p-2 rounded-full text-peacock-marigold hover:bg-peacock-marigold hover:text-white transition-colors"
                aria-label="Buy Now"
            >
                <ShoppingCartIcon className="w-5 h-5" />
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-max px-2 py-1 bg-peacock-dark text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
                    Buy Now
                </span>
            </button>
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
            <button 
                onClick={() => onQuickView(product)}
                className="text-white bg-peacock-magenta/80 backdrop-blur-sm px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90"
            >
                Quick View
            </button>
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold font-serif text-peacock-dark">{product.name}</h3>
        <div className="mt-2 flex justify-center items-center space-x-4">
          <p className="text-gray-600">
            Rent from <span className="font-bold text-peacock-emerald">${product.rentPrice}</span>
          </p>
           <p className="text-gray-600">
            Buy for <span className="font-bold text-peacock-marigold">${product.buyPrice}</span>
          </p>
        </div>
      </div>
    </div>
  );
};