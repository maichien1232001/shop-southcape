import { createApi } from '@reduxjs/toolkit/query/react';
import { Product } from '../../../interfaces/product.interface';
import { createBaseQueryWithReauth } from '../../../store/baseQueryWithReauth';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CmsQueryListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

export const rtkQueryCmsApi = createApi({
  reducerPath: 'rtkQueryCmsApi',
  tagTypes: ['CmsProducts', 'CmsOrders', 'CmsCoupons', 'CmsCustomers', 'CmsPayments', 'CmsStats'],
  baseQuery: createBaseQueryWithReauth(`${(import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api'}/cms`),
  endpoints: (builder) => ({
    // ===== Sản phẩm =====
    getCmsProducts: builder.query<PaginatedResponse<Product>, CmsQueryListParams | void>({
      query: (params) => ({
        url: '/products',
        params: params || undefined,
      }),
      providesTags: ['CmsProducts'],
      transformResponse: (response: any) => {
        const data = (response.data || []) as Array<{ _id: string; id?: string }>;
        return {
          data: data.map((p) => ({
            ...p,
            id: p.id || p._id,
          })) as unknown as Product[],
          pagination: response.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 },
        };
      },
    }),
    createCmsProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['CmsProducts', 'CmsStats'],
    }),
    updateCmsProduct: builder.mutation<Product, Partial<Product> & { id: string }>({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: 'PUT', body }),
      invalidatesTags: ['CmsProducts', 'CmsStats'],
    }),
    deleteCmsProduct: builder.mutation<{ message: string; id: string }, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CmsProducts', 'CmsStats'],
    }),

    // ===== Dashboard Stats =====
    getDashboardStats: builder.query<{
      totalSales: number;
      totalOrders: number;
      totalProducts: number;
      totalCustomers: number;
      activeCoupons: number;
      ordersByStatus: Record<string, number>;
      salesTrend: Array<{ date: string; sales: number; orders: number }>;
      categoryDistribution: Array<{ category: string; count: number }>;
      recentOrders: Array<{
        id: string; orderCode: string; customerName: string;
        totalAmount: number; currency: string; orderStatus: string; createdAt: string;
      }>;
    }, void>({
      query: () => '/stats',
      providesTags: ['CmsStats'],
    }),

    // ===== Đơn hàng =====
    getCmsOrders: builder.query<PaginatedResponse<any>, CmsQueryListParams | void>({
      query: (params) => ({
        url: '/orders',
        params: params || undefined,
      }),
      providesTags: ['CmsOrders'],
    }),
    updateOrderStatus: builder.mutation<any, { id: string; orderStatus: string }>({
      query: ({ id, orderStatus }) => ({ url: `/orders/${id}/status`, method: 'PUT', body: { orderStatus } }),
      invalidatesTags: ['CmsOrders', 'CmsStats'],
    }),

    // ===== Mã giảm giá =====
    getCmsCoupons: builder.query<PaginatedResponse<any>, CmsQueryListParams | void>({
      query: (params) => ({
        url: '/coupons',
        params: params || undefined,
      }),
      providesTags: ['CmsCoupons'],
    }),
    createCmsCoupon: builder.mutation<any, any>({
      query: (body) => ({ url: '/coupons', method: 'POST', body }),
      invalidatesTags: ['CmsCoupons', 'CmsStats'],
    }),
    updateCmsCoupon: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...body }) => ({ url: `/coupons/${id}`, method: 'PUT', body }),
      invalidatesTags: ['CmsCoupons', 'CmsStats'],
    }),
    deleteCmsCoupon: builder.mutation<any, string>({
      query: (id) => ({ url: `/coupons/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CmsCoupons', 'CmsStats'],
    }),

    // ===== Khách hàng =====
    getCmsCustomers: builder.query<PaginatedResponse<any>, CmsQueryListParams | void>({
      query: (params) => ({
        url: '/customers',
        params: params || undefined,
      }),
      providesTags: ['CmsCustomers'],
    }),
    updateCustomerRole: builder.mutation<any, { id: string; role: string }>({
      query: ({ id, role }) => ({ url: `/customers/${id}/role`, method: 'PUT', body: { role } }),
      invalidatesTags: ['CmsCustomers', 'CmsStats'],
    }),

    // ===== Phương thức thanh toán =====
    getCmsPaymentMethods: builder.query<PaginatedResponse<any>, CmsQueryListParams | void>({
      query: (params) => ({
        url: '/payment-methods',
        params: params || undefined,
      }),
      providesTags: ['CmsPayments'],
    }),
    createCmsPaymentMethod: builder.mutation<any, any>({
      query: (body) => ({ url: '/payment-methods', method: 'POST', body }),
      invalidatesTags: ['CmsPayments'],
    }),
    updateCmsPaymentMethod: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...body }) => ({ url: `/payment-methods/${id}`, method: 'PUT', body }),
      invalidatesTags: ['CmsPayments'],
    }),
    deleteCmsPaymentMethod: builder.mutation<any, string>({
      query: (id) => ({ url: `/payment-methods/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CmsPayments'],
    }),
  }),
});

export const {
  useGetCmsProductsQuery,
  useCreateCmsProductMutation,
  useUpdateCmsProductMutation,
  useDeleteCmsProductMutation,
  useGetDashboardStatsQuery,
  useGetCmsOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetCmsCouponsQuery,
  useCreateCmsCouponMutation,
  useUpdateCmsCouponMutation,
  useDeleteCmsCouponMutation,
  useGetCmsCustomersQuery,
  useUpdateCustomerRoleMutation,
  useGetCmsPaymentMethodsQuery,
  useCreateCmsPaymentMethodMutation,
  useUpdateCmsPaymentMethodMutation,
  useDeleteCmsPaymentMethodMutation,
} = rtkQueryCmsApi;
