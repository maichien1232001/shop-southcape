import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Product } from '../../../interfaces/product.interface';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils';
import { Rating } from '../../../components/Rating';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { ShoppingCart, Eye } from 'lucide-react';
import { RootState } from '../../../store';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addProduct } = useCart();
  const [hovered, setHovered] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  // Lấy ngôn ngữ và tiền tệ đang chọn từ Redux
  const { locale, currency } = useSelector((state: RootState) => state.locale);

  // Lấy thông tin giá động theo tiền tệ hiện tại
  const price = _.get(product, `prices.${currency}.price`, 0);
  const originalPrice = _.get(product, `prices.${currency}.compare_at_price`);

  const hasDiscount = originalPrice ? originalPrice > price : false;
  const discountPercent = hasDiscount && originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const productName = _.get(product, `name.${locale}`) || _.get(product, 'name.vi', '');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const sizes = _.get(product, 'sizes', []);
    const colors = _.get(product, 'colors', []);
    
    if (_.size(sizes) === 1 && _.first(sizes) === 'One Size') {
      addProduct(product, _.first(colors) || '', 'One Size', 1);
      notification.success({
        message: locale === 'vi' ? 'Thêm vào giỏ hàng' : 'Added to Cart',
        description: locale === 'vi' 
          ? `Đã thêm ${productName} vào giỏ hàng`
          : locale === 'en'
          ? `Added ${productName} to cart`
          : `${productName}をカートに追加しました`,
        placement: 'topRight'
      });
    } else {
      setShowSizeSelector(true);
    }
  };

  const handleSelectSizeAndAdd = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const colors = _.get(product, 'colors', []);
    addProduct(product, _.first(colors) || '', size, 1);
    notification.success({
      message: locale === 'vi' ? 'Thêm vào giỏ hàng' : 'Added to Cart',
      description: locale === 'vi'
        ? `Đã thêm ${productName} (Cỡ ${size}) vào giỏ hàng`
        : locale === 'en'
        ? `Added ${productName} (Size ${size}) to cart`
        : `${productName} (サイズ ${size}) をカートに追加しました`,
      placement: 'topRight'
    });
    setShowSizeSelector(false);
  };

  const images = _.get(product, 'images', []);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group cursor-pointer flex flex-col gap-3 relative bg-brand-light pb-4 border border-transparent hover:border-brand-border/40 transition-all duration-300 shadow-sm hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowSizeSelector(false);
      }}
    >
      {/* Vùng ảnh sản phẩm */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-border/20">
        <img
          src={_.get(images, '[0]', '')}
          alt={productName}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            hovered && _.get(images, '[1]') ? 'opacity-0 scale-102' : 'opacity-100'
          }`}
        />
        {_.get(images, '[1]') && (
          <img
            src={_.get(images, '[1]')}
            alt={`${productName} Alternative`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              hovered ? 'opacity-100 scale-102' : 'opacity-0'
            }`}
          />
        )}

        {/* Nhãn Sale */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white font-sans text-[9px] font-bold tracking-widest px-2 py-1 uppercase">
            -{discountPercent}% SALE
          </span>
        )}

        {/* Menu tương tác nhanh đè lên ảnh khi hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          {!showSizeSelector ? (
            <div className="flex gap-2 w-full animate-slide-up">
              <button
                onClick={handleQuickAdd}
                className="flex-1 bg-brand-forest hover:bg-[#22442d] text-white flex items-center justify-center gap-1.5 h-10 text-[10px] font-sans font-bold tracking-wider uppercase transition-colors rounded-none cursor-pointer"
              >
                <ShoppingCart size={13} /> {locale === 'vi' ? 'Thêm nhanh' : locale === 'en' ? 'Quick Add' : 'クイック追加'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.id}`);
                }}
                className="w-10 bg-brand-light hover:bg-brand-dark hover:text-white text-brand-dark flex items-center justify-center h-10 transition-colors rounded-none border border-brand-border cursor-pointer"
              >
                <Eye size={14} className="text-current" />
              </button>
            </div>
          ) : (
            <div className="w-full bg-brand-light p-2 shadow-lg animate-slide-up flex flex-col gap-1.5 border border-brand-border">
              <p className="text-[10px] text-brand-gray text-center font-semibold font-sans tracking-wider uppercase mb-1">
                {locale === 'vi' ? 'Chọn kích cỡ:' : locale === 'en' ? 'Select size:' : 'サイズ選択:'}
              </p>
              <div className="flex justify-center gap-1.5">
                {_.map(_.get(product, 'sizes', []), (size) => (
                  <button
                    key={size}
                    onClick={(e) => handleSelectSizeAndAdd(size, e)}
                    className="w-8 h-8 text-xs font-sans border border-brand-border hover:border-brand-forest hover:bg-brand-forest hover:text-white transition-all flex items-center justify-center font-medium cursor-pointer"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thông tin sản phẩm dưới ảnh */}
      <div className="px-3 flex flex-col gap-1">
        <span className="text-[10px] text-brand-gray tracking-widest uppercase font-sans font-light">
          {_.get(product, 'subCategory', '')}
        </span>
        <h4 className="font-sans text-sm font-semibold tracking-wide text-brand-dark truncate leading-tight group-hover:text-brand-forest transition-colors">
          {productName}
        </h4>
        <div className="flex items-center justify-between mt-1">
          {/* Giá tiền */}
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-bold text-brand-forest">
              {formatPrice(price, currency)}
            </span>
            {hasDiscount && (
              <span className="font-sans text-xs text-brand-gray line-through">
                {formatPrice(originalPrice || 0, currency)}
              </span>
            )}
          </div>
          {/* Đánh giá sao */}
          <Rating value={_.get(product, 'rating', 0)} count={_.get(product, 'reviewsCount', 0)} size={11} />
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
