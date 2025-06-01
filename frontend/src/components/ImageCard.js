import React from 'react';
import { Link } from 'react-router-dom';

function ImageCard({ image }) { // 'image' ở đây là 'imageForCard' từ HomePage
  // const uploaderName = image.account?.username || image.account?.fullname || 'Người dùng ẩn danh';
  // console.log("Image prop received by ImageCard:", image); // Giữ lại để debug nếu cần

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white border-0 py-2">
        <div className="d-flex align-items-center">
          {/* uploaderId phải có trong image prop để link này hoạt động */}
          <Link to={image.uploaderProfileLink || `/profile/${image.uploaderId || 'unknown-user'}`}>
            <img
              src={image.uploaderAvatar} // Sử dụng trực tiếp
              alt={image.uploaderName}   // Sử dụng trực tiếp
              className="rounded-circle me-2 uploader-avatar-custom"
            />
          </Link>
          <div>
            <Link to={image.uploaderProfileLink || `/profile/${image.uploaderId || 'unknown-user'}`} className="fw-bold text-dark text-decoration-none">
              {image.uploaderName}
            </Link>
            <small className="d-block text-muted">{image.timestamp}</small>
          </div>
        </div>
      </div>

      {/* Ảnh chính */}
      <Link to={`/image/${image.id || 'default-image-id'}`}>
        <img
          src={image.src} // Sử dụng trực tiếp
          className="card-img-top-custom"
          alt={image.description || 'Hình ảnh'}
          referrerPolicy="no-referrer"
        />
      </Link>

      <div className="card-body">
        {image.description && <h5 className="card-title">{image.description}</h5>}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="btn-group">
            <button type="button" className="btn btn-sm btn-outline-primary">
              <i className="bi bi-heart me-1"></i> Thích ({image.likes})
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-chat-dots me-1"></i> Bình luận ({image.comments})
            </button>
          </div>
          <small className="text-muted"><i className="bi bi-eye me-1"></i>{image.views || 0} lượt xem</small>
        </div>
      </div>
    </div>
  );
}

export default ImageCard;