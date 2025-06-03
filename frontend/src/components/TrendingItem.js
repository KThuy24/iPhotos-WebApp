// src/components/TrendingItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PHOTO_API } from '../config/api';
import axios from 'axios';
import { GetDetailPhoto } from '../config/reuseAPI';
import { useDispatch } from 'react-redux';

function TrendingItem({ item }) {
  const dispatch = useDispatch();

  const handleDetailImage = async () => {
    try {
      await axios.post(`${PHOTO_API}/view/${item._id}`, {}, {
        withCredentials: true
      });
  
      await GetDetailPhoto(dispatch, item._id);
    } catch (err) {
      console.log(err);
    }
  }
  // item là object: id, title, thumbnailSrc, views
  return (
    <div className="d-flex mb-3">
      <Link to={`/image/detail/${item?._id}`} onClick={handleDetailImage}>
        <img
          src={item?.url || 'https://via.placeholder.com/80x60?text=Thumb'}
          alt={item?.title}
          className="img-thumbnail me-2"
          style={{ width: '80px', height: '60px', objectFit: 'cover' }}
        />
      </Link>
      <div>
        <Link to={`/image/detail/${item?._id}`} className="text-dark fw-semibold text-decoration-none d-block" style={{fontSize: '0.9rem'}}>
          {item?.title || 'Tiêu đề ảnh'}
        </Link>
        <small className="text-muted">{item.views || 0} lượt xem</small>
      </div>
    </div>
  );
}

export default TrendingItem;