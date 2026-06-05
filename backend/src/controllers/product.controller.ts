import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import _ from 'lodash';
import { Product, IProduct } from '../models/Product';
import { Category } from '../models/Category';
import { translateValidationError } from '../utils/errorTranslator';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, minPrice, maxPrice, currency = 'VND', page, limit, status } = req.query;

    const query: FilterQuery<IProduct> = {};

    // Lọc theo status
    if (status && status !== 'all') {
      query.status = status;
    }

    // 1. Lọc theo danh mục (category slug hoặc ID)
    if (category && category !== 'all') {
      const matchedCat = await Category.findOne({ slug: category });
      if (matchedCat) {
        query.category = matchedCat._id;
      }
    }

    // 2. Tìm kiếm (theo tên hoặc sku)
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { sku: searchRegex },
        { 'name.vi': searchRegex },
        { 'name.en': searchRegex },
        { 'name.ja': searchRegex }
      ];
    }

    const products = await Product.find(query).populate('category').sort({ createdAt: -1 });

    // 3. Lọc theo giá sau khi lấy dữ liệu (do prices là Map cấu trúc động)
    let filteredProducts = products;
    const activeCurrency = String(currency).toUpperCase();

    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;

      filteredProducts = _.filter(products, (p) => {
        const priceData = p.prices ? p.prices.get(activeCurrency) : undefined;
        const price = _.get(priceData, 'price');
        if (price === undefined) return false;
        return price >= min && price <= max;
      }) as typeof products;
    }

    const isCms = req.originalUrl.includes('/cms');
    if (isCms) {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const total = filteredProducts.length;
      const totalPages = Math.ceil(total / limitNum);
      const paginated = filteredProducts.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      res.status(200).json({
        data: paginated,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
        },
      });
      return;
    }

    res.status(200).json(filteredProducts);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách sản phẩm.', error: msg });
  }
};

export const getProductDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category');

    if (!product) {
      res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
      return;
    }

    res.status(200).json(product);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Lỗi lấy chi tiết sản phẩm.', error: msg });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const allowedFields = ['sku', 'name', 'description', 'seoTitle', 'seoDescription', 'prices', 'images', 'category', 'subCategory', 'colors', 'sizes', 'inventory', 'status', 'ratings'];
    const productData = _.pick(req.body, allowedFields);

    // Phân giải category từ slug (ví dụ 'women') sang ObjectId
    if (typeof productData.category === 'string') {
      const matchedCat = await Category.findOne({ slug: productData.category });
      if (matchedCat) {
        productData.category = matchedCat._id;
      } else {
        // Nếu không tìm thấy, thử tìm theo ObjectId
        const existingCat = await Category.findById(productData.category);
        if (!existingCat) {
          res.status(400).json({ message: 'Danh mục sản phẩm không hợp lệ.' });
          return;
        }
      }
    }

    const newProduct = await Product.create(productData);
    const populated = await newProduct.populate('category');
    res.status(201).json(populated);
  } catch (error: any) {
    const msg = translateValidationError(error);
    res.status(400).json({ message: 'Lỗi thêm sản phẩm mới.', error: msg });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const allowedFields = ['sku', 'name', 'description', 'seoTitle', 'seoDescription', 'prices', 'images', 'category', 'subCategory', 'colors', 'sizes', 'inventory', 'status', 'ratings'];
    const updateData = _.pick(req.body, allowedFields);

    if (typeof updateData.category === 'string') {
      const matchedCat = await Category.findOne({ slug: updateData.category });
      if (matchedCat) {
        updateData.category = matchedCat._id;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate('category');
    if (!updatedProduct) {
      res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (error: any) {
    const msg = translateValidationError(error);
    res.status(400).json({ message: 'Lỗi cập nhật sản phẩm.', error: msg });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
      return;
    }

    res.status(200).json({ message: 'Đã xóa sản phẩm thành công.', id });
  } catch (error: any) {
    const msg = translateValidationError(error);
    res.status(400).json({ message: 'Lỗi xóa sản phẩm.', error: msg });
  }
};
