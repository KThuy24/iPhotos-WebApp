// src/components/Navbar.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Failed_Auth, Loading_Auth, Logout_Success } from "../redux/auth.Slice";
import { ACCOUNT_API } from "../config/api";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// Destructure các props cần thiết ngay tại tham số của hàm
function Navbar() {
  const currentAccount = useSelector((state)=>state.auth.account?.data);
  const isLoggedIn = useSelector((state)=>state.auth.isAuthenticated);
  const navigate = useNavigate(); // Hook để điều hướng
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  // Hàm xử lý khi nhấn nút Đăng xuất
  const handleLogoutClick = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn đăng xuất không?",
        text: "Nếu có hãy bấm nút OK, Ngược lại bấm hủy!",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#808080",
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
      });
      if (result.isConfirmed) {
        dispatch(Loading_Auth());
        
        const res = await axios.post(`${ACCOUNT_API}/logout`,{
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });

          dispatch(Logout_Success());
          navigate('/login');
          toast.success(res.data.message);
          await Swal.fire("Đã đăng xuất!", "Bạn vừa thực hiện đăng xuất thành công.", "success");
      }
    } catch (err) {
        dispatch(Failed_Auth(err));
        toast.error(err.response?.data?.message);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary custom-navbar">
      <div className="container"> {/* Navbar content sẽ có lề */}
        <Link className="navbar-brand" to="/">
          <i className="bi bi-camera-fill me-2"></i>
          iPhotos
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
                {currentAccount?.role === 'admin' && (
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
                      <li>
                        <Link className="dropdown-item" to="/admin/accounts">
                          <i className="bi bi-person-square me-2"></i> Tài khoản
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/images">
                          <i className="bi bi-image me-2"></i> Hình ảnh
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                <li className="nav-item">
                    <Link className="nav-link" to="/user/upload-image"> 
                        <i className="bi bi-cloud-arrow-up-fill me-1"></i> Tải ảnh lên
                    </Link>
                </li>
                {/* Dropdown cho người dùng đã đăng nhập */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {currentAccount?.fullname || 'Tài khoản'}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item d-flex align-items-center" to="/my-gallery">
                        <i className="bi bi-images me-2"></i> Bộ sưu tập
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center"
                        to={`/my-profile/edit/${currentAccount?._id}`}
                      >
                        <i className="bi bi-person-lines-fill me-2"></i> Hồ sơ
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item d-flex align-items-center" onClick={handleLogoutClick}>
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