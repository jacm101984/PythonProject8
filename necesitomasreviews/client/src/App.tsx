import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import {
  PublicRoute,
  ProtectedRoute,
  AdminRoute,
  SuperAdminRoute,
  RegionalAdminRoute,
  PromoterRoute
} from './components/auth/ProtectedRoutes';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import VerifyEmailPage from './pages/public/VerifyEmailPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Páginas legales
import TermsAndConditions from '@/pages/public/legal/TermsAndConditions';
import PrivacyPolicy from '@/pages/public/legal/PrivacyPolicy';
import ShippingPolicy from '@/pages/public/legal/ShippingPolicy';
import RefundPolicy from '@/pages/public/legal/RefundPolicy';

// Páginas de checkout
import CheckoutPage from '@/pages/public/checkout/CheckoutPage';
import PaymentSuccessPage from '@/pages/public/checkout/PaymentSuccessPage';
import PaymentFailedPage from '@/pages/public/checkout/PaymentFailedPage';
import PaymentCancelPage from '@/pages/public/checkout/PaymentCancelPage';

// User Pages
import DashboardPage from './pages/user/DashboardPage';
import ProfilePage from './pages/user/ProfilePage';
import CardsPage from './pages/user/cards/CardsPage';
import CardDetailPage from './pages/user/cards/CardDetailPage';
import CardDetailsPage from './pages/user/cards/CardDetailsPage';
import CardActivationPage from './pages/user/cards/CardActivationPage';
import CardFormPage from './pages/user/cards/CardFormPage';
import CardQRPage from './pages/user/cards/CardQRPage';
import CardStatsPage from './pages/user/cards/CardStatsPage';
import OrdersPage from './pages/user/orders/OrdersPage';
import OrderDetailPage from './pages/user/orders/OrderDetailPage';
import NotificationSettingsPage from './pages/user/NotificationSettingsPage';

// Promoter Pages
import PromoterPage from './pages/promoter/PromoterPage';
import PromoterDashboardPage from './pages/user/DashboardPage';
import PromoCodePage from './pages/promoter/PromoCodePage';
import PromoterCodeFormPage from './pages/promoter/PromoterCodeFormPage';
import CommissionsPage from './pages/promoter/CommissionsPage';
import MetricAlertsPage from './pages/promoter/MetricAlertsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/users/AdminUsersPage';
import AdminCreateUserPage from './pages/admin/users/AdminCreateUserPage';
import AdminEditUserPage from './pages/admin/users/AdminEditUserPage';
import AdminCardsPage from './pages/admin/cards/AdminCardsPage';
import AdminCardFormPage from './pages/admin/cards/AdminCardFormPage';
import AdminCardQRPage from './pages/admin/cards/AdminCardQRPage';
import AdminOrdersPage from './pages/admin/orders/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/orders/AdminOrderDetailPage';
import AdminPromotersPage from './pages/admin/promoters/AdminPromotersPage';
import AdminRegionsPage from './pages/admin/regions/AdminRegionsPage';
import AdminRegionFormPage from './pages/admin/regions/AdminRegionFormPage';
import AdminNotificationsPage from './pages/admin/notifications/AdminNotificationsPage';
import AdminReportsPage from './pages/admin/reports/AdminReportsPage';
import RegionalReportsPage from './pages/admin/reports/RegionalReportsPage';
import UsersPage from './pages/admin/users/UsersPage';
import RegionsPage from './pages/admin/regions/RegionsPage';
import ReportsPage from './pages/admin/reports/ReportsPage';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* ===== RUTAS PÚBLICAS ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          {/* Auth Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          </Route>

          {/* Legal Pages */}
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />

          {/* Checkout Routes */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-failed" element={<PaymentFailedPage />} />
          <Route path="/payment-cancel" element={<PaymentCancelPage />} />

          {/* 404 Page */}
          <Route path="/not-found" element={<NotFoundPage />} />
        </Route>

        {/* ===== RUTAS DE USUARIO REGULAR ===== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Cards */}
            <Route path="/dashboard/cards" element={<CardsPage />} />
            <Route path="/dashboard/cards/:cardId" element={<CardDetailPage />} />
            <Route path="/dashboard/cards/details/:cardId" element={<CardDetailsPage />} />
            <Route path="/dashboard/cards/activate" element={<CardActivationPage />} />
            <Route path="/dashboard/cards/form" element={<CardFormPage />} />
            <Route path="/dashboard/cards/form/:cardId" element={<CardFormPage />} />
            <Route path="/dashboard/cards/qr/:cardId" element={<CardQRPage />} />
            <Route path="/dashboard/cards/stats" element={<CardStatsPage />} />

            {/* Orders */}
            <Route path="/dashboard/orders" element={<OrdersPage />} />
            <Route path="/dashboard/orders/:orderId" element={<OrderDetailPage />} />

            {/* User Profile & Settings */}
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/settings" element={<NotificationSettingsPage />} />
            <Route path="/dashboard/help" element={<NotFoundPage />} />
          </Route>
        </Route>

        {/* ===== RUTAS DE PROMOTOR ===== */}
        <Route element={<PromoterRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/promoter/dashboard" element={<PromoterDashboardPage />} />
            <Route path="/dashboard/promoter" element={<PromoterPage />} />
            <Route path="/promoter/codes" element={<PromoCodePage />} />
            <Route path="/promoter/codes/new" element={<PromoterCodeFormPage />} />
            <Route path="/promoter/codes/:codeId" element={<PromoterCodeFormPage />} />
            <Route path="/promoter/promo-codes" element={<PromoCodePage />} />
            <Route path="/promoter/commissions" element={<CommissionsPage />} />
            <Route path="/promoter/metrics" element={<MetricAlertsPage />} />
          </Route>
        </Route>

        {/* ===== RUTAS DE ADMINISTRADOR ===== */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

            {/* Users Management */}
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/new" element={<AdminCreateUserPage />} />
            <Route path="/admin/users/:userId" element={<AdminEditUserPage />} />

            {/* Cards Management */}
            <Route path="/admin/cards" element={<AdminCardsPage />} />
            <Route path="/admin/cards/:cardId" element={<AdminCardFormPage />} />
            <Route path="/admin/cards/qr/:cardId" element={<AdminCardQRPage />} />

            {/* Orders Management */}
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/orders/:orderId" element={<AdminOrderDetailPage />} />

            {/* Promoters Management */}
            <Route path="/admin/promoters" element={<AdminPromotersPage />} />

            {/* Reports */}
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />

            {/* Super Admin Only Routes */}
            <Route element={<SuperAdminRoute />}>
              <Route path="/admin/regions" element={<AdminRegionsPage />} />
              <Route path="/admin/regions/new" element={<AdminRegionFormPage />} />
              <Route path="/admin/regions/:regionId" element={<AdminRegionFormPage />} />
              <Route path="/admin/reports/regional" element={<RegionalReportsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;