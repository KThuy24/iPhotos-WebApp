import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetAllPhoto, GetDetailPhoto } from "../../config/reuseAPI";
import Swal from "sweetalert2";
import axios from "axios";
import { DeletePhoto_Success, Failed_Photo, Loading_Photo } from "../../redux/photo.Slice";
import { PHOTO_API } from "../../config/api";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";

function ImageList () {
    const imageList = useSelector((state) => state.photo?.allPhoto);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(null);
  
    const fetching = async () => {
      try{
          await GetAllPhoto(dispatch);
      }catch(error){
          console.log(error);
      }
    };

    const handleEdit = async (image) => {
      try{
          await GetDetailPhoto(dispatch,image._id);
          navigate(`/admin/image/edit/${image._id}`);
      }catch(error){
          console.log(error);
      }
    };
    
    const handleDelete = async (id) => {
        try{
          const result = await Swal.fire({
            title: "Bạn có chắc chắn muốn xóa bài đăng này?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#808080",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });
        if (result.isConfirmed) {
            dispatch(Loading_Photo());
            const res = await axios.delete(`${PHOTO_API}/delete/${id}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            dispatch(DeletePhoto_Success());
            await fetching();
            toast.success(res.data.message);
            await Swal.fire("Đã xóa!", "Bài đăng đã được xóa thành công.", "success");
        }
        }catch(error){
          dispatch(Failed_Photo(error));
          toast.error(error.response?.data?.massage);
        }
    };

    const handleViewDetail = async (image) => {
        try {
            await GetDetailPhoto(dispatch, image._id);
            navigate(`/admin/image/detail/${image._id}`);
        } catch (err) {
            console.log(err);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Tính toán index ảnh theo trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const finalImageList = imageList?.photos?.slice(startIndex, endIndex);
  
    const totalPages = Math.ceil(imageList?.photos?.length / itemsPerPage);
    
    useEffect(() => {
      setLoading(true);
      const loadData = async () => {
          try{
              await fetching();
          }catch(err){
              console.error('Lỗi khi tải dữ liệu:', err);
          } finally{
            setTimeout(() => {
              setLoading(false);
            }, 700);
          }
      }
      loadData();
    }, []);

    return (
        <div className="container mt-4">
            <div className="card">
            <div className="card-header fw-bold" style={{ fontSize: "18px" }}>
                Danh sách hình ảnh
            </div>
            <div className="card-body">
                {loading ? (
                    <div className="text-center mt-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Đang tải danh sách hình ảnh...</p>
                    </div>
                ) : (
                <div className="table-responsive">
                    <table
                    className="table table-bordered table-hover align-middle"
                    style={{ fontSize: "17px" }}
                    >
                    <thead className="table-light text-center">
                        <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Họ và tên</th>
                        <th scope="col">Email</th>
                        <th scope="col">Tên đăng nhập</th>
                        <th scope="col">URL</th>
                        <th scope="col">Tiêu đề</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Thẻ</th>
                        <th scope="col">Chế độ</th>
                        <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {finalImageList?.length > 0 ? (
                        finalImageList.map((image, index) => (
                            <tr key={image.id}>
                            <td>{index + 1}</td>
                            <td>{image.account?.fullname}</td>
                            <td>{image.account?.email}</td>
                            <td>{image.account?.username}</td>
                            <td>
                                <a
                                    href={image?.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="d-block"
                                >
                                    <img
                                        src={image?.url}
                                        alt="Hình ảnh"
                                        className="rounded"
                                        width="60"
                                        height="60"
                                    />
                                </a>
                            </td>
                            <td>{image?.title}</td>
                            <td>{image?.description}</td>
                            <td>{image?.tags}</td>
                            <td>
                                <span
                                    style={{fontSize:'15px'}}
                                    className={`badge ${
                                        image?.visibility === "công khai"
                                        ? "bg-primary"
                                        : "bg-danger"
                                    }`
                                }
                                >
                                    {image?.visibility}
                                </span>
                            </td>
                            <td>
                                <div className="dropdown">
                                    <button
                                    className="btn btn-sm btn-outline-secondary bi-three-dots"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    >
                                    </button>
                                    <ul className="dropdown-menu">
                                    <li>
                                        <button
                                            className="dropdown-item bi-eye"
                                            onClick={() => handleViewDetail(image)}
                                        >
                                            <span className="ms-2">
                                                Chi tiết
                                            </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item text-primary bi-pencil"
                                            onClick={() => handleEdit(image)}
                                        >
                                            <span className="ms-2">
                                                Sửa
                                            </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item text-danger bi-trash"
                                            onClick={() => handleDelete(image._id)}
                                        >
                                            <span className="ms-2">
                                                Xóa
                                            </span>
                                        </button>
                                    </li>
                                    </ul>
                                </div>
                                </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="8" className="text-center text-muted">
                            Không có tài khoản nào.
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                    {/* Phân trang */}
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    />
                </div>
                )}
            </div>
            </div>
        </div>
    );
}
    
export default ImageList;