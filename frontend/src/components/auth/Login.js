/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Failed_Auth,
  Loading_Auth,
  Login_Success,
} from "../../redux/auth.Slice";
import { toast } from "react-toastify";
import { ACCOUNT_API } from "../../config/api.js";

function Login() {
  const account = useSelector((state)=>state.auth.account?.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [input, setInput] = useState({
        EmailorUsername:"",
        password:"",
    });

    const handleChange = (e) => {
        setInput({...input,[e.target.name]:e.target.value})
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(input)
        try{
            dispatch(Loading_Auth());
            const res = await axios.post(`${ACCOUNT_API}/login`,input,{
              headers:{'Content-Type':'application/json'},
              withCredentials: true
            });
            dispatch(Login_Success(res.data));
            toast.success(res.data.notification + res.data.message);
            if (rememberMe) {
                sessionStorage.setItem("rememberedLogin", JSON.stringify({
                  EmailorUsername: input.EmailorUsername,
                }));
            } else {
                sessionStorage.removeItem("rememberedLogin");
            }
        }catch(err){
            console.error(err);
            toast.error(err.response?.data?.message);
            dispatch(Failed_Auth(err));
        }
    };

    useEffect(() => {
        const saved = sessionStorage.getItem("rememberedLogin");
        if (saved) {
          const parsed = JSON.parse(saved);
          setInput((prev) => ({...prev, EmailorUsername: parsed.EmailorUsername}));
          setRememberMe(true);
        }
    }, []);

    useEffect(()=>{
        const loadData = async () => {
            try{
              if(account){
                navigate('/');
              }
            }catch(err){
                console.log(err);
            }
        }
        loadData();
    },[account]);

  return (
    <div
      className="card p-4 shadow container"
      style={{ maxWidth: "600px", width: "100%" }}
    >
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="EmailorUsername" className="form-label">
              Email hoặc Tên đăng nhập
            </label>
            <input
              name="EmailorUsername"
              type="text"
              value={input.EmailorUsername}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập email hoặc tên đăng nhập"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              value={input.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Nhớ mật khẩu
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Đăng nhập
          </button>
        </form>
        <div className="text-left mt-3">
          <small className="d-block mb-3">
            Quên mật khẩu? <Link to="/forgot-password">Khôi phục</Link>
          </small>
          <small className="d-block">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
