import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './index';
import { setCredentials, logout } from '../features/auth/store/authSlice';

// Biến dùng chung ở cấp độ module để lưu trữ duy nhất 1 tiến trình refresh token đang chạy
let refreshPromise: Promise<string | null> | null = null;

export const createBaseQueryWithReauth = (baseUrl: string) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include', // Đảm bảo đính kèm Cookie chứa refreshToken
  });

  return async (args: any, api: any, extraOptions: any) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      // Bỏ qua nếu là request login hoặc refresh để tránh lặp vô tận
      const isRefreshRequest = typeof args === 'object' && args !== null && args.url === '/auth/refresh';
      const isLoginRequest = typeof args === 'object' && args !== null && args.url === '/auth/login';

      if (isRefreshRequest || isLoginRequest) {
        return result;
      }

      if (!refreshPromise) {
        // Tạo baseQuery gốc tới api chính để gọi refresh token
        const rootBaseQuery = fetchBaseQuery({
          baseUrl: (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api',
          credentials: 'include',
        });

        refreshPromise = (async () => {
          try {
            const refreshResult = await rootBaseQuery(
              {
                url: '/auth/refresh',
                method: 'POST',
              },
              api,
              extraOptions
            );

            if (refreshResult.data) {
              const data = refreshResult.data as { token: string; user: any };
              api.dispatch(setCredentials({ token: data.token, user: data.user }));
              return data.token;
            }
          } catch (err) {
            console.error('Lỗi khi tự động làm mới token:', err);
          }
          return null;
        })();
      }

      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        // Thử lại request ban đầu với token mới (prepareHeaders sẽ tự lấy token mới từ state)
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh thất bại, logout người dùng
        api.dispatch(logout());
      }
    }

    return result;
  };
};
