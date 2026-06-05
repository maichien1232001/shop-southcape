import React from 'react';
import { Table, Tag, Select, Spin, Avatar, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useGetCmsCustomersQuery, useUpdateCustomerRoleMutation } from '../services/rtkQueryCmsApi';
import dayjs from 'dayjs';

const roleColors: Record<string, string> = { customer: 'default', staff: 'blue', admin: 'purple', superadmin: 'red' };
const roleLabels: Record<string, string> = { customer: 'Khách hàng', staff: 'Nhân viên', admin: 'Quản trị', superadmin: 'Super Admin' };
import { ROLE_OPTIONS } from '../../../constants/selectOptions';

export const CustomerManagement: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data: responseData, isLoading } = useGetCmsCustomersQuery({ page, limit });
  const [updateRole, { isLoading: isUpdating }] = useUpdateCustomerRoleMutation();

  const customers = responseData?.data || [];
  const total = responseData?.pagination?.total || 0;

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateRole({ id, role }).unwrap();
      notification.success({
        message: 'Thành công',
        description: 'Cập nhật vai trò thành công!',
        placement: 'topRight'
      });
    } catch (err: any) {
      const errMsg = err?.data?.error || err?.data?.message || 'Lỗi cập nhật vai trò.';
      notification.error({
        message: 'Thất bại',
        description: errMsg,
        placement: 'topRight'
      });
    }
  };

  const columns = [
    { title: 'Người dùng', key: 'user', width: 250,
      render: (_: unknown, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} src={record.avatar} size="small" style={{ backgroundColor: '#0f172a' }} />
          <div>
            <div className="font-semibold text-brand-dark text-xs">{record.fullName}</div>
            <div className="text-brand-gray text-[10px]">{record.email}</div>
          </div>
        </div>
      ),
    },
    { title: 'SĐT', dataIndex: 'phoneNumber', key: 'phone', width: 130,
      render: (phone: string) => <span className="text-xs text-brand-gray">{phone || 'Chưa cập nhật'}</span>,
    },
    { title: 'Vai trò', dataIndex: 'role', key: 'role', width: 140,
      render: (role: string) => <Tag color={roleColors[role] || 'default'} className="rounded text-[10px] uppercase font-semibold">{roleLabels[role] || role}</Tag>,
    },
    { title: 'Đổi vai trò', key: 'changeRole', width: 160,
      render: (_: unknown, record: any) => (
        <Select value={record.role} onChange={(val) => handleRoleChange(record.id, val)} options={ROLE_OPTIONS} className="w-full" loading={isUpdating} />
      ),
    },
    { title: 'Đơn hàng', dataIndex: 'orderCount', key: 'orders', width: 90, align: 'center' as const,
      render: (count: number) => <span className="font-semibold text-brand-dark">{count}</span>,
    },
    { title: 'Đăng nhập qua', dataIndex: 'provider', key: 'provider', width: 110,
      render: (provider: string) => <Tag className="rounded text-[10px] uppercase">{provider}</Tag>,
    },
    { title: 'Ngày tham gia', key: 'date', width: 130,
      render: (_: unknown, record: any) => {
        const d = dayjs(record.createdAt);
        return <span className="text-brand-gray text-xs">{d.format('DD/MM/YYYY')}</span>;
      },
    },
  ];

  if (isLoading) return <div className="flex justify-center items-center min-h-[40vh]"><Spin size="large" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Quản lý khách hàng</h1>
          <p className="text-xs text-brand-gray mt-1">Tổng cộng <strong>{total}</strong> người dùng</p>
        </div>
      </div>
      <Table 
        dataSource={customers} 
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

export default CustomerManagement;
