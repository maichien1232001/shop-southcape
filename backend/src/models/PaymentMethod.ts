import { Schema, model, Document } from 'mongoose';

export interface IPaymentMethod extends Document {
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  icon: string;
  sortOrder: number;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  icon: { type: String, default: 'CreditCardOutlined' },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

PaymentMethodSchema.index({ sortOrder: 1 });

export const PaymentMethod = model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);
