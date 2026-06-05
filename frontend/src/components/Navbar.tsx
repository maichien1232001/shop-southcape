import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSearch } from '../features/search/store/searchSlice';
import { useCart } from '../hooks/useCart';
import { Search, ShoppingBag, Menu, X, Compass, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Drawer, Dropdown, notification } from 'antd';
import { setLocale, setCurrency } from '../features/shop/store/localeSlice';
import { logout } from '../features/auth/store/authSlice';
import { LANGUAGES, CURRENCIES } from '../constants/languages';
import { RootState } from '../store';

export const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { itemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lấy locale và currency từ Redux
  const { locale, currency } = useSelector((state: RootState) => state.locale);
  // Lấy trạng thái auth từ Redux
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);


  const navLabels = {
    explore: { vi: 'Bộ Sưu Tập', en: 'Explore Moodboards', ja: 'ルックブック' },
    women: { vi: 'Thời trang Nữ', en: 'Women', ja: 'レディース' },
    men: { vi: 'Thời trang Nam', en: 'Men', ja: 'メンズ' },
    accessories: { vi: 'Phụ kiện', en: 'Accessories', ja: 'アクセサリー' },
  };

  const navLinks = [
    { label: navLabels.explore[locale], path: '/' },
    { label: navLabels.women[locale], path: '/search?category=women' },
    { label: navLabels.men[locale], path: '/search?category=men' },
    { label: navLabels.accessories[locale], path: '/search?category=accessories' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    notification.success({
      message: locale === 'vi' ? 'Đăng xuất' : 'Logout',
      description: locale === 'vi' ? 'Đăng xuất thành công.' : 'Logged out successfully.',
      placement: 'topRight'
    });
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile-info',
      label: (
        <div className="px-2 py-1 border-b border-brand-border/40 font-sans text-xs">
          <p className="font-bold text-brand-dark m-0">{user?.fullName}</p>
          <p className="text-[10px] text-brand-gray m-0 mt-0.5">{user?.email}</p>
        </div>
      ),
      disabled: true,
    },
    ...((user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'staff') ? [
      {
        key: 'admin-dashboard',
        label: (
          <span className="font-sans text-xs flex items-center gap-2 py-1">
            <LayoutDashboard size={14} className="text-brand-gray" />
            <span>{locale === 'vi' ? 'Trang quản trị CMS' : 'CMS Panel'}</span>
          </span>
        ),
        onClick: () => navigate('/cms'),
      }
    ] : []),
    {
      key: 'logout',
      label: (
        <span className="font-sans text-xs flex items-center gap-2 py-1 text-red-600 hover:text-red-700">
          <LogOut size={14} />
          <span>{locale === 'vi' ? 'Đăng xuất' : 'Sign Out'}</span>
        </span>
      ),
      onClick: handleLogout,
    }
  ];

  const languageItems = LANGUAGES.map((lang) => ({
    key: lang.code,
    label: (
      <span className="font-sans text-xs flex items-center gap-1.5 py-1">
        <span>{lang.flag}</span>
        <span>{lang.name}</span>
      </span>
    ),
    onClick: () => dispatch(setLocale(lang.code)),
  }));

  const currencyItems = CURRENCIES.map((curr) => ({
    key: curr.code,
    label: (
      <span className="font-sans text-xs flex items-center gap-1 py-1">
        <span className="font-semibold">{curr.code}</span>
        <span className="text-brand-gray">({curr.symbol})</span>
      </span>
    ),
    onClick: () => dispatch(setCurrency(curr.code)),
  }));

  const handleMobileLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname + location.search === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-light/90 backdrop-blur-md border-b border-brand-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Nút Hamburger cho Mobile */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden text-brand-dark p-1 hover:opacity-75 transition-opacity"
        >
          <Menu size={22} />
        </button>

        {/* LOGO: Thiết kế tối giản, khoảng cách chữ rộng */}
        <Link
          to="/"
          className="font-serif text-lg sm:text-xl md:text-2xl tracking-[0.3em] font-semibold text-brand-dark hover:text-brand-forest transition-colors text-center"
        >
          SOUTHCAPE
        </Link>

        {/* Cột giữa: Danh mục Menu lớn (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`font-sans text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 relative py-2 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-brand-forest after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ${isActive(link.path)
                  ? 'text-brand-forest after:scale-x-100'
                  : 'text-brand-gray hover:text-brand-dark'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cột phải: Các chức năng Tiện ích */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Bộ chọn ngôn ngữ */}
          <Dropdown menu={{ items: languageItems }} trigger={['click']} placement="bottomRight">
            <button className="text-[10px] font-sans font-semibold text-brand-gray hover:text-brand-dark flex items-center gap-1 cursor-pointer transition-colors px-2 py-1.5 border border-brand-border/60 bg-brand-light hover:bg-brand-border/20">
              <span>{LANGUAGES.find(l => l.code === locale)?.flag}</span>
              <span className="uppercase">{locale}</span>
            </button>
          </Dropdown>

          {/* Bộ chọn tiền tệ */}
          <Dropdown menu={{ items: currencyItems }} trigger={['click']} placement="bottomRight">
            <button className="text-[10px] font-sans font-semibold text-brand-gray hover:text-brand-dark flex items-center gap-1 cursor-pointer transition-colors px-2 py-1.5 border border-brand-border/60 bg-brand-light hover:bg-brand-border/20">
              <span>{currency}</span>
            </button>
          </Dropdown>

          {/* Icon Tìm kiếm */}
          <button
            onClick={() => dispatch(toggleSearch())}
            className="p-2 text-brand-dark hover:text-brand-forest transition-colors relative hover:scale-105 cursor-pointer"
            aria-label="Tìm kiếm"
          >
            <Search size={20} />
          </button>

          {/* Icon Giỏ hàng kèm Badge số đếm */}
          <button
            onClick={() => navigate('/cart')}
            className="p-2 text-brand-dark hover:text-brand-forest transition-colors relative group hover:scale-105"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag size={20} />
            {itemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-forest text-brand-light text-[9px] font-sans font-bold flex items-center justify-center rounded-full px-1 border border-brand-light group-hover:scale-110 transition-transform duration-300">
                {itemsCount}
              </span>
            )}
          </button>

          {/* Icon Tài khoản */}
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <button
                className="p-2 text-brand-dark hover:text-brand-forest transition-colors relative hover:scale-105 cursor-pointer"
                aria-label="Tài khoản"
              >
                <User size={20} />
              </button>
            </Dropdown>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="p-2 text-brand-dark hover:text-brand-forest transition-colors relative hover:scale-105 cursor-pointer"
              aria-label="Đăng nhập"
            >
              <User size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Drawer Menu cho Mobile */}
      <Drawer
        title={
          <span className="font-serif tracking-[0.2em] font-semibold text-brand-dark">
            MENU
          </span>
        }
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        closeIcon={<X size={18} />}
        styles={{
          body: { padding: '1.5rem' },
        }}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="space-y-6">
            {/* Các link điều hướng chính */}
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleMobileLinkClick(link.path)}
                  className={`text-left font-sans text-xs tracking-wider uppercase font-semibold py-2 border-b border-brand-border/40 ${isActive(link.path) ? 'text-brand-forest' : 'text-brand-gray'
                    }`}
                >
                  {link.label}
                </button>
              ))}

              {isAuthenticated ? (
                <>
                  {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'staff') && (
                    <button
                      onClick={() => handleMobileLinkClick('/cms')}
                      className="text-left font-sans text-xs tracking-wider uppercase font-semibold py-2 border-b border-brand-border/40 text-brand-accent flex items-center gap-1.5"
                    >
                      <LayoutDashboard size={14} />
                      CMS Panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-left font-sans text-xs tracking-wider uppercase font-semibold py-2 border-b border-brand-border/40 text-red-600 flex items-center gap-1.5"
                  >
                    <LogOut size={14} />
                    {locale === 'vi' ? 'Đăng xuất' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleMobileLinkClick('/login')}
                  className="text-left font-sans text-xs tracking-wider uppercase font-semibold py-2 border-b border-brand-border/40 text-brand-forest flex items-center gap-1.5"
                >
                  <User size={14} />
                  {locale === 'vi' ? 'Đăng nhập' : 'Sign In'}
                </button>
              )}
            </div>

            {/* Bộ chọn ngôn ngữ & tiền tệ trên mobile */}
            <div className="border-t border-b border-brand-border/60 py-4 flex gap-4">
              <div className="flex-1 space-y-1">
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-brand-gray">Ngôn ngữ</span>
                <div className="flex gap-1">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => dispatch(setLocale(l.code))}
                      className={`flex-1 text-[10px] font-sans py-1.5 border text-center font-semibold cursor-pointer ${
                        locale === l.code ? 'border-brand-forest bg-brand-forest/5 text-brand-forest' : 'border-brand-border text-brand-gray'
                      }`}
                    >
                      {l.flag} {l.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-brand-gray">Tiền tệ</span>
                <div className="flex gap-1">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => dispatch(setCurrency(c.code))}
                      className={`flex-1 text-[10px] font-sans py-1.5 border text-center font-semibold cursor-pointer ${
                        currency === c.code ? 'border-brand-forest bg-brand-forest/5 text-brand-forest' : 'border-brand-border text-brand-gray'
                      }`}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mục giới thiệu nhanh */}
            <div className="bg-brand-border/20 p-4 rounded-sm space-y-2">
              <span className="flex items-center gap-1.5 font-serif text-xs font-semibold text-brand-forest tracking-wide">
                <Compass size={14} /> Southcape Owner Club
              </span>
              <p className="text-[10px] text-brand-gray leading-relaxed font-sans font-light">
                Trải nghiệm sự giao thoa độc đáo giữa kiến trúc tối giản và đại dương bao la tại Nam Hải, Hàn Quốc.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-brand-gray font-light font-sans tracking-wide">
            © 2026 SOUTHCAPE GLOBAL. ALL RIGHTS RESERVED.
          </div>
        </div>
      </Drawer>
    </header>
  );
};
export default Navbar;
