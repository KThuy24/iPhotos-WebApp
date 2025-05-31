// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Destructure các props cần thiết ngay tại tham số của hàm
function Navbar({ isLoggedIn, userName, isAdmin, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Hook để điều hướng

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  // Hàm xử lý khi nhấn nút Đăng xuất
  const handleLogoutClick = () => {
    if (onLogout) { // Gọi hàm onLogout được truyền từ component cha
      onLogout();
    }
    navigate('/login'); // Điều hướng về trang đăng nhập sau khi logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container"> {/* Navbar content sẽ có lề */}
        <Link className="navbar-brand" to="/">
          <i className="bi bi-camera-fill me-2"></i>
          ShareImage
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/trending">
                <i className="bi bi-fire me-1"></i> Thịnh hành
              </Link>
            </li>

            {/* Hiển thị dựa trên trạng thái isLoggedIn */}
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus-fill me-1"></i> Đăng ký
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Hiển thị menu Quản lý nếu là admin */}
                {isAdmin && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-gear-fill me-1"></i> Quản lý
                    </a>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="/admin/users">...</Link></li>
                      {/* ... các mục quản lý khác ... */}
                    </ul>
                  </li>
                )}

                <li className="nav-item">
                    <Link className="nav-link" to="/upload">
                        <i className="bi bi-cloud-arrow-up-fill me-1"></i> Tải ảnh lên
                    </Link>
                </li>

                {/* Dropdown cho người dùng đã đăng nhập */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i> {userName || 'Tài khoản'}
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/my-gallery">Bộ sưu tập</Link></li>
                    <li><Link className="dropdown-item" to="/profile/edit">Hồ sơ</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      {/* Nút Đăng xuất gọi hàm handleLogoutClick */}
                      <button className="dropdown-item" onClick={handleLogoutClick}>
                        <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
          <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Tìm kiếm ảnh, tags..."
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;