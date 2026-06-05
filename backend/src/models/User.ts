import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'customer' | 'staff' | 'admin' | 'superadmin';
  fullName: string;
  avatar?: string;
  phoneNumber?: string;
  provider: 'local' | 'google' | 'facebook';
  socialId?: string;
  addresses: Array<{
    isDefault: boolean;
    recipientName: string;
    recipientPhone: string;
    city: string;
    district: string;
    ward: string;
    streetAddress: string;
  }>;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Trống nếu đăng nhập bằng Google/FB
  role: { type: String, enum: ['customer', 'staff', 'admin', 'superadmin'], default: 'customer' },
  fullName: { type: String, required: true },
  avatar: { type: String },
  phoneNumber: { type: String },
  provider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  socialId: { type: String },
  addresses: [{
    isDefault: { type: Boolean, default: false },
    recipientName: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    streetAddress: { type: String, required: true }
  }],
  refreshToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);
