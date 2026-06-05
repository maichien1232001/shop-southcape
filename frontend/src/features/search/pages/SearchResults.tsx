import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CONCEPTS } from '../../../constants/shopData';
import { ProductCard } from '../../shop/components/ProductCard';
import { AnimateContainer } from '../../../components/AnimateContainer';
import { Search, Compass, ShoppingBag, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Select, Button } from 'antd';
import { RootState } from '../../../store';
import { useGetProductsQuery } from '../../store/services/rtkQueryStoreApi';

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy locale và currency từ Redux
  const { locale, currency } = useSelector((state: RootState) => state.locale);

  const queryParam = searchParams.get('query') || '';
  const categoryParam = searchParams.get('category') || 'all';

  const [searchInput, setSearchInput] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceFilter, setPriceFilter] = useState<'all' | 'under100' | '100to200' | 'over200'>('all');

  // Đồng bộ state khi URL params thay đổi
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setSearchInput(queryParam);
    setSelectedCategory(categoryParam);
  }, [queryParam, categoryParam]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Gọi API lấy sản phẩm thực tế theo category và tìm kiếm từ database
  const { data: dbProducts, isLoading } = useGetProductsQuery({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    search: queryParam || undefined,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({
      query: searchInput,
      category: selectedCategory,
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({
      query: searchInput,
      category,
    });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCategory('all');
    setPriceFilter('all');
    setSearchParams({});
  };

  // Logic Lọc sản phẩm & concept kết hợp
  const trimmedQuery = queryParam.trim().toLowerCase();

  // 1. Lọc các Concept (giữ nguyên lọc tĩnh của lookbook)
  const matchedConcepts = CONCEPTS.filter((c) => {
    if (!trimmedQuery) return false;
    return (
      c.title.toLowerCase().includes(trimmedQuery) ||
      c.subtitle.toLowerCase().includes(trimmedQuery) ||
      c.description.toLowerCase().includes(trimmedQuery) ||
      c.tags.some((t) => t.toLowerCase().includes(trimmedQuery))
    );
  });

  // 2. Lọc các Sản phẩm theo khoảng giá
  const matchedProducts = dbProducts
    ? dbProducts.filter((product) => {
        // Lọc theo Khoảng giá (chuẩn hóa động theo tiền tệ đang chọn)
        let matchesPrice = true;
        const activePrice = product.prices[currency]?.price || 0;

        if (priceFilter === 'under100') {
          matchesPrice = activePrice < (currency === 'USD' ? 100 : 2500000);
        } else if (priceFilter === '100to200') {
          const low = currency === 'USD' ? 100 : 2500000;
          const high = currency === 'USD' ? 200 : 5000000;
          matchesPrice = activePrice >= low && activePrice <= high;
        } else if (priceFilter === 'over200') {
          matchesPrice = activePrice > (currency === 'USD' ? 200 : 5000000);
        }

        return matchesPrice;
      })
    : [];

  // Nhãn đa ngôn ngữ
  const labels: Record<string, Record<string, string>> = {
    searchPlaceholder: { vi: 'Tìm kiếm sản phẩm hoặc concept...', en: 'Search products or concepts...', ja: '製品またはコンセプトを検索...' },
    searchBtn: { vi: 'Tìm', en: 'Search', ja: '検索' },
    resultsTitle: { vi: 'Kết quả tìm kiếm cho "{query}"', en: 'Search results for "{query}"', ja: '「{query}」の検索結果' },
    allProductsTitle: { vi: 'Tất cả sản phẩm', en: 'All Products', ja: 'すべての製品' },
    foundProducts: { vi: 'Tìm thấy {count} sản phẩm', en: 'Found {count} products', ja: '{count} 個の製品が見つかりました' },
    foundConcepts: { vi: ' và {count} concept', en: ' and {count} concepts', ja: ' と {count} 個のコンセプト' },
    allCategories: { vi: 'Tất cả danh mục', en: 'All Categories', ja: 'すべてのカテゴリ' },
    womenCategory: { vi: 'Thời trang Nữ', en: 'Women', ja: 'レディース' },
    menCategory: { vi: 'Thời trang Nam', en: 'Men', ja: 'メンズ' },
    accCategory: { vi: 'Phụ kiện & Khác', en: 'Accessories', ja: 'アクセサリー' },
    resetFilters: { vi: 'Đặt lại', en: 'Reset', ja: 'リセット' },
    filterTitle: { vi: 'BỘ LỌC TÌM KIẾM', en: 'SEARCH FILTERS', ja: 'フィルター検索' },
    priceFilterTitle: { vi: 'Khoảng giá tiền', en: 'Price Range', ja: '価格帯' },
    allPrices: { vi: 'Tất cả mức giá', en: 'All prices', ja: 'すべての価格' },
    conceptMatchedHeader: { vi: 'CONCEPTS MOODBOARD PHÙ HỢP', en: 'MATCHING CONCEPTS', ja: 'マッチしたコンセプト' },
    productMatchedHeader: { vi: 'SẢN PHẨM PHÙ HỢP', en: 'MATCHING PRODUCTS', ja: 'マッチした製品' },
    noProductsFound: { vi: 'Không tìm thấy sản phẩm nào khớp bộ lọc đã chọn.', en: 'No products match the selected filters.', ja: '選択したフィルターに一致する製品が見つかりません。' },
    clearFiltersBtn: { vi: 'Xóa bộ lọc để xem tất cả', en: 'Clear filters to view all', ja: 'フィルターをクリアしてすべて表示' },
  };

  const getPriceLabel = (filterValue: string) => {
    if (filterValue === 'all') return labels.allPrices[locale];
    if (currency === 'USD') {
      if (filterValue === 'under100') return 'Dưới $100';
      if (filterValue === '100to200') return '$100 - $200';
      return 'Trên $200';
    } else {
      if (filterValue === 'under100') return 'Dưới 2.500.000 ₫';
      if (filterValue === '100to200') return '2.500.000 ₫ - 5.000.000 ₫';
      return 'Trên 5.000.000 ₫';
    }
  };

  return (
    <AnimateContainer animation="fade-in" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[75vh] space-y-10">
      
      {/* 1. Thanh tìm kiếm trên trang kết quả */}
      <div className="bg-brand-light p-6 border border-brand-border/40 shadow-sm max-w-3xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3 text-brand-gray" size={18} />
            <input
              type="text"
              placeholder={labels.searchPlaceholder[locale]}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-brand-border focus:border-brand-forest focus:outline-none font-sans text-sm tracking-wide transition-colors"
            />
          </div>
          <button
            type="submit"
            className="bg-brand-forest hover:bg-[#22442d] text-white px-6 py-2.5 text-xs font-sans font-bold tracking-widest uppercase transition-colors cursor-pointer"
          >
            {labels.searchBtn[locale]}
          </button>
        </form>
      </div>

      {/* 2. Tiêu đề hiển thị trạng thái tìm kiếm */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-border/60 pb-4 gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-brand-dark tracking-wide">
            {queryParam ? labels.resultsTitle[locale].replace('{query}', queryParam) : labels.allProductsTitle[locale]}
          </h2>
          <p className="text-xs text-brand-gray font-sans font-light mt-1">
            {labels.foundProducts[locale].replace('{count}', matchedProducts.length.toString())}
            {matchedConcepts.length > 0 && (
              <span>{labels.foundConcepts[locale].replace('{count}', matchedConcepts.length.toString())}</span>
            )}
          </p>
        </div>

        {/* Thanh công cụ lọc nhanh bên trên */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Lọc danh mục */}
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-36 font-sans text-xs rounded-none"
            popupClassName="font-sans text-xs"
          >
            <Select.Option value="all">{labels.allCategories[locale]}</Select.Option>
            <Select.Option value="women">{labels.womenCategory[locale]}</Select.Option>
            <Select.Option value="men">{labels.menCategory[locale]}</Select.Option>
            <Select.Option value="accessories">{labels.accCategory[locale]}</Select.Option>
          </Select>

          {/* Nút reset */}
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[10px] font-sans font-semibold tracking-wider text-brand-gray hover:text-brand-dark uppercase border border-brand-border px-3 py-1.5 h-8 bg-brand-light transition-colors cursor-pointer"
          >
            <RefreshCw size={10} /> {labels.resetFilters[locale]}
          </button>
        </div>
      </div>

      {/* 3. Bố cục hiển thị chính */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Cột Lọc bên trái (Desktop) */}
        <div className="space-y-6 bg-brand-light p-5 border border-brand-border shadow-sm">
          <h3 className="font-serif text-xs tracking-widest text-brand-dark font-bold uppercase flex items-center gap-1.5 border-b border-brand-border pb-3">
            <SlidersHorizontal size={12} /> {labels.filterTitle[locale]}
          </h3>

          {/* Lọc Phân loại */}
          <div className="space-y-2">
            <h4 className="font-sans text-[10px] tracking-widest text-brand-dark font-bold uppercase">
              {labels.allCategories[locale]}
            </h4>
            <div className="flex flex-col gap-2 font-sans text-xs">
              {[
                { label: labels.allCategories[locale], value: 'all' },
                { label: labels.womenCategory[locale], value: 'women' },
                { label: labels.menCategory[locale], value: 'men' },
                { label: labels.accCategory[locale], value: 'accessories' },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2 cursor-pointer text-brand-gray hover:text-brand-dark transition-colors">
                  <input
                    type="radio"
                    name="category-filter"
                    checked={selectedCategory === item.value}
                    onChange={() => handleCategoryChange(item.value)}
                    className="accent-brand-forest cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lọc Khoảng giá */}
          <div className="space-y-2 pt-4 border-t border-brand-border/60">
            <h4 className="font-sans text-[10px] tracking-widest text-brand-dark font-bold uppercase">
              {labels.priceFilterTitle[locale]}
            </h4>
            <div className="flex flex-col gap-2 font-sans text-xs">
              {['all', 'under100', '100to200', 'over200'].map((val) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer text-brand-gray hover:text-brand-dark transition-colors">
                  <input
                    type="radio"
                    name="price-filter"
                    checked={priceFilter === val}
                    onChange={() => setPriceFilter(val as 'all' | 'under100' | '100to200' | 'over200')}
                    className="accent-brand-forest cursor-pointer"
                  />
                  <span>{getPriceLabel(val)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Lưới sản phẩm & concept kết quả bên phải (Chiếm 3/4 cột) */}
        <div className="lg:col-span-3 space-y-10">
          
          {/* A. Hiển thị Concept khớp trước */}
          {matchedConcepts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm tracking-widest text-brand-gray uppercase flex items-center gap-1.5">
                <Compass size={14} className="text-brand-forest" /> {labels.conceptMatchedHeader[locale]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matchedConcepts.map((concept) => (
                  <div
                    key={concept.id}
                    onClick={() => navigate(`/concept/${concept.id}`)}
                    className="group cursor-pointer border border-brand-border/40 hover:border-brand-border bg-brand-light overflow-hidden transition-all shadow-sm flex flex-col"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-brand-border/10">
                      <img
                        src={concept.coverImage}
                        alt={concept.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 space-y-1.5">
                      <h4 className="font-serif text-sm font-semibold text-brand-dark">
                        {concept.title}
                      </h4>
                      <p className="text-[10px] text-brand-gray font-light font-sans truncate">
                        {concept.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B. Hiển thị Lưới sản phẩm lẻ */}
          <div className="space-y-4">
            {matchedProducts.length > 0 && matchedConcepts.length > 0 && (
              <h3 className="font-serif text-sm tracking-widest text-brand-gray uppercase flex items-center gap-1.5 pt-4 border-t border-brand-border/40">
                <ShoppingBag size={14} className="text-brand-forest" /> {labels.productMatchedHeader[locale]}
              </h3>
            )}
            
            {isLoading ? (
              <div className="text-center py-16 font-sans text-xs tracking-wider text-brand-gray uppercase">
                Đang tìm kiếm sản phẩm...
              </div>
            ) : matchedProducts.length === 0 ? (
              <div className="py-16 text-center space-y-4 border border-dashed border-brand-border">
                <p className="text-sm text-brand-gray italic">{labels.noProductsFound[locale]}</p>
                <Button
                  onClick={handleResetFilters}
                  className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white rounded-none cursor-pointer"
                >
                  {labels.clearFiltersBtn[locale]}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {matchedProducts.map((product) => (
                  <ProductCard key={product.id || (product as { _id?: string })._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimateContainer>
  );
};

export default SearchResults;
