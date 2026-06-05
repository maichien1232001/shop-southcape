import React, { useState } from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { notification } from 'antd';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    notification.success({
      message: 'Đăng ký thành công',
      description: 'Cảm ơn bạn đã đăng ký nhận bản tin thời trang của Southcape!',
      placement: 'topRight'
    });
    setEmail('');
  };

  return (
    <footer className="bg-brand-dark text-[#e8e6e1] pt-16 pb-8 px-6 md:px-12 border-t border-brand-border/10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 pb-12 border-b border-brand-border/10">
        
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg tracking-[0.3em] font-semibold text-brand-light">
            SOUTHCAPE
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Sự giao hòa tuyệt đối giữa thiên nhiên kỳ vĩ ven biển và kiến trúc hiện đại tối giản. Chúng tôi mang đến thời trang golf hiệu năng cao với hơi thở Quiet Luxury tinh tế.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors" aria-label="Youtube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
          </div>
        </div>

        {/* Cột 2: Đường dẫn nhanh */}
        <div className="space-y-3">
          <h4 className="font-serif text-xs tracking-widest text-brand-light font-semibold uppercase">
            Hỗ trợ khách hàng
          </h4>
          <ul className="space-y-2 text-xs text-gray-400 font-light">
            <li><a href="#" className="hover:text-brand-accent transition-colors">Hướng dẫn chọn size quần áo</a></li>
            <li><a href="#" className="hover:text-brand-accent transition-colors">Chính sách giao hàng & Vận chuyển</a></li>
            <li><a href="#" className="hover:text-brand-accent transition-colors">Chính sách đổi trả trong vòng 14 ngày</a></li>
            <li><a href="#" className="hover:text-brand-accent transition-colors">Câu hỏi thường gặp (FAQs)</a></li>
          </ul>
        </div>

        {/* Cột 3: Trải nghiệm Resort câu lạc bộ */}
        <div className="space-y-3">
          <h4 className="font-serif text-xs tracking-widest text-brand-light font-semibold uppercase">
            Resort & Clubhouse
          </h4>
          <ul className="space-y-2 text-xs text-gray-400 font-light">
            <li><a href="#" className="hover:text-brand-accent transition-colors">South Cape Owners Club Korea</a></li>
            <li><a href="#" className="hover:text-brand-accent transition-colors">Trải nghiệm sân golf Cliffside</a></li>
            <li><a href="#" className="hover:text-brand-accent transition-colors">Kiến trúc Clubhouse & Villa resort</a></li>
            <li><a href="#" className="hover:text-brand-accent transition-colors">Đặt chỗ & Nghỉ dưỡng</a></li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký nhận bản tin */}
        <div className="space-y-3">
          <h4 className="font-serif text-xs tracking-widest text-brand-light font-semibold uppercase">
            Bản tin thời trang
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Đăng ký để nhận sớm nhất thông tin về các bộ sưu tập lookbook mới và ưu đãi độc quyền.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 pt-1">
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-gray-500" size={16} />
              <input
                type="email"
                required
                placeholder="Địa chỉ Email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-light/5 border border-brand-border/20 pl-10 pr-4 py-2.5 text-xs text-brand-light placeholder:text-gray-500 focus:outline-none focus:border-brand-accent transition-colors rounded-none"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-light text-brand-dark hover:bg-brand-accent hover:text-brand-dark px-4 py-2.5 text-[10px] font-sans font-bold tracking-widest uppercase transition-all duration-300 rounded-none"
            >
              Đăng ký ngay
            </button>
          </form>
        </div>
      </div>

      {/* Dòng bản quyền dưới cùng */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-light">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-brand-accent" />
          <span>Trang web Redesign Demo bởi Antigravity. Cảm hứng từ Southcape US.</span>
        </div>
        <div>
          © 2026 SOUTHCAPE CLUB CO., LTD. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
