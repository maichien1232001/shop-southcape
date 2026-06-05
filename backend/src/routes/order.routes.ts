import { Router } from 'express';
import { createOrder, getOrderDetails, getPaymentQR, validateCoupon } from '../controllers/order.controller';

const router = Router();

// Hỗ trợ cả khách vãng lai (guest) và khách hàng đã đăng nhập
router.post('/', createOrder);
router.get('/validate-coupon/:code', validateCoupon);
router.get('/:id', getOrderDetails);
router.get('/:id/vnpay-qr', getPaymentQR);

export default router;
