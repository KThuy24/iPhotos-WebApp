// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageCard from '../components/ImageCard';
import TrendingItem from '../components/TrendingItem';

// Dữ liệu giả lập (bạn sẽ fetch từ API)
const mockFeedImages = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    title: 'Phong cảnh núi non hùng vĩ',
    description: 'Một buổi chiều tuyệt đẹp tại dãy Alps. Không khí trong lành và cảnh quan làm say đắm lòng người.',
    uploaderName: 'Alice Wonderland',
    uploaderAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    uploaderId: 'alice',
    timestamp: '2 giờ trước',
    likes: 152,
    comments: 12,
    views: 1024
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    title: 'Hồ nước xanh biếc',
    description: 'Mặt hồ phẳng lặng như gương, phản chiếu bầu trời xanh ngắt. Một nơi lý tưởng để thư giãn.',
    uploaderName: 'Bob The Explorer',
    uploaderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    uploaderId: 'bob',
    timestamp: '5 giờ trước',
    likes: 230,
    comments: 25,
    views: 2500
  },
  // Thêm nhiều ảnh giả lập khác
];

const mockTrendingImages = [
  { id: '2', title: 'Hồ nước xanh biếc', thumbnailSrc: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', views: 2500 },
  { id: '3', title: 'Thành phố về đêm lung linh', thumbnailSrc: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', views: 2200 },
  { id: '4', title: 'Chú mèo đáng yêu', thumbnailSrc: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1143&q=80', views: 1980 },
  { id: '1', title: 'Phong cảnh núi non hùng vĩ', thumbnailSrc: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', views: 1024 },
];


function HomePage({ currentUser, onLogout }) { // Nhận currentUser và onLogout từ App.js
  const [feedImages, setFeedImages] = useState([]);
  const [trendingImages, setTrendingImages] = useState([]);

  useEffect(() => {
    setFeedImages(mockFeedImages);
    setTrendingImages(mockTrendingImages);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        // Truyền các props đã được destructure xuống Navbar
        isLoggedIn={!!currentUser} // Chuyển currentUser thành boolean (true nếu có user, false nếu null)
        userName={currentUser?.username} // Lấy username nếu currentUser tồn tại, ngược lại là undefined
        isAdmin={currentUser?.role === 'admin'} // Kiểm tra quyền admin nếu currentUser tồn tại
        onLogout={onLogout} // Truyền thẳng hàm onLogout
      />
      <main className="container flex-grow-1 my-4"> {/* my-4: margin top/bottom */}
        <div className="row">
          {/* Phần feed ảnh chính (chiếm 3/4 không gian hoặc col-md-8, col-lg-9) */}
          <div className="col-lg-8 col-md-7"> {/* Thay đổi col-md-7 thành col-md-8 nếu muốn */}
            <h3 className="mb-3">Ảnh mới nhất</h3>
            {feedImages.length > 0 ? (
              feedImages.map(image => (
                <ImageCard key={image.id} image={image} />
              ))
            ) : (
              <p>Chưa có ảnh nào để hiển thị.</p>
            )}
            {/* TODO: Thêm nút "Xem thêm" hoặc infinite scroll */}
          </div>

          {/* Phần sidebar (chiếm 1/4 không gian hoặc col-md-4, col-lg-3) */}
          <div className="col-lg-4 col-md-5"> {/* Thay đổi col-md-5 thành col-md-4 nếu muốn */}
            <div className="sticky-top" style={{ top: '20px' }}> {/* Giữ sidebar cố định khi cuộn */}
              {/* Giới thiệu (nếu có) */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Giới thiệu PixelShare</h5>
                  <p className="card-text small text-muted">
                    Chào mừng bạn đến với chúng tôi đây là nơi chia sẻ những khoảnh khắc tuyệt vời qua ống kính.
                    Khám phá, tải lên và kết nối với cộng đồng yêu nhiếp ảnh!
                  </p>
                </div>
              </div>

              {/* Ảnh xem nhiều nhất */}
              <div className="card">
                <div className="card-header fw-bold">
                  Xem nhiều nhất
                </div>
                <div className="list-group list-group-flush p-2" style={{maxHeight: '400px', overflowY: 'auto'}}>
                  {trendingImages.length > 0 ? (
                    trendingImages.map(item => (
                      <TrendingItem key={item.id} item={item} />
                    ))
                  ) : (
                    <p className="p-2 text-muted">Chưa có ảnh nào nổi bật.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;