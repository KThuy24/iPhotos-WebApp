// các api có thể sử dụng nhiều lần
import axios from "axios";
import { ACCOUNT_API, COMMENT_API, PHOTO_API } from "./api";
import { toast } from "react-toastify";
import { Failed_Auth, GetAllAccount_Success, GetDetailAccount_Success, Loading_Auth } from "../redux/auth.Slice";
//import { Failed_Photo, GetAllPhoto_Success, GetDetailPhoto_Success, Loading_Photo } from "../redux/photo.Slice";
import { Failed_Comment, GetAllComment_Success, Loading_Comment } from "../redux/commentSlice";

import {
    Loading_Photo,
    CreatePhoto_Success,
    UploadPhoto_Success,
    GetAllPhoto_Success,
    GetDetailPhoto_Success,
    Failed_Photo,

    Loading_User_Photos,
    GetUserPhotos_Success,
    GetUserPhotos_Failed,
    DeletePhoto_Success
} from "../redux/photo.Slice";

//------------------------GET ALL------------------------//
export const GetAllAccount = async (dispatch) =>{
    try{
        dispatch(Loading_Auth());
        const res = await axios.get(`${ACCOUNT_API}/list`,{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials: true
        });
        dispatch(GetAllAccount_Success(res.data));
    }catch(err){
        console.error(err);
        toast.error(err.response?.data?.messsage);
        dispatch(Failed_Auth(err));
    }
};

export const GetAllPhoto = async (dispatch) =>{
    try{
        dispatch(Loading_Photo());
        const res = await axios.get(`${PHOTO_API}/list`,{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials: true
        });
        dispatch(GetAllPhoto_Success(res.data));
    }catch(err){
        console.error(err);
        toast.error(err.response?.data?.messsage);
        dispatch(Failed_Photo(err));
    }
};

export const GetAllComment = async (dispatch) =>{
    try{
        dispatch(Loading_Comment());
        const res = await axios.get(`${COMMENT_API}/list`,{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials: true
        });
        dispatch(GetAllComment_Success(res.data));
    }catch(err){
        console.error(err);
        toast.error(err.response?.data?.messsage);
        dispatch(Failed_Comment(err));
    }
};

//------------------------GET DETAIL------------------------//
export const GetDetailAccount = async (dispatch,id) =>{
    try{
        dispatch(Loading_Auth());
        const res = await axios.get(`${ACCOUNT_API}/detail/${id}`,{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials: true
        });
        dispatch(GetDetailAccount_Success(res.data));
    }catch(err){
        console.error(err);
        toast.error(err.response?.data?.messsage);
        dispatch(Failed_Auth(err));
    }
};

export const GetDetailPhoto = async (dispatch,id) =>{
    try{
        dispatch(Loading_Photo());
        const res = await axios.get(`${PHOTO_API}/detail/${id}`,{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials: true
        });
        console.log("API Response for GetDetailPhoto with ID:", id, "Response data:", res.data);
        dispatch(GetDetailPhoto_Success(res.data));
    }catch(err){
        console.error(err);
        toast.error(err.response?.data?.messsage);
        dispatch(Failed_Photo(err));
    }
};

export const UploadPhotoAPI = async (dispatch, formData) => { 
    try {
        dispatch(Loading_Photo()); // Sử dụng action loading chung của photo
        const res = await axios.post(`${PHOTO_API}/create`, formData, {
            // Axios tự động set 'Content-Type': 'multipart/form-data' khi gửi FormData
            // Không cần headers: {'Content-Type':'multipart/form-data'} ở đây
            withCredentials: true
        });

        dispatch(UploadPhoto_Success(res.data)); // Dispatch action thành công mới
        toast.success(res.data.message || "Ảnh đã được tải lên thành công!");
        return res.data; // Trả về data để component có thể xử lý 
    } catch (err) {
        console.error("Lỗi khi tải ảnh lên:", err.response ? err.response.data : err.message);
        const errorMessage = err.response?.data?.message || "Đã xảy ra lỗi khi tải ảnh lên.";
        toast.error(errorMessage);
        dispatch(Failed_Photo(err.response?.data || { message: errorMessage }));
        throw err; 
    }
};


// ------------------------GET PHOTOS BY CURRENT USER API------------------------ //
export const GetUserPhotosAPI = async (dispatch) => {
    try {
        dispatch(Loading_User_Photos());

        const res = await axios.get(`${PHOTO_API}/my-photos`, { 
             withCredentials: true // Quan trọng để backend xác thực user
        });

        dispatch(GetUserPhotos_Success(res.data));
        return res.data;
    } catch (err) {
        console.error("Lỗi khi lấy ảnh của người dùng:", err.response ? err.response.data : err.message);
        const errorMessage = err.response?.data?.message || "Đã xảy ra lỗi khi tải bộ sưu tập.";
        toast.error(errorMessage);
        dispatch(GetUserPhotos_Failed(err.response?.data || { message: errorMessage }));
        throw err;
    }
};

export const DeletePhotoAPI = async (dispatch, photoId) => {
    try {
        dispatch(Loading_Photo()); // Hoặc action loading riêng
        const res = await axios.delete(`${PHOTO_API}/delete/${photoId}`, {
            withCredentials: true
        });
        // Dispatch action thành công để Redux store cập nhật
        dispatch(DeletePhoto_Success({ photoId: photoId, message: res.data.message })); // Gửi photoId
        toast.success(res.data.message || 'Xóa ảnh thành công!');
        return res.data;
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Lỗi khi xóa ảnh.';
        toast.error(errorMessage);
        dispatch(Failed_Photo(err.response?.data || { message: errorMessage }));
        throw err;
    }
};