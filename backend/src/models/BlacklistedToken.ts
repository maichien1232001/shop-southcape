import { Schema, model, Document } from 'mongoose';

export interface IBlacklistedToken extends Document {
  token: string;
  expireAt: Date;
}

const BlacklistedTokenSchema = new Schema<IBlacklistedToken>({
  token: { type: String, required: true, unique: true },
  expireAt: { type: Date, required: true },
});

// Thiết lập TTL index để MongoDB tự động xóa token khi hết hạn
BlacklistedTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const BlacklistedToken = model<IBlacklistedToken>('BlacklistedToken', BlacklistedTokenSchema);
