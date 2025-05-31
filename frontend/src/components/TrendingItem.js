// src/components/TrendingItem.js
import React from 'react';
import { Link } from 'react-router-dom';

function TrendingItem({ item }) {
  // item là object: id, title, thumbnailSrc, views
  return (
    <div className="d-flex mb-3">
      <Link to={`/image/${item.id}`}>
        <img
          src={item.thumbnailSrc || 'https://via.placeholder.com/80x60?text=Thumb'}
          alt={item.title}
          className="img-thumbnail me-2"
          style={{ width: '80px', height: '60px', objectFit: 'cover' }}
        />
      </Link>
      <div>
        <Link to={`/image/${item.id}`} className="text-dark fw-semibold text-decoration-none d-block" style={{fontSize: '0.9rem'}}>
          {item.title || 'Tiêu đề ảnh'}
        </Link>
        <small className="text-muted">{item.views || 0} lượt xem</small>
      </div>
    </div>
  );
}

export default TrendingItem;