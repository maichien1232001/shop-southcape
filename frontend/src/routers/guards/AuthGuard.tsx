import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { notification, Spin } from 'antd';
import { RootState } from '../../store';

interface AuthGuardProps {
  allowedRoles?: ('customer' | 'staff' | 'admin' | 'superadmin')[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ allowedRoles = ['admin', 'superadmin'] }) => {
  const location = useLocation();
  const { token, user, isInitializing } = useSelector((state: RootState) => state.auth);

  const role = user?.role || 'customer';
  const isAuthorized = !!token && (allowedRoles as string[]).includes(role);

  useEffect(() => {
    if (token && !isAuthorized) {
      notification.error({
        message: 'Quyền truy cập bị từ chối',
        description: 'Bạn không có quyền truy cập trang này!',
        placement: 'topRight'
      });
    }
  }, [token, isAuthorized]);

  if (isInitializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (!token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
