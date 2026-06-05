import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils';
import { Rating } from '../../../components/Rating';
import { AnimateContainer } from '../../../components/AnimateContainer';
import { ArrowLeft, ShoppingCart, ShieldCheck, Sparkles, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, notification } from 'antd';
import { ProductCard } from '../components/ProductCard';
import { RootState } from '../../../store';
import { useGetProductDetailsQuery, useGetProductsQuery } from '../../store/services/rtkQueryStoreApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';


export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct } = useCart();

  // Lấy locale và currency từ Redux
  const { locale, currency } = useSelector((state: RootState) => state.locale);

  // Lấy thông tin sản phẩm từ cơ sở dữ liệu
  const { data: product, isLoading: isProductLoading } = useGetProductDetailsQuery(id || '');

  // Lấy danh sách sản phẩm cùng danh mục cho phần gợi ý
  const { data: allProducts } = useGetProductsQuery(
    product
      ? { category: (product.category as { slug?: string; _id?: string })?.slug || (product.category as { slug?: string; _id?: string })?._id || String(product.category) }
      : undefined,
    { skip: !product }
  );

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  // Khởi tạo các phân loại mặc định
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (product) {
      setSelectedColor(_.get(product, 'colors[0]', ''));
      setSelectedSize(_.get(product, 'sizes[0]', ''));
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Ngôn ngữ nhãn tĩnh
  const labels: Record<string, Record<string, string>> = {
    notFound: { vi: 'Sản phẩm không tồn tại', en: 'Product not found', ja: '製品が見つかりません' },
    notFoundDesc: { vi: 'Vui lòng kiểm tra lại đường dẫn hoặc danh sách sản phẩm.', en: 'Please check the URL or the product catalog again.', ja: 'URLまたは製品カタログをもう một lầnご確認ください。' },
    backHome: { vi: 'Quay về Trang chủ', en: 'Back to Home', ja: 'ホームに戻る' },
    backPrev: { vi: 'Quay lại trang trước', en: 'Back to previous page', ja: '前のページに戻る' },
    productCode: { vi: 'Mã sản phẩm', en: 'Product Code', ja: '商品コード' },
    colors: { vi: 'Màu sắc', en: 'Colors', ja: 'カラー' },
    sizes: { vi: 'Kích cỡ', en: 'Sizes', ja: 'サイズ' },
    addToCart: { vi: 'THÊM VÀO GIỎ HÀNG', en: 'ADD TO CART', ja: 'カートに追加' },
    details: { vi: 'CHI TIẾT & CHẤT LIỆU SẢN PHẨM', en: 'DETAILS & MATERIALS', ja: '詳細＆素材' },
    guarantee: { vi: 'Hàng chính hãng phân phối từ Southcape', en: 'Authentic product distributed by Southcape', ja: 'Southcapeが販売する正規品' },
    recommendTitle: { vi: 'Có Thể Bạn Cũng Ưa Thích', en: 'You May Also Like', ja: 'おすすめ商品' },
    recommendSub: { vi: 'Complete the collection', en: 'Complete the collection', ja: 'コレクションを完成させる' },
  };

  if (isProductLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="font-sans text-xs tracking-wider text-brand-gray uppercase">
          Đang tải chi tiết sản phẩm...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="font-serif text-2xl text-brand-dark">{labels.notFound[locale]}</h2>
        <p className="text-brand-gray text-xs">{labels.notFoundDesc[locale]}</p>
        <Link to="/" className="text-xs font-semibold text-brand-forest hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> {labels.backHome[locale]}
        </Link>
      </div>
    );
  }

  // Phân giải thông tin giá động theo tiền tệ đang chọn
  const price = _.get(product, `prices.${currency}.price`, 0);
  const originalPrice = _.get(product, `prices.${currency}.compare_at_price`);
  const hasDiscount = originalPrice ? originalPrice > price : false;

  const productName = _.get(product, `name.${locale}`) || _.get(product, 'name.vi', '');
  const productDesc = _.get(product, `description.${locale}`) || _.get(product, 'description.vi', '');

  const handleAddToCart = () => {
    if (!selectedSize) {
      notification.error({
        message: locale === 'vi' ? 'Chọn kích cỡ' : 'Select Size',
        description: locale === 'vi' ? 'Vui lòng chọn kích cỡ sản phẩm' : locale === 'en' ? 'Please select a size' : 'サイズを選択してください',
        placement: 'topRight'
      });
      return;
    }
    if (!selectedColor) {
      notification.error({
        message: locale === 'vi' ? 'Chọn màu sắc' : 'Select Color',
        description: locale === 'vi' ? 'Vui lòng chọn màu sắc sản phẩm' : locale === 'en' ? 'Please select a color' : 'カラーを選択してください',
        placement: 'topRight'
      });
      return;
    }

    addProduct(product, selectedColor, selectedSize, quantity);
    notification.success({
      message: locale === 'vi' ? 'Thêm vào giỏ hàng' : 'Added to Cart',
      description: locale === 'vi'
        ? `Đã thêm ${quantity} x ${productName} vào giỏ hàng`
        : locale === 'en'
        ? `Added ${quantity} x ${productName} to cart`
        : `${quantity} x ${productName}をカートに追加しました`,
      placement: 'topRight'
    });
  };

  // Lấy các sản phẩm liên quan (cùng danh mục, bỏ sản phẩm hiện tại)
  const relatedProducts = allProducts
    ? allProducts.filter(
        (p) => {
          const pId = p.id || (p as { _id?: string })._id;
          const currentId = product.id || (product as { _id?: string })._id;
          return pId !== currentId;
        }
      ).slice(0, 4)
    : [];

  const images = _.get(product, 'images', []);
  const details = _.get(product, 'details', []);

  return (
    <AnimateContainer animation="fade-in" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-[11px] font-sans font-semibold tracking-wider text-brand-gray uppercase hover:text-brand-dark transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} /> {labels.backPrev[locale]}
      </button>

      {/* Grid 2 cột: Ảnh bên trái, Thông tin bên phải */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        
        {/* Cột trái: Bộ sưu tập hình ảnh dạng Swiper cao cấp */}
        <div className="space-y-4 w-full">
          {/* Main Swiper */}
          <div className="relative group overflow-hidden border border-brand-border/40 shadow-sm">
            <Swiper
              modules={[Navigation, Thumbs]}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              spaceBetween={0}
              slidesPerView={1}
              className="aspect-[3/4] w-full bg-brand-border/10 relative"
            >
              {_.map(images, (img, idx) => (
                <SwiperSlide key={idx} className="relative w-full h-full overflow-hidden">
                  <img
                    src={img}
                    alt={`${productName} View ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </SwiperSlide>
              ))}

              {/* Custom Navigation Arrows with Glassmorphism */}
              <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-white transition-all opacity-0 group-hover:opacity-100 duration-300 shadow-sm cursor-pointer">
                <ChevronLeft size={18} />
              </button>
              <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-white transition-all opacity-0 group-hover:opacity-100 duration-300 shadow-sm cursor-pointer">
                <ChevronRight size={18} />
              </button>
            </Swiper>
          </div>

          {/* Thumbs Swiper */}
          <div className="w-full">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={12}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="thumbs-swiper w-full"
            >
              {_.map(images, (img, idx) => (
                <SwiperSlide key={idx} className="cursor-pointer">
                  <div className="aspect-[3/4] w-full overflow-hidden border border-brand-border hover:border-brand-gray transition-all duration-300 relative group bg-brand-light">
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    {/* Dimming overlay */}
                    <div className="absolute inset-0 bg-brand-dark/15 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Cột phải: Thông tin sản phẩm & Điều hướng giỏ hàng */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="font-sans text-[10px] tracking-widest text-brand-accent uppercase font-bold">
              {_.get(product, 'subCategory', '')}
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark tracking-wide leading-tight">
              {productName}
            </h1>
            <div className="flex items-center gap-4 pt-1">
              <Rating value={_.get(product, 'rating', 0)} count={_.get(product, 'reviewsCount', 0)} size={14} />
              <span className="text-xs text-brand-gray border-l border-brand-border pl-4">
                {labels.productCode[locale]}: <strong className="text-brand-dark">{_.get(product, 'sku') || _.get(product, 'id')}</strong>
              </span>
            </div>
          </div>

          {/* Bảng giá */}
          <div className="flex items-baseline gap-4 py-2 border-y border-brand-border/50">
            <span className="font-sans text-2xl font-bold text-brand-forest">
              {formatPrice(price, currency)}
            </span>
            {hasDiscount && (
              <span className="font-sans text-base text-brand-gray line-through">
                {formatPrice(originalPrice || 0, currency)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs text-red-500 font-sans font-semibold uppercase tracking-wider">
                {locale === 'vi' ? 'Mức giá ưu đãi' : locale === 'en' ? 'Special Offer' : 'スペシャルプライス'}
              </span>
            )}
          </div>

          {/* Mô tả ngắn */}
          <p className="text-xs text-brand-gray font-sans font-light leading-relaxed">
            {productDesc}
          </p>

          {/* Chọn Màu Sắc */}
          <div className="space-y-2">
            <h4 className="font-sans text-[11px] tracking-widest text-brand-dark font-bold uppercase">
              {labels.colors[locale]}: <span className="font-light text-brand-gray normal-case pl-1">{selectedColor}</span>
            </h4>
            <div className="flex gap-2">
              {_.map(_.get(product, 'colors', []), (color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 text-xs font-sans border transition-all cursor-pointer ${
                    selectedColor === color
                      ? 'border-brand-forest bg-brand-forest text-white'
                      : 'border-brand-border bg-brand-light text-brand-dark hover:border-brand-gray'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Chọn Kích Cỡ */}
          <div className="space-y-2">
            <h4 className="font-sans text-[11px] tracking-widest text-brand-dark font-bold uppercase">
              {labels.sizes[locale]}: <span className="font-light text-brand-gray normal-case pl-1">{selectedSize}</span>
            </h4>
            <div className="flex gap-2">
              {_.map(_.get(product, 'sizes', []), (size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 text-xs font-sans font-semibold border flex items-center justify-center transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'border-brand-forest bg-brand-forest text-white'
                      : 'border-brand-border bg-brand-light text-brand-dark hover:border-brand-gray'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Số Lượng & Nút Hành Động */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {/* Tăng giảm số lượng */}
            <div className="flex items-center border border-brand-border h-12 self-start sm:self-auto">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="px-4 text-brand-gray hover:text-brand-dark disabled:opacity-30 transition-colors h-full cursor-pointer"
              >
                -
              </button>
              <span className="px-6 text-sm font-sans font-semibold text-brand-dark select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 text-brand-gray hover:text-brand-dark transition-colors h-full cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Nút thêm vào giỏ */}
            <Button
              type="primary"
              onClick={handleAddToCart}
              className="flex-1 !bg-brand-forest !border-brand-forest hover:!bg-[#22442d] hover:!border-[#22442d] !h-12 !rounded-none font-sans text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer !text-white"
            >
              <ShoppingCart size={15} /> {labels.addToCart[locale]}
            </Button>
          </div>

          {/* Accordion Chi Tiết Sản Phẩm */}
          <div className="pt-4 border-t border-brand-border/50">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="w-full flex justify-between items-center py-2 text-left font-serif text-sm tracking-widest text-brand-dark uppercase font-semibold hover:text-brand-forest transition-colors cursor-pointer"
            >
              <span>{labels.details[locale]}</span>
              {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {detailsOpen && (
              <div className="pt-2 pb-4 animate-fade-in">
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-brand-gray font-sans font-light leading-relaxed">
                  {_.map(details, (detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                  <li className="list-none pt-2 font-semibold text-[10px] text-brand-dark flex items-center gap-1.5 uppercase tracking-wide">
                    <ShieldCheck size={13} className="text-brand-forest" /> {labels.guarantee[locale]}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GỢI Ý PHỐI ĐỒ / SẢN PHẨM KHÁC */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-brand-border pt-16 space-y-8">
          <div className="flex flex-col items-center text-center gap-1">
            <span className="font-sans text-[9px] tracking-[0.3em] font-semibold text-brand-gray uppercase flex items-center gap-1">
              <Sparkles size={10} /> {labels.recommendSub[locale]}
            </span>
            <h3 className="font-serif text-xl md:text-2xl tracking-wide font-medium text-brand-dark">
              {labels.recommendTitle[locale]}
            </h3>
          </div>

          {/* Lưới sản phẩm lẻ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {_.map(relatedProducts, (p) => (
              <ProductCard key={p.id || (p as { _id?: string })._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </AnimateContainer>
  );
};

export default ProductDetail;
