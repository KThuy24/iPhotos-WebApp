import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Failed_Auth, Loading_Auth, SetAccount_Success } from "../redux/auth.Slice";
import axios from "axios";
import { ACCOUNT_API } from "../config/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Profile () {
    const currentAccount = useSelector((state) => state.auth.account?.data);
    const dispatch = useDispatch();
    
    const [input, setInput] = useState({
        fullname: currentAccount?.fullname||"",
        email: currentAccount?.email||"",
        username: currentAccount?.username||"",
        avatar: currentAccount?.avatar||"",
        avatarUrl: currentAccount?.avatar||"",
    });

    const handleChange = (e) => {
        e.preventDefault();
        setInput({...input,[e.target.name]:e.target.value});
    };
    
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if(file) {
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validImageTypes.includes(file.type)) {
                toast.info('Vui lòng chọn một file hình ảnh hợp lệ (JPG, PNG).');
                return;
            }
            setInput({ ...input, 
                avatar: file, 
                avatarUrl: URL.createObjectURL(file),
             });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('username', input.username);
        if(input.avatar) 
        {
            formData.append('avatar', input.avatar);
        }
        console.log(formData)
        try{
            dispatch(Loading_Auth());
            const res = await axios.put(`${ACCOUNT_API}/update/${currentAccount._id}`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data',
                },
                withCredentials:true,
            });
            dispatch(SetAccount_Success(res.data));
            toast.success(res.data.message);
        }catch(err){
            console.error(err);
            toast.error(err.response?.data?.message);
            dispatch(Failed_Auth(err));
        }
    };

    useEffect(() => {
        if (currentAccount) {
            setInput({
                fullname: currentAccount?.fullname||"",
                email: currentAccount?.email||"",
                username: currentAccount?.username||"",
                avatar: currentAccount?.avatar||"",
                avatarUrl: currentAccount?.avatar||"",
        });
        }
    }, [currentAccount]);
    return (
        <div
            className="card p-4 shadow container"
            style={{ maxWidth: "600px", width: "100%" }}
        >
            <Link to='/' style={{fontSize:'16px'}}>
                <button className="btn btn-outline-secondary">
                    ← Quay lại
                </button>
            </Link>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <h3 className="mb-4 text-center">Hồ sơ của tôi</h3>
                    
                    <div>
                        {input.avatarUrl && (
                            <div className="mb-3 text-center">
                            <img
                                src={input.avatarUrl}
                                alt="Avatar Preview"
                                className="rounded-circle border border-secondary"
                                style={{
                                    width: '128px',
                                    height: '128px',
                                    objectFit: 'cover',
                                }}
                            />
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="avatar" className="form-label">
                            Ảnh đại diện:
                            </label>
                            <input
                                type="file"
                                id="avatar"
                                name="avatar"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fullname" className="form-label">Họ và tên</label>
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
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Tên đăng nhập</label>
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
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Địa chỉ Email</label>
                        <input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Nhập email"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        style={{fontSize:'18px'}}
                        disabled={JSON.stringify(input) === JSON.stringify({
                                fullname: currentAccount?.fullname||"",
                                email: currentAccount?.email||"",
                                username: currentAccount?.username||"",
                                avatar: currentAccount?.avatar||"",
                                avatarUrl: currentAccount?.avatar||"",
                            })
                        }
                    >
                        Cập nhật
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;