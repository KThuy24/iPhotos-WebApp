// các api có thể sử dụng nhiều lần
import axios from "axios";
import { ACCOUNT_API, PHOTO_API } from "./api";
import { toast } from "react-toastify";
import { Failed_Auth, GetAllAccount_Success, GetDetailAccount_Success, Loading_Auth } from "../redux/auth.Slice";
import { Failed_Photo, GetAllPhoto_Success, Loading_Photo } from "../redux/photo.Slice";

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