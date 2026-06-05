# 🛍️ Southcape E-Commerce Project

Dự án website thương mại điện tử **Southcape** thời trang cao cấp, bao gồm hai phần chính: **Frontend** (giao diện người dùng và trang quản trị CMS) và **Backend** (API server, quản lý cơ sở dữ liệu MongoDB).

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework**: React 19, Vite 8, TypeScript
- **Styling**: Tailwind CSS v4, Ant Design v6 (Antd Theme custom)
- **State Management**: Redux Toolkit, React Redux
- **API Fetching**: RTK Query (giao tiếp thời gian thực với Backend)
- **UI Components & Slider**: Lucide React, Swiper, Antd Icons

### Backend
- **Platform**: Node.js, Express, TypeScript
- **Database**: MongoDB (sử dụng Mongoose ODM)
- **Authentication**: Passport.js (JWT Strategy), JsonWebToken
- **Email Service**: Nodemailer
- **Utilities**: Lodash, Moment.js & Moment Timezone

---

## 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

Dự án được tổ chức theo mô hình Monorepo đơn giản chia làm 2 thư mục chính:

```text
shop/
├── backend/                  # Mã nguồn Backend API
│   ├── api/                  # Vercel Serverless Function entrypoint
│   ├── src/
│   │   ├── config/           # Cấu hình Passport, JWT...
│   │   ├── constants/        # Hằng số (ngôn ngữ, múi giờ...)
│   │   ├── controllers/      # Xử lý logic nghiệp vụ (Auth, Product, Order, Cms...)
│   │   ├── db/               # Script khởi tạo cơ sở dữ liệu mẫu (Seeding)
│   │   ├── middlewares/      # Middleware kiểm tra quyền truy cập (Auth...)
│   │   ├── models/           # Mongoose Schemas (User, Product, Order, Coupon...)
│   │   ├── routes/           # Khai báo các API Endpoints
│   │   ├── utils/            # Công cụ hỗ trợ dịch lỗi, format...
│   │   ├── app.ts            # Khởi tạo Express App
│   │   └── server.ts         # Khởi động server
│   ├── tsconfig.json
│   └── vercel.json           # Cấu hình deploy Vercel
│
├── frontend/                 # Mã nguồn Frontend (React Single Page Application)
│   ├── public/               # Ảnh tĩnh, icon, favicon...
│   ├── src/
│   │   ├── assets/           # Tài nguyên ảnh, logo
│   │   ├── components/       # Các components dùng chung (Layout, Navbar, Footer, Rating...)
│   │   ├── configs/          # Cấu hình theme Ant Design
│   │   ├── constants/        # Các định nghĩa hằng số
│   │   ├── features/         # Module tính năng của ứng dụng
│   │   │   ├── auth/         # Login, Register, Forgot Password, Profile
│   │   │   ├── cart/         # Giỏ hàng, trang Checkout đặt hàng
│   │   │   ├── cms/          # Quản lý sản phẩm, đơn hàng, khách hàng, coupon (Trang Admin)
│   │   │   ├── search/       # Tìm kiếm sản phẩm
│   │   │   └── shop/         # Trang chủ, xem chi tiết sản phẩm, Lookbook
│   │   ├── hooks/            # Custom hooks (useCart, useDebounce...)
│   │   ├── interfaces/       # Các định nghĩa kiểu TypeScript (interfaces)
│   │   ├── routers/          # Cấu hình React Router & Auth Guard bảo mật
│   │   ├── store/            # Redux Store cấu hình chung
│   │   ├── utils/            # Các hàm helper định dạng tiền tệ, ngày tháng...
│   │   ├── index.css         # Styling chính (Tailwind)
│   │   └── main.tsx          # Điểm chạy đầu tiên của React
│   ├── tsconfig.json
│   └── vercel.json           # Cấu hình deploy Vercel
│
└── .gitignore                # Quản lý loại trừ các file build/node_modules/env
```

---

## ✨ Các Tính Năng Chính (Key Features)

### 🛒 Khách Hàng (Shop & Customer Front)
1. **Trang Chủ Cảm Hứng**: Hiển thị Lookbook thời trang trực quan, slideshow Banner chất lượng cao và tích hợp ảnh điểm nóng (Hotspot Image) tương tác trực tiếp.
2. **Tìm Kiếm & Lọc Thông Minh**: Tìm kiếm tức thì thông qua bộ lọc đa chiều (Khoảng giá, danh mục, kích cỡ, màu sắc, sắp xếp).
3. **Chi Tiết Sản Phẩm**: Đánh giá xếp hạng sao (Rating), chọn phân loại hàng (Size/Color), xem tồn kho thực tế, mô tả chi tiết sản phẩm và danh sách sản phẩm liên quan.
4. **Giỏ Hàng Đa Năng**: Thêm/sửa số lượng, xóa sản phẩm trực tiếp từ Drawer giỏ hàng nhanh hoặc trang giỏ hàng chi tiết.
5. **Thanh Toán & Đặt Hàng (Checkout)**: Nhập thông tin giao hàng, áp dụng mã giảm giá (Coupon), chọn phương thức thanh toán linh hoạt và theo dõi đơn hàng trực tiếp.
6. **Tài Khoản Thành Viên**: Đăng ký, đăng nhập bảo mật bằng mật khẩu, khôi phục mật khẩu qua Email OTP, cập nhật thông tin cá nhân và xem lịch sử đơn hàng.

### 🛡️ Quản Trị Hệ Thống (CMS Admin Dashboard)
1. **Bảng Điều Khiển (Dashboard)**: Thống kê doanh thu trực quan, số lượng đơn hàng, số khách hàng mới và biểu đồ xu hướng.
2. **Quản Lý Sản Phẩm**: Thêm mới, cập nhật thông tin, tải lên hình ảnh lên Cloudinary, thiết lập tồn kho, danh mục và quản lý trạng thái ẩn/hiện sản phẩm.
3. **Quản Lý Đơn Hàng**: Xem danh sách đơn hàng chi tiết, cập nhật trạng thái đơn hàng (Chờ xử lý, Đang giao, Đã giao, Đã hủy) và cập nhật trạng thái thanh toán.
4. **Quản Lý Khách Hàng**: Xem danh sách thành viên, cập nhật thông tin hoặc trạng thái kích hoạt tài khoản.
5. **Quản Lý Khuyến Mãi (Coupon)**: Tạo mới và phân phối các mã giảm giá theo số tiền cố định hoặc theo phần trăm kèm theo hạn sử dụng và mức giảm tối đa.

---

## 🔒 Bảo Mật & Xác Thực (Security & Authentication)

Dự án áp dụng cơ chế xác thực nâng cao và bảo mật tuyệt đối chống lại các tấn công phổ biến như XSS và CSRF bằng mô hình **Chiến lược lưu trữ kép (Dual-Storage Strategy)**:

1. **Access Token (Hạn ngắn - 15 phút)**:
   - Được trả về qua JSON body của phản hồi Login/Refresh.
   - Lưu trữ hoàn toàn trên **RAM (Redux State)** của Frontend. Trình duyệt không lưu Access Token xuống Disk, giúp phòng chống tối đa tấn công XSS chiếm dụng token.
   - Cho phép JavaScript ở Frontend truy cập token này để đính kèm header `Authorization` khi gọi các API bên thứ 3 từ Client-side.
2. **Refresh Token (Hạn dài - 7 ngày)**:
   - Được Backend thiết lập dưới dạng **Secure HttpOnly Cookie**. Trình duyệt tự động quản lý ở tầng hệ thống và chặn mọi kịch bản JavaScript tiếp cận, ngăn ngừa đánh cắp token dài hạn.
   - Khi reload trang hoặc Access Token hết hạn, Frontend tự động bắn request `/auth/refresh` (trình duyệt tự đính kèm cookie) để nhận Access Token mới lưu lại vào Redux RAM.
3. **Cơ chế Request Pooling (Mutex Lock)**:
   - Khi token hết hạn (lỗi 401), custom BaseQuery của RTK Query sử dụng kỹ thuật Shared Promise để khóa tiến trình. Kể cả khi có hàng chục request đồng thời bị lỗi 401, hệ thống **chỉ gửi duy nhất 1 yêu cầu làm mới `/auth/refresh`** lên backend, gom các request còn lại vào hàng đợi và tự động bắn lại (retry) khi lấy được token mới thành công.
4. **Cơ chế Blacklist Token khi Logout**:
   - Khi người dùng đăng xuất (Logout), hệ thống sẽ gửi yêu cầu lên Backend thu hồi token.
   - Backend xóa bỏ cookie `refreshToken`, xóa token trong DB.
   - Đồng thời, đưa Access Token cũ đang hoạt động vào bảng `BlacklistedToken` lưu trong MongoDB. Bảng này áp dụng thuộc tính **TTL (Time-To-Live) Index** để tự động xóa bản ghi khi token hết hạn tự nhiên nhằm giữ cơ sở dữ liệu gọn nhẹ.

---

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy (Installation & Usage)

### Bước 1: Clone dự án và cài đặt dependencies

Di chuyển vào từng thư mục dự án và cài đặt các gói thư viện:

```bash
# Cài đặt thư viện cho Backend
cd backend
yarn install

# Cài đặt thư viện cho Frontend
cd ../frontend
npm install
```

### Bước 2: Cấu hình biến môi trường (Environment Variables)

#### Cấu hình Backend:
Tạo file `.env` tại thư mục `/backend` và cấu hình như sau:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/southcape-ecommerce
NODE_ENV=development

# Tự động tạo dữ liệu mẫu khi chạy lần đầu
CREATE_SAMPLE_DATA=true

# Bảo mật JWT
JWT_SECRET=your_jwt_secret_key_here

# Tài khoản Admin mặc định hệ thống tạo sẵn
ADMIN_EMAIL=admin@southcape.com
ADMIN_USER=admin
ADMIN_PASSWORD=adminsecretpassword
```

#### Cấu hình Frontend:
Tạo file `.env` tại thư mục `/frontend` và cấu hình:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset
```

### Bước 3: Khởi chạy dự án

#### Chạy Backend API Server:
```bash
cd backend
yarn dev
```
*Server sẽ khởi chạy tại: `http://localhost:5000`*

#### Chạy Frontend App:
```bash
cd frontend
npm run dev
```
*Giao diện người dùng sẽ chạy tại: `http://localhost:5173` (hoặc cổng được hiển thị trên console)*

---

Chúc bạn có những trải nghiệm tuyệt vời cùng với **Southcape**! 🚀
