import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import NotFound from "./pages/NotFound";

// Order matters: Cart needs Products, Orders needs Products, and so on.
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <ScrollToTop />
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      {/* Public pages */}
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />

                      {/* Logged-in customers only */}
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/order-confirmation/:orderId"
                        element={
                          <ProtectedRoute>
                            <OrderConfirmation />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <MyOrders />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin only */}
                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/products"
                        element={
                          <AdminRoute>
                            <AdminProducts />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/orders"
                        element={
                          <AdminRoute>
                            <AdminOrders />
                          </AdminRoute>
                        }
                      />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
