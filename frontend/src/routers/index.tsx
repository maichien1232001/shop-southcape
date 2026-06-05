import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import CartPage from '../features/cart/pages/CartPage';
import Home from '../features/shop/pages/Home';
import LookbookDetail from '../features/shop/pages/LookbookDetail';
import ProductDetail from '../features/shop/pages/ProductDetail';
import SearchResults from '../features/search/pages/SearchResults';
import Checkout from '../features/cart/pages/Checkout';
import Dashboard from '../features/cms/pages/Dashboard';
import ProductManagement from '../features/cms/pages/ProductManagement';
import OrderManagement from '../features/cms/pages/OrderManagement';
import CouponManagement from '../features/cms/pages/CouponManagement';
import CustomerManagement from '../features/cms/pages/CustomerManagement';
import PaymentManagement from '../features/cms/pages/PaymentManagement';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import ForgotPassword from '../features/auth/pages/ForgotPassword';
import { ROUTES } from './routes';
import AuthGuard from './guards/AuthGuard';
import Layout from '../components/Layout';
import CmsLayout from '../components/cms/CmsLayout';
import { RouteErrorBoundary } from '../components/ErrorBoundary';

export const router = createBrowserRouter([
  // 1. Client Shop Routes inside Layout (with Navbar and Footer)
  {
    element: <Layout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
      },
      {
        path: ROUTES.CONCEPT_DETAIL,
        element: <LookbookDetail />,
      },
      {
        path: ROUTES.PRODUCT_DETAIL,
        element: <ProductDetail />,
      },
      {
        path: ROUTES.SEARCH,
        element: <SearchResults />,
      },
      {
        path: ROUTES.CART,
        element: <CartPage />,
      },
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTES.REGISTER,
        element: <Register />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      // Protected Client Routes
      {
        element: <AuthGuard allowedRoles={['customer', 'staff', 'admin', 'superadmin']} />,
        children: [
          {
            path: ROUTES.CHECKOUT,
            element: <Checkout />,
          },
        ],
      },
    ],
  },

  // 2. CMS Administration Routes inside CmsLayout (with Sidebar and Header)
  {
    element: <AuthGuard allowedRoles={['admin', 'superadmin']} />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <CmsLayout />,
        children: [
          {
            path: ROUTES.CMS_DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: ROUTES.CMS_PRODUCTS,
            element: <ProductManagement />,
          },
          {
            path: ROUTES.CMS_ORDERS,
            element: <OrderManagement />,
          },
          {
            path: ROUTES.CMS_COUPONS,
            element: <CouponManagement />,
          },
          {
            path: ROUTES.CMS_CUSTOMERS,
            element: <CustomerManagement />,
          },
          {
            path: ROUTES.CMS_PAYMENTS,
            element: <PaymentManagement />,
          },
        ],
      },
    ],
  },

  // 3. Catch-all route to display 404 inside Layout when page is not found
  {
    path: '*',
    element: <Layout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '*',
        element: <RouteErrorBoundary />,
      },
    ],
  },
]);

export default router;
