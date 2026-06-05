import { Product } from './product.interface';

export interface CartItem {
  id: string; // Khóa định danh duy nhất: productId_color_size
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discountPercentage: number;
  isOpen: boolean;
}
