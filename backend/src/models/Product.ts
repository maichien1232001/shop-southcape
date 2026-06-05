import { Schema, model, Document } from 'mongoose';
import { SupportedLocale } from '../constants/languages';

export interface IProduct extends Document {
  sku: string;
  name: Record<SupportedLocale, string>;
  description: Record<SupportedLocale, string>;
  seoTitle?: Record<SupportedLocale, string>;
  seoDescription?: Record<SupportedLocale, string>;
  prices: Map<string, {
    price: number;
    compare_at_price?: number;
  }>;
  images: string[];
  category: Schema.Types.ObjectId;
  colors: string[];
  sizes: string[];
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  ratings: {
    average: number;
    count: number;
  };
}

const ProductSchema = new Schema<IProduct>({
  sku: { type: String, required: true, unique: true },
  name: {
    vi: { type: String, required: true },
    en: { type: String, required: true },
    ja: { type: String, required: true }
  },
  description: {
    vi: { type: String, required: true },
    en: { type: String, required: true },
    ja: { type: String, required: true }
  },
  seoTitle: {
    vi: { type: String },
    en: { type: String },
    ja: { type: String }
  },
  seoDescription: {
    vi: { type: String },
    en: { type: String },
    ja: { type: String }
  },
  prices: { 
    type: Map, 
    of: new Schema({
      price: { type: Number, required: true },
      compare_at_price: { type: Number }
    }, { _id: false }),
    required: true 
  },
  images: [{ type: String }],
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  colors: [{ type: String }],
  sizes: [{ type: String }],
  inventory: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

// --- ĐÁNH INDEX TỐI ƯU HIỆU NĂNG TRUY VẤN (BE Performance) ---
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ createdAt: -1 });

// Index phục vụ tìm kiếm Full-Text Search đa ngôn ngữ
ProductSchema.index({ 
  'name.vi': 'text', 
  'name.en': 'text', 
  'name.ja': 'text',
  'description.vi': 'text',
  'description.en': 'text' 
});

export const Product = model<IProduct>('Product', ProductSchema);
