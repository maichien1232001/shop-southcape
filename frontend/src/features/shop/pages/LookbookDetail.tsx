import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CONCEPTS, PRODUCTS } from '../../../constants/shopData';
import { HotspotImage } from '../components/HotspotImage';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils';
import { AnimateContainer } from '../../../components/AnimateContainer';
import { ArrowLeft, ShoppingCart, ChevronRight } from 'lucide-react';
import { Button, notification, Select } from 'antd';
import { RootState } from '../../../store';

export const LookbookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  // Lấy locale và currency từ Redux
  const { locale, currency } = useSelector((state: RootState) => state.locale);

  // Tìm kiếm concept tương ứng
  const concept = CONCEPTS.find((c) => c.id === id);

  // Cuộn lên đầu trang khi chuyển hướng vào trang này
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  // Nhãn đa ngôn ngữ
  const labels: Record<string, Record<string, string>> = {
    notFound: { vi: 'Concept không tồn tại', en: 'Concept not found', ja: 'コンセプトが見つかりません' },
    notFoundDesc: { vi: 'Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.', en: 'Please check the URL or go back to home.', ja: 'URLを確認するか、ホームに戻ってください。' },
    goHome: { vi: 'Quay về Trang chủ', en: 'Back to Home', ja: 'ホームに戻る' },
    itemsInOutfit: { vi: 'Sản phẩm trong bộ phối', en: 'Items in Outfit', ja: 'コーディネートアイテム' },
    itemsCountLabel: { vi: '{count} Món', en: '{count} Items', ja: '{count} 点' },
    oneSize: { vi: 'Một cỡ', en: 'One Size', ja: 'ワンサイズ' },
    addToCartOutfit: { vi: 'THÊM TRỌN BỘ OUTFIT VÀO GIỎ HÀNG', en: 'ADD FULL OUTFIT TO CART', ja: 'コーディネートをすべてカートに追加' },
    outfitAddedSuccess: { vi: 'Đã thêm trọn bộ {count} món đồ vào giỏ hàng thành công!', en: 'Successfully added all {count} items to cart!', ja: 'コーディネート {count} 点すべてがカートに追加されました！' },
    singleItemAddedSuccess: { vi: 'Đã thêm {name} (Cỡ {size}) vào giỏ hàng', en: 'Added {name} (Size {size}) to cart', ja: '{name} (サイズ {size}) をカートに追加しました' },
  };

  if (!concept) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="font-serif text-2xl text-brand-dark">{labels.notFound[locale]}</h2>
        <p className="text-brand-gray text-xs">{labels.notFoundDesc[locale]}</p>
        <Link to="/" className="text-xs font-semibold text-brand-forest hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> {labels.goHome[locale]}
        </Link>
      </div>
    );
  }

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddSingleItem = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const size = selectedSizes[product.id] || product.sizes[0] || 'S';
    const color = product.colors[0] || 'Default';

    addProduct(product, color, size, 1);
    
    const productName = product.name[locale] || product.name['vi'];
    notification.success({
      message: locale === 'vi' ? 'Thêm vào giỏ hàng' : 'Added to Cart',
      description: labels.singleItemAddedSuccess[locale]
        .replace('{name}', productName)
        .replace('{size}', size),
      placement: 'topRight'
    });
  };

  const handleAddFullOutfit = (products: { productId: string }[]) => {
    let addedCount = 0;
    products.forEach((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return;

      const size = selectedSizes[product.id] || product.sizes[0] || 'S';
      const color = product.colors[0] || 'Default';

      addProduct(product, color, size, 1);
      addedCount++;
    });

    if (addedCount > 0) {
      notification.success({
        message: locale === 'vi' ? 'Thêm trọn bộ outfit' : 'Outfit Added',
        description: labels.outfitAddedSuccess[locale].replace('{count}', addedCount.toString()),
        placement: 'topRight'
      });
    }
  };

  return (
    <AnimateContainer animation="fade-in" className="min-h-screen pb-16">
      {/* 1. Phần Đầu Trang Concept với màu nền chủ đạo */}
      <section className={`${concept.themeColor} py-12 md:py-20 border-b border-brand-border/40 transition-colors duration-500`}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-[11px] font-sans font-semibold tracking-wider text-current uppercase hover:opacity-75 transition-opacity cursor-pointer"
          >
            <ArrowLeft size={14} /> {labels.goHome[locale]}
          </button>
          
          <div className="space-y-2">
            <span className="font-sans text-[10px] tracking-widest uppercase font-bold opacity-75">
              {concept.subtitle}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide text-current">
              {concept.title}
            </h1>
          </div>
          
          <p className="text-xs md:text-sm font-sans font-light leading-relaxed max-w-3xl opacity-85">
            {concept.description}
          </p>
        </div>
      </section>

      {/* 2. Trình diễn Lookbooks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {concept.lookbooks.map((lookbook, index) => (
          <div
            key={lookbook.id}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start"
          >
            {/* Cột trái: Ảnh tương tác Hotspots (Chiếm 3/5 cột) */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2">
                <span>LOOK {index + 1}</span>
                {lookbook.title && (
                  <span className="text-xs font-sans font-light text-brand-gray border-l border-brand-border pl-2">
                    {lookbook.title}
                  </span>
                )}
              </h3>
              <div className="shadow-md border border-brand-border/30">
                <HotspotImage lookbook={lookbook} />
              </div>
              {lookbook.description && (
                <p className="text-xs text-brand-gray font-sans font-light leading-relaxed mt-2 pl-1 border-l-2 border-brand-forest">
                  {lookbook.description}
                </p>
              )}
            </div>

            {/* Cột phải: Danh sách chi tiết các món đồ thời trang (Chiếm 2/5 cột) */}
            <div className="lg:col-span-2 space-y-6 bg-brand-light p-6 border border-brand-border shadow-sm">
              <div className="flex justify-between items-center border-b border-brand-border pb-4">
                <h4 className="font-serif text-sm font-semibold tracking-widest text-brand-dark uppercase">
                  {labels.itemsInOutfit[locale]}
                </h4>
                <span className="text-[10px] font-sans font-semibold text-brand-gray">
                  {labels.itemsCountLabel[locale].replace('{count}', lookbook.hotspots.length.toString())}
                </span>
              </div>

              {/* Chi tiết từng sản phẩm */}
              <div className="space-y-4">
                {lookbook.hotspots.map((hotspot) => {
                  const product = PRODUCTS.find((p) => p.id === hotspot.productId);
                  if (!product) return null;

                  const currentSelectedSize = selectedSizes[product.id] || product.sizes[0] || 'S';
                  const productName = product.name[locale] || product.name['vi'];
                  const activePrice = product.prices[currency]?.price || 0;

                  return (
                    <div
                      key={product.id}
                      className="flex gap-4 p-3 bg-brand-light border border-brand-border/30 hover:border-brand-border transition-colors duration-300"
                    >
                      {/* Ảnh đại diện */}
                      <Link to={`/product/${product.id}`} className="w-16 h-20 bg-brand-border/10 overflow-hidden flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={productName}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Thông tin */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-0.5">
                          <h5 className="font-sans text-xs font-semibold text-brand-dark truncate">
                            <Link to={`/product/${product.id}`} className="hover:text-brand-forest">
                              {productName}
                            </Link>
                          </h5>
                          <p className="text-[9px] text-brand-gray tracking-wider uppercase font-light">
                            {product.subCategory}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="font-sans text-xs font-bold text-brand-forest">
                            {formatPrice(activePrice, currency)}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Chọn cỡ */}
                            {product.sizes.length > 1 && product.sizes[0] !== 'One Size' ? (
                              <Select
                                size="small"
                                value={currentSelectedSize}
                                onChange={(value) => handleSizeSelect(product.id, value)}
                                className="w-16 font-sans text-[10px]"
                                popupClassName="font-sans text-xs"
                                suffixIcon={<ChevronRight size={8} />}
                              >
                                {product.sizes.map((s) => (
                                  <Select.Option key={s} value={s}>
                                    {s}
                                  </Select.Option>
                                ))}
                              </Select>
                            ) : (
                              <span className="text-[9px] font-sans text-brand-gray mr-1">{labels.oneSize[locale]}</span>
                            )}

                            {/* Nút thêm món lẻ */}
                            <Button
                              size="small"
                              onClick={() => handleAddSingleItem(product.id)}
                              className="rounded-none h-7 px-2 bg-brand-forest border-brand-forest hover:bg-[#22442d] hover:border-[#22442d] text-white text-[10px] font-sans flex items-center justify-center cursor-pointer"
                              type="primary"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nút thêm trọn bộ outfit */}
              <Button
                type="primary"
                onClick={() => handleAddFullOutfit(lookbook.hotspots)}
                className="w-full bg-brand-forest border-brand-forest hover:bg-[#22442d] hover:border-[#22442d] h-12 rounded-none font-sans text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 mt-2 cursor-pointer"
              >
                <ShoppingCart size={15} /> {labels.addToCartOutfit[locale]}
              </Button>
            </div>
          </div>
        ))}
      </section>
    </AnimateContainer>
  );
};

export default LookbookDetail;
