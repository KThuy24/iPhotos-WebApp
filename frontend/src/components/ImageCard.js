// src/components/ImageCard.js
import React from 'react';
import { Link } from 'react-router-dom';

function ImageCard({ image }) {
  // image là một object chứa thông tin: src, title, description, uploaderName, uploaderAvatar, uploaderProfileLink, timestamp, etc.
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white border-0 py-2">
        <div className="d-flex align-items-center">
          <Link to={image.uploaderProfileLink || `/profile/${image.account._id}`}>
            <img
              src={image.account.avatar || 'https://via.placeholder.com/40?text=User'}
              alt={image.uploaderName}
              className="rounded-circle me-2"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
          </Link>
          <div>
            <Link to={image.uploaderProfileLink || `/profile/${image.uploaderId}`} className="fw-bold text-dark text-decoration-none">
              {image.account.fullname || 'Người dùng ẩn danh'}
            </Link>
            <small className="d-block text-muted">{image.timestamp || 'Vài phút trước'}</small>
          </div>
        </div>
      </div>

      {/* Ảnh chính */}
      <Link to={`/image/${image.id}`}>
        <img
          src={image.url || 'https://via.placeholder.com/600x400?text=Image'}
          className="card-img-top"
          alt={image.title || 'Hình ảnh'}
          style={{ maxHeight: '500px', objectFit: 'cover' }}
        />
      </Link>

      <div className="card-body">
        {image.title && <h5 className="card-title">{image.title}</h5>}
        <p className="card-text text-muted">
          {image.description || 'Không có mô tả.'}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="btn-group">
            <button type="button" className="btn btn-sm btn-outline-primary">
              <i className="bi bi-heart me-1"></i> Thích ({image.likes || 0})
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-chat-dots me-1"></i> Bình luận ({image.comments || 0})
            </button>
          </div>
          <small className="text-muted"><i className="bi bi-eye me-1"></i>{image.views || 0} lượt xem</small>
        </div>
      </div>
    </div>
  );
}

export default ImageCard;