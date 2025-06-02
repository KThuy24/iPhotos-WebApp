import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACCOUNT_API } from "../../config/api";
import { Failed_Auth, Loading_Auth, SetAccount_Success } from "../../redux/auth.Slice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function AccountEdit () {
    const accountList = useSelector((state) => state.auth?.allAccount.accounts);
    const currentAccount = useSelector((state) => state.auth?.detailAccount?.account);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [input, setInput] = useState({
      fullname: currentAccount?.fullname||"",
      email: currentAccount?.email||"",
      username: currentAccount?.username||"",
      role: currentAccount?.role||"",
      activation: currentAccount?.activation||0,
    });
    //------------------------------------------------------------//
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: name === "activation" ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('username', input.username);
        formData.append('role', input.role);
        formData.append('activation', input.activation);
        try{
            dispatch(Loading_Auth());
            const res = await axios.put(`${ACCOUNT_API}/update/${currentAccount._id}`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                withCredentials: true
            });
            const index = accountList.findIndex(account => account.id === account._id);
            if(index !== -1) {
                dispatch(SetAccount_Success(accountList[index] = res.data));
            }
            toast.success(res.data.message);
            navigate('/admin/accounts');
        }catch(err){
            dispatch(Failed_Auth(err))
            toast.error("Lỗi cập nhật tài khoản");
        }
    };
  //------------------------------------------------------------//
  useEffect(() => {
    if (currentAccount) {
        setInput({
            fullname: currentAccount?.fullname||"",
            email: currentAccount?.email||"",
            username: currentAccount?.username||"",
            role: currentAccount?.role||"",
            activation: currentAccount?.activation||0,
      });
    }
  }, [currentAccount]);
  //------------------------------------------------------------//
    return (
        <div className="card p-4 shadow container" style={{ maxWidth: '600px', width: '100%' }}> {/* Tăng maxWidth một chút */}
            <Link to='/admin/accounts' style={{fontSize:'16px'}}>
                <i>Quay lại</i>
            </Link>
            <div className="card-body">
                <h2 className="card-title text-center mb-4">Cập nhật thông tin tài khoản</h2>
                <form onSubmit={handleSubmit}>
                {/* Họ và tên */}
                <div className="mb-3">
                    <label htmlFor="fullname" className="form-label">Họ và tên:</label>
                    <input
                    type="text"
                    name="fullname"
                    value={input.fullname}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Nhập họ và tên"
                    required
                    />
                </div>
                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Nhập địa chỉ email"
                    required
                    />
                </div>
                {/* Tên đăng nhập */}
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Tên đăng nhập:</label> {/* Đổi id để tránh trùng với login form */}
                    <input
                    type="text"
                    name="username"
                    value={input.username}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Nhập tên đăng nhập"
                    required
                    />
                </div>
                {/* Quyền hạn */}
                <div className="mb-3">
                    <label className="form-label d-block">Quyền hạn:</label>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="role"
                            id="roleAdmin"
                            value="admin"
                            checked={input.role === "admin"}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="roleAdmin">Admin</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="role"
                            id="roleUser"
                            value="user"
                            checked={input.role === "user"}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="roleUser">User</label>
                    </div>
                </div>
                {/* Kích hoạt */}
                <div className="mb-3">
                    <label className="form-label d-block">Trạng thái hoạt động:</label>
                    <div className="form-check form-check-inline">
                        <input
                        className="form-check-input"
                        type="radio"
                        name="activation"
                        id="active"
                        value={1}
                        checked={parseInt(input.activation) === 1}
                        onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="active">Hoạt động</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                        className="form-check-input"
                        type="radio"
                        name="activation"
                        id="inactive"
                        value={0}
                        checked={parseInt(input.activation) === 0}
                        onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="inactive">Ngưng hoạt động</label>
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary w-100 mt-3"
                    style={{fontSize:'18px'}}
                    disabled={JSON.stringify(input) === JSON.stringify({
                            fullname: currentAccount?.fullname||"",
                            email: currentAccount?.email||"",
                            username: currentAccount?.username||"",
                            role: currentAccount?.role||"",
                            activation: currentAccount?.activation||0,
                        })
                    }
                >
                    Lưu
                </button>
                </form>
            </div>
        </div>
    );
};

export default AccountEdit;