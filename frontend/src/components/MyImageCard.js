// src/components/MyImageCard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LIKE_API, PHOTO_API } from '../config/api';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { formatTimeAgo } from "../utils/formatTimeAgo.ts";
import { DeletePhoto_Success, Failed_Photo, Loading_Photo } from '../redux/photo.Slice';
import Swal from 'sweetalert2';
// GetDetailPhoto được import từ reuseAPI, giữ nguyên cách nó được thiết kế
import { GetDetailPhoto } from '../config/reuseAPI';

import './MyImageCard.css';

function MyImageCard({ photo, onDeleteSuccess }) {
  const currentUser = useSelector(state => state.auth.account?.data);
  const allComments = useSelector(state => state.comment?.allComment?.comments); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Khởi tạo state với giá trị mặc định an toàn, sẽ được cập nhật trong useEffect
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  //useEffect để cập nhật state dựa trên prop 'photo' 
  useEffect(() => {
    if (photo && photo._id) {
      const currentPhotoLikes = photo.likes || []; // Đảm bảo là mảng
      setLiked(currentUser ? currentPhotoLikes.includes(currentUser._id) : false);
      setLikeCount(currentPhotoLikes.length);
    } else {
      setLiked(false);
      setLikeCount(0);
    }
  }, [photo, currentUser]);


  // KIỂM TRA PROP 'photo' SAU KHI GỌI HOOKS 
  if (!photo || !photo._id) {
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
      await axios.post(`${LIKE_API}/${prevLiked ? 'not-favorite' : 'my-favorite'}`,
        { photo: photo._id },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
    } catch (err) {
      setLiked(prevLiked);
      setLikeCount(prevLiked ? likeCount + 1 : likeCount - 1);
      toast.error(err.response?.data?.message || 'Lỗi khi thích/bỏ thích ảnh');
    }
  };

  const handleEdit = () => {
    navigate(`/admin/image/edit/${photo._id}`);
  };

  const handleDelete = async () => {
    Swal.fire({ /* ... */ }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(Loading_Photo());
          const response = await axios.delete(`${PHOTO_API}/delete/${photo._id}`, {
            withCredentials: true,
          });
          dispatch(DeletePhoto_Success({ photoId: photo._id, message: response.data.message }));
          toast.success(response.data.message || 'Xóa ảnh thành công!');
          if (onDeleteSuccess) {
            onDeleteSuccess(photo._id);
          }
        } catch (err) {
          dispatch(Failed_Photo(err.response?.data || { message: "Lỗi khi xóa ảnh", error: err }));
          toast.error(err.response?.data?.message || 'Lỗi khi xóa ảnh');
          console.error("Delete error:", err);
        }
      }
    });
  };

  // Hàm này gọi các hàm từ reuseAPI và không được dispatch trực tiếp
  const handlePrepareDetailView = async () => {
    try {
      // Tăng lượt xem
      await axios.post(`${PHOTO_API}/view/${photo._id}`, {}, { withCredentials: true });

      // Gọi GetDetailPhoto từ reuseAPI (tự dispatch bên trong)
      await GetDetailPhoto(dispatch, photo._id);
    } catch (err) {
      console.error("Lỗi khi chuẩn bị xem chi tiết hoặc tăng view:", err);
      // Toast hoặc xử lý lỗi khác nếu cần, GetDetailPhoto đã có xử lý lỗi riêng
    }
  };

  // Xử lý giá trị mặc định cho JSX
  const imageUrl = (photo.url && photo.url[0]) || 'https://via.placeholder.com/300x200.png?text=Image+Not+Available';
  const title = photo.title || 'Không có tiêu đề';
  const views = photo.views || 0;
  const safeAllComments = allComments || []; // Đảm bảo allComments là mảng
  const commentsForThisImage = safeAllComments.filter(c => c.photo === photo._id || c.photo?._id === photo._id);

  return (
    <div className="col">
      <div className="card h-100 shadow-sm my-image-card">
        <Link to={`/image/detail/${photo._id}`} className="my-image-card-link" onClick={handlePrepareDetailView}>
          {/* ... img tag ... */}
          <img
            src={imageUrl}
            className="card-img-top my-image-card-img"
            alt={title}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x200.png?text=Image+Error"; }}
          />
        </Link>
        <div className="card-body my-image-card-body">
          <Link to={`/image/detail/${photo._id}`} className="text-decoration-none" onClick={handlePrepareDetailView}>
            <h6 className="card-title-body mb-1 text-dark">{title}</h6>
          </Link>
          <p className="card-text-small text-muted mb-2">
            {photo.createdAt ? formatTimeAgo(photo.createdAt) : "Không rõ thời gian"}
            <span className="mx-1">•</span>
            {photo.visibility === 'công khai' ? <><i className="bi bi-globe me-1"></i>Công khai</> : <><i className="bi bi-lock-fill me-1"></i>Riêng tư</>}
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
                to={`/image/detail/${photo._id}`}
                className="btn btn-outline-secondary photo-action-button-xs"
                onClick={handlePrepareDetailView}
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
              {/* <span className="ms-1 d-none d-sm-inline">lượt xem</span> */}
            </small>
          </div>

        </div>
        <div className="card-footer my-image-card-footer">
          <button onClick={handleEdit} className="btn btn-sm btn-outline-primary me-2">
            <i className="bi bi-pencil-square me-1"></i>Chỉnh sửa
          </button>
          <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
            <i className="bi bi-trash3 me-1"></i>Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyImageCard;