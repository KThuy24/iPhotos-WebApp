import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Failed_Auth, Loading_Auth, Reset_Success } from "../../redux/auth.Slice";
import axios from "axios";
import { ACCOUNT_API } from "../../config/api";

function ResetPassword () {
    const url = window.location.href;
    const urlObj = new URL(url); // Tạo Object URL
    const token = urlObj.searchParams.get('token'); // Lấy token từ URL
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [input, setInput] = useState({
        password:"",
        confirmPassword:"",
    });

    const handleChange = (e) => {
        setInput({...input,[e.target.name]:e.target.value});
    };
    
    const handleClickReset = async (e) => {
        e.preventDefault();
        if (input.password !== input.confirmPassword)
        {
            toast.error("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
            return;
        }
        try{
            dispatch(Loading_Auth());
            const res = await axios.post(`${ACCOUNT_API}/reset-password/${token}`,{password:input.password},{
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            dispatch(Reset_Success());
            setTimeout(() => {
                toast.success(res.data.message);
            }, 2000);
            setTimeout(() => {
                toast.info(res.data.notification);
            }, 4000);
            setTimeout(() => {
                navigate('/login');
            }, 6000);
        }catch(err){
            console.error(err);
            toast.error(err.response?.data?.message || "Lỗi khi xử lý đặt lại mật khẩu từ Server !");
            dispatch(Failed_Auth(err));
        }
    };
    return (
        <div
            className="card shadow container"
            style={{maxWidth:'500px', width:'100%'}}
        >
            <div className="card-body">
                <h2 className="card-title text-center mb-4">Khôi phục mật khẩu</h2>
                <form onSubmit={handleClickReset}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mật khẩu:</label>
                        <input
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Nhập mật khẩu mới"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={input.confirmPassword}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Xác nhận
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;