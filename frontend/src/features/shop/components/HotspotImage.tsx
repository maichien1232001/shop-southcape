import React from 'react';
import { useSelector } from 'react-redux';
import { Popover, Button, notification } from 'antd';
import { Plus, ShoppingCart, ArrowUpRight } from 'lucide-react';
import { Lookbook, Hotspot } from '../../../interfaces/concept.interface';
import { PRODUCTS } from '../../../constants/shopData';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';

interface HotspotImageProps {
  lookbook: Lookbook;
}

export const HotspotImage: React.FC<HotspotImageProps> = ({ lookbook }) => {
  const navigate = useNavigate();
  const { addProduct } = useCart();

  // Lấy ngôn ngữ và tiền tệ đang chọn từ Redux
  const { locale, currency } = useSelector((state: RootState) => state.locale);

  const handleQuickAdd = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    // Chọn size mặc định đầu tiên hoặc 'One Size'
    const defaultSize = product.sizes[0] || 'S';
    const defaultColor = product.colors[0] || 'Default';
    
    addProduct(product, defaultColor, defaultSize, 1);
    
    const productName = product.name[locale] || product.name['vi'];
    notification.success({
      message: locale === 'vi' ? 'Thêm vào giỏ hàng' : 'Added to Cart',
      description: locale === 'vi' 
        ? `Đã thêm ${productName} vào giỏ hàng` 
        : locale === 'en'
        ? `Added ${productName} to cart`
        : `${productName}をカートに追加しました`,
      placement: 'topRight'
    });
  };

  const renderPopoverContent = (hotspot: Hotspot) => {
    const product = PRODUCTS.find((p) => p.id === hotspot.productId);
    if (!product) {
      return <div>{locale === 'vi' ? 'Không tìm thấy sản phẩm' : 'Product not found'}</div>;
    }

    const productName = product.name[locale] || product.name['vi'];
    const activePrice = product.prices[currency]?.price || 0;

    return (
      <div className="flex gap-3 p-1 max-w-[240px] font-sans">
        <img
          src={product.images[0]}
          alt={productName}
          className="w-14 h-18 object-cover bg-brand-light border border-brand-border flex-shrink-0"
        />
        <div className="flex flex-col justify-between min-w-0">
          <div>
            <h4 className="text-xs font-semibold text-brand-dark leading-snug truncate">
              {productName}
            </h4>
            <span className="text-[10px] text-brand-gray tracking-wider uppercase font-light">
              {product.subCategory}
            </span>
            <p className="text-xs font-bold text-brand-forest mt-1">
              {formatPrice(activePrice, currency)}
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              size="small"
              onClick={() => navigate(`/product/${product.id}`)}
              className="rounded-none text-[9px] font-semibold border-brand-border text-brand-dark px-2 h-7 flex items-center gap-0.5 cursor-pointer"
            >
              {locale === 'vi' ? 'Chi tiết' : 'Details'} <ArrowUpRight size={10} />
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={(e) => handleQuickAdd(product.id, e)}
              className="rounded-none text-[9px] font-semibold bg-brand-forest hover:bg-[#22442d] border-brand-forest hover:border-[#22442d] px-2 h-7 flex items-center gap-1 cursor-pointer"
            >
              <ShoppingCart size={10} /> {locale === 'vi' ? 'Mua' : 'Buy'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Hình ảnh lookbook chính */}
      <img
        src={lookbook.image}
        alt={lookbook.title || 'Lookbook Concept'}
        className="w-full h-auto object-cover max-h-[85vh] block transition-transform duration-700 hover:scale-[1.01]"
      />

      {/* Render danh sách Hotspots */}
      {lookbook.hotspots.map((hotspot, idx) => (
        <Popover
          key={`${lookbook.id}_hotspot_${idx}`}
          content={renderPopoverContent(hotspot)}
          trigger={['hover', 'click']}
          placement="top"
        >
          <button
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-brand-light border-2 border-brand-forest flex items-center justify-center cursor-pointer shadow-lg animate-hotspot hover:scale-110 active:scale-95 transition-transform duration-300 group z-10"
          >
            <Plus
              size={12}
              className="text-brand-forest stroke-[3] group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </Popover>
      ))}
    </div>
  );
};
export default HotspotImage;
