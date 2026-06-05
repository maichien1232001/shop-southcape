import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Form, Input, InputNumber, Switch, Spin, notification, Popconfirm } from 'antd';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useGetCmsPaymentMethodsQuery, useCreateCmsPaymentMethodMutation, useUpdateCmsPaymentMethodMutation, useDeleteCmsPaymentMethodMutation } from '../services/rtkQueryCmsApi';

export const PaymentManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: responseData, isLoading } = useGetCmsPaymentMethodsQuery({ page, limit });
  const [createMethod, { isLoading: isCreating }] = useCreateCmsPaymentMethodMutation();
  const [updateMethod, { isLoading: isUpdating }] = useUpdateCmsPaymentMethodMutation();
  const [deleteMethod] = useDeleteCmsPaymentMethodMutation();

  const methods = responseData?.data || [];
  const total = responseData?.pagination?.total || 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [form] = Form.useForm();

  const handleOpenAdd = () => { setEditingMethod(null); form.resetFields(); setModalOpen(true); };
  const handleOpenEdit = (method: any) => {
    setEditingMethod(method);
    form.setFieldsValue(method);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingMethod) {
        await updateMethod({ id: editingMethod.id, ...values }).unwrap();
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật phương thức thanh toán thành công!',
          placement: 'topRight'
        });
      } else {
        await createMethod(values).unwrap();
        notification.success({
          message: 'Thành công',
          description: 'Tạo phương thức thanh toán thành công!',
          placement: 'topRight'
        });
      }
      setModalOpen(false); form.resetFields();
    } catch (err: any) {
      console.error('Lỗi lưu phương thức thanh toán:', err);
      const errMsg = err?.data?.error || err?.data?.message || 'Lỗi lưu phương thức thanh toán.';
      notification.error({
        message: 'Thất bại',
        description: errMsg,
        placement: 'topRight'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMethod(id).unwrap();
      notification.success({
        message: 'Thành công',
        description: 'Đã xóa phương thức thanh toán!',
        placement: 'topRight'
      });
    } catch (err: any) {
      const errMsg = err?.data?.error || err?.data?.message || 'Lỗi xóa phương thức thanh toán.';
      notification.error({
        message: 'Thất bại',
        description: errMsg,
        placement: 'topRight'
      });
    }
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name', width: 200,
      render: (name: string) => <span className="font-semibold text-brand-dark">{name}</span>,
    },
    { title: 'Mã code', dataIndex: 'code', key: 'code', width: 140,
      render: (code: string) => <code className="font-bold text-brand-dark tracking-wider bg-brand-border/30 px-2 py-0.5">{code}</code>,
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description',
      render: (desc: string) => <span className="text-brand-gray text-xs">{desc || '—'}</span>,
    },
    { title: 'Thứ tự', dataIndex: 'sortOrder', key: 'sortOrder', width: 80, align: 'center' as const,
      render: (order: number) => <span className="font-semibold">{order}</span>,
    },
    { title: 'Hoạt động', dataIndex: 'isActive', key: 'isActive', width: 100,
      render: (active: boolean) => <Tag color={active ? 'success' : 'default'} className="rounded text-[10px]">{active ? 'Bật' : 'Tắt'}</Tag>,
    },
    { title: 'Thao tác', key: 'actions', width: 100, align: 'center' as const,
      render: (_: unknown, record: any) => (
        <div className="flex gap-2 justify-center">
          <button onClick={() => handleOpenEdit(record)} className="text-brand-gray hover:text-brand-accent transition-colors"><Edit size={15} /></button>
          <Popconfirm title="Xóa phương thức này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
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
          <h1 className="text-xl font-bold text-brand-dark">Quản lý phương thức thanh toán</h1>
          <p className="text-xs text-brand-gray mt-1">Tổng cộng <strong>{total}</strong> phương thức</p>
        </div>
        <Button type="primary" onClick={handleOpenAdd} icon={<Plus size={14} />} className="flex items-center gap-1.5">Thêm phương thức</Button>
      </div>

      <Table 
        dataSource={methods} 
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

      <Modal title={editingMethod ? 'Chỉnh sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSubmit} confirmLoading={isCreating || isUpdating} okText="Lưu" cancelText="Hủy" width={480}>
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="Tên hiển thị" rules={[{ required: true, message: 'Nhập tên' }]}><Input placeholder="VD: Thanh toán khi nhận hàng" /></Form.Item>
          <Form.Item name="code" label="Mã code" rules={[{ required: true, message: 'Nhập mã code' }]}><Input placeholder="VD: COD" /></Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea rows={2} /></Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="sortOrder" label="Thứ tự sắp xếp" initialValue={0}><InputNumber min={0} className="w-full" /></Form.Item>
            <Form.Item name="isActive" label="Hoạt động" valuePropName="checked" initialValue={true}><Switch /></Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentManagement;
