// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Giả sử bạn muốn Navbar trên trang này
import Footer from '../components/Footer';   // và Footer
import RegisterFormView from '../components/RegisterFormView';

function RegisterPage({ currentUser, onLogout }) { // Nhận props nếu Navbar cần
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    // Kiểm tra độ dài mật khẩu (có thể thêm nhiều validation phức tạp hơn)
    if (formData.password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
    }

    // Chuẩn bị dữ liệu gửi đi (loại bỏ confirmPassword)
    const { confirmPassword, ...dataToSubmit } = formData;
    // Bạn có thể thêm role và activation ở đây nếu backend không tự set default
    // dataToSubmit.role = 'user';
    // dataToSubmit.activation = 1;

    try {
      const response = await fetch('/api/auth/register', { // API endpoint đăng ký của bạn
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message || 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt (nếu có) hoặc đăng nhập.');
        // Reset form hoặc chuyển hướng người dùng
        setFormData({ fullname: '', email: '', username: '', password: '', confirmPassword: '' });
        // Tự động chuyển hướng đến trang đăng nhập sau vài giây
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
      console.error('Registration API error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        isLoggedIn={!!currentUser} // Giả sử trang đăng ký vẫn hiện navbar
        userName={currentUser?.username}
        isAdmin={currentUser?.role === 'admin'}
        onLogout={onLogout}
      />
      <main className="container d-flex flex-grow-1 align-items-center justify-content-center py-4">
        <RegisterFormView
          formData={formData}
          error={error}
          success={success}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </main>
      <Footer />
    </div>
  );
}

export default RegisterPage;