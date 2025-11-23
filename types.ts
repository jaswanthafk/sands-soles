
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number; // In KWD
  image: string;
  description: string;
  tags: string[];
  color: string;
  category: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  image: string;
  category: string;
  excerpt: string;
  content: string[]; // Array of paragraphs for simplicity
  author: string;
}

export interface StylistResponse {
  recommendedIds: string[];
  message: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type LoyaltyTier = 'SILVER' | 'GOLD' | 'PLATINUM';

export type Theme = 'light'; // Enforce light theme

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  area: string;
  address: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  itemsCount: number;
  image: string; // Thumbnail of first item
  items: CartItem[]; // Full item details for verification
  shippingDetails?: ShippingDetails;
  discountApplied?: number;
  pointsRedeemed?: number;
  pointsEarned?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  savedCart?: CartItem[];
  savedHistory?: string[]; // Product IDs
  wishlist?: string[]; // Product IDs
  orders: Order[];
  loyaltyPoints: number;
  tier: LoyaltyTier;
  isAdmin?: boolean;
}
