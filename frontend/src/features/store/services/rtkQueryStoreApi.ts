import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../../store';
import { Product } from '../../../interfaces/product.interface';
import { UserInfo } from '../../auth/store/authSlice';

export const rtkQueryStoreApi = createApi({
  reducerPath: 'rtkQueryStoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Auth Endpoints
    login: builder.mutation<{ token: string; user: UserInfo }, { email?: string; password?: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
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
