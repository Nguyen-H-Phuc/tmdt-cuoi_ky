import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import CategoryGrid from "./components/CategoryGrid.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function App() {
  return (
      <Router>
        <Routes>
          {/* Nhóm các trang có chung Header và Footer */}
          <Route element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow bg-[#F4F4F4]"> {/* Thêm màu nền xám nhạt cho toàn bộ các trang */}
                <Outlet />
              </main>
              <Footer />
            </div>
          }>
            <Route path="/" element={<CategoryGrid />} />

            {/* 2. Thêm Route Dashboard vào đây */}
            <Route path="/dashboard" element={<DashboardPage />} />

          </Route>

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
  );
}

export default App;