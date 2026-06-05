import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setSearchOpen, setQuery } from '../store/searchSlice';
import { Search, X, TrendingUp, Compass, ShoppingBag } from 'lucide-react';
import { PRODUCTS, CONCEPTS } from '../../../constants/shopData';
import { formatPrice } from '../../../utils';
import { useNavigate } from 'react-router-dom';

export const SearchOverlay: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state: RootState) => state.search.isOpen);
  const globalQuery = useSelector((state: RootState) => state.search.query);

  // Lấy locale và currency từ Redux
  const { locale, currency } = useSelector((state: RootState) => state.locale);
  
  const [localQuery, setLocalQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus vào ô input khi mở overlay
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalQuery(globalQuery);
      try {
        document.body.style.overflow = 'hidden';
      } catch {
        // Ignored
      }
    } else {
      try {
        document.body.style.overflow = 'unset';
      } catch {
        // Ignored
      }
    }
    return () => {
      try {
        document.body.style.overflow = 'unset';
      } catch {
        // Ignored
      }
    };
  }, [isOpen, globalQuery]);

  // Đóng khi ấn phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(setSearchOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  if (!isOpen) return null;

  // Lọc sản phẩm & concept phù hợp
  const trimmedQuery = localQuery.trim().toLowerCase();
  
  const filteredProducts = trimmedQuery
    ? PRODUCTS.filter((p) => {
        const name = p.name[locale] || p.name['vi'] || '';
        const desc = p.description[locale] || p.description['vi'] || '';
        return (
          name.toLowerCase().includes(trimmedQuery) ||
          p.subCategory.toLowerCase().includes(trimmedQuery) ||
          desc.toLowerCase().includes(trimmedQuery)
        );
      }).slice(0, 4)
    : [];

  const filteredConcepts = trimmedQuery
    ? CONCEPTS.filter(
        (c) =>
          c.title.toLowerCase().includes(trimmedQuery) ||
          c.subtitle.toLowerCase().includes(trimmedQuery) ||
          c.description.toLowerCase().includes(trimmedQuery)
      ).slice(0, 3)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localQuery.trim()) return;
    dispatch(setQuery(localQuery));
    dispatch(setSearchOpen(false));
    navigate(`/search?query=${encodeURIComponent(localQuery)}`);
  };

  const handleItemClick = (path: string) => {
    dispatch(setSearchOpen(false));
    navigate(path);
  };

  // Nhãn đa ngôn ngữ
  const labels: Record<string, Record<string, string>> = {
    portalTitle: { vi: 'Cổng Tìm Kiếm Southcape', en: 'Southcape Search Portal', ja: 'サウスケープ 検索ポータル' },
    placeholder: { vi: 'Tìm kiếm sản phẩm, concept, chất liệu dệt...', en: 'Search products, concepts, fabrics...', ja: '製品、コンセプト、生地を検索...' },
    clearBtn: { vi: 'Xóa', en: 'Clear', ja: 'クリア' },
    searchBtn: { vi: 'Tìm', en: 'Search', ja: '検索' },
    noConcepts: { vi: 'Không tìm thấy concept phù hợp', en: 'No matching concepts found', ja: '一致するコンセプトが見つかりません' },
    noProducts: { vi: 'Không tìm thấy sản phẩm phù hợp', en: 'No matching products found', ja: '一致する製品が見つかりません' },
    popularTitle: { vi: 'Từ khóa tìm kiếm phổ biến', en: 'Popular Searches', ja: 'よく検索されるキーワード' },
    exploreConcepts: { vi: 'Khám phá nhanh bộ sưu tập', en: 'Explore concepts quick list', ja: 'コレクションを簡単に見る' },
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm animate-fade-in flex flex-col justify-start">
      {/* Vùng thanh tìm kiếm trên cùng */}
      <div className="bg-brand-light border-b border-brand-border py-8 px-6 md:px-16 shadow-lg animate-slide-down">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <span className="font-serif text-sm tracking-widest text-brand-gray uppercase">
              {labels.portalTitle[locale]}
            </span>
            <button
              onClick={() => dispatch(setSearchOpen(false))}
              className="p-1 text-brand-dark hover:rotate-90 transition-transform duration-300 cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form tìm kiếm */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-1 text-brand-gray" size={24} />
            <input
              ref={inputRef}
              type="text"
              placeholder={labels.placeholder[locale]}
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-4 bg-transparent border-b-2 border-brand-dark/20 focus:border-brand-forest focus:outline-none font-serif text-2xl tracking-wide placeholder:text-gray-400 placeholder:font-light transition-colors"
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => setLocalQuery('')}
                className="absolute right-24 text-xs font-sans text-brand-gray hover:text-brand-dark tracking-wider uppercase cursor-pointer"
              >
                {labels.clearBtn[locale]}
              </button>
            )}
            <button
              type="submit"
              className="absolute right-0 bg-brand-forest text-white hover:bg-[#22442d] px-6 py-2.5 text-xs font-sans font-semibold tracking-widest uppercase transition-colors cursor-pointer"
            >
              {labels.searchBtn[locale]}
            </button>
          </form>

          {/* Kết quả tìm kiếm nhanh */}
          {trimmedQuery ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 pt-4 border-t border-brand-border max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
              {/* Cột 1: Concepts gợi ý */}
              <div className="space-y-4">
                <h4 className="font-serif text-sm tracking-widest text-brand-gray uppercase flex items-center gap-2">
                  <Compass size={14} /> Concepts ({filteredConcepts.length})
                </h4>
                {filteredConcepts.length === 0 ? (
                  <p className="text-xs text-brand-gray italic">{labels.noConcepts[locale]}</p>
                ) : (
                  <div className="space-y-3">
                    {filteredConcepts.map((concept) => (
                      <div
                        key={concept.id}
                        onClick={() => handleItemClick(`/concept/${concept.id}`)}
                        className="flex items-center gap-3 p-2 hover:bg-brand-border/40 cursor-pointer transition-colors"
                      >
                        <img
                          src={concept.coverImage}
                          alt={concept.title}
                          className="w-12 h-12 object-cover"
                        />
                        <div>
                          <h5 className="font-sans text-xs font-semibold text-brand-dark">
                            {concept.title}
                          </h5>
                          <p className="font-serif text-[10px] text-brand-gray italic">
                            {concept.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cột 2: Sản phẩm tìm thấy */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="font-serif text-sm tracking-widest text-brand-gray uppercase flex items-center gap-2">
                  <ShoppingBag size={14} /> {locale === 'vi' ? 'Sản phẩm gợi ý' : 'Suggested Products'} ({filteredProducts.length})
                </h4>
                {filteredProducts.length === 0 ? (
                  <p className="text-xs text-brand-gray italic">{labels.noProducts[locale]}</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => {
                      const productName = product.name[locale] || product.name['vi'];
                      const activePrice = product.prices[currency]?.price || 0;
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleItemClick(`/product/${product.id}`)}
                          className="flex items-center gap-3 p-2 hover:bg-brand-border/40 cursor-pointer transition-colors border border-transparent hover:border-brand-border"
                        >
                          <img
                            src={product.images[0]}
                            alt={productName}
                            className="w-12 h-16 object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-sans text-xs font-semibold text-brand-dark truncate">
                              {productName}
                            </h5>
                            <p className="text-[10px] text-brand-gray font-light">
                              {product.subCategory}
                            </p>
                            <p className="font-sans text-xs text-brand-forest font-medium mt-1">
                              {formatPrice(activePrice, currency)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Trạng thái mặc định: Gợi ý các xu hướng hoặc Concept chính
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2 pt-2">
              <div>
                <h4 className="font-serif text-xs tracking-widest text-brand-gray uppercase flex items-center gap-2 mb-3">
                  <TrendingUp size={12} /> {labels.popularTitle[locale]}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Polo', 'Skirt', 'Visor', 'Knitwear', 'Quiet Luxury', 'Linen'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setLocalQuery(tag)}
                      className="px-3 py-1.5 bg-brand-border/40 hover:bg-brand-border text-brand-dark text-xs font-sans tracking-wide transition-colors cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-serif text-xs tracking-widest text-brand-gray uppercase flex items-center gap-2 mb-3">
                  <Compass size={12} /> {labels.exploreConcepts[locale]}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {CONCEPTS.slice(0, 2).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleItemClick(`/concept/${c.id}`)}
                      className="group cursor-pointer overflow-hidden relative aspect-video"
                    >
                      <img
                        src={c.coverImage}
                        alt={c.title}
                        className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <span className="font-serif text-xs text-white tracking-widest font-semibold">
                          {c.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vùng nền đen mờ nhấp vào để đóng */}
      <div className="flex-1 cursor-pointer" onClick={() => dispatch(setSearchOpen(false))} />
    </div>
  );
};

export default SearchOverlay;
