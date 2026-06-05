import { SupportedLocale } from '../constants/languages';

export interface ProductPrice {
  price: number;
  compare_at_price?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: Record<SupportedLocale, string>;
  description: Record<SupportedLocale, string>;
  seoTitle?: Record<SupportedLocale, string>;
  seoDescription?: Record<SupportedLocale, string>;
  prices: Record<string, ProductPrice>; // Ví dụ: { "VND": { price: 5000000 }, "USD": { price: 200 } }
  images: string[];
  category: 'men' | 'women' | 'accessories';
  subCategory: string; // ví dụ: "Polo", "Knitwear", "Skirt", "Cap", "Shoes"
  colors: string[]; // ví dụ: ["White", "Navy", "Beige"]
  sizes: string[]; // ví dụ: ["S", "M", "L"]
  details?: string[]; // chi tiết sản phẩm hiển thị trên UI
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  rating: number;
  reviewsCount: number;
  inStock: boolean;
}

