import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CONCEPTS, PRODUCTS } from '../../../constants/shopData';
import { HotspotImage } from './HotspotImage';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { Button, notification, Select } from 'antd';
import { RootState } from '../../../store';

// Import CSS của Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export const ConceptSection: React.FC = () => {
  const { addProduct } = useCart();
  const [activeConceptId, setActiveConceptId] = useState(CONCEPTS[0].id);
  
  // Lưu trữ cấu hình kích thước được chọn cho từng sản phẩm trong Outfit mua nhanh
  const [outfitSizes, setOutfitSizes] = useState<Record<string, string>>({});

  // Lấy locale và currency từ Redux
  const { locale, currency } = useSelector((state: RootState) => state.locale);

  const activeConcept = CONCEPTS.find((c) => c.id === activeConceptId) || CONCEPTS[0];

  const handleSizeChange = (productId: string, size: string) => {
    setOutfitSizes((prev) => ({ ...prev, [productId]: size }));
  };

  // Thêm trọn bộ outfit vào giỏ hàng
  const handleAddOutfitToCart = (productsInOutfit: { id: string }[]) => {
    let addedCount = 0;
    
    productsInOutfit.forEach((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return;

      const size = outfitSizes[product.id] || product.sizes[0] || 'S';
      const color = product.colors[0] || 'Default';

      addProduct(product, color, size, 1);
      addedCount++;
    });

    if (addedCount > 0) {
      notification.success({
        message: locale === 'vi' ? 'Thêm vào giỏ hàng' : 'Added to Cart',
        description: locale === 'vi'
          ? `Đã thêm trọn bộ ${addedCount} món đồ vào giỏ hàng thành công!`
          : locale === 'en'
          ? `Successfully added all ${addedCount} items to cart!`
          : `コーディネート ${addedCount} 点すべてをカートに追加しました！`,
        placement: 'topRight'
      });
    }
  };

  // Nhãn đa ngôn ngữ
  const labels: Record<string, Record<string, string>> = {
    sectionSub: { vi: 'Curated Moodboards', en: 'Curated Moodboards', ja: '厳選されたムードボード' },
    shopTheLook: { vi: 'SHOP THE LOOK', en: 'SHOP THE LOOK', ja: 'コーディネートをショップ' },
    itemsAppeared: { vi: '({count} sản phẩm xuất hiện)', en: '({count} items featured)', ja: '({count} 点のアイテム)' },
    oneSize: { vi: 'Một cỡ', en: 'One Size', ja: 'ワンサイズ' },
    sizePrefix: { vi: 'Cỡ {s}', en: 'Size {s}', ja: 'サイズ {s}' },
    addOutfitBtn: { vi: 'THÊM TRỌN BỘ VÀO GIỎ HÀNG', en: 'ADD FULL OUTFIT TO CART', ja: 'コーディネートをすべてカートに追加' },
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* 1. Header & Điều hướng Concept Tab */}
      <div className="flex flex-col items-center text-center gap-6">
        <span className="font-sans text-[10px] tracking-[0.3em] font-semibold text-brand-gray uppercase">
          {labels.sectionSub[locale]}
        </span>
        
        {/* Menu Tabs phong cách tạp chí tối giản */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 border-b border-brand-border/40 pb-2 w-full max-w-2xl">
          {CONCEPTS.map((concept) => (
            <button
              key={concept.id}
              onClick={() => {
                setActiveConceptId(concept.id);
                // Reset sizes đã chọn
                setOutfitSizes({});
              }}
              className={`font-serif text-lg md:text-xl tracking-wider pb-3 relative transition-all duration-300 cursor-pointer ${
                activeConceptId === concept.id
                  ? 'text-brand-forest font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-forest'
                  : 'text-brand-gray/60 hover:text-brand-dark'
              }`}
            >
              {concept.title}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Chi tiết Concept hoạt động */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start bg-brand-light p-6 md:p-10 border border-brand-border/40 shadow-sm animate-fade-in">
        
        {/* Cột trái & giữa: Slider Lookbook tương tác */}
        <div className="lg:col-span-2 space-y-4">
          <Swiper
            modules={[Pagination, Navigation, EffectFade]}
            effect="fade"
            autoHeight={true}
            pagination={{ clickable: true }}
            navigation={true}
            className="mySwiper shadow-md border border-brand-border/35"
          >
            {activeConcept.lookbooks.map((lookbook) => (
              <SwiperSlide key={lookbook.id}>
                <div className="flex flex-col">
                  {/* Component ảnh Hotspots */}
                  <HotspotImage lookbook={lookbook} />
                  
                  {/* Chú thích ảnh lookbook */}
                  {lookbook.title && (
                    <div className="p-4 bg-brand-light border-t border-brand-border/40">
                      <h4 className="font-serif text-base font-semibold text-brand-dark">
                        {lookbook.title}
                      </h4>
                      <p className="text-xs text-brand-gray font-light font-sans mt-1">
                        {lookbook.description}
                      </p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Cột phải: Thông tin Concept & Tùy chọn mua trọn bộ */}
        <div className="space-y-6 flex flex-col justify-between h-full">
          {/* Mô tả Concept */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="font-sans text-[10px] tracking-widest text-brand-accent uppercase font-bold">
                {activeConcept.subtitle}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark tracking-wide">
                {activeConcept.title}
              </h3>
            </div>
            
            <p className="text-xs text-brand-gray font-sans font-light leading-relaxed">
              {activeConcept.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeConcept.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-brand-border/30 text-brand-gray text-[9px] font-sans tracking-wide uppercase"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Shop the Look - Mua trọn bộ */}
          <div className="border-t border-brand-border/60 pt-6 space-y-4">
            <h4 className="font-serif text-sm tracking-widest text-brand-dark uppercase font-semibold flex items-center justify-between">
              <span>{labels.shopTheLook[locale]}</span>
              <span className="text-[10px] font-sans font-normal text-brand-gray normal-case">
                {labels.itemsAppeared[locale].replace('{count}', activeConcept.lookbooks[0].hotspots.length.toString())}
              </span>
            </h4>

            {/* Danh sách các sản phẩm có trong Lookbook */}
            <div className="space-y-3">
              {activeConcept.lookbooks[0].hotspots.map((hotspot) => {
                const product = PRODUCTS.find((p) => p.id === hotspot.productId);
                if (!product) return null;

                const selectedSize = outfitSizes[product.id] || product.sizes[0] || 'S';
                const productName = product.name[locale] || product.name['vi'];
                const activePrice = product.prices[currency]?.price || 0;

                return (
                  <div
                    key={product.id}
                    className="flex gap-3 items-center justify-between p-2 bg-brand-light border border-brand-border/40 hover:border-brand-border transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.images[0]}
                        alt={productName}
                        className="w-10 h-13 object-cover flex-shrink-0 border border-brand-border"
                      />
                      <div className="min-w-0">
                        <h5 className="font-sans text-xs font-semibold text-brand-dark truncate pr-2">
                          {productName}
                        </h5>
                        <p className="font-sans text-xs font-bold text-brand-forest mt-0.5">
                          {formatPrice(activePrice, currency)}
                        </p>
                      </div>
                    </div>

                    {/* Lựa chọn size cho từng món */}
                    {product.sizes.length > 1 && product.sizes[0] !== 'One Size' ? (
                      <Select
                        size="small"
                        value={selectedSize}
                        onChange={(value) => handleSizeChange(product.id, value)}
                        className="w-20 font-sans text-xs rounded-none border-brand-border"
                        suffixIcon={<ChevronRight size={10} />}
                        popupClassName="font-sans text-xs"
                      >
                        {product.sizes.map((size) => (
                          <Select.Option key={size} value={size}>
                            {labels.sizePrefix[locale].replace('{s}', size)}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <span className="text-[10px] font-sans text-brand-gray font-light px-2">
                        {labels.oneSize[locale]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Nút Thêm trọn bộ outfit */}
            <Button
              type="primary"
              onClick={() => handleAddOutfitToCart(activeConcept.lookbooks[0].hotspots.map(h => ({ id: h.productId })))}
              className="w-full bg-brand-forest border-brand-forest hover:bg-[#22442d] hover:border-[#22442d] h-11 rounded-none font-sans text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              <ShoppingCart size={14} /> {labels.addOutfitBtn[locale]}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
