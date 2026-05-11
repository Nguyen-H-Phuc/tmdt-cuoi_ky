import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import CategoryGrid from "./components/CategoryGrid.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductListView from "./components/ProductListView.jsx";

const SocialLoginHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const fullName = params.get('fullName');
        const role = params.get('role');

        if (token) {
            login(token, { fullName, role });
            navigate('/', { replace: true });
        }
    }, [location, login, navigate]);

    return null;
};

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
            <Route path="/" element={
              <div className="container mx-auto max-w-6xl">
                <CategoryGrid />
                <ProductListView />
              </div>
            } />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
  );
}

export default App;