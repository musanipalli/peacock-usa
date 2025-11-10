import { Product, Category, Review } from './types';

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Royal Blue Lehenga', category: Category.Women, description: 'A stunning lehenga with intricate gold embroidery.', imageUrls: ['https://picsum.photos/seed/lehenga/400/500'], buyPrice: 450, rentPrice: 90 },
  { id: 2, name: 'Emerald Green Sherwani', category: Category.Men, description: 'Elegant silk sherwani for weddings and special occasions.', imageUrls: ['https://picsum.photos/seed/sherwani/400/500'], buyPrice: 500, rentPrice: 100 },
  { id: 3, name: 'Ruby Red Saree', category: Category.Women, description: 'Classic Banarasi silk saree with a modern twist.', imageUrls: ['https://picsum.photos/seed/saree/400/500'], buyPrice: 350, rentPrice: 75 },
  { id: 4, name: 'Golden Jhumkas', category: Category.Jwellery, description: 'Traditional temple jewellery-style earrings.', imageUrls: ['https://picsum.photos/seed/jhumkas/400/500'], buyPrice: 80, rentPrice: 20 },
  { id: 5, name: 'Boys Kurta Pajama Set', category: Category.KidsBoys, description: 'Comfortable and stylish cotton kurta set for boys.', imageUrls: ['https://picsum.photos/seed/kurta/400/500'], buyPrice: 120, rentPrice: 30 },
  { id: 6, name: 'Girls Anarkali Dress', category: Category.KidsGirls, description: 'Flowy and vibrant anarkali for young girls.', imageUrls: ['https://picsum.photos/seed/anarkali/400/500'], buyPrice: 150, rentPrice: 40 },
  { id: 7, name: 'Embroidered Potli Bag', category: Category.Handbags, description: 'A beautiful potli bag to complete your traditional look.', imageUrls: ['https://picsum.photos/seed/potli/400/500'], buyPrice: 60, rentPrice: 15 },
  { id: 8, name: 'Classic Nehru Jacket', category: Category.Men, description: 'A versatile jacket that can be paired with any kurta.', imageUrls: ['https://picsum.photos/seed/nehru/400/500'], buyPrice: 180, rentPrice: 45 },
  { id: 9, name: 'Silver Diya Set', category: Category.PoojaItems, description: 'Exquisite silver-plated diyas for your pooja room.', imageUrls: ['https://picsum.photos/seed/diya/400/500'], buyPrice: 150, rentPrice: 35 },
  { id: 10, name: 'Embroidered Mojaris', category: Category.Shoes, description: 'Handcrafted traditional mojaris with intricate threadwork.', imageUrls: ['https://picsum.photos/seed/mojari/400/500'], buyPrice: 95, rentPrice: 25 },
  { id: 11, name: 'Kundan Necklace Set', category: Category.Jwellery, description: 'A stunning Kundan necklace with matching earrings.', imageUrls: ['https://picsum.photos/seed/kundan/400/500'], buyPrice: 220, rentPrice: 55 },
  { id: 12, name: 'Peacock Wall Art', category: Category.HomeDecor, description: 'Vibrant metal wall art to adorn your living space.', imageUrls: ['https://picsum.photos/seed/wallart/400/500'], buyPrice: 130, rentPrice: 40 },
];

export const REVIEWS: Review[] = [
  { id: 1, productId: 1, author: 'Priya S.', location: 'New York, USA', text: 'The lehenga was absolutely breathtaking! I received so many compliments. The rental process was seamless.', rating: 5 },
  { id: 2, productId: 2, author: 'Aarav M.', location: 'London, UK', text: 'Peacock has an amazing collection. The sherwani I bought was of premium quality. Highly recommend!', rating: 5 },
  { id: 3, productId: 3, author: 'Sunita K.', location: 'Toronto, CA', text: 'I rented a saree for a family function and it was perfect. The customer service is top-notch.', rating: 4 },
  { id: 4, productId: 1, author: 'Rohan P.', location: 'Sydney, AU', text: 'Finally, a place for high-quality Indian wear abroad. My go-to for every occasion.', rating: 5 },
];

export const T_AND_C_TEXT = `Welcome to Peacock! By renting an item from our platform, you agree to the following terms and conditions. These are designed to ensure a smooth and fair experience for both our lenders and renters.

1. Rental Period
The rental period begins on the day the item is delivered to you and ends on the day you postmark it for return. Standard rental periods are 4 or 8 days. Late returns will incur a daily late fee of $50 per item.

2. Care of Garments
We expect you to treat our garments with the utmost care, as if they were your own cherished possessions. You are responsible for any loss, destruction, or damage to the product beyond minor wear and tear. Minor wear and tear includes small, repairable issues like a loose bead or a sticky zipper. Major damage, such as large stains, rips, or non-repairable issues, will result in charges up to the full retail value of the item.

3. Cleaning
You agree not to clean, press, or alter the garments in any way. We handle all professional cleaning and maintenance. Our specialized cleaning process ensures that every item is pristine and for the next renter.`;