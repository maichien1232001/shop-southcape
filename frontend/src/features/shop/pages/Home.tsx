import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { CONCEPTS } from '../../../constants/shopData';
import { ConceptSection } from '../components/ConceptSection';
import { ProductCard } from '../components/ProductCard';
import { AnimateContainer } from '../../../components/AnimateContainer';
import { Compass, Sparkles, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../../store/services/rtkQueryStoreApi';

// Import CSS của Swiper
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: dbProducts, isLoading } = useGetProductsQuery();
  
  // Lấy 4 sản phẩm bán chạy/nổi bật để trưng bày ở dưới
  const featuredProducts = dbProducts ? dbProducts.slice(0, 4) : [];

  const scrollToMoodboards = () => {
    const section = document.getElementById('moodboard-showcase');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimateContainer animation="fade-in" className="space-y-6">
      {/* 1. HERO SLIDER BANNER: Slider toàn màn hình */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-brand-dark">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="effect-fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {CONCEPTS.map((concept) => (
            <SwiperSlide key={concept.id} className="relative h-full w-full">
              {/* Background Image */}
              <div className="absolute inset-0 bg-black/30 z-10" />
              <img
                src={concept.coverImage}
                alt={concept.title}
                className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 animate-[zoom_20s_infinite_alternate]"
              />

              {/* Nội dung chữ đè lên */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto space-y-4">
                <span className="font-sans text-[10px] sm:text-xs tracking-[0.4em] font-bold text-[#b2935b] uppercase animate-slide-down">
                  {concept.subtitle}
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-wide font-medium text-brand-light leading-tight animate-slide-up">
                  {concept.title}
                </h1>
                <p className="font-sans text-xs sm:text-sm text-gray-300 font-light max-w-xl leading-relaxed hidden sm:block">
                  {concept.description}
                </p>
                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => navigate(`/concept/${concept.id}`)}
                    className="bg-brand-light text-brand-dark hover:bg-brand-accent hover:text-brand-dark px-8 py-3.5 text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 rounded-none shadow-md"
                  >
                    Xem chi tiết Concept
                  </button>
                  <button
                    onClick={scrollToMoodboards}
                    className="border border-white/50 text-white hover:border-white hover:bg-white/10 px-8 py-3.5 text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 rounded-none hidden md:block"
                  >
                    Khám phá thêm
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Nút cuộn xuống dưới */}
        <button
          onClick={scrollToMoodboards}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white hover:text-brand-accent transition-colors flex flex-col items-center gap-1.5 animate-bounce"
        >
          <span className="font-sans text-[9px] tracking-widest uppercase">Cuộn xuống</span>
          <ChevronDown size={14} />
        </button>
      </section>

      {/* 2. BRAND PHIẾU NARRATIVE: Tuyên ngôn thương hiệu */}
      <section className="py-16 bg-[#f7f6f3] border-b border-brand-border/40 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <Compass className="mx-auto text-brand-forest/60" size={28} />
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-brand-dark font-medium leading-relaxed italic">
            "Nature Meets Human. Sporty Elegance."
          </h2>
          <p className="font-sans text-xs md:text-sm text-brand-gray leading-relaxed font-light">
            Southcape định nghĩa lại phong cách thời trang nghỉ dưỡng và thể thao cao cấp. Lấy cảm hứng từ sân golf uốn lượn ven đại dương Nam Hải, chúng tôi kiến tạo các bộ trang phục kết hợp khả năng co giãn đỉnh cao, chất vải siêu nhẹ tối tân, mang đến sự lịch lãnh tuyệt đối cho từng chuyển động của bạn.
          </p>
        </div>
      </section>

      {/* 3. CURATED MOODBOARDS: Khu vực mua sắm theo Look / Concept chính */}
      <div id="moodboard-showcase">
        <ConceptSection />
      </div>

      {/* 4. NEW ARRIVALS / INDIVIDUAL PRODUCTS: Mua sắm sản phẩm lẻ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-border/40 space-y-10">
        <div className="flex flex-col items-center text-center gap-2">
          <span className="font-sans text-[10px] tracking-[0.3em] font-semibold text-brand-gray uppercase flex items-center gap-1">
            <Sparkles size={11} /> Featured Pieces
          </span>
          <h3 className="font-serif text-2xl md:text-3xl tracking-wide font-medium text-brand-dark">
            Món Đồ Đọc Bản Nổi Bật
          </h3>
        </div>

        {/* Lưới sản phẩm */}
        {isLoading ? (
          <div className="text-center py-12 font-sans text-xs tracking-wider text-brand-gray uppercase">
            Đang tải bộ sưu tập nổi bật...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id || (product as { _id?: string })._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </AnimateContainer>
  );
};
export default Home;
