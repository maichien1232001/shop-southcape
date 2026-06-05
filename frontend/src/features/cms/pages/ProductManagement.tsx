import React, { useState } from 'react';
import { Product } from '../../../interfaces/product.interface';
import { formatPrice } from '../../../utils';
import { AnimateContainer } from '../../../components/AnimateContainer';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, Eye } from 'lucide-react';
import { Table, Button, Tag, notification } from 'antd';
import { ProductFilters } from '../../../components/cms/ProductFilters';
import { ProductFormModal } from '../../../components/cms/ProductFormModal';
import {
  useGetCmsProductsQuery,
  useCreateCmsProductMutation,
  useUpdateCmsProductMutation,
  useDeleteCmsProductMutation,
} from '../services/rtkQueryCmsApi';

export const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Trạng thái bộ lọc
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
  });

  // RTK Query CMS APIs
  const { data: responseData, isLoading: isListLoading } = useGetCmsProductsQuery({
    page,
    limit,
    search: filters.search || undefined,
    category: filters.category !== 'all' ? filters.category : undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
  });

  const dbProducts = responseData?.data || [];
  const total = responseData?.pagination?.total || 0;

  const [createProductApi, { isLoading: isCreating }] = useCreateCmsProductMutation();
  const [updateProductApi, { isLoading: isUpdating }] = useUpdateCmsProductMutation();
  const [deleteProductApi, { isLoading: isDeleting }] = useDeleteCmsProductMutation();

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  // Xóa sản phẩm qua API
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductApi(productId).unwrap();
      notification.success({
        message: 'Thành công',
        description: 'Đã xóa sản phẩm thành công!',
        placement: 'topRight'
      });
    } catch (err: unknown) {
      console.error('Lỗi xóa sản phẩm:', err);
      notification.error({
        message: 'Thất bại',
        description: 'Lỗi xóa sản phẩm. Vui lòng thử lại.',
        placement: 'topRight'
      });
    }
  };

  // Thêm mới hoặc chỉnh sửa sản phẩm qua API
  const handleFormSubmit = async (formValues: Partial<Product>) => {
    try {
      if (editingProduct) {
        const id = editingProduct.id || (editingProduct as { _id?: string })._id || '';
        await updateProductApi({
          id,
          ...formValues,
        }).unwrap();
        notification.success({
          message: 'Thành công',
          description: `Đã cập nhật sản phẩm "${formValues.name?.vi}" thành công!`,
          placement: 'topRight'
        });
      } else {
        await createProductApi({
          ...formValues,
          sku: formValues.sku || `SKU-${Date.now()}`,
          images: formValues.images && formValues.images.length > 0 ? formValues.images : [
            'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop'
          ],
          category: formValues.category || 'women',
          subCategory: formValues.subCategory || 'Other',
          colors: formValues.colors || ['Off-White'],
          sizes: formValues.sizes || ['S', 'M', 'L'],
          inventory: formValues.inventory || 0,
          status: formValues.status || 'active',
        }).unwrap();
        notification.success({
          message: 'Thành công',
          description: `Đã thêm sản phẩm "${formValues.name?.vi}" thành công!`,
          placement: 'topRight'
        });
      }

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Lỗi lưu sản phẩm:', err);
      const errMsg = err?.data?.error || err?.data?.message || 'Lưu sản phẩm thất bại. Vui lòng thử lại.';
      notification.error({
        message: 'Thất bại',
        description: errMsg,
        placement: 'topRight'
      });
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'images',
      key: 'images',
      width: 70,
      render: (images: string[]) => (
        <img
          src={images[0]}
          alt="Product Thumbnail"
          className="w-10 h-13 object-cover border border-brand-border"
        />
      ),
    },
    {
      title: 'Mã SKU / ID',
      key: 'sku',
      width: 140,
      render: (_: unknown, record: Product) => (
        <div className="flex flex-col gap-0.5">
          <code className="text-[10px] text-brand-forest font-semibold bg-brand-border/40 px-1 py-0.5 w-max">{record.sku}</code>
          <span className="text-[9px] text-brand-gray">{record.id || (record as { _id?: string })._id}</span>
        </div>
      ),
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      render: (_: unknown, record: Product) => (
        <div className="font-sans text-xs">
          <strong className="text-brand-dark block text-xs sm:text-sm">{record.name.vi}</strong>
          <span className="text-brand-gray text-[10px] block font-light">{record.name.en}</span>
          <span className="text-brand-accent text-[9px] uppercase font-light tracking-wider">{record.subCategory}</span>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: unknown) => {
        const cat = category as { slug?: string; name?: Record<string, string> } | null;
        const catName = typeof cat === 'object' && cat !== null ? cat.name?.vi || cat.slug : String(category);
        const catSlug = typeof cat === 'object' && cat !== null ? cat.slug : String(category);
        return (
          <Tag color={catSlug === 'women' ? 'pink' : catSlug === 'men' ? 'blue' : 'gold'} className="rounded-none font-sans text-[10px] uppercase">
            {catName}
          </Tag>
        );
      },
    },
    {
      title: 'Giá bán (VND / USD)',
      key: 'prices',
      align: 'right' as const,
      width: 160,
      render: (_: unknown, record: Product) => {
        const vnd = record.prices.VND?.price;
        const usd = record.prices.USD?.price;
        return (
          <div className="flex flex-col text-right font-sans text-xs">
            <span className="font-bold text-brand-forest">{vnd ? formatPrice(vnd, 'VND') : '-'}</span>
            <span className="text-brand-gray text-[10px]">{usd ? formatPrice(usd, 'USD') : '-'}</span>
          </div>
        );
      },
    },
    {
      title: 'Kho / Trạng thái',
      key: 'inventory',
      width: 120,
      render: (_: unknown, record: Product) => (
        <div className="flex flex-col gap-1 font-sans text-xs">
          <span className="text-brand-dark">Tồn kho: <strong>{record.inventory}</strong></span>
          <Tag color={record.status === 'active' ? 'success' : record.status === 'draft' ? 'warning' : 'default'} className="rounded-none text-[9px] uppercase w-max">
            {record.status}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: Product) => {
        const pId = record.id || (record as { _id?: string })._id || '';
        return (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate(`/product/${pId}`)}
              className="text-brand-gray hover:text-brand-forest transition-colors"
              title="Xem sản phẩm"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => handleEditClick(record)}
              className="text-brand-gray hover:text-brand-accent transition-colors"
              title="Chỉnh sửa sản phẩm"
            >
              <Edit size={15} />
            </button>
            <button
              onClick={() => handleDeleteProduct(pId)}
              className="text-brand-gray hover:text-red-500 transition-colors"
              title="Xóa sản phẩm"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Quản lý sản phẩm</h1>
          <p className="text-xs text-brand-gray mt-1">
            Tổng cộng <strong>{total}</strong> sản phẩm phù hợp
          </p>
        </div>
        <Button
          type="primary"
          onClick={handleAddClick}
          icon={<Plus size={14} />}
          className="flex items-center gap-1.5"
        >
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Bộ lọc sản phẩm */}
      <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Bảng sản phẩm */}
      <Table
        dataSource={dbProducts}
        columns={columns}
        rowKey={(record) => record.id || (record as { _id?: string })._id || ''}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (newPage) => setPage(newPage),
          showSizeChanger: false,
        }}
        loading={isListLoading || isDeleting}
        className="font-sans text-xs"
      />

      {/* Modal Form Thêm/Sửa sản phẩm */}
      <ProductFormModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        initialValues={editingProduct}
        confirmLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default ProductManagement;
