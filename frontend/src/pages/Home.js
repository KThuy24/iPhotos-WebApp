// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import ImageCard from '../components/ImageCard';
import TrendingItem from '../components/TrendingItem';
import Pagination from '../components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllPhoto } from '../config/reuseAPI';

// // Dữ liệu giả lập (bạn sẽ fetch từ API)
// const mockFeedImages = [
//   {
//     id: '1',
//     src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
//     title: 'Phong cảnh núi non hùng vĩ',
//     description: 'Một buổi chiều tuyệt đẹp tại dãy Alps. Không khí trong lành và cảnh quan làm say đắm lòng người.',
//     uploaderName: 'Alice Wonderland',
//     uploaderAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
//     uploaderId: 'alice',
//     timestamp: '2 giờ trước',
//     likes: 152,
//     comments: 12,
//     views: 1024
//   },
//   {
//     id: '2',
//     src: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
//     title: 'Hồ nước xanh biếc',
//     description: 'Mặt hồ phẳng lặng như gương, phản chiếu bầu trời xanh ngắt. Một nơi lý tưởng để thư giãn.',
//     uploaderName: 'Bob The Explorer',
//     uploaderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
//     uploaderId: 'bob',
//     timestamp: '5 giờ trước',
//     likes: 230,
//     comments: 25,
//     views: 2500
//   },
//   // Thêm nhiều ảnh giả lập khác
// ];

// const mockTrendingImages = [
//   { id: '2', title: 'Hồ nước xanh biếc', thumbnailSrc: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', views: 2500 },
//   { id: '3', title: 'Thành phố về đêm lung linh', thumbnailSrc: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', views: 2200 },
//   { id: '4', title: 'Chú mèo đáng yêu', thumbnailSrc: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1143&q=80', views: 1980 },
//   { id: '1', title: 'Phong cảnh núi non hùng vĩ', thumbnailSrc: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', views: 1024 },
// ];


function Home () { 
  const images = useSelector((state) => state.photo?.allPhoto?.photos) || [];
  const dispatch = useDispatch();
  const [trendingImages, setTrendingImages] = useState([]);

  const fetching = async () => {
    try {
      await GetAllPhoto(dispatch);
    }catch(err){
      console.log(err);
    }
  }
  // Tính toán index ảnh theo trang
  const [imageList, setImageList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const finalImages = imageList.length > 0 ? imageList : images;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedImages = finalImages.slice(startIndex, endIndex);
  const totalPages = Math.ceil(imageList.length / itemsPerPage);

  //-------------------------------------------------------------//
  // Tự động scroll về đầu trang mỗi khi chuyển trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // tự động quay về trang đầu tiên mỗi khi search, filter hoặc tải lại api
  useEffect(() => {
    setTrendingImages(displayedImages);
    setCurrentPage(1); // reset về trang đầu tiên
  }, []);

  // mount data khi truy cập trang home
  useEffect(() => {
    fetching();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main className="container flex-grow-1 my-4"> {/* my-4: margin top/bottom */}
        <div className="row">
          {/* Phần feed ảnh chính (chiếm 3/4 không gian hoặc col-md-8, col-lg-9) */}
          <div className="col-lg-8 col-md-7"> {/* Thay đổi col-md-7 thành col-md-8 nếu muốn */}
            <h3 className="mb-3">Ảnh mới nhất</h3>
            {displayedImages.length > 0 ? (
              displayedImages.map(image => (
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
                  <h5 className="card-title">Giới thiệu iPhotos</h5>
                  <p className="card-text small text-muted">
                    Chào mừng bạn đến với chúng tôi đây là nơi chia sẻ những khoảnh khắc tuyệt vời qua ống kính.
                    Khám phá, tải lên và kết nối với cộng đồng yêu nhiếp ảnh!
                  </p>
                </div>
              </div>
              {/* Thẻ chủ đề */}
              <div className="card mb-3">
                <div className="card-header fw-bold">Thẻ</div>
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-2">
                    {trendingImages.length > 0 ? (
                      trendingImages.map((tag, index) => (
                        <button
                          key={index}
                          className="btn btn-light border rounded-pill px-3 py-1 tag-button"
                          // onClick={() => handleClickTag(tag)}
                        >
                          {/* {tag.toUpperCase()} */}
                        </button>
                      ))
                    ) : (
                      <div className="text-muted">Không có thẻ nào.</div>
                    )}
                  </div>
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
      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Home;