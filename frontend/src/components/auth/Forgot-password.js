import { useState } from "react";
import { Failed_Auth, Forgot_Success, Loading_Auth } from "../../redux/auth.Slice";
import axios from "axios";
import { ACCOUNT_API } from "../../config/api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword () {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [input,setInput] = useState({
        email: user?.email || "",
    });

    const handleChange = (e) => {
        setInput({...input,[e.target.name]:e.target.value});
    };

    const handleClickSendEmail = async (e) => {
        e.preventDefault(); 
        try{
            dispatch(Loading_Auth());
            const res = await axios.post(`${ACCOUNT_API}/forgot-password`,input,{
                headers:{'Content-Type':'application/json'},
                withCredentials: true
            });
            dispatch(Forgot_Success());
            toast.success(res.data.message);
            navigate('/');
        }catch(err){
            console.error(err)
            toast.error(err.response?.data?.message);
            dispatch(Failed_Auth(err));
        }
    };

    return (
        <div
            className="card shadow container"
            style={{maxWidth:'500px', width:'100%'}}
        >
            <div className="card-body">
                <h2 className="card-title text-center mb-4">Quên mật khẩu</h2>
                <form onSubmit={handleClickSendEmail}>
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

                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Gửi
                    </button>
                </form>
                <div className="text-center mt-3">
                <small>
                    Đã nhớ mật khẩu? <Link to="/login">Đăng nhập ngay</Link>
                </small>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;