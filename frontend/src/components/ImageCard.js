// src/components/ImageCard.js
import React, { useState, useEffect } from 'react'; // Thêm useEffect
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import axios from 'axios';
import { LIKE_API, PHOTO_API } from '../config/api';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// Giữ nguyên cách GetDetailPhoto được import và sử dụng
import { GetDetailPhoto } from '../config/reuseAPI';
import { formatTimeAgo } from "../utils/formatTimeAgo.ts";

function ImageCard({ image }) { // Prop là 'image'
  // GỌI TẤT CẢ HOOKS LÊN ĐẦU
  const currentUser = useSelector(state => state.auth.account?.data);
  const allComments = useSelector(state => state.comment?.allComment?.comments); // Sẽ kiểm tra sau
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Khởi tạo state với giá trị mặc định an toàn
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // useEffect để cập nhật state dựa trên prop 'image'
  useEffect(() => {
    if (image && image._id) {
      const currentImageLikes = image.likes || []; // Đảm bảo là mảng
      setLiked(currentUser ? currentImageLikes.includes(currentUser._id) : false);
      setLikeCount(currentImageLikes.length);
    } else {
      setLiked(false);
      setLikeCount(0);
    }
  }, [image, currentUser]);

  // KIỂM TRA PROP 'image' SAU KHI GỌI HOOKS
  if (!image || !image._id) {
    return null;
  }

  const handleToggleLike = async () => {
    if (!currentUser) {
      toast.info("Vui lòng đăng nhập để thích ảnh!");
      navigate('/login');
      return;
    }
    const prevLiked = liked;
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? likeCount - 1 : likeCount + 1);
    try {
      await axios.post(`${LIKE_API}/${prevLiked ? 'not-favorite' : 'my-favorite'}`, {
        photo: image._id
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      // toast.success(res.data.message); // Bỏ nếu API không trả message
    } catch (err) {
      setLiked(prevLiked);
      setLikeCount(prevLiked ? likeCount + 1 : likeCount - 1);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi thích ảnh');
    }
  };

  // Hàm xử lý khi click vào ảnh hoặc nút bình luận để load chi tiết và tăng view
  const handleDetailImageAndIncreaseView = async () => {
    try {
      // Tăng lượt xem
      await axios.post(`${PHOTO_API}/view/${image._id}`, {}, { withCredentials: true });

      // Gọi GetDetailPhoto từ reuseAPI
      await GetDetailPhoto(dispatch, image._id);
    } catch (err) {
      console.error("Lỗi khi xử lý chi tiết ảnh hoặc tăng view:", err);
    }
  };

  // Xử lý giá trị mặc định cho JSX
  const imageUrl = (image.url && image.url[0]) || 'https://via.placeholder.com/600x400?text=Image+Not+Available';
  const title = image.title || 'Không có tiêu đề';
  const description = image.description || 'Không có mô tả.';
  const views = image.views || 0;
  const safeAllComments = allComments || [];
  const commentsForThisImage = safeAllComments.filter(c => c.photo === image._id || c.photo?._id === image._id);

   return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white border-0 py-2">
        {/* ... phần header card ... */}
        <div className="d-flex align-items-center">
          <Link to={`/user/profile/${image.account?._id || 'unknown'}`}>
            <img
              src={image.account?.avatar || 'https://via.placeholder.com/40'}
              alt={image.account?.fullname || 'User'}
              className="rounded-circle me-2"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
            />
          </Link>
          <div>
            <Link to={`/user/profile/${image.account?._id || 'unknown'}`} className="fw-bold text-dark text-decoration-none">
              {image.account?.fullname || 'Người dùng ẩn danh'}
            </Link>
            <small className="d-block text-muted">{image.createdAt ? formatTimeAgo(image.createdAt) : "Không rõ thời gian"}</small>
          </div>
        </div>
      </div>
      <Link to={`/image/detail/${image._id}`} onClick={handleDetailImageAndIncreaseView}>
        {/* ... img tag ... */}
        <img
          src={imageUrl}
          className="card-img-top"
          alt={title}
          style={{ maxHeight: '500px', objectFit: 'cover', cursor: 'pointer' }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Image+Error'; }}
        />
      </Link>
      <div className="card-body">
        {title && <h5 className="card-title">{title}</h5>}
        <p className="card-text text-muted">
          {description}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top"> {/* Thêm mt-2 thay vì mt-3 nếu cần */}
            {/* Nhóm các nút hành động (Thích, Bình luận) */}
            <div className="d-flex align-items-center">
              {/* Nút Thích - Làm nhỏ hơn */}
              <button
                type="button"
                className={`btn ${liked ? 'btn-danger' : 'btn-outline-danger'} me-2 photo-action-button-xs`}
                onClick={handleToggleLike}
                title={liked ? 'Bỏ thích' : 'Thích'}
              >
                <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                <span className="ms-1">{likeCount}</span>
              </button>

              {/* Nút Bình luận - Làm nhỏ hơn */}
              <Link
                to={`/image/detail/${image._id}`}
                className="btn btn-outline-secondary photo-action-button-xs"
                onClick={handleDetailImageAndIncreaseView}
                title="Bình luận"
              >
                <i className="bi bi-chat-dots"></i>
                <span className="ms-1">{commentsForThisImage.length}</span>
              </Link>
            </div>

            {/* Lượt xem - Đẩy sát về bên phải */}
            <small className="text-muted d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-eye me-1"></i>
              {views}
            </small>
          </div>
      </div>
    </div>
  );
}

export default ImageCard;