export enum Category {
  Women = 'women',
  Men = 'men',
  KidsBoys = 'kids-boys',
  KidsGirls = 'kids-girls',
  Handbags = 'handbags',
  Shoes = 'shoes',
  Jwellery = 'jwellery',
  PoojaItems = 'pooja-items',
  HomeDecor = 'home-decor',
}

export interface Product {
  id: number;
  name: string;
  category: Category;
  description: string;
  stylingNotes?: string;
  imageUrls: string[];
  buyPrice: number;
  rentPrice: number;
  sellerEmail?: string; // Link product to a seller
}

export interface Review {
  id: number;
  productId: number; // Link review to a product
  author: string;
  location: string;
  text: string;
  rating: number;
}

export enum CartAction {
  Rent = 'rent',
  Buy = 'buy',
}

export interface CartItem {
  product: Product;
  quantity: number;
  action: CartAction;
}

export interface ShippingDetails {
  fullName: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  name: string;
  email: string;
  password?: string; // In a real app, this would be a hash
  phoneNumber?: string;
}

export type UserType = 'customer' | 'seller';

export enum OrderStatus {
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Returned = 'Returned',
}

export interface Order {
  id: string;
  userEmail: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  shippingDetails: ShippingDetails;
}
