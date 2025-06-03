// src/components/ImageCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LIKE_API, PHOTO_API } from '../config/api';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GetDetailPhoto } from '../config/reuseAPI';
import { formatTimeAgo } from "../utils/formatTimeAgo.ts"; 

function ImageCard({ image }) {
  const currentUser = useSelector(state => state.auth.account?.data); 
  const commentCount = useSelector(state => state.comment?.allComment?.comments); 
  const [liked, setLiked] = useState(image?.likes?.includes(currentUser?._id));
  const [likeCount, setLikeCount] = useState(image.likes?.length || 0);
  const dispatch = useDispatch();

  const handleToggleLike = async () => {
    const prevLiked = liked;
  
    // Cập nhật UI ngay lập tức (optimistic update)
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? likeCount - 1 : likeCount + 1);
  
    try {
      const res = await axios.post(`${LIKE_API}/${prevLiked ? 'not-favorite' : 'my-favorite'}`, {
        photo: image._id
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
  
      // Có thể cập nhật Redux hoặc bỏ qua nếu bạn chỉ dùng local state
      toast.success(res.data.message);
    } catch (err) {
      // Nếu lỗi, quay lại trạng thái cũ
      setLiked(prevLiked);
      setLikeCount(prevLiked ? likeCount + 1 : likeCount - 1);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // hàm lấy thông tin chi tiết hình ảnh
  const handleDetailImage = async () => {
    try {
      await axios.post(`${PHOTO_API}/view/${image._id}`, {}, {
        withCredentials: true
      });
  
      await GetDetailPhoto(dispatch, image._id);
    } catch (err) {
      console.log(err);
    }
  };
  
  // image là một object chứa thông tin: src, title, description, uploaderName, uploaderAvatar, uploaderProfileLink, timestamp, etc.
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white border-0 py-2">
        <div className="d-flex align-items-center">
          <Link to={`/user/profile/${image.account?._id}`}>
            <img
              src={image?.account?.avatar}
              alt={image?.account?.fullname}
              className="rounded-circle me-2"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
          </Link>
          <div>
            <Link to={`/user/profile/${image.account?._id}`} className="fw-bold text-dark text-decoration-none">
              {image?.account?.fullname || 'Người dùng ẩn danh'}
            </Link>
            <small className="d-block text-muted">{formatTimeAgo(image.createdAt)}</small>
          </div>
        </div>
      </div>
      {/* Ảnh chính */}
      <Link to={`/image/detail/${image._id}`}>
        <img
          src={image?.url || 'https://via.placeholder.com/600x400?text=Image'}
          className="card-img-top"
          alt={image?.title || 'Hình ảnh'}
          style={{ maxHeight: '500px', objectFit: 'cover' }}
          onClick={handleDetailImage}
        />
      </Link>
      <div className="card-body">
        {image?.title && <h5 className="card-title">{image?.title}</h5>}
        <p className="card-text text-muted">
          {image?.description || 'Không có mô tả.'}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="btn-group">
            <button
              type="button"
              className={`btn btn-sm ${liked ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={handleToggleLike}
            >
              <i className="bi bi-heart me-1"></i> Thích ({likeCount})
            </button>
            <Link to={`/image/detail/${image._id}`}>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary"
                onClick={handleDetailImage}
              >
                <i className="bi bi-chat-dots me-1"></i> Bình luận ({commentCount?.filter(c => c.photo?._id === image?._id)?.length || 0})
              </button>
            </Link>
          </div>
          <small className="text-muted"><i className="bi bi-eye me-1"></i>{image?.views || 0} lượt xem</small>
        </div>
      </div>
    </div>
  );
}

export default ImageCard;