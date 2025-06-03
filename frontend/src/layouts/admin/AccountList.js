/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { GetAllAccount, GetDetailAccount } from "../../config/reuseAPI";
import { useDispatch, useSelector } from "react-redux";
import Pagination from '../../components/Pagination';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DeleteAccount_Success, Failed_Auth, Loading_Auth } from "../../redux/auth.Slice";
import { toast } from "react-toastify";
import { ACCOUNT_API } from "../../config/api";
import axios from "axios";

function AccountList () {
  const accountList = useSelector((state) => state.auth?.allAccount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const fetching = async () => {
    try{
        await GetAllAccount(dispatch);
    }catch(error){
        console.log(error);
    }
  };

  const handleEdit = async (account) => {
    try{
        await GetDetailAccount(dispatch,account._id);
        navigate(`/admin/account/edit/${account._id}`);
    }catch(error){
        console.log(error);
    }
  };
  
  const handleDelete = async (id) => {
    try{
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa tài khoản này?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#808080",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
        dispatch(Loading_Auth());
        const res = await axios.delete(`${ACCOUNT_API}/delete/${id}`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });
        dispatch(DeleteAccount_Success());
        await fetching();
        toast.success(res.data.message);
        await Swal.fire("Đã xóa!", "Tài khoản đã được xóa thành công.", "success");
    }
    }catch(error){
      dispatch(Failed_Auth(error));
      toast.error(error.response?.data?.massage);
    }
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Tính toán index ảnh theo trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const finalAccountList = accountList?.accounts?.slice(startIndex, endIndex);

  const totalPages = Math.ceil(accountList?.accounts?.length / itemsPerPage);
  
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
          Danh sách tài khoản
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Đang tải danh sách tài khoản...</p>
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
                    <th scope="col">Ảnh đại diện</th>
                    <th scope="col">Quyền hạn</th>
                    <th scope="col">Kích hoạt</th>
                    <th scope="col">Hành động</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {finalAccountList?.length > 0 ? (
                    finalAccountList.map((account, index) => (
                      <tr key={account.id}>
                        <td>{index + 1}</td>
                        <td>{account.fullname}</td>
                        <td>{account.email}</td>
                        <td>{account.username}</td>
                        <td>
                          <img
                            src={account.avatar}
                            alt="avatar"
                            className="rounded-circle"
                            width="40"
                            height="40"
                          />
                        </td>
                        <td>
                          <span
                              style={{fontSize:'15px'}}
                              className={`badge ${
                                account.role === "admin"
                                  ? "bg-primary"
                                  : "bg-secondary"
                              }`
                            }
                          >
                            {account.role}
                          </span>
                        </td>
                        <td>
                          {account.activation === 1 ? (
                            <span className="text-success" style={{fontSize:'20px'}}>✅</span>
                          ) : (
                            <span className="text-danger" style={{fontSize:'20px'}}>❌</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-3"
                            onClick={() => handleEdit(account)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(account._id)}
                          >
                            Xóa
                          </button>
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
  
export default AccountList;