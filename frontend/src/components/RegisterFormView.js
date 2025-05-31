// src/components/RegisterFormView.js
import React from 'react';
import { Link } from 'react-router-dom'; 

function RegisterFormView({
  formData, // Object chứa các trường: fullname, email, username, password, confirmPassword
  error,
  success,
  handleChange, // Hàm xử lý khi các input thay đổi
  handleSubmit  // Hàm xử lý khi form được submit
}) {
  return (
    <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}> {/* Tăng maxWidth một chút */}
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit}>
          {/* Họ và tên */}
          <div className="mb-3">
            <label htmlFor="fullname" className="form-label">Họ và tên:</label>
            <input
              type="text"
              className="form-control"
              id="fullname"
              name="fullname" // Thêm name attribute
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập địa chỉ email"
              required
            />
          </div>

          {/* Tên đăng nhập */}
          <div className="mb-3">
            <label htmlFor="reg_username" className="form-label">Tên đăng nhập:</label> {/* Đổi id để tránh trùng với login form */}
            <input
              type="text"
              className="form-control"
              id="reg_username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Chọn tên đăng nhập"
              required
            />
          </div>

          {/* Mật khẩu */}
          <div className="mb-3">
            <label htmlFor="reg_password" className="form-label">Mật khẩu:</label> 
            <input
              type="password"
              className="form-control"
              id="reg_password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
              required
              minLength="6" // Thêm validation cơ bản
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu:</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Đăng ký
          </button>
        </form>

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success mt-3" role="alert">
            {success}
          </div>
        )}

        <div className="text-center mt-3">
          <small>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default RegisterFormView;