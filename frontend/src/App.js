// src/App.js
import React, { useState, useEffect } from 'react'; // Thêm useState và useEffect
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage'; // Import trang đăng ký


function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Hàm này sẽ được gọi từ Login.js sau khi đăng nhập thành công
  const handleLoginSuccess = (userData) => {
    console.log("App.js: User logged in successfully", userData);
    setCurrentUser(userData);
    // Lưu thông tin người dùng vào localStorage để duy trì đăng nhập
    if (userData) { // Đảm bảo userData không phải là null/undefined
        localStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  // Hàm này sẽ được gọi từ Navbar (thông qua HomePage) khi người dùng đăng xuất
  const handleLogout = () => {
    console.log("App.js: User logged out");
    setCurrentUser(null);
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('userData');
    // Việc chuyển hướng sau khi logout nên được xử lý bởi component gọi hàm logout
    // ví dụ: Navbar sẽ dùng useNavigate để chuyển về /login
  };

  // useEffect sẽ chạy một lần khi component App được mount
  // để kiểm tra xem có thông tin người dùng nào đã lưu trong localStorage không
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setCurrentUser(userData);
        console.log("App.js: User data loaded from localStorage:", userData);
      } catch (error) {
        console.error("App.js: Error parsing user data from localStorage", error);
        // Nếu dữ liệu bị hỏng, xóa nó khỏi localStorage
        localStorage.removeItem('userData');
      }
    }
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần sau khi mount

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/" // Route cho trang chủ
          element={<HomePage currentUser={currentUser} onLogout={handleLogout} />}
        />

        <Route
          path="/register" // Route cho trang đăng ký
          // Truyền props currentUser và onLogout nếu Navbar trên trang này cần
          element={<RegisterPage currentUser={currentUser} onLogout={handleLogout} />}
        />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;