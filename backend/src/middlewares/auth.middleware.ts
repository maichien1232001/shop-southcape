import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '../models/User';

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
