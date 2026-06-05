import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../../../interfaces/cart.interface';
import { Product } from '../../../interfaces/product.interface';

// Tải trạng thái giỏ hàng từ localStorage nếu có
const loadCartFromStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem('southcape_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('southcape_cart', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  promoCode: null,
  discountPercentage: 0,
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        selectedColor: string;
        selectedSize: string;
        quantity: number;
      }>
    ) => {
      const { product, selectedColor, selectedSize, quantity } = action.payload;
      const itemId = `${product.id}_${selectedColor}_${selectedSize}`;

      const existingItemIndex = state.items.findIndex((item) => item.id === itemId);

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          id: itemId,
          product,
          selectedColor,
          selectedSize,
          quantity,
        });
      }
      saveCartToStorage(state.items);
      state.isOpen = true; // Tự động mở ngăn kéo giỏ hàng khi thêm sản phẩm
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
      }
      saveCartToStorage(state.items);
    },
    applyPromoCode: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      if (code === 'SOUTHCAPE10') {
        state.promoCode = code;
        state.discountPercentage = 10;
      } else if (code === 'GOLF20') {
        state.promoCode = code;
        state.discountPercentage = 20;
      } else {
        state.promoCode = null;
        state.discountPercentage = 0;
      }
    },
    setPromoCode: (
      state,
      action: PayloadAction<{ code: string; discountPercentage: number }>
    ) => {
      state.promoCode = action.payload.code;
      state.discountPercentage = action.payload.discountPercentage;
    },
    removePromoCode: (state) => {
      state.promoCode = null;
      state.discountPercentage = 0;
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
      state.discountPercentage = 0;
      saveCartToStorage([]);
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyPromoCode,
  setPromoCode,
  removePromoCode,
  clearCart,
  setCartOpen,
  toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;
