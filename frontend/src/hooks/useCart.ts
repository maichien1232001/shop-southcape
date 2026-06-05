import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { RootState } from '../store';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromoCode,
  setPromoCode,
  removePromoCode,
  setCartOpen,
  toggleCart,
} from '../features/cart/store/cartSlice';
import { Product } from '../interfaces/product.interface';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const promoCode = useSelector((state: RootState) => state.cart.promoCode);
  const discountPercentage = useSelector((state: RootState) => state.cart.discountPercentage);
  const isOpen = useSelector((state: RootState) => state.cart.isOpen);
  
  // Lấy tiền tệ hiện tại từ localeSlice
  const { currency } = useSelector((state: RootState) => state.locale);

  // Tính tổng số sản phẩm trong giỏ hàng
  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);

  // Tính tổng số tiền trước giảm giá theo tiền tệ đang chọn
  const subtotal = items.reduce(
    (total, item) => {
      const price = _.get(item, `product.prices.${currency}.price`, 0);
      return total + price * item.quantity;
    },
    0
  );

  // Tính số tiền giảm giá
  const discountAmount = (subtotal * discountPercentage) / 100;

  // Tính tổng số tiền cuối cùng phải trả
  const total = subtotal - discountAmount;

  // Ngưỡng miễn phí vận chuyển tương ứng theo tiền tệ (USD: $300, VND: 7.500.000₫)
  const freeShippingThreshold = currency === 'USD' ? 300 : 7500000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const neededForFreeShipping = freeShippingThreshold - subtotal;
  const freeShippingProgress = Math.min(
    (subtotal / freeShippingThreshold) * 100,
    100
  );

  const addProduct = (
    product: Product,
    color: string,
    size: string,
    quantity: number = 1
  ) => {
    dispatch(addToCart({ product, selectedColor: color, selectedSize: size, quantity }));
  };

  const removeProduct = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const changeQuantity = (id: string, qty: number) => {
    dispatch(updateQuantity({ id, quantity: qty }));
  };

  const applyCode = (code: string) => {
    dispatch(applyPromoCode(code));
  };

  const setPromo = (code: string, percent: number) => {
    dispatch(setPromoCode({ code, discountPercentage: percent }));
  };

  const removeCode = () => {
    dispatch(removePromoCode());
  };

  const resetCart = () => {
    dispatch(clearCart());
  };

  const setOpenCart = (open: boolean) => {
    dispatch(setCartOpen(open));
  };

  const toggleOpenCart = () => {
    dispatch(toggleCart());
  };

  return {
    items,
    promoCode,
    discountPercentage,
    isOpen,
    itemsCount,
    subtotal,
    discountAmount,
    total,
    isFreeShipping,
    neededForFreeShipping,
    freeShippingProgress,
    freeShippingThreshold,
    addProduct,
    removeProduct,
    changeQuantity,
    applyCode,
    setPromo,
    removeCode,
    resetCart,
    setOpenCart,
    toggleOpenCart,
  };
};
