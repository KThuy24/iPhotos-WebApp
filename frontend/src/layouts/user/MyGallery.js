// src/layouts/user/MyGallery.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GetUserPhotosAPI } from '../../config/reuseAPI'; // API để lấy ảnh của user
import MyImageCard from '../../components/MyImageCard'; // Component mới cho ảnh trong bộ sưu tập
import './MyGallery.css'; // CSS cho trang này (tạo file này nếu chưa có)

const MyGallery = () => {
  const dispatch = useDispatch();

  // Lấy state từ Redux store
  const {
    userPhotos: rawUserPhotos, 
    loadingUserPhotos,
    error
  } = useSelector((state) => state.photo);

  const currentAccount = useSelector((state) => state.auth.account?.data);

  // Local state để quản lý danh sách ảnh đang hiển thị,
  const [displayedPhotos, setDisplayedPhotos] = useState([]);

  // Fetch ảnh của người dùng khi component mount
  useEffect(() => {
  GetUserPhotosAPI(dispatch);
}, [dispatch]); 

useEffect(() => {
  const photosFromStore = (rawUserPhotos && rawUserPhotos.photos)
                          ? rawUserPhotos.photos
                          : (Array.isArray(rawUserPhotos) ? rawUserPhotos : []);

  setDisplayedPhotos(photosFromStore);
}, [rawUserPhotos]);

  const handlePhotoDeleteSuccess = (deletedPhotoId) => {
    setDisplayedPhotos(prevPhotos => prevPhotos.filter(photo => photo._id !== deletedPhotoId));
  };

  // Hiển thị trạng thái loading (chỉ khi chưa có dữ liệu nào được hiển thị)
  if (loadingUserPhotos && displayedPhotos.length === 0) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Đang tải bộ sưu tập...</span>
        </div>
        <p className="mt-3 fs-5 text-muted">Đang tải bộ sưu tập của bạn...</p>
      </div>
    );
  }

  // Hiển thị thông báo lỗi (chỉ khi chưa có dữ liệu nào được hiển thị)
  if (error && displayedPhotos.length === 0) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center shadow-sm" role="alert">
          <h4 className="alert-heading"><i className="bi bi-exclamation-triangle-fill me-2"></i>Có lỗi xảy ra!</h4>
          <p>{error.message || (typeof error === 'object' ? JSON.stringify(error) : error) || "Không thể tải bộ sưu tập. Vui lòng thử lại sau."}</p>
          <hr />
          <button onClick={() => GetUserPhotosAPI(dispatch)} className="btn btn-primary">
            <i className="bi bi-arrow-repeat me-2"></i>Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Hiển thị khi bộ sưu tập trống (sau khi đã load xong và không có lỗi)
  if (!loadingUserPhotos && displayedPhotos.length === 0) {
    return (
      <div className="container text-center my-5 my-gallery-empty">
        <i className="bi bi-images display-1 text-muted mb-3"></i>
        <h2>Bộ sưu tập của bạn còn trống!</h2>
        <p className="lead text-secondary">Hãy bắt đầu hành trình chia sẻ khoảnh khắc của bạn.</p>
        <Link to="/user/upload-image" className="btn btn-lg btn-success mt-3 shadow-sm">
          <i className="bi bi-cloud-arrow-up-fill me-2"></i>Tải ảnh đầu tiên ngay
        </Link>
      </div>
    );
  }

  // Hiển thị danh sách ảnh
  return (
    <div className="container my-gallery-container my-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h1 className="my-gallery-title">
          Bộ sưu tập của {currentAccount?.fullname || currentAccount?.username || 'bạn'}
          <span className="badge bg-light text-dark ms-2 align-middle">{displayedPhotos.length} ảnh</span>
        </h1>
        <Link to="/user/upload-image" className="btn btn-primary shadow-sm">
          <i className="bi bi-plus-circle-fill me-2"></i>Tải thêm ảnh
        </Link>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 g-4">
        {displayedPhotos.map((photoItem) => ( 
          <MyImageCard
            key={photoItem._id} // Key là đúng
            photo={photoItem}   // Prop 'photo' nhận giá trị từ 'photoItem'
            onDeleteSuccess={handlePhotoDeleteSuccess}
          />
        ))}
      </div>
    </div>
  );
};

export default MyGallery;