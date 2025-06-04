// src/components/MyImageCard.js
import React, { useState, useEffect } from 'react'; // Thêm useEffect nếu cần
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate nếu cần
import axios from 'axios';
import { LIKE_API, PHOTO_API } from '../config/api';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { formatTimeAgo } from "../utils/formatTimeAgo.ts";
// Import action xóa ảnh từ photo.Slice
import { DeletePhoto_Success, Failed_Photo, Loading_Photo } from '../redux/photo.Slice'; 
import Swal from 'sweetalert2'; // Để xác nhận xóa

// CSS riêng cho MyImageCard nếu cần
import './MyImageCard.css'; // Tạo file CSS này

// Component này nhận prop `photo` (giống ImageCard) và có thể thêm prop `onDelete`
function MyImageCard({ photo, onDeleteSuccess }) {
  const currentUser = useSelector(state => state.auth.account?.data);
  // Like state có thể giữ nguyên 
  const [liked, setLiked] = useState(photo?.likes?.includes(currentUser?._id));
  const [likeCount, setLikeCount] = useState(photo.likes?.length || 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Nếu bạn không muốn chức năng like phức tạp ở đây, có thể đơn giản hóa
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
      // Không cần toast ở đây nếu bạn muốn MyGallery xử lý thông báo chung
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
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa ảnh này?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Vâng, xóa nó!',
      cancelButtonText: 'Hủy bỏ'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(Loading_Photo()); // Hoặc một action loading riêng cho delete
          const response = await axios.delete(`${PHOTO_API}/delete/${photo._id}`, {
            withCredentials: true,
          });


          dispatch(DeletePhoto_Success({ photoId: photo._id, message: response.data.message }));
          toast.success(response.data.message || 'Xóa ảnh thành công!');
          if (onDeleteSuccess) {
            onDeleteSuccess(photo._id); 
          }
        } catch (err) {
          dispatch(Failed_Photo(err.response?.data || err));
          toast.error(err.response?.data?.message || 'Lỗi khi xóa ảnh');
          console.error("Delete error:", err);
        }
      }
    });
  };


  if (!photo || !photo.url || photo.url.length === 0) {
    return null;
  }
  const imageUrl = photo.url[0];

  return (
    <div className="col">
      <div className="card h-100 shadow-sm my-image-card"> 
        <Link to={`/image/detail/${photo._id}`} className="my-image-card-link">
          <img
            src={imageUrl}
            className="card-img-top my-image-card-img"
            alt={photo.title || 'Ảnh cá nhân'}
            onError={(e) => { e.target.onerror = null; e.target.src="https-via.placeholder.com/300x200.png?text=Image+Error" }}
          />
          <div className="my-image-card-overlay">
            <div className="my-image-card-overlay-content">
            </div>
          </div>
        </Link>
        <div className="card-body my-image-card-body">
          <Link to={`/image/detail/${photo._id}`} className="text-decoration-none">
            <h6 className="card-title-body mb-1 text-dark">{photo.title || 'Không có tiêu đề'}</h6>
          </Link>
          <p className="card-text-small text-muted mb-2">
            {formatTimeAgo(photo.createdAt)}
            <span className="mx-1">•</span>
            {photo.visibility === 'công khai' ? <><i className="bi bi-globe me-1"></i>Công khai</> : <><i className="bi bi-lock-fill me-1"></i>Riêng tư</>}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <div>
                <button
                    type="button"
                    className={`btn btn-sm ${liked ? 'btn-danger' : 'btn-outline-danger'} me-2`} // Đổi màu nút like
                    onClick={handleToggleLike}
                    title={liked ? 'Bỏ thích' : 'Thích'}
                >
                    <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i> ({likeCount})
                </button>
                <Link to={`/image/detail/${photo._id}`} className="btn btn-sm btn-outline-secondary" title="Xem chi tiết và bình luận">
                    <i className="bi bi-chat-dots"></i>
                </Link>
            </div>
             <small className="text-muted" title="Lượt xem"><i className="bi bi-eye me-1"></i>{photo.views || 0}</small>
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