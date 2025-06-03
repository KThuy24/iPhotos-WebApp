/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { COMMENT_API, PHOTO_API } from "../../../config/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CreateComment_Success,
  Failed_Comment,
  Loading_Comment,
} from "../../../redux/commentSlice";
import axios from "axios";
import { GetAllComment } from "../../../config/reuseAPI";
import { SetView_Success } from "../../../redux/photo.Slice";
import { formatTimeAgo } from "../../../utils/formatTimeAgo.ts"

function ViewDetailImage() {
  const detailImage = useSelector((state) => state.photo?.detailPhoto?.photo);
  const commentList = useSelector((state) => state.comment?.allComment?.comments);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(commentList || []);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetching = async () => {
      try {
        await GetAllComment(dispatch);
      } catch (err) {
        console.error(err);
      }
    };
    fetching();
  }, []);

  useEffect(() => {
    if (detailImage && detailImage._id) {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  }, [detailImage]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    dispatch(Loading_Comment());

    try {
      const res = await axios.post(
        `${COMMENT_API}/create`,
        {
          photo: detailImage._id,
          content: comment,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(CreateComment_Success(res.data));
      setComments((prev) => [res.data.comment, ...prev]);
      toast.success(res.data.message);
      await GetAllComment(dispatch);
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi bình luận");
      dispatch(Failed_Comment());
    }
  };

  const handleGoBack = async () => {
    try {
      const res = await axios.get(`${PHOTO_API}/list`);
      dispatch(SetView_Success(res.data)); // Cập nhật lại list ảnh
      navigate(-1); // Quay lại trang trước
    } catch (err) {
      console.error("Lỗi khi làm mới danh sách ảnh:", err);
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Đang tải hình ảnh...</p>
      </div>
    );
  }

  return (
    <div className="col-lg-10 col-md-7 m-auto">
      <button onClick={handleGoBack} className="btn btn-outline-secondary mt-3">
        ← Quay lại
      </button>
      <div className="card mb-4 mt-2 shadow-sm">
        {/* Thông tin người đăng */}
        <div className="card-header bg-white border-0 py-2">
          <div className="d-flex align-items-center">
            <img
              src={detailImage.account?.avatar}
              alt={detailImage.account?.fullname}
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <div>
              {detailImage.account?.fullname || "Người dùng ẩn danh"}
              <small className="d-block text-muted">
                {formatTimeAgo(detailImage.createdAt) || "Vài phút trước"}
              </small>
            </div>
          </div>
        </div>
        {/* Hình ảnh */}
        <img
          src={
            detailImage?.url || "https://via.placeholder.com/600x400?text=Image"
          }
          className="card-img-top"
          alt={detailImage?.title || "Hình ảnh"}
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
        <div className="card-body">
          {detailImage?.title && (
            <h5 className="card-title">{detailImage?.title}</h5>
          )}
          <p className="card-text text-muted">
            {detailImage?.description || "Không có mô tả."}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="btn-group"></div>
            <small className="text-muted">
              <i className="bi bi-eye me-1"></i>
              {detailImage?.views || 0} lượt xem
            </small>
          </div>
        </div>
      </div>
      {/* PHẦN BÌNH LUẬN */}
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <h4>Bình luận</h4>
          {/* Form nhập bình luận */}
          <form onSubmit={handleSubmitComment} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập bình luận..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  height: "48px",
                  fontSize: "15px",
                  padding: "10px 12px",
                }}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!comment}
              >
                Gửi
              </button>
            </div>
          </form>
          {/* Danh sách bình luận */}
          {comments.length > 0 ? (
            comments
              .filter((c) => c.photo?._id === detailImage?._id)
              .map((c) => (
                <div key={c._id} className="d-flex mb-3">
                  <img
                    src={c.account?.avatar}
                    alt={c.account?.fullname}
                    className="rounded-circle me-2"
                    style={{
                      width: "36px",
                      height: "36px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <strong>{c.account?.fullname}</strong>
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
