import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import CategoryGrid from "./components/CategoryGrid.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import SellerPage from "./pages/SellerPage.jsx";

// Import Admin layout & nested views
import AdminLayout from "./components/AdminLayout.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminProductsPage from "./pages/AdminProductsPage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import AdminCategoriesPage from "./pages/AdminCategoriesPage.jsx";
import AdminReportsPage from "./pages/AdminReportsPage.jsx";
import AdminTransactionsPage from "./pages/AdminTransactionsPage.jsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import AdminStatisticsPage from "./pages/AdminStatisticsPage.jsx";

const SocialLoginHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const fullName = params.get('fullName');
        const role = params.get('role');
        const userId = params.get('userId');
        const email = params.get('email');
        const avatar = params.get('avatar');

        if (token && location.pathname !== '/reset-password') {
            login(token, { fullName, role, userId: userId ? parseInt(userId) : null, email, avatar });
            navigate('/', { replace: true });
        }
    }, [location, login, navigate]);

    return null;
};

function App() {
  return (
      <CartProvider>
        <Router>
          <SocialLoginHandler />
          <Routes>
            <Route element={
              <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-grow bg-[#F4F4F4] pb-10"> {/* Gộp cả nền xám và padding-bottom */}
                  <Outlet />
                </main>
                <Footer />
              </div>
            }>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/" element={<CategoryGrid />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout/:productId" element={<CheckoutPage />} />
              <Route path="/seller/:sellerId" element={<SellerPage />} />
            </Route>

            {/* Admin Route Group with custom AdminLayout (different shell from Main Shop) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="transactions" element={<AdminTransactionsPage />} />
              <Route path="statistics" element={<AdminStatisticsPage />} />
            </Route>

            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </Router>
      </CartProvider>
  );
}

export default App;
