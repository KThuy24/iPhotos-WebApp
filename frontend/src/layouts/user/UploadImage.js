import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UploadPhotoAPI } from '../../config/reuseAPI';
import { toast } from 'react-toastify';
import './UploadImage.css';

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('công khai');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Lấy trạng thái từ Redux store
  const { loading, error: uploadError, success: uploadSuccess, uploadedPhoto } = useSelector((state) => state.photo);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Kiểm tra loại file và kích thước nếu cần
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Vui lòng chọn một file ảnh hợp lệ.");
        e.target.value = null; // Reset input
        setFile(null);
        setPreview(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // Giới hạn 10MB
        toast.error("Kích thước file quá lớn (tối đa 10MB).");
        e.target.value = null; // Reset input
        setFile(null);
        setPreview(null);
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setTags('');
    setVisibility('công khai');
    // Reset input file
    const fileInput = document.getElementById('file-input-upload');
    if (fileInput) {
        fileInput.value = null;
    }
  };

  // Xử lý sau khi upload thành công
  useEffect(() => {
    if (uploadSuccess && uploadedPhoto) {
      resetForm();
      //chuyển hướng người dùng
      navigate('/my-gallery'); 
    }
  }, [uploadSuccess, uploadedPhoto, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Vui lòng chọn một tệp ảnh.');
      return;
    }
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề cho ảnh.');
      return;
    }

    const formData = new FormData();
    formData.append('imageFile', file); 
    formData.append('title', title);
    formData.append('description', description);
    // Chuyển chuỗi tags thành mảng các chuỗi, loại bỏ khoảng trắng và các tag rỗng
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    formData.append('tags', JSON.stringify(tagsArray)); // Gửi dưới dạng JSON string, backend parse lại
    formData.append('visibility', visibility);
    // `accountId` sẽ được backend tự động lấy từ thông tin session/token của người dùng đang đăng nhập

    try {
      await UploadPhotoAPI(dispatch, formData);
      // Logic sau khi thành công đã được chuyển vào useEffect
    } catch (err) {
      console.error("Upload failed in component:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">Tải Ảnh Mới Lên</h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="file-input-upload" className="form-label fw-bold">Chọn ảnh:</label>
                  <input
                    type="file"
                    id="file-input-upload" 
                    className="form-control"
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    onChange={handleFileChange}
                    required
                  />
                  {preview && (
                    <div className="mt-3 text-center">
                      <img src={preview} alt="Xem trước ảnh" className="img-thumbnail" style={{ maxHeight: '250px', maxWidth: '100%' }} />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-bold">Tiêu đề:</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Hoàng hôn trên biển"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-bold">Nhập mô tả:</label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Viết mô tả ngắn gọn về bức ảnh của bạn..."
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="tags" className="form-label fw-bold">Tag:</label>
                  <input
                    type="text"
                    id="tags"
                    className="form-control"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="ví dụ: #phong cảnh, #hoàng hôn, #du lịch"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="visibility" className="form-label fw-bold">Chế độ hiển thị:</label>
                  <select
                    id="visibility"
                    className="form-select"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option value="công khai">Công khai</option>
                    <option value="riêng tư">Riêng tư</option>
                  </select>
                </div>

                {uploadError && (
                    <div className="alert alert-danger" role="alert">
                        Lỗi: {uploadError.message || JSON.stringify(uploadError)}
                    </div>
                )}

                <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    <><i className="bi bi-cloud-arrow-up-fill me-2"></i>Tải Lên</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;