import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { PHOTO_API } from '../config/api'; // Đường dẫn đến file api constants
import ImageCard from '../components/ImageCard'; // Component để hiển thị từng ảnh
import { useDispatch, useSelector } from 'react-redux';
import { Loading_Photo, Failed_Photo, SetSearchResults_Success } from '../redux/photo.Slice'; 

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = useQuery();
  const searchQuery = queryParams.get('query');
  const dispatch = useDispatch();
  const { searchResults, loadingSearch, errorSearch } = useSelector((state) => state.photo);



  useEffect(() => {
    if (searchQuery) {
      const fetchSearchResults = async () => {
        dispatch(Loading_Photo()); // Hoặc một action loading riêng cho search
        try {
          const response = await axios.get(`${PHOTO_API}/search`, {
            params: { query: searchQuery },
            withCredentials: true, // Nếu cần xác thực để xem một số ảnh
          });

          if (response.data && response.data.success) {
            dispatch(SetSearchResults_Success(response.data.photos)); // Dispatch action để lưu kết quả
          } else {
            dispatch(Failed_Photo({ message: response.data?.message || 'Không tìm thấy kết quả.' }));
          }
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Lỗi khi tìm kiếm ảnh.';
          dispatch(Failed_Photo({ message: errorMessage, error: err.response?.data || err }));
          console.error("Search error:", err);
        }
      };
      fetchSearchResults();
    } else {
        dispatch(SetSearchResults_Success([])); // Xóa kết quả nếu query rỗng
    }
  }, [searchQuery, dispatch, location.search]); // Phụ thuộc vào searchQuery và dispatch (location.search để trigger khi URL thay đổi hoàn toàn)


  if (loadingSearch) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tìm kiếm...</span>
        </div>
        <p className="mt-3 fs-5 text-muted">Đang tìm kiếm kết quả cho "{searchQuery}"...</p>
      </div>
    );
  }

  if (errorSearch) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center shadow-sm" role="alert">
          <h4 className="alert-heading">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>Có lỗi xảy ra!
          </h4>
          <p>{errorSearch.message || "Không thể thực hiện tìm kiếm. Vui lòng thử lại."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {searchQuery ? (
        <>
          <h1 className="mb-4">Kết quả tìm kiếm cho: "{searchQuery}"</h1>
          {searchResults && searchResults.length > 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {searchResults.map((photo) => (
                  photo && photo._id ? <ImageCard key={photo._id} image={photo} /> : null
                ))}
              </div>
          ) : (
            <div className="text-center my-5">
              <i className="bi bi-search display-1 text-muted mb-3"></i>
              <h2>Không tìm thấy kết quả nào.</h2>
              <p className="lead text-secondary">
                Hãy thử với từ khóa khác hoặc kiểm tra lại chính tả.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center my-5">
            <h2>Nhập từ khóa để tìm kiếm ảnh.</h2>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;