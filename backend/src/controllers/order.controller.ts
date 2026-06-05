import { Request, Response } from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Coupon } from '../models/Coupon';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, subtotal, discountAmount, shippingCost, total, currency, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0 || !shippingAddress) {
      res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin giỏ hàng và địa chỉ giao hàng.' });
      return;
    }

    // Sinh mã đơn hàng ngẫu nhiên, ví dụ: SC123456
    const orderCode = 'SC' + Math.floor(100000 + Math.random() * 900000);

    // Ánh xạ phương thức thanh toán từ frontend sang enum backend
    let mappedPaymentMethod: 'COD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO' = 'COD';
    if (paymentMethod === 'bank') {
      mappedPaymentMethod = 'VNPAY';
    } else if (paymentMethod === 'card') {
      mappedPaymentMethod = 'BANK_TRANSFER';
    }

    // Ánh xạ địa chỉ giao hàng
    const { fullName, phone, address, city } = shippingAddress;

    interface OrderItemPayload {
      product: {
        id?: string;
        _id?: string;
        sku?: string;
        name?: string | Record<string, string>;
        prices?: Record<string, { price: number; compare_at_price?: number }>;
      };
      quantity: number;
    }

    const newOrder = await Order.create({
      orderCode,
      customer: req.user ? (req.user as { _id?: string })._id : undefined,
      items: (items as OrderItemPayload[]).map((item) => {
        const prod = item.product;
        const prices = prod.prices || {};
        const priceObj = prices[currency as string] || { price: 0 };
        const prodName = typeof prod.name === 'object' ? (prod.name.vi || prod.name.en || '') : (prod.name || 'Sản phẩm gôn');
        return {
          product: prod.id || prod._id,
          sku: prod.sku || 'SKU-UNKNOWN',
          name: prodName,
          price: priceObj.price || 0,
          quantity: item.quantity
        };
      }),
      subtotal,
      discountAmount,
      shippingFee: shippingCost || 0,
      totalAmount: total,
      currency: currency || 'VND',
      shippingAddress: {
        recipientName: fullName || 'Khách hàng',
        recipientPhone: phone || '0900000000',
        addressString: `${address || ''}, ${city || ''}`
      },
      paymentMethod: mappedPaymentMethod,
      paymentStatus: mappedPaymentMethod === 'VNPAY' ? 'pending' : 'pending',
      orderStatus: 'pending'
    });

    // Trừ số lượng tồn kho của các sản phẩm tương ứng trong đơn hàng
    for (const item of items as OrderItemPayload[]) {
      const productId = item.product.id || item.product._id;
      if (productId) {
        await Product.findByIdAndUpdate(productId, {
          $inc: { inventory: -item.quantity }
        });
      }
    }

    res.status(201).json(newOrder);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi tạo đơn hàng mới.', error: msg });
  }
};

export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Tìm theo orderCode hoặc ObjectId
    const order = await Order.findOne({
      $or: [
        { orderCode: id },
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : undefined }
      ].filter(Boolean)
    }).populate('items.product');

    if (!order) {
      res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
      return;
    }

    res.status(200).json(order);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi lấy thông tin đơn hàng.', error: msg });
  }
};

export const getPaymentQR = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ orderCode: id });

    if (!order) {
      res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
      return;
    }

    res.status(200).json({
      qrCodeData: `vnpay-qr-mock-data-for-${order.orderCode}`,
      amount: order.totalAmount,
      currency: order.currency
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi tạo cổng thanh toán QR-Pay.', error: msg });
  }
};

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const { amount } = req.query;
    
    if (!code) {
      res.status(400).json({ message: 'Vui lòng cung cấp mã giảm giá.' });
      return;
    }

    const { Coupon } = require('../models/Coupon');
    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
    
    if (!coupon) {
      res.status(400).json({ message: 'Mã giảm giá không tồn tại hoặc đã bị khóa.' });
      return;
    }

    if (coupon.expiresAt && moment(coupon.expiresAt).isBefore(moment())) {
      res.status(400).json({ message: 'Mã giảm giá đã hết hạn sử dụng.' });
      return;
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      res.status(400).json({ message: 'Mã giảm giá đã đạt số lần sử dụng tối đa.' });
      return;
    }

    if (amount) {
      const orderAmount = parseFloat(amount as string);
      if (orderAmount < coupon.minOrderAmount) {
        res.status(400).json({ 
          message: `Đơn hàng tối thiểu để áp dụng mã này là $${coupon.minOrderAmount} (hoặc quy đổi tương đương).` 
        });
        return;
      }
    }

    res.status(200).json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi kiểm tra mã giảm giá.', error: msg });
  }
};
