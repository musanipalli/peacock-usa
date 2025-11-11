import React, { useState } from 'react';
import { User, Product } from '../types';
import { ProductFormModal } from './ProductFormModal';

interface MyProductsProps {
    user: User;
    allProducts: Product[];
    onAdd: (product: Omit<Product, 'id'>) => void;
    onUpdate: (product: Product) => void;
    onDelete: (productId: number) => void;
    onBack: () => void;
}

const SellerProductCard: React.FC<{ product: Product; onEdit: () => void; onDelete: () => void; }> = ({ product, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-64 object-cover" />
        <div className="p-4">
            <h3 className="text-lg font-bold font-serif text-peacock-dark truncate">{product.name}</h3>
            <div className="mt-2 flex justify-between items-center text-sm">
                <p>Buy: <span className="font-bold text-peacock-marigold">${product.buyPrice}</span></p>
                <p>Rent: <span className="font-bold text-peacock-emerald">${product.rentPrice}</span></p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <button onClick={onEdit} className="bg-peacock-sapphire text-white text-xs px-3 py-1 rounded-full hover:bg-opacity-80">Edit</button>
                <button onClick={onDelete} className="bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-opacity-80">Delete</button>
            </div>
        </div>
    </div>
);


export const MyProducts: React.FC<MyProductsProps> = ({ user, allProducts, onAdd, onUpdate, onDelete, onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const sellerProducts = allProducts.filter(p => p.sellerEmail === user.email);

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };
    
    const handleSaveProduct = (productData: Omit<Product, 'id' | 'sellerEmail'> | Product) => {
        if ('id' in productData) {
            onUpdate(productData as Product);
        } else {
            onAdd(productData as Omit<Product, 'id'>);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <button onClick={onBack} className="text-peacock-sapphire hover:underline mb-6 font-medium">&larr; Back to Shopping</button>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold font-serif text-peacock-dark">My Products Dashboard</h1>
                     <button onClick={handleOpenAddModal} className="bg-peacock-magenta text-white py-2 px-6 rounded-full font-bold hover:bg-peacock-sapphire transition-colors duration-300 flex items-center justify-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <span>Add New Product</span>
                    </button>
                </div>
                
                <h3 className="text-2xl font-bold font-serif mb-6 border-b pb-2">Your Listed Products ({sellerProducts.length})</h3>
                {sellerProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {sellerProducts.map(product => (
                            <SellerProductCard 
                                key={product.id}
                                product={product}
                                onEdit={() => handleOpenEditModal(product)}
                                onDelete={() => {
                                    if(window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                                        onDelete(product.id)
                                    }
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-peacock-dark">You haven't listed any products yet.</h2>
                        <p className="text-gray-500 mt-2">Click "Add New Product" to get started!</p>
                    </div>
                )}
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
