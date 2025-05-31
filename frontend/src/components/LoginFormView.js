import React from 'react';
import { Link } from 'react-router-dom'; 

function LoginFormView({
  username,
  password,
  error,
  success,
  onUsernameChange,
  onPasswordChange,
  onSubmit
}) {
  return (
    <div className="card p-4 shadow" style={{ maxWidth: '450px', width: '100%' }}>
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Đăng nhập</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Tên đăng nhập:</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={onUsernameChange}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Mật khẩu:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Đăng nhập
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
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default LoginFormView;