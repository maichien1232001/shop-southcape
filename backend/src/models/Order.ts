import { Schema, model, Document } from 'mongoose';

export interface IOrder extends Document {
  orderCode: string; // Mã đơn hàng ngẫu nhiên, ví dụ: ORD-1728192
  customer: Schema.Types.ObjectId | null; // Null nếu là khách vãng lai (guest checkout)
  guestInfo?: {
    email: string;
    fullName: string;
    phoneNumber: string;
  };
  items: Array<{
    product: Schema.Types.ObjectId;
    sku: string;
    name: string; // Lưu tên sản phẩm tại thời điểm mua
    price: number; // Lưu giá sản phẩm tại thời điểm mua
    quantity: number;
  }>;
  shippingAddress: {
    recipientName: string;
    recipientPhone: string;
    addressString: string;
  };
  paymentMethod: 'COD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentDetails?: Map<string, string>;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  currency: string; // VND hoặc USD tại thời điểm đặt hàng
  orderStatus: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
}

const OrderSchema = new Schema<IOrder>({
  orderCode: { type: String, required: true, unique: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User' },
  guestInfo: {
    email: { type: String },
    fullName: { type: String },
    phoneNumber: { type: String }
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  shippingAddress: {
    recipientName: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    addressString: { type: String, required: true }
  },
  paymentMethod: { type: String, enum: ['COD', 'BANK_TRANSFER', 'VNPAY', 'MOMO'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentDetails: { type: Map, of: String },
  shippingFee: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'VND' },
  orderStatus: { type: String, enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export const Order = model<IOrder>('Order', OrderSchema);
