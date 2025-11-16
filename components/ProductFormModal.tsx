import React, { useState, useEffect, useRef } from 'react';
import { Product, Category } from '../types';
import { WomanIcon } from './icons/WomanIcon';
import { ManIcon } from './icons/ManIcon';
import { KidsBoyIcon } from './icons/KidsBoyIcon';
import { KidsGirlIcon } from './icons/KidsGirlIcon';
import { HandbagIcon } from './icons/HandbagIcon';
import { ShoeIcon } from './icons/ShoeIcon';
import { JewelleryIcon } from './icons/JewelleryIcon';
import { PoojaIcon } from './icons/PoojaIcon';
import { HomeDecorIcon } from './icons/HomeDecorIcon';

const initialFormData = {
    name: '',
    category: Category.Women,
    description: '',
    stylingNotes: '',
    imageUrls: [] as string[],
    buyPrice: 0,
    rentPrice: 0,
};

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const categoryOptions = [
    { value: Category.Women, label: 'Women', icon: <WomanIcon className="w-5 h-5 text-gray-500" /> },
    { value: Category.Men, label: 'Men', icon: <ManIcon className="w-5 h-5 text-gray-500" /> },
    { value: Category.KidsBoys, label: 'Kids - Boys', icon: <KidsBoyIcon className="w-5 h-5 text-gray-500" /> },
    { value: Category.KidsGirls, label: 'Kids - Girls', icon: <KidsGirlIcon className="w-5 h-5 text-gray-500" /> },
    { value: Category.Handbags, label: 'Handbags', icon: <HandbagIcon className="w-5 h-5 text-gray-500" /> },
    { value: Category.Shoes, label: 'Shoes', icon: <ShoeIcon className="w-5 h-5 text-gray-500" /> },
    { value: Category.Jwellery, label: 'Jwellery', icon: <JewelleryIcon className="w-5 h-5 text-gray-500" /> },
    { value: Category.PoojaItems, label: 'Pooja Items', icon: <PoojaIcon className="w-5 h-5 text-gray-500" /> },
    { value: Category.HomeDecor, label: 'Home Decor', icon: <HomeDecorIcon className="w-5 h-5 text-gray-500" /> },
];


interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: Omit<Product, 'id' | 'sellerEmail'> | Product) => void;
    productToEdit?: Product | null;
    userEmail: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, productToEdit, userEmail }) => {
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'sellerEmail'>>(initialFormData);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const [categorySearch, setCategorySearch] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                setFormData(productToEdit);
            } else {
                setFormData(initialFormData);
            }
        }
    }, [isOpen, productToEdit]);
    
     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
                setCategorySearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'buyPrice' || name === 'rentPrice' ? parseFloat(value) || 0 : value }));
    };
    
    const handleCategorySelect = (category: Category) => {
        setFormData(prev => ({...prev, category}));
        setIsCategoryOpen(false);
        setCategorySearch('');
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        if (formData.imageUrls.length + files.length > 7) {
            alert('You can upload a maximum of 7 images.');
            return;
        }

        const newImageUrls = await Promise.all(
            Array.from(files).map(file => toBase64(file))
        );

        setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...newImageUrls] }));
    };
    
    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
    };

    const handleSetPrimaryImage = (selectedIndex: number) => {
        setFormData(prev => {
            if (selectedIndex < 0 || selectedIndex >= prev.imageUrls.length) {
                return prev;
            }
            const newImageUrls = [...prev.imageUrls];
            const [selectedImage] = newImageUrls.splice(selectedIndex, 1);
            newImageUrls.unshift(selectedImage);
            return { ...prev, imageUrls: newImageUrls };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.imageUrls.length === 0) {
            alert('Please upload at least one image.');
            return;
        }
        if (productToEdit) {
            onSave({ ...productToEdit, ...formData });
        } else {
            onSave({ ...formData, sellerEmail: userEmail });
        }
    };

    const filteredCategories = categoryOptions.filter(option =>
        option.label.toLowerCase().includes(categorySearch.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold font-serif">{productToEdit ? `Editing: ${productToEdit.name}` : 'Add a New Product'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Product Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 mt-1 border rounded-md" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <div className="relative mt-1" ref={categoryDropdownRef}>
                                <button type="button" onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-peacock-magenta focus:outline-none focus:ring-1 focus:ring-peacock-magenta sm:text-sm">
                                    <span className="flex items-center">
                                        {categoryOptions.find(opt => opt.value === formData.category)?.icon}
                                        <span className="ml-3 block truncate">{categoryOptions.find(opt => opt.value === formData.category)?.label}</span>
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.24a.75.75 0 011.06 0L10 14.148l2.7-2.908a.75.75 0 111.06 1.06l-3.25 3.5a.75.75 0 01-1.06 0l-3.25-3.5a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                                {isCategoryOpen && (
                                    <div className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        <div className="p-2">
                                            <input
                                                type="text"
                                                placeholder="Search category..."
                                                value={categorySearch}
                                                onChange={(e) => setCategorySearch(e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <ul className="max-h-56 overflow-auto">
                                            {filteredCategories.map(option => (
                                                <li key={option.value} onClick={() => handleCategorySelect(option.value)} className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-gray-100">
                                                    <div className="flex items-center">
                                                        {option.icon}
                                                        <span className="font-normal ml-3 block truncate">{option.label}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 mt-1 border rounded-md" rows={4} required></textarea>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
                                Dressing Suggestions
                                <span className="text-xs text-gray-400">Shown on product detail page</span>
                            </label>
                            <textarea
                                name="stylingNotes"
                                value={formData.stylingNotes}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 border rounded-md"
                                rows={3}
                                placeholder="e.g., Pair with ivory heels and mirrorwork potli."
                            ></textarea>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">
                                Product Images
                                <span className="ml-2 text-xs font-normal text-gray-400">(drag to reorder, first is primary)</span>
                            </label>
                            <span className="text-sm font-semibold text-peacock-sapphire bg-blue-100 px-2 py-1 rounded-full">{formData.imageUrls.length} / 7</span>
                        </div>
                        <div className="mt-2">
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                                {formData.imageUrls.map((url, index) => (
                                    <div key={`${index}-${url.slice(-10)}`} className="relative aspect-square group/preview">
                                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-sm" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold hover:bg-red-700 transition-transform hover:scale-110 z-20"
                                            aria-label="Remove image"
                                        >
                                            &times;
                                        </button>
                                        {index === 0 ? (
                                            <div className="absolute bottom-0 left-0 right-0 bg-peacock-emerald text-white text-xs text-center py-1 font-bold pointer-events-none">
                                                Primary
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSetPrimaryImage(index)}
                                                className="absolute inset-0 bg-black bg-opacity-0 group-hover/preview:bg-opacity-60 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 z-10"
                                            >
                                                Make Primary
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {formData.imageUrls.length < 7 && (
                                    <label htmlFor="image-upload" className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="text-center">
                                            <svg className="mx-auto h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            <span className="mt-2 block text-xs font-medium text-gray-600">Add Image</span>
                                        </div>
                                        <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} className="sr-only" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Buy Price ($)</label>
                            <input type="number" name="buyPrice" value={formData.buyPrice} onChange={handleInputChange} className="w-full p-2 mt-1 border rounded-md" required min="0" step="0.01"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Rent Price ($)</label>
                            <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleInputChange} className="w-full p-2 mt-1 border rounded-md" required min="0" step="0.01"/>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end space-x-2 border-t mt-auto">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-6 rounded-full font-bold hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-peacock-magenta text-white py-2 px-6 rounded-full font-bold hover:bg-peacock-sapphire">{productToEdit ? 'Save Changes' : 'Add Product'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
