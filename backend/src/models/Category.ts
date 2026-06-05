import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: {
    vi: string;
    en: string;
    ja: string;
  };
  slug: string;
  description?: {
    vi: string;
    en: string;
    ja: string;
  };
}

const CategorySchema = new Schema<ICategory>({
  name: {
    vi: { type: String, required: true },
    en: { type: String, required: true },
    ja: { type: String, required: true }
  },
  slug: { type: String, required: true, unique: true },
  description: {
    vi: { type: String },
    en: { type: String },
    ja: { type: String }
  }
}, { timestamps: true });

export const Category = model<ICategory>('Category', CategorySchema);
