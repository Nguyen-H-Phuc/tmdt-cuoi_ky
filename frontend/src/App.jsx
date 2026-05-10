import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import CategoryGrid from "./components/CategoryGrid.jsx";
import ProductListView from "./components/ProductListView.jsx";

function App() {
  return (
      <Router>
        <Routes>
          <Route element={
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Header />
              <main className="flex-grow pb-10">
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
          </Route>

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
  );
}

export default App;
