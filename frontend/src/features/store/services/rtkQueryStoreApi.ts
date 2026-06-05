import { createApi } from '@reduxjs/toolkit/query/react';
import { Product } from '../../../interfaces/product.interface';
import { UserInfo } from '../../auth/store/authSlice';
import { createBaseQueryWithReauth } from '../../../store/baseQueryWithReauth';

export const rtkQueryStoreApi = createApi({
  reducerPath: 'rtkQueryStoreApi',
  baseQuery: createBaseQueryWithReauth((import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api'),
  endpoints: (builder) => ({
    // Auth Endpoints
    login: builder.mutation<{ token: string; user: UserInfo }, { email?: string; password?: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<unknown, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    refresh: builder.mutation<{ token: string; user: UserInfo }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    register: builder.mutation<unknown, unknown>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string; resetToken?: string }, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, unknown>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // Storefront Products API
    getProducts: builder.query<Product[], { category?: string; search?: string; currency?: string } | void>({
      query: (params) => ({
        url: '/products',
        params: params || undefined,
      }),
      transformResponse: (response: unknown) => {
        const products = response as Array<{ _id: string; id?: string }>;
        return products.map((p) => ({
          ...p,
          id: p.id || p._id,
        })) as unknown as Product[];
      },
    }),
    getProductDetails: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: unknown) => {
        const product = response as { _id: string; id?: string };
        return {
          ...product,
          id: product.id || product._id,
        } as unknown as Product;
      },
    }),

    // Orders API
    createOrder: builder.mutation<unknown, unknown>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
    }),
    getOrderDetails: builder.query<unknown, string>({
      query: (orderId) => `/orders/${orderId}`,
    }),
    // API tạo mã QR VNPay tại chỗ (Storefront QR Flow)
    getPaymentQR: builder.query<{ qrCodeData: string; amount: number }, { orderId: string }>({
      query: ({ orderId }) => `/orders/${orderId}/vnpay-qr`,
    }),
    validateCoupon: builder.mutation<{ code: string; discountType: 'percent' | 'fixed'; discountValue: number; minOrderAmount: number }, { code: string; amount?: number }>({
      query: ({ code, amount }) => ({
        url: `/orders/validate-coupon/${code}`,
        params: amount ? { amount } : undefined,
        method: 'GET',
      }),
    }),
  }),
});

export const { 
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateOrderMutation, 
  useGetOrderDetailsQuery, 
  useGetPaymentQRQuery,
  useValidateCouponMutation,
} = rtkQueryStoreApi;
