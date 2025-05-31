import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginFormView from '../components/LoginFormView';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Khởi tạo navigate

  const handleLoginSubmit = async (e) => { 
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
        console.log('Login data:', data);
        if (onLoginSuccess) {
          onLoginSuccess(data.user || data); 
        }

        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }
        if (data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
        }
        // Chuyển hướng sau khi đăng nhập thành công
        setTimeout(() => {
            navigate('/'); // Chuyển về trang chủ hoặc dashboard
        }, 1500); // Chờ 1.5 giây để người dùng đọc thông báo success
      } else {
        setError(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err) {
      setError('Lỗi kết nối tới máy chủ. Vui lòng thử lại sau.');
      console.error('Login API error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        isLoggedIn={false}
        userName={null}
        isAdmin={false}
      />

      <main className="container d-flex flex-grow-1 align-items-center justify-content-center py-4">
        <LoginFormView
          username={username}
          password={password}
          error={error}
          success={success}
          onUsernameChange={(e) => setUsername(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleLoginSubmit} 
        />
      </main>

      <Footer />
    </div>
  );
}

export default Login;