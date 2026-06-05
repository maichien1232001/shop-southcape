import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { Coupon } from '../models/Coupon';
import { PaymentMethod } from '../models/PaymentMethod';
import { translateValidationError } from '../utils/errorTranslator';
import moment from 'moment';

// ==================== DASHBOARD STATS (DỮ LIỆU THỰC) ====================

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeCoupons = await Coupon.countDocuments({ isActive: true, expiresAt: { $gte: moment().toDate() } });

    // Tính doanh thu thực
    const orders = await Order.find({ orderStatus: { $ne: 'cancelled' } });
    let totalSalesUSD = 0;
    orders.forEach(order => {
      if (order.currency === 'USD') {
        totalSalesUSD += order.totalAmount;
      } else {
        totalSalesUSD += order.totalAmount / 25000;
      }
    });

    // Thống kê đơn hàng theo trạng thái
    const ordersByStatus = {
      pending: await Order.countDocuments({ orderStatus: 'pending' }),
      confirmed: await Order.countDocuments({ orderStatus: 'confirmed' }),
      shipping: await Order.countDocuments({ orderStatus: 'shipping' }),
      delivered: await Order.countDocuments({ orderStatus: 'delivered' }),
      cancelled: await Order.countDocuments({ orderStatus: 'cancelled' }),
    };

    // Phân bổ danh mục sản phẩm
    const categories = await Category.find();
    const categoryCounts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const categoryMap = new Map(categoryCounts.map(c => [c._id.toString(), c.count]));
    const categoryDistribution = categories.map(cat => ({
      category: cat.name.vi || cat.slug,
      count: categoryMap.get(cat._id.toString()) || 0,
    }));

    // Đơn hàng gần đây (5 đơn mới nhất)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentOrdersMapped = recentOrders.map(o => ({
      id: String(o._id),
      orderCode: o.orderCode,
      customerName: o.shippingAddress?.recipientName || 'Khách vãng lai',
      totalAmount: o.totalAmount,
      currency: o.currency,
      orderStatus: o.orderStatus,
      createdAt: (o as any).createdAt || moment().toDate(),
    }));

    // Xu hướng doanh số 6 tháng gần nhất (tổng hợp thực từ DB)
    const sixMonthsAgo = moment().subtract(6, 'months').toDate();

    const monthlyAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, orderStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          sales: {
            $sum: {
              $cond: [
                { $eq: ['$currency', 'USD'] },
                '$totalAmount',
                { $divide: ['$totalAmount', 25000] }
              ]
            }
          },
          orders: { $sum: 1 },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = moment().date(1).subtract(i, 'months');
      const yearMonth = d.format('YYYY-MM');
      const found = monthlyAgg.find(m => m._id === yearMonth);
      const monthIdx = d.month();
      salesTrend.push({
        date: months[monthIdx],
        sales: found ? Math.round(found.sales) : 0,
        orders: found ? found.orders : 0
      });
    }

    res.status(200).json({
      totalSales: Math.round(totalSalesUSD),
      totalOrders,
      totalProducts,
      totalCustomers,
      activeCoupons,
      ordersByStatus,
      salesTrend,
      categoryDistribution,
      recentOrders: recentOrdersMapped,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi lấy thống kê dashboard.', error: msg });
  }
};

// ==================== QUẢN LÝ ĐƠN HÀNG ====================

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const total = await Order.countDocuments();
    const totalPages = Math.ceil(total / limitNum);

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('customer', 'fullName email')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const mapped = orders.map(o => ({
      ...o,
      id: String(o._id),
      createdAt: (o as any).createdAt,
      updatedAt: (o as any).updatedAt,
    }));

    res.status(200).json({
      data: mapped,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      }
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng.', error: msg });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ.' });
      return;
    }

    const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });
    if (!order) {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
      return;
    }

    res.status(200).json(order);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn hàng.', error: msg });
  }
};

// ==================== QUẢN LÝ MÃ GIẢM GIÁ ====================

export const getCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const total = await Coupon.countDocuments();
    const totalPages = Math.ceil(total / limitNum);

    const coupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const mapped = coupons.map(c => ({ ...c, id: String(c._id) }));

    res.status(200).json({
      data: mapped,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      }
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách mã giảm giá.', error: msg });
  }
};

export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error: any) {
    const msg = translateValidationError(error);
    res.status(400).json({ message: 'Lỗi tạo mã giảm giá.', error: msg });
  }
};

export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!coupon) { res.status(404).json({ message: 'Không tìm thấy mã giảm giá.' }); return; }
    res.status(200).json(coupon);
  } catch (error: any) {
    const msg = translateValidationError(error);
    res.status(400).json({ message: 'Lỗi cập nhật mã giảm giá.', error: msg });
  }
};

export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) { res.status(404).json({ message: 'Không tìm thấy mã giảm giá.' }); return; }
    res.status(200).json({ message: 'Đã xóa mã giảm giá.', id });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi xóa mã giảm giá.', error: msg });
  }
};

// ==================== QUẢN LÝ KHÁCH HÀNG ====================

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limitNum);

    const customers = await User.find()
      .select('-password -refreshToken -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    // Đếm số đơn hàng của từng khách hàng cho danh sách đã phân trang này
    const customerIds = customers.map(c => c._id);
    const orderCounts = await Order.aggregate([
      { $match: { customer: { $in: customerIds } } },
      { $group: { _id: '$customer', count: { $sum: 1 } } }
    ]);
    const orderMap = new Map(orderCounts.map(o => [String(o._id), o.count]));

    const mapped = customers.map(c => ({
      ...c,
      id: String(c._id),
      orderCount: orderMap.get(String(c._id)) || 0,
      createdAt: (c as any).createdAt,
    }));

    res.status(200).json({
      data: mapped,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      }
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách khách hàng.', error: msg });
  }
};

export const updateCustomerRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['customer', 'staff', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ message: 'Vai trò không hợp lệ.' });
      return;
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true })
      .select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');
    if (!user) { res.status(404).json({ message: 'Không tìm thấy người dùng.' }); return; }
    res.status(200).json(user);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi cập nhật vai trò.', error: msg });
  }
};

// ==================== QUẢN LÝ PHƯƠNG THỨC THANH TOÁN ====================

export const getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const total = await PaymentMethod.countDocuments();
    const totalPages = Math.ceil(total / limitNum);

    const methods = await PaymentMethod.find()
      .sort({ sortOrder: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const mapped = methods.map(m => ({ ...m, id: String(m._id) }));

    res.status(200).json({
      data: mapped,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      }
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách phương thức thanh toán.', error: msg });
  }
};

export const createPaymentMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    const method = await PaymentMethod.create(req.body);
    res.status(201).json(method);
  } catch (error: any) {
    const msg = translateValidationError(error);
    res.status(400).json({ message: 'Lỗi tạo phương thức thanh toán.', error: msg });
  }
};

export const updatePaymentMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const method = await PaymentMethod.findByIdAndUpdate(id, req.body, { new: true });
    if (!method) { res.status(404).json({ message: 'Không tìm thấy phương thức thanh toán.' }); return; }
    res.status(200).json(method);
  } catch (error: any) {
    const msg = translateValidationError(error);
    res.status(400).json({ message: 'Lỗi cập nhật phương thức thanh toán.', error: msg });
  }
};

export const deletePaymentMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const method = await PaymentMethod.findByIdAndDelete(id);
    if (!method) { res.status(404).json({ message: 'Không tìm thấy phương thức thanh toán.' }); return; }
    res.status(200).json({ message: 'Đã xóa phương thức thanh toán.', id });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi xóa phương thức thanh toán.', error: msg });
  }
};
