// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import ImageCard from '../components/ImageCard';
import TrendingItem from '../components/TrendingItem';
import { formatTimeAgo } from '../utils/dateUtils'; 

function HomePage() {
  const [feedImages, setFeedImages] = useState([]);
  const [trendingImages, setTrendingImages] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [errorFeed, setErrorFeed] = useState(null);
  const [errorTrending, setErrorTrending] = useState(null);

  useEffect(() => {
    const fetchFeedImages = async () => {
      setLoadingFeed(true);
      setErrorFeed(null);
      try {
        // Đảm bảo URL này đúng với API endpoint của bạn (ví dụ: /api/photo/all hoặc /api/photos)
        const response = await fetch('/api/photo/list'); // Hoặc API endpoint cụ thể của bạn cho "ảnh mới nhất"
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Lỗi không xác định từ server" }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response - Feed Images:", data); // QUAN TRỌNG: Kiểm tra cấu trúc data này

        if (data && data.success && Array.isArray(data.photos)) {
          setFeedImages(data.photos);
        } else {
          // Nếu API trả về trực tiếp mảng ảnh (ít khả năng hơn nếu có success/message)
          // Hoặc nếu cấu trúc khác, cần điều chỉnh
          console.warn("Unexpected data structure for feed images:", data);
          setFeedImages([]); // Hoặc xử lý lỗi cụ thể hơn
          throw new Error("Dữ liệu ảnh mới nhất không hợp lệ.");
        }
      } catch (error) {
        console.error("Failed to fetch feed images:", error);
        setErrorFeed(error.message || "Không thể tải ảnh mới nhất.");
      } finally {
        setLoadingFeed(false);
      }
    };

    const fetchTrendingImages = async () => {
      setLoadingTrending(true);
      setErrorTrending(null);
      try {
        // Đảm bảo URL này đúng với API endpoint của bạn
        const response = await fetch('/api/photo/trendingPhotos');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Lỗi không xác định từ server" }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response - Trending Images:", data); // QUAN TRỌNG: Kiểm tra cấu trúc data này

        if (data && data.success && Array.isArray(data.photos)) {
          setTrendingImages(data.photos);
        } else {
          console.warn("Unexpected data structure for trending images:", data);
          setTrendingImages([]);
          // throw new Error("Dữ liệu ảnh trending không hợp lệ.");
        }
      } catch (error) {
        console.error("Failed to fetch trending images:", error);
        setErrorTrending(error.message || "Không thể tải ảnh xem nhiều nhất.");
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchFeedImages();
    fetchTrendingImages();
  }, []);

  const renderFeedContent = () => {
    if (loadingFeed) return <p>Đang tải ảnh mới nhất...</p>;
    if (errorFeed) return <p className="text-danger">Lỗi: {errorFeed}</p>;
    if (feedImages.length > 0) {
      return feedImages.map(apiPhoto => {
        // Ánh xạ dữ liệu từ API sang cấu trúc mà ImageCard mong đợi
        const imageForCard = {
          id: apiPhoto._id, // MongoDB _id
          src: apiPhoto.url, // URL ảnh chính
          title: apiPhoto.title,
          description: apiPhoto.description,
          uploaderName: apiPhoto.account?.fullname || apiPhoto.account?.fullname || 'Người dùng ẩn danh',
          uploaderAvatar: apiPhoto.account?.avatar || 'https://via.placeholder.com/40?text=User',
          uploaderId: apiPhoto.account?._id, // Dùng để tạo link profile
          // uploaderProfileLink: `/profile/${apiPhoto.account?._id}`, // Có thể tạo sẵn link
          timestamp: formatTimeAgo(apiPhoto.createdAt), // Sử dụng hàm formatTimeAgo
          likes: apiPhoto.likes?.length || 0, // Số lượng likes
          // Giả sử bạn sẽ fetch comments riêng hoặc backend trả về commentCount
          comments: apiPhoto.commentCount || 0, // Hoặc apiPhoto.comments?.length nếu có

        };
        console.log("Data for ImageCard:", imageForCard);
        return <ImageCard key={imageForCard.id} image={imageForCard} />;
      });
    }
    return <p>Chưa có ảnh nào để hiển thị.</p>;
  };

  const renderTrendingContent = () => {
    if (loadingTrending) return <p className="p-2 text-muted">Đang tải...</p>;
    if (errorTrending) return <p className="p-2 text-danger">Lỗi: {errorTrending}</p>;
    if (trendingImages.length > 0) {
      return trendingImages.map(apiTrendingPhoto => {
        const trendingItemForCard = {
          id: apiTrendingPhoto._id,
          thumbnailSrc: apiTrendingPhoto.url, // Giả sử URL ảnh chính cũng là thumbnail
          //title: apiTrendingPhoto.title,
          views: apiTrendingPhoto.views || 0,
          // Nếu backend trả về thông tin người đăng cho trending item, bạn cũng có thể thêm vào đây
        };
        return <TrendingItem key={trendingItemForCard.id} item={trendingItemForCard} />;
      });
    }
    return <p className="p-2 text-muted">Chưa có ảnh nào nổi bật.</p>;
  };

  return (
    <div className="row">
      <div className="col-lg-8 col-md-7">
        <h3 className="mb-3">Ảnh mới nhất</h3>
        {renderFeedContent()}
      </div>
      <div className="col-lg-4 col-md-5">
        <div className="sticky-top" style={{ top: '20px' }}>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Giới thiệu IPhotos</h5> {/* Sửa lại tên nếu cần */}
              <p className="card-text small text-muted">
                Chào mừng bạn đến với chúng tôi đây là nơi chia sẻ những khoảnh khắc tuyệt vời qua ống kính.
                Khám phá, tải lên và kết nối với cộng đồng yêu nhiếp ảnh!
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-header fw-bold">Xem nhiều nhất</div>
            <div className="list-group list-group-flush p-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {renderTrendingContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );


}

export default HomePage;