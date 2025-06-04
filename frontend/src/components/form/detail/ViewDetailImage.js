// ViewDetailImage.js
import { useEffect, useState } from 'react'; // Bỏ useState nếu không dùng isLoading local
import { useDispatch, useSelector } from 'react-redux';
// Import các hàm tiện ích từ reuseAPI
import { GetDetailPhoto, GetAllComment } from '../../../config/reuseAPI'; // Import các hàm async

// ... (các import khác như toast, slices, api constants)
import { formatTimeAgo } from "../../../utils/formatTimeAgo.ts";

import { Link, useNavigate, useParams } from "react-router-dom";
import { COMMENT_API, PHOTO_API } from "../../../config/api";
import { toast } from "react-toastify";

import {
  CreateComment_Success,
  Failed_Comment,
  Loading_Comment,
} from "../../../redux/commentSlice";
import axios from "axios";

function ViewDetailImage() {
  const { id: photoIdFromParams } = useParams();
  const dispatch = useDispatch(); // Lấy dispatch từ Redux

  // Lấy dữ liệu từ Redux store
  const detailImage = useSelector((state) => state.photo?.detailPhoto?.photo);
  const isLoadingPhotoDetail = useSelector((state) => state.photo?.loadingDetail);
  const errorPhotoDetail = useSelector((state) => state.photo?.errorDetail);

  const commentList = useSelector((state) => state.comment?.allComment?.comments);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  // Fetch chi tiết ảnh khi component mount hoặc photoIdFromParams thay đổi
  useEffect(() => {
    if (photoIdFromParams) {
      GetDetailPhoto(dispatch, photoIdFromParams)
        .catch(err => {
          // debug
          console.error("Error from GetDetailPhoto in component:", err);
        });
    }
  }, [dispatch, photoIdFromParams]); // dispatch là dependency ổn định

  // Fetch danh sách bình luận
  useEffect(() => {
    // Gọi trực tiếp hàm từ reuseAPI
    GetAllComment(dispatch)
      .catch(err => {
        console.error("Error from GetAllComment in component:", err);
      });
  }, [dispatch]); // Chỉ chạy 1 lần khi mount

  //  Cập nhật local state `comments` khi `commentList` từ Redux thay đổi
  useEffect(() => {
    if (commentList) {
      setComments(commentList);
    }
  }, [commentList]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !detailImage?._id) return;
  
    dispatch(Loading_Comment());
    try {
      const res = await axios.post(
        `${COMMENT_API}/create`,
        { photo: detailImage._id, content: comment, },
        { headers: { "Content-Type": "application/json" }, withCredentials: true, }
      );
      dispatch(CreateComment_Success(res.data));
      toast.success(res.data.message);
      setComment("");
      await GetAllComment(dispatch);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi bình luận");
      dispatch(Failed_Comment(err.response?.data || err));
    }
  };


  const handleGoBack = () => {
    navigate(-1);
  };

  // ... (phần render JSX giữ nguyên, chỉ cần đảm bảo nó sử dụng đúng state từ Redux)
  if (isLoadingPhotoDetail === true || (isLoadingPhotoDetail !== false && !detailImage && !errorPhotoDetail)) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Đang tải hình ảnh...</p>
      </div>
    );
  }

  if (errorPhotoDetail) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          Có lỗi xảy ra khi tải ảnh: {errorPhotoDetail.message || JSON.stringify(errorPhotoDetail)}
          <button onClick={() => GetDetailPhoto(dispatch, photoIdFromParams)} className="btn btn-sm btn-primary ms-3">Thử lại</button>
        </div>
      </div>
    );
  }

  if (!detailImage || (detailImage._id !== photoIdFromParams && !isLoadingPhotoDetail)) {
    return (
        <div className="text-center mt-5">
            <p className="mt-2">Không tìm thấy thông tin ảnh hoặc đang chờ dữ liệu mới...</p>
        </div>
    );
  }

  const filteredComments = comments.filter(
    (c) => c.photo === detailImage._id || c.photo?._id === detailImage._id
  );

  return (
    <div className="col-lg-10 col-md-7 m-auto">
      <button onClick={handleGoBack} className="btn btn-outline-secondary mt-3 mb-2">
        ← Quay lại
      </button>
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-white border-0 py-2">
          <div className="d-flex align-items-center">
            <img
              src={detailImage.account?.avatar || "https://via.placeholder.com/40x40?text=User"}
              alt={detailImage.account?.fullname}
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
              onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/40x40?text=Err" }}
            />
            <div>
              {detailImage.account?.fullname || "Người dùng ẩn danh"}
              <small className="d-block text-muted">
                {formatTimeAgo(detailImage.createdAt) || "Vài phút trước"}
              </small>
            </div>
          </div>
        </div>
        <img
          src={ (detailImage.url && detailImage.url[0]) || "https://via.placeholder.com/600x400?text=Image" }
          className="card-img-top"
          alt={detailImage.title || "Hình ảnh"}
          style={{ maxHeight: "60vh", objectFit: "contain", backgroundColor: '#f0f0f0' }}
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/600x400?text=Image+Error" }}
        />
        <div className="card-body">
          {detailImage.title && (
            <h5 className="card-title">{detailImage.title}</h5>
          )}
          <p className="card-text text-muted">
            {detailImage.description || "Không có mô tả."}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="btn-group"></div>
            <small className="text-muted">
              <i className="bi bi-eye me-1"></i>
              {detailImage.views || 0} lượt xem
            </small>
          </div>
        </div>
      </div>
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <h4>Bình luận ({filteredComments.length})</h4>
          <form onSubmit={handleSubmitComment} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập bình luận..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ height: "48px", fontSize: "15px", padding: "10px 12px", }}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!comment.trim()}
              >
                Gửi
              </button>
            </div>
          </form>
          {filteredComments.length > 0 ? (
            filteredComments
              .map((c) => (
                <div key={c._id} className="d-flex mb-3">
                  <img
                    src={c.account?.avatar || "https://via.placeholder.com/36x36?text=User"}
                    alt={c.account?.fullname}
                    className="rounded-circle me-2"
                    style={{ width: "36px", height: "36px", objectFit: "cover", }}
                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/36x36?text=Err" }}
                  />
                  <div>
                    <strong>{c.account?.fullname || "Người dùng ẩn danh"}</strong>
                    <p className="mb-1">{c.content}</p>
                    <small className="text-muted">
                      {formatTimeAgo(c.createdAt)}
                    </small>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-muted">Chưa có bình luận nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewDetailImage;