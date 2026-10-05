import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const LandingPage   = lazy(() => import('./pages/LandingPage'));
const ShopPage      = lazy(() => import('./pages/ShopPage'));
const ProductPage   = lazy(() => import('./pages/ProductPage'));
const CartPage      = lazy(() => import('./pages/CartPage'));
const CheckoutPage  = lazy(() => import('./pages/CheckoutPage'));
const AccountPage   = lazy(() => import('./pages/AccountPage'));
const LoginPage     = lazy(() => import('./pages/LoginPage'));
const OrderConfirmed = lazy(() => import('./pages/OrderConfirmed'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/"            element={<LandingPage />} />
                <Route path="/shop"        element={<ShopPage />} />
                <Route path="/shop/:slug"  element={<ProductPage />} />
                <Route path="/cart"        element={<CartPage />} />
                <Route path="/checkout"    element={<CheckoutPage />} />
                <Route path="/account"     element={<AccountPage />} />
                <Route path="/login"       element={<LoginPage />} />
                <Route path="/order-confirmed" element={<OrderConfirmed />} />
                <Route path="/admin/*"     element={<AdminDashboard />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
