import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Failed_Auth, Loading_Auth, Register_Success } from "../../redux/auth.Slice";
import { ACCOUNT_API } from "../../config/api";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import axios from "axios";

function Register () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
      fullname:"",
      email:"",
      username:"",
      password:"",
      confirmPassword:""
  });

  const handleChange = (e) => {
      setInput({...input,[e.target.name]:e.target.value})
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try{
          if (input.password !== input.confirmPassword) {
              toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
              return;
          }
          dispatch(Loading_Auth());
          const res = await axios.post(`${ACCOUNT_API}/register`,{
            fullname: input.fullname,
            email: input.email,
            username: input.username,
            password: input.password,
          },{
            headers:{'Content-Type':'application/json'},
            withCredentials: true
          });
          dispatch(Register_Success(res.data));
          toast.success(res.data.message);
          navigate('/login');
          resetForm();
      }catch(err){
          console.error(err);
          toast.error(err.response?.data?.message);
          dispatch(Failed_Auth(err));
      }
  };

  const resetForm = () => {
      setInput({
          fullname:"",
          email:"",
          username:"",
          password:"",
          confirmPassword:""
      })
  };

  useEffect(()=>{
      const loadData = async () => {
          try{
              resetForm();
          }catch(err){
              console.log(err);
          }
      }
      loadData();
  },[]);
  return (
    <div className="card p-4 shadow container" style={{ maxWidth: '600px', width: '100%' }}> {/* Tăng maxWidth một chút */}
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Đăng ký tài khoản</h2>
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
          {/* Mật khẩu */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Mật khẩu:</label> 
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập mật khẩu"
              required
              minLength="6" // Thêm validation cơ bản
            />
          </div>
          {/* Xác nhận mật khẩu */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu:</label>
            <input
              type="password"
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập lại mật khẩu"
              required
              minLength="6"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Đăng ký
          </button>
        </form>
        <div className="text-center mt-3">
          <small>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Register;