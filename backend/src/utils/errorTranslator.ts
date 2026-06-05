export const translateValidationError = (error: any): string => {
  if (error && error.name === 'ValidationError' && error.errors) {
    const missingFields: string[] = [];
    
    // Map of database fields/paths to Vietnamese friendly names
    const fieldMap: Record<string, string> = {
      'name.vi': 'Tên sản phẩm (Tiếng Việt)',
      'name.en': 'Tên sản phẩm (Tiếng Anh)',
      'name.ja': 'Tên sản phẩm (Tiếng Nhật)',
      'description.vi': 'Mô tả sản phẩm (Tiếng Việt)',
      'description.en': 'Mô tả sản phẩm (Tiếng Anh)',
      'description.ja': 'Mô tả sản phẩm (Tiếng Nhật)',
      'category': 'Danh mục',
      'sku': 'Mã SKU',
      'prices': 'Giá sản phẩm',
      'inventory': 'Số lượng tồn kho',
      'status': 'Trạng thái',
      'code': 'Mã code giảm giá',
      'discountType': 'Loại giảm giá',
      'discountValue': 'Giá trị giảm giá',
      'expiresAt': 'Ngày hết hạn',
      'minOrderAmount': 'Số tiền tối thiểu',
      'maxUses': 'Số lần dùng tối đa',
      'name': 'Tên hiển thị',
    };

    Object.keys(error.errors).forEach((key) => {
      const fieldName = fieldMap[key] || key;
      missingFields.push(fieldName);
    });

    return `Thiếu hoặc sai định dạng các trường bắt buộc: ${missingFields.join(', ')}`;
  }
  
  if (error && error.code === 11000) {
    // Duplicate key error in MongoDB
    const keys = Object.keys(error.keyValue || {});
    return `Dữ liệu đã tồn tại và bị trùng lặp: ${keys.join(', ')}`;
  }

  return error.message || String(error);
};
