import mongoose from 'mongoose';
import crypto from 'crypto';
import _ from 'lodash';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { User } from '../models/User';

// Hàm băm mật khẩu bảo mật bằng SHA256 (Node.js crypto)
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const runAutoMigration = async (): Promise<void> => {
  console.log('--- Bắt đầu tiến trình tự động Migrate & Seed dữ liệu ---');

  try {
    // 1. Migrate & Seed Categories
    const categoriesData = [
      {
        slug: 'women',
        name: {
          vi: 'Thời trang Nữ',
          en: 'Women',
          ja: 'レディース'
        },
        description: {
          vi: 'BST thời trang gôn cao cấp dành cho Nữ',
          en: 'Premium golf fashion collection for Women',
          ja: 'レディース向けプレミアムゴルフファッションコレクション'
        }
      },
      {
        slug: 'men',
        name: {
          vi: 'Thời trang Nam',
          en: 'Men',
          ja: 'メンズ'
        },
        description: {
          vi: 'BST thời trang gôn lịch lãm dành cho Nam',
          en: 'Elegant golf fashion collection for Men',
          ja: 'メンズ向けエレガントゴルフファッションコレクション'
        }
      },
      {
        slug: 'accessories',
        name: {
          vi: 'Phụ kiện & Khác',
          en: 'Accessories',
          ja: 'アクセサリー'
        },
        description: {
          vi: 'Phụ kiện mũ visor, găng tay da Cabretta cao cấp',
          en: 'Visors, premium Cabretta leather gloves & accessories',
          ja: 'サンバイザー、プレミアムカブレッタレザーグローブ＆アクセサリー'
        }
      }
    ];

    const categoryMap: Record<string, mongoose.Types.ObjectId> = {};

    for (const cat of categoriesData) {
      let existingCat = await Category.findOne({ slug: cat.slug });
      if (!existingCat) {
        existingCat = await Category.create(cat);
        console.log(`[Seed] Đã tạo danh mục: ${cat.name.vi}`);
      }
      categoryMap[cat.slug] = existingCat._id as mongoose.Types.ObjectId;
    }

    // 2. Migrate & Seed Admin Account từ biến môi trường
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@southcape.com';
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminsecretpassword2026';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        email: adminEmail,
        fullName: adminUser,
        role: 'admin',
        password: hashPassword(adminPassword),
        provider: 'local',
        addresses: [
          {
            isDefault: true,
            recipientName: adminUser,
            recipientPhone: '0900000000',
            city: 'Hồ Chí Minh',
            district: 'Quận 1',
            ward: 'Phường Bến Nghé',
            streetAddress: 'Công xã Paris'
          }
        ]
      });
      console.log(`[Seed] Đã khởi tạo thành công tài khoản Admin: ${adminEmail}`);
    } else {
      console.log(`[Migration] Tài khoản Admin (${adminEmail}) đã tồn tại.`);
    }

    // 3. Migrate & Seed Sản phẩm mẫu
    const isCreateSample = process.env.CREATE_SAMPLE_DATA === 'true';
    if (isCreateSample) {
      console.log('[Seed] Phát hiện CREATE_SAMPLE_DATA = true. Tiến hành dọn dẹp các sản phẩm cũ...');
      await Product.deleteMany({});
    }

    const productsCount = await Product.countDocuments();
    if (productsCount === 0) {
      const mockProducts = [
        {
          sku: 'SC-WOM-POLO-001',
          name: {
            vi: 'Áo Thun Polo Dệt Kim Trơn',
            en: 'Fine Knit Classic Polo',
            ja: 'ファインニット クラシック ポロ'
          },
          description: {
            vi: 'Chiếc áo polo dệt kim tinh tế mang phong cách Quiet Luxury tối giản.',
            en: 'A refined fine-knit polo shirt embodying minimalist Quiet Luxury styling.',
            ja: 'ミニマリストなクワイエット・ラグジュアリーを体 hiệnした上質なニットポロシャツ。'
          },
          prices: {
            VND: { price: 3850000, compare_at_price: 4500000 },
            USD: { price: 155, compare_at_price: 180 }
          },
          images: [
            'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop'
          ],
          category: categoryMap['women'],
          subCategory: 'Polo',
          colors: ['Off-White', 'Warm Taupe'],
          sizes: ['S', 'M', 'L'],
          inventory: 45,
          status: 'active',
          ratings: {
            average: 4.8,
            count: 12
          }
        },
        {
          sku: 'SC-WOM-SKIRT-002',
          name: {
            vi: 'Chân Váy Xếp Ly Kaki Cao Cấp',
            en: 'Pleated A-Line Golf Skirt',
            ja: 'プリーツ Aライン ゴルフスカート'
          },
          description: {
            vi: 'Váy A-line xếp ly chống tia UV nhẹ nhàng bay bổng trên sân gôn.',
            en: 'An elegant UV-protective pleated A-line skirt offering comfort and fluid motion.',
            ja: '快適さと流れるような動きを提供する、エレガントなUVカットプリーツAラインスカート。'
          },
          prices: {
            VND: { price: 4600000, compare_at_price: 5200000 },
            USD: { price: 185, compare_at_price: 210 }
          },
          images: [
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop'
          ],
          category: categoryMap['women'],
          subCategory: 'Skirt',
          colors: ['Navy Blue', 'Off-White'],
          sizes: ['S', 'M'],
          inventory: 30,
          status: 'active',
          ratings: {
            average: 5.0,
            count: 8
          }
        },
        {
          sku: 'SC-ACC-VISOR-003',
          name: {
            vi: 'Mũ Visor Vải Thô Southcape Logo Thêu',
            en: 'Classic Canvas Visor',
            ja: 'クラシック キャンバス サンバイザー'
          },
          description: {
            vi: 'Mũ visor che nắng vành rộng, thêu logo thủ công tinh tế.',
            en: 'Wide-brim sun protection visor featuring delicate hand-embroidered signature logo.',
            ja: '繊細な手刺繍のシグネチャーロゴがあしらわれた、つば広の日よけサンバイザー。'
          },
          prices: {
            VND: { price: 1850000 },
            USD: { price: 75 }
          },
          images: [
            'https://images.unsplash.com/photo-1534215754734-18e55d13ce35?q=80&w=600&auto=format&fit=crop'
          ],
          category: categoryMap['accessories'],
          subCategory: 'Visor',
          colors: ['Warm Sand', 'Navy Blue'],
          sizes: ['Free Size'],
          inventory: 100,
          status: 'active',
          ratings: {
            average: 4.7,
            count: 24
          }
        }
      ];

      // Sử dụng lodash để lặp qua mockProducts và tạo sản phẩm mẫu
      await Promise.all(
        _.map(mockProducts, async (prod) => {
          await Product.create(prod);
          console.log(`[Seed] Đã tạo sản phẩm mẫu: ${prod.name.vi}`);
        })
      );
      console.log('[Seed] Hoàn tất seed dữ liệu sản phẩm.');
    } else {
      console.log(`[Migration] Bảng sản phẩm đã có ${productsCount} sản phẩm. Bỏ qua seeding sản phẩm.`);
    }

    console.log('--- Hoàn tất tiến trình Migrate & Seed dữ liệu thành công ---');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Lỗi trong quá trình chạy tự động Migration:', errorMessage);
  }
};
