import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { PHOTO_API } from "../../../config/api";
import {
  Failed_Photo,
  Loading_Photo,
  UpdatePhoto_Success,
} from "../../../redux/photo.Slice";
import axios from "axios";
import { toast } from "react-toastify";

function ImageEdit() {
  const imageList = useSelector((state) => state.photo?.allPhoto?.photos);
  const currentImage = useSelector((state) => state.photo?.detailPhoto?.photo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const [input, setInput] = useState({
    title: currentImage?.title || "",
    description: currentImage?.description || "",
    tags: currentImage?.tags || [],
    visibility: currentImage?.visibility || 0,
    url: currentImage?.url || "",
    imageUrl: currentImage?.url || "",
  });
  //------------------------------------------------------------//
  const handleChange = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validImageTypes.includes(file.type)) {
        toast.info("Vui lòng chọn một file hình ảnh hợp lệ (JPG, PNG).");
        return;
      }
      setInput({ ...input, url: file, imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("description", input.description);
    formData.append("tags", input.tags);
    formData.append("visibility", input.visibility);
    if (input.url) {
      formData.append("url", input.url);
    }
    console.log("input", formData);
    try {
      dispatch(Loading_Photo());
      const res = await axios.put(
        `${PHOTO_API}/update/${currentImage._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      const index = imageList.findIndex((image) => image.id === image._id);
      if (index !== -1) {
        dispatch(UpdatePhoto_Success((imageList[index] = res.data)));
      }
      toast.success(res.data.message);
      navigate("/admin/images");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      dispatch(Failed_Photo(err));
      toast.error(err.response?.data?.message);
    }
  };
  //------------------------------------------------------------//
  useEffect(() => {
    if (currentImage) {
      setInput({
        title: currentImage?.title || "",
        description: currentImage?.description || "",
        tags: currentImage?.tags || [],
        visibility: currentImage?.visibility || 0,
        url: currentImage?.url || "",
        imageUrl: currentImage?.url || "",
      });
    }
  }, [currentImage]);
  //------------------------------------------------------------//
  return (
    <div
      className="card p-4 shadow container"
      style={{ maxWidth: "800px", width: "100%" }}
    >
      {" "}
      {/* Tăng maxWidth một chút */}
      <Link to="/admin/images" style={{ fontSize: "16px" }}>
        <button className="btn btn-outline-secondary">← Quay lại</button>
      </Link>
      <div className="card-body">
        <h2 className="card-title text-center mb-4">
          Cập nhật thông tin bài đăng
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Tiêu đề:
            </label>
            <input
              type="text"
              name="title"
              value={input.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập tiêu đề"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Mô tả:
            </label>
            <input
              type="text"
              name="description"
              value={input.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập mô tả"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tags" className="form-label">
              Chủ đề:
            </label>
            <input
              type="text"
              name="tags"
              value={input.tags}
              onChange={handleChange}
              className="form-control"
              placeholder="Chọn chủ đề"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label d-block">Chế độ:</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="visibility"
                id="public"
                value="công khai"
                checked={input.visibility === "công khai"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="public">
                Công khai
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="visibility"
                id="private"
                value="riêng tư"
                checked={input.visibility === "riêng tư"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="private">
                Riêng tư
              </label>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <label htmlFor="url" className="form-label">
                Hình ảnh:
              </label>
              <input
                type="file"
                id="url"
                name="url"
                accept="image/*"
                onChange={handleAvatarChange}
                className="form-control"
              />
            </div>
            {input.imageUrl && (
              <div className="mb-3 text-center">
                <img
                  src={input.imageUrl}
                  alt="Avatar Preview"
                  className="rounded border border-secondary"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>
          {loading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <button
              type="submit"
              className="btn btn-primary w-100 mt-3"
              style={{ fontSize: "18px" }}
              disabled={
                loading ||
                JSON.stringify(input) ===
                  JSON.stringify({
                    title: currentImage?.title || "",
                    description: currentImage?.description || "",
                    tags: currentImage?.tags || [],
                    visibility: currentImage?.visibility || 0,
                    url: currentImage?.url || "",
                    imageUrl: currentImage?.url || "",
                  })
              }
            >
              Lưu
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default ImageEdit;
