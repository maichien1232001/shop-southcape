import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Form, Input, InputNumber, DatePicker, Select, Switch, Spin, notification, Popconfirm } from 'antd';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useGetCmsCouponsQuery, useCreateCmsCouponMutation, useUpdateCmsCouponMutation, useDeleteCmsCouponMutation } from '../services/rtkQueryCmsApi';
import dayjs from 'dayjs';

import { DISCOUNT_TYPE_OPTIONS } from '../../../constants/selectOptions';

export const CouponManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: responseData, isLoading } = useGetCmsCouponsQuery({ page, limit });
  const [createCoupon, { isLoading: isCreating }] = useCreateCmsCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCmsCouponMutation();
  const [deleteCoupon] = useDeleteCmsCouponMutation();

  const coupons = responseData?.data || [];
  const total = responseData?.pagination?.total || 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [form] = Form.useForm();

  const handleOpenAdd = () => { setEditingCoupon(null); form.resetFields(); setModalOpen(true); };
  const handleOpenEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    form.setFieldsValue({
      ...coupon,
      expiresAt: coupon.expiresAt ? dayjs(coupon.expiresAt) : undefined
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values, expiresAt: values.expiresAt?.toISOString() || dayjs().toISOString() };
      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon.id, ...payload }).unwrap();
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật mã giảm giá thành công!',
          placement: 'topRight'
        });
      } else {
        await createCoupon(payload).unwrap();
        notification.success({
          message: 'Thành công',
          description: 'Tạo mã giảm giá thành công!',
          placement: 'topRight'
        });
      }
      setModalOpen(false); form.resetFields();
    } catch (err: any) {
      console.error('Lỗi lưu mã giảm giá:', err);
      const errMsg = err?.data?.error || err?.data?.message || 'Lỗi lưu mã giảm giá.';
      notification.error({
        message: 'Thất bại',
        description: errMsg,
        placement: 'topRight'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id).unwrap();
      notification.success({
        message: 'Thành công',
        description: 'Đã xóa mã giảm giá!',
        placement: 'topRight'
      });
    } catch (err: any) {
      const errMsg = err?.data?.error || err?.data?.message || 'Lỗi xóa mã giảm giá.';
      notification.error({
        message: 'Thất bại',
        description: errMsg,
        placement: 'topRight'
      });
    }
  };

  const columns = [
    { title: 'Mã code', dataIndex: 'code', key: 'code', width: 140,
      render: (code: string) => <code className="font-bold text-brand-dark tracking-wider bg-brand-border/30 px-2 py-0.5">{code}</code>,
    },
    { title: 'Loại', dataIndex: 'discountType', key: 'discountType', width: 100,
      render: (type: string) => <Tag color={type === 'percent' ? 'blue' : 'green'} className="rounded text-[10px] uppercase">{type === 'percent' ? 'Phần trăm' : 'Cố định'}</Tag>,
    },
    { title: 'Giá trị', dataIndex: 'discountValue', key: 'discountValue', width: 100,
      render: (val: number, record: any) => <span className="font-semibold">{record.discountType === 'percent' ? `${val}%` : `$${val}`}</span>,
    },
    { title: 'Đã dùng / Tối đa', key: 'usage', width: 130,
      render: (_: unknown, r: any) => <span className="text-xs">{r.usedCount} / {r.maxUses || '∞'}</span>,
    },
    { title: 'Hết hạn', dataIndex: 'expiresAt', key: 'expiresAt', width: 130,
      render: (d: string) => {
        const date = dayjs(d);
        const expired = date.isBefore(dayjs());
        return <span className={`text-xs ${expired ? 'text-red-500' : 'text-brand-gray'}`}>{date.format('DD/MM/YYYY')}</span>;
      },
    },
    { title: 'Hoạt động', dataIndex: 'isActive', key: 'isActive', width: 90,
      render: (active: boolean) => <Tag color={active ? 'success' : 'default'} className="rounded text-[10px]">{active ? 'Bật' : 'Tắt'}</Tag>,
    },
    { title: 'Thao tác', key: 'actions', width: 100, align: 'center' as const,
      render: (_: unknown, record: any) => (
        <div className="flex gap-2 justify-center">
          <button onClick={() => handleOpenEdit(record)} className="text-brand-gray hover:text-brand-accent transition-colors"><Edit size={15} /></button>
          <Popconfirm title="Xóa mã giảm giá này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <button className="text-brand-gray hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="flex justify-center items-center min-h-[40vh]"><Spin size="large" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Quản lý mã giảm giá</h1>
          <p className="text-xs text-brand-gray mt-1">Tổng cộng <strong>{total}</strong> mã giảm giá</p>
        </div>
        <Button type="primary" onClick={handleOpenAdd} icon={<Plus size={14} />} className="flex items-center gap-1.5">Thêm mã mới</Button>
      </div>

      <Table 
        dataSource={coupons} 
        columns={columns} 
        rowKey="id" 
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (newPage) => setPage(newPage),
          showSizeChanger: false,
        }} 
        size="middle" 
        className="text-xs" 
      />

      <Modal title={editingCoupon ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSubmit} confirmLoading={isCreating || isUpdating} okText="Lưu" cancelText="Hủy" width={500}>
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="code" label="Mã code" rules={[{ required: true, message: 'Nhập mã code' }]}><Input placeholder="VD: SUMMER2026" /></Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="discountType" label="Loại giảm giá" rules={[{ required: true }]}><Select options={DISCOUNT_TYPE_OPTIONS} /></Form.Item>
            <Form.Item name="discountValue" label="Giá trị" rules={[{ required: true }]}><InputNumber min={0} className="w-full" /></Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="minOrderAmount" label="Đơn tối thiểu ($)"><InputNumber min={0} className="w-full" /></Form.Item>
            <Form.Item name="maxUses" label="Số lần dùng tối đa (0 = vô hạn)"><InputNumber min={0} className="w-full" /></Form.Item>
          </div>
          <Form.Item name="expiresAt" label="Ngày hết hạn" rules={[{ required: !editingCoupon, message: 'Chọn ngày hết hạn' }]}><DatePicker className="w-full" /></Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="isActive" label="Hoạt động" valuePropName="checked" initialValue={true}><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponManagement;
