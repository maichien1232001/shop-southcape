import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import {
  getDashboardStats,
  getOrders, updateOrderStatus,
  getCoupons, createCoupon, updateCoupon, deleteCoupon,
  getCustomers, updateCustomerRole,
  getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod,
} from '../controllers/cms.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Tất cả route CMS yêu cầu quyền Admin và có tiền tố /api/cms trong app.ts

// Dashboard
router.get('/stats', requireAuth, requireAdmin, getDashboardStats);

// Sản phẩm
router.get('/products', requireAuth, requireAdmin, getProducts);
router.post('/products', requireAuth, requireAdmin, createProduct);
router.put('/products/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/products/:id', requireAuth, requireAdmin, deleteProduct);

// Đơn hàng
router.get('/orders', requireAuth, requireAdmin, getOrders);
router.put('/orders/:id/status', requireAuth, requireAdmin, updateOrderStatus);

// Mã giảm giá
router.get('/coupons', requireAuth, requireAdmin, getCoupons);
router.post('/coupons', requireAuth, requireAdmin, createCoupon);
router.put('/coupons/:id', requireAuth, requireAdmin, updateCoupon);
router.delete('/coupons/:id', requireAuth, requireAdmin, deleteCoupon);

// Khách hàng
router.get('/customers', requireAuth, requireAdmin, getCustomers);
router.put('/customers/:id/role', requireAuth, requireAdmin, updateCustomerRole);

// Phương thức thanh toán
router.get('/payment-methods', requireAuth, requireAdmin, getPaymentMethods);
router.post('/payment-methods', requireAuth, requireAdmin, createPaymentMethod);
router.put('/payment-methods/:id', requireAuth, requireAdmin, updatePaymentMethod);
router.delete('/payment-methods/:id', requireAuth, requireAdmin, deletePaymentMethod);

export default router;
