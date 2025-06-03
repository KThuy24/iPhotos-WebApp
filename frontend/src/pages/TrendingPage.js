import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import { GetAllPhoto } from "../config/reuseAPI";
import ImageCard from "../components/ImageCard";
import TrendingItem from "../components/TrendingItem";

function TrendingPage () {
    const images = useSelector((state) => state.photo?.allPhoto?.photos) || [];
    const dispatch = useDispatch();
    const [trendingImages, setTrendingImages] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);

    const fetching = async () => {
      try {
        await GetAllPhoto(dispatch);
      }catch(err){
        console.log(err);
      }
    }

    const handleTagClick = (tag) => {
      setSelectedTag(tag);
      const filtered = trendingList.filter(img =>
        img.tags && img.tags.includes(tag)
      );
      setTrendingList(filtered);
      setCurrentPage(1); // về trang đầu
    };

    //-------------------------------------------------------------//
    // Tính toán index ảnh theo trang
    const [trendingList, setTrendingList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
  
    const finalTrending= trendingList.length > 0 ? trendingList : images;
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedTrending = finalTrending.slice(startIndex, endIndex);
    const totalPages = Math.ceil(trendingList.length / itemsPerPage);  

    // Tự động scroll về đầu trang mỗi khi chuyển trang
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // tự động quay về trang đầu tiên mỗi khi search, filter hoặc tải lại api
    useEffect(() => {
      setTrendingList(displayedTrending);
      setTrendingImages(displayedTrending);
      setCurrentPage(1); // reset về trang đầu tiên
    }, []);

    // mount data khi truy cập trang home
    useEffect(() => {
        fetching();
    }, []);
    //-------------------------------------------------------------//
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main className="container flex-grow-1 my-4"> {/* my-4: margin top/bottom */}
        <div className="row">
          {/* Phần feed ảnh chính (chiếm 3/4 không gian hoặc col-md-8, col-lg-9) */}
          <div className="col-lg-8 col-md-7"> {/* Thay đổi col-md-7 thành col-md-8 nếu muốn */}
            <h3 className="mb-3 bi-fire" style={{color:'red'}}>  Xu hướng</h3>
            {selectedTag && (
              <button
                className="btn btn-sm btn-outline-secondary mb-2"
                onClick={() => {
                  setSelectedTag(null);
                  setTrendingList([]);
                  setCurrentPage(1);
                }}
              >
                Xoá lọc: #{selectedTag}
              </button>
            )}
            {displayedTrending.length > 0 ? (
              displayedTrending.map(image => (
                <ImageCard key={image._id} image={image} />
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
                <div className="card-header fw-bold">Thẻ</div>
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-2">
                    {images.length > 0 ? (
                      images.map((img, index) =>
                        img.tags?.length > 0 ? (
                          img.tags.map((item, idx) => (
                            <button
                              key={`${index}-${idx}`}
                              className={`btn btn-light border rounded-pill px-3 py-1 tag-button me-1 mb-1 ${
                                selectedTag === item ? 'btn-primary text-white' : ''
                              }`}
                              onClick={() => handleTagClick(item)}
                            >
                              #{item}
                            </button>
                          ))
                        ) : (
                          <div key={index} className="text-muted">Không có thẻ nào.</div>
                        )
                      )
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
  
export default TrendingPage;