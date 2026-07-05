import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Views
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory';

// Admin Page Views
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// NotFound Page
const NotFound = () => (
  <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
    <h1 className="text-6xl font-black text-indigo-600 dark:text-indigo-500">404</h1>
    <h2 className="text-xl font-bold uppercase tracking-wide">Page Not Found</h2>
    <p className="text-xs text-gray-500 font-light">
      The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
    </p>
    <a
      href="/"
      className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all"
    >
      Return to Store Catalog
    </a>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                {/* Global Navigation Header */}
                <Navbar />
                
                {/* Main Content Area */}
                <main className="flex-grow bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  <Routes>
                    {/* Public Storefront Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Customer Protected Route Pipeline */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-confirmation"
                      element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-history"
                      element={
                        <ProtectedRoute>
                          <OrderHistory />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Protected Dashboard Routes */}
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute>
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <ProtectedRoute>
                          <AdminRoute>
                            <AdminProducts />
                          </AdminRoute>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <ProtectedRoute>
                          <AdminRoute>
                            <AdminOrders />
                          </AdminRoute>
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Fallback Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                {/* Footer Section */}
                <Footer />
              </div>
            </Router>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
