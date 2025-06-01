// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Thêm Navigate
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/custom.css'; 
// import TrendingPage from './pages/TrendingPage';
// import UploadPage from './pages/UploadPage';
// import AdminUsersPage from './pages/AdminUsersPage';


// Component Layout chung để bao bọc các trang cần Navbar và Footer
function MainLayout({ children, isLoggedIn, userName, isAdmin, onLogout }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={userName}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />
      <main className="flex-grow-1 container py-4"> 
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    console.log("App.js: User logged in successfully", userData);
    setCurrentUser(userData);
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      // Token nên được lưu riêng nếu API trả về token và userData riêng
      // Ví dụ: localStorage.setItem('authToken', userData.token); (nếu token nằm trong userData)
    }
  };

  const handleLogout = () => {
    console.log("App.js: User logged out");
    setCurrentUser(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken'); // Xóa cả token nếu có
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    // Cũng nên kiểm tra token nếu bạn dùng token riêng
    // const storedToken = localStorage.getItem('authToken');
    if (storedUserData ) {
      try {
        const userData = JSON.parse(storedUserData);
        setCurrentUser(userData);
        console.log("App.js: User data loaded from localStorage:", userData);
      } catch (error) {
        console.error("App.js: Error parsing user data from localStorage", error);
        localStorage.removeItem('userData');
        // localStorage.removeItem('authToken');
      }
    }
  }, []);

  // Tính toán các props cho Navbar
  const isLoggedIn = !!currentUser; // True nếu currentUser có giá trị, ngược lại là false
  const isAdmin = currentUser?.role === 'admin';

  const userName = currentUser?.username || currentUser?.name || 'User';

  console.log("App.js - isLoggedIn:", isLoggedIn);
  console.log("App.js - isAdmin:", isAdmin);
  console.log("App.js - currentUser:", currentUser);


  return (
    <BrowserRouter>
      <Routes>
        {/* Route cho trang Login không dùng MainLayout */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />}
        />
        {/* Route cho trang Register không dùng MainLayout (hoặc dùng nếu Navbar trên RegisterPage là Navbar chung) */}
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <RegisterPage />}
        />

        {/* Các route sử dụng MainLayout (có Navbar và Footer chung) */}
        <Route
          path="/*" // Bắt tất cả các route khác
          element={
            <MainLayout
              isLoggedIn={isLoggedIn}
              userName={userName}
              isAdmin={isAdmin}
              onLogout={handleLogout}
            >
              <Routes> {/* Routes lồng nhau cho nội dung chính bên trong MainLayout */}
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/trending" element={<TrendingPage />} /> */}
                {/* <Route
                  path="/upload"
                  element={isLoggedIn ? <UploadPage /> : <Navigate to="/login" replace />}
                /> */}

                {/* Ví dụ route chỉ dành cho admin */}
                {isLoggedIn && isAdmin && (
                  <Route path="/admin/users" element={<div>Admin Users Management Page</div>} />
                  // <Route path="/admin/users" element={<AdminUsersPage />} />
                )}

                {/* Route mặc định nếu không khớp (trang 404) */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;