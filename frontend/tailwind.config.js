/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#fafafa',       // Nền trắng sạch hiện đại
          dark: '#0f172a',        // Navy slate đậm sang trọng
          forest: '#0f172a',      // Giữ tương thích, trỏ đến navy slate
          accent: '#c8a96e',      // Vàng đồng ấm áp cao cấp
          gray: '#64748b',        // Slate gray cân bằng
          border: '#e5e7eb',      // Viền xám nhẹ hiện đại
        }
      },
      fontFamily: {
        serif: ['ui-sans-serif', 'system-ui', 'sans-serif', "'Apple Color Emoji'", "'Segoe UI Emoji'", "'Segoe UI Symbol'", "'Noto Color Emoji'"],
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif', "'Apple Color Emoji'", "'Segoe UI Emoji'", "'Segoe UI Symbol'", "'Noto Color Emoji'"],
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
