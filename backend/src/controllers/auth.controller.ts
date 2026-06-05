import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../models/User';
import moment from 'moment';

const JWT_SECRET = process.env.JWT_SECRET || 'southcapesecrethashkey2026';

const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: email, password, fullName.' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email này đã được sử dụng.' });
      return;
    }

    const hashedPassword = hashPassword(password);
    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
      role: 'customer',
      provider: 'local',
    });

    res.status(201).json({
      message: 'Đăng ký tài khoản thành công.',
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi đăng ký tài khoản.', error: msg });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Vui lòng cung cấp email và password.' });
      return;
    }

    const hashedPassword = hashPassword(password);
    const user = await User.findOne({ email });

    if (!user || user.password !== hashedPassword) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
      return;
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công.',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi đăng nhập.', error: msg });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Vui lòng cung cấp email.' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy người dùng với email này.' });
      return;
    }

    // Tạo reset token ngẫu nhiên
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = moment().add(10, 'minutes').toDate();
    await user.save();

    // Giả lập gửi email: in ra console để dễ test ở local
    console.log(`\n======================================================`);
    console.log(`[FORGOT PASSWORD] Gửi email khôi phục mật khẩu tới: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`Đường dẫn giả lập: http://localhost:5173/forgot-password?token=${resetToken}`);
    console.log(`======================================================\n`);

    res.status(200).json({
      message: 'Mã khôi phục mật khẩu đã được gửi tới email của bạn (Vui lòng kiểm tra Console ở Backend).',
      resetToken: resetToken,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi xử lý quên mật khẩu.', error: msg });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ token và mật khẩu mới.' });
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: moment().toDate() },
    });

    if (!user) {
      res.status(400).json({ message: 'Mã khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.' });
      return;
    }

    // Cập nhật mật khẩu mới và xóa token
    user.password = hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập ngay.' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi đặt lại mật khẩu.', error: msg });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }

    const user = req.user as IUser;

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi lấy thông tin cá nhân.', error: msg });
  }
};
