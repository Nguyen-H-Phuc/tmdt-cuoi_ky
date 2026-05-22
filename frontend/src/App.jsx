import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

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

        if (token && location.pathname !== '/reset-password') {
            login(token, { fullName, role, userId: userId ? parseInt(userId) : null, email });
            navigate('/', { replace: true });
        }
    }, [location, login, navigate]);

    return null;
};
import CategoryGrid from "./components/CategoryGrid.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

function App() {
  return (
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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/" element={<CategoryGrid />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout/:productId" element={<CheckoutPage />} />
          </Route>

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </Router>
  );
}

export default App;
