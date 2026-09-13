import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WardrobeProvider } from './context/WardrobeContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WeatherNotificationToast from './components/WeatherNotificationToast';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import OotdPage from './pages/OotdPage';
import WardrobePage from './pages/WardrobePage';
import DiscoverPage from './pages/DiscoverPage';
import RecommendationsPage from './pages/RecommendationsPage';
import StylistBookingPage from './pages/StylistBookingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <WardrobeProvider>
        <CartProvider>
          <NotificationProvider>
            <div className="min-h-screen flex flex-col justify-between bg-[#FAF6ED] text-[#1E2229]">
              
              <div>
                <Navbar />
                <CartDrawer />
                <WeatherNotificationToast />
                
                <main>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Authenticated Routes */}
                  <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                  <Route path="/ootd" element={<ProtectedRoute><OotdPage /></ProtectedRoute>} />
                  <Route path="/wardrobe" element={<ProtectedRoute><WardrobePage /></ProtectedRoute>} />
                  <Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
                  <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
                  <Route path="/stylist" element={<ProtectedRoute><StylistBookingPage /></ProtectedRoute>} />
                  <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>

            <Footer />

          </div>
        </NotificationProvider>
      </CartProvider>
    </WardrobeProvider>
  </AuthProvider>
  );
}
