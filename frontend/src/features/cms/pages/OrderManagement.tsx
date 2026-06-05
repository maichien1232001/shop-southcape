import React from 'react';
import { Table, Tag, Select, Spin, Typography, notification } from 'antd';
import { useGetCmsOrdersQuery, useUpdateOrderStatusMutation } from '../services/rtkQueryCmsApi';
import { formatPrice } from '../../../utils';
import dayjs from 'dayjs';

const { Text } = Typography;

import { ORDER_STATUS_OPTIONS } from '../../../constants/selectOptions';

const statusColors: Record<string, string> = {
  pending: 'warning', confirmed: 'processing', shipping: 'blue', delivered: 'success', cancelled: 'error',
};
const statusLabels: Record<string, string> = {
  pending: 'Chờ xử lý', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy',
};

export const OrderManagement: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data: responseData, isLoading } = useGetCmsOrdersQuery({ page, limit });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orders = responseData?.data || [];
  const total = responseData?.pagination?.total || 0;

  const handleStatusChange = async (id: string, orderStatus: string) => {
    try {
      await updateStatus({ id, orderStatus }).unwrap();
      notification.success({
        message: 'Thành công',
        description: 'Cập nhật trạng thái đơn hàng thành công!',
        placement: 'topRight'
      });
    } catch {
      notification.error({
        message: 'Thất bại',
        description: 'Lỗi cập nhật trạng thái.',
        placement: 'topRight'
      });
    }
  };

  const columns = [
    {
      title: 'Mã đơn', dataIndex: 'orderCode', key: 'orderCode', width: 120,
      render: (code: string) => <code className="font-bold text-brand-dark tracking-wider">{code}</code>,
    },
    {
      title: 'Khách hàng', key: 'customer', width: 180,
      render: (_: unknown, record: any) => (
        <div>
          <div className="font-semibold text-brand-dark text-xs">{record.shippingAddress?.recipientName || 'N/A'}</div>
          <div className="text-brand-gray text-[10px]">{record.shippingAddress?.recipientPhone || ''}</div>
        </div>
      ),
    },
    {
      title: 'Tổng tiền', key: 'total', align: 'right' as const, width: 140,
      render: (_: unknown, record: any) => (
        <Text strong className="text-brand-dark">{formatPrice(record.totalAmount, record.currency as 'USD' | 'VND')}</Text>
      ),
    },
    {
      title: 'Thanh toán', dataIndex: 'paymentMethod', key: 'paymentMethod', width: 120,
      render: (method: string) => <Tag className="rounded text-[10px] uppercase">{method}</Tag>,
    },
    {
      title: 'Trạng thái', dataIndex: 'orderStatus', key: 'orderStatus', width: 160,
      render: (status: string, record: any) => (
        <Select
          value={status}
          onChange={(val) => handleStatusChange(record.id, val)}
          options={ORDER_STATUS_OPTIONS}
          className="w-full"
          loading={isUpdating}
        />
      ),
    },
    {
      title: 'Trạng thái hiện tại', dataIndex: 'orderStatus', key: 'statusTag', width: 120,
      render: (status: string) => (
        <Tag color={statusColors[status] || 'default'} className="rounded text-[10px] uppercase font-semibold">
          {statusLabels[status] || status}
        </Tag>
      ),
    },
    {
      title: 'Ngày đặt', key: 'date', width: 140,
      render: (_: unknown, record: any) => {
        const d = dayjs(record.createdAt);
        return <span className="text-brand-gray text-xs">{d.format('DD/MM/YYYY HH:mm')}</span>;
      },
    },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[40vh]"><Spin size="large" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Quản lý đơn hàng</h1>
          <p className="text-xs text-brand-gray mt-1">Tổng cộng <strong>{total}</strong> đơn hàng</p>
        </div>
      </div>
      <Table 
        dataSource={orders} 
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
    </div>
  );
};

export default OrderManagement;
