// Páginas públicas
export { default as HomePage } from './public/HomePage';
export { default as LoginPage } from './public/LoginPage';
export { default as RegisterPage } from './public/RegisterPage';
export { default as ForgotPasswordPage } from './public/ForgotPasswordPage';
export { default as ResetPasswordPage } from './public/ResetPasswordPage';
export { default as VerifyEmailPage } from './public/VerifyEmailPage';

// Páginas de checkout
export { default as CheckoutPage } from '@/pages/public/checkout/CheckoutPage';
export { default as PaymentSuccessPage } from '@/pages/public/checkout/PaymentSuccessPage';
export { default as PaymentCancelPage } from '@/pages/public/checkout/PaymentCancelPage';

// Páginas de usuario
export { default as DashboardPage } from './user/DashboardPage';
export { default as ProfilePage } from './user/ProfilePage';
export { default as OrdersPage } from './user/orders/OrdersPage';

// Páginas de tarjetas NFC
export { default as CardsPage } from './user/cards/CardsPage';
export { default as CardFormPage } from './user/cards/CardFormPage';
export { default as CardStatsPage } from './user/cards/CardStatsPage';
export { default as CardQRPage } from './user/cards/CardQRPage';

// Páginas de promotor
export { default as PromoterPage } from './promoter/PromoterPage';