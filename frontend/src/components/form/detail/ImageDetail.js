import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatTimeAgo } from "../../../utils/formatTimeAgo.ts"; 

function ImageDetail () {
    const detailImage = useSelector((state) => state.photo?.detailPhoto?.photo);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
    if (detailImage && detailImage._id) {
        setTimeout(() => {
        setIsLoading(false);
        }, 800);
    }
    }, [detailImage]);

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
            <Link to={'/admin/images'}>
                <button className="btn btn-outline-secondary mt-3">
                    ← Quay lại
                </button>
            </Link>
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
                            {formatTimeAgo(detailImage.createdAt)}
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
        </div>
    );
};

export default ImageDetail;