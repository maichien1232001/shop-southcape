import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '../models/User';
import { BlacklistedToken } from '../models/BlacklistedToken';

// Middleware kiểm tra xem token đã bị blacklist khi logout chưa
export const checkBlacklist = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const isBlacklisted = await BlacklistedToken.findOne({ token });
      if (isBlacklisted) {
        return res.status(401).json({ message: 'Token đã bị vô hiệu hóa (Blacklisted).' });
      }
    } catch (err) {
      console.error('Lỗi khi kiểm tra blacklist token:', err);
    }
  }
  next();
};

// Middleware yêu cầu đăng nhập (xác thực token)
export const requireAuth = passport.authenticate('jwt', { session: false });

// Middleware yêu cầu quyền Admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as IUser;
  if (user && (user.role === 'admin' || user.role === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ message: 'Quyền truy cập bị từ chối. Yêu cầu tài khoản quản trị.' });
  }
};
