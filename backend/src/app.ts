import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import './constants/timezone';
import moment from 'moment';

// Import Passport config
import './config/passport.config';

// Import Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import cmsRoutes from './routes/cms.routes';
import { checkBlacklist } from './middlewares/auth.middleware';

dotenv.config();

const app = express();

app.use(cors({
  origin: true, // Cho phép origin hiện tại gửi request
  credentials: true, // Cho phép đính kèm cookie
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Khởi tạo Passport Middleware
app.use(passport.initialize() as unknown as express.Handler);

// Đăng ký middleware kiểm tra Blacklist toàn cục cho mọi request
app.use(checkBlacklist);

// Route kiểm tra sức khỏe hệ thống (Health Check)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: moment().toDate() });
});

// Đăng ký các API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cms', cmsRoutes);

interface HttpError extends Error {
  status?: number;
}

// Middleware xử lý lỗi tập trung
app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Lỗi máy chủ nội bộ',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

export default app;
