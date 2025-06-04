import { createSlice } from "@reduxjs/toolkit";

const photoSlice = createSlice({
  name: "photo",
  initialState:{
    allPhoto: null,
    newPhoto: null,
    detailPhoto: null,
    loading: false,
    success: false,
    error: null,

    //up ảnh
    uploadedPhoto: null,
    //bộ sưu tập
    userPhotos: null,
    loadingUserPhotos: false, // Loading state riêng cho userPhotos
  },
  reducers: {
    //--------LOADING--------//
    Loading_Photo: (state) => {
      state.loading = true;

      state.success = false; // Reset success khi bắt đầu operation mới
      state.error = null;    // Reset error
      state.uploadedPhoto = null; // Reset ảnh đã upload khi bắt đầu operation mới
    },
    //--------SET VIEW--------//
    SetView_Success: (state,action) => {
      state.loading = false;
      state.success = true;
      state.allPhoto = action.payload;
    },
    //----------CREATE PHOTO----------//
    CreatePhoto_Success: (state, action) => {
        state.newPhoto = null;
        state.loading = false;
        state.success = true;
        state.newPhoto = action.payload;
        state.allPhoto?.allPhoto.push(state.newPhoto?.newPhoto);
      },
    //----------UPDATE PHOTO----------//
    UpdatePhoto_Success: (state,action) => {
        state.loading = false;
        state.success = true;
        state.allPhoto = action.payload;
    },
    //----------DELETE PHOTO----------//
     DeletePhoto_Success: (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        const deletedPhotoId = action.payload.photoId; 

        // Cập nhật allPhoto
        if (state.allPhoto) {
            if (state.allPhoto.allPhoto && Array.isArray(state.allPhoto.allPhoto)) {
                state.allPhoto.allPhoto = state.allPhoto.allPhoto.filter(p => p._id !== deletedPhotoId);
            } else if (Array.isArray(state.allPhoto)) {
                state.allPhoto = state.allPhoto.filter(p => p._id !== deletedPhotoId);
            }
            // Cập nhật total count nếu allPhoto là object
            if (state.allPhoto.data && Array.isArray(state.allPhoto.data) && typeof state.allPhoto.total === 'number') {
                 const originalLength = state.allPhoto.data.length;
                 state.allPhoto.data = state.allPhoto.data.filter(p => p._id !== deletedPhotoId);
                 if (state.allPhoto.data.length < originalLength) {
                     state.allPhoto.total -=1;
                 }
            }
        }

        // Cập nhật userPhotos
        if (state.userPhotos) {
            if (state.userPhotos.photos && Array.isArray(state.userPhotos.photos)) {
                state.userPhotos.photos = state.userPhotos.photos.filter(p => p._id !== deletedPhotoId);
            } else if (Array.isArray(state.userPhotos)) {
                state.userPhotos = state.userPhotos.filter(p => p._id !== deletedPhotoId);
            }
        }

        // Cập nhật detailPhoto nếu ảnh đang xem bị xóa
        if (state.detailPhoto && state.detailPhoto._id === deletedPhotoId) {
            state.detailPhoto = null;
        }
    },

    //----------GET ALL PHOTO----------//
    GetAllPhoto_Success: (state, action) => {
        state.loading = false;
        state.success = true;
        state.allPhoto = action.payload;
    },
    //----------GET DETAIL PHOTO----------//
    GetDetailPhoto_Success: (state,action) => {
        state.detailPhoto = null;
        state.loading = false;
        state.success = true;
        state.detailPhoto = action.payload;
    }, 
    //--------FAILED--------//
    Failed_Photo: (state,action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      state.uploadedPhoto = null;
    },

     // -------- ACTION CHO UPLOAD ẢNH-------- //
    UploadPhoto_Success: (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.uploadedPhoto = action.payload.photo; // payload từ API là { message: "...", photo: {...} }

        // nếu state.allPhoto.allPhoto là một mảng:
        if (state.allPhoto && state.allPhoto.allPhoto && Array.isArray(state.allPhoto.allPhoto) && action.payload.photo) {
            // Thêm vào đầu danh sách để ảnh mới nhất hiển thị trước
            state.allPhoto.allPhoto.unshift(action.payload.photo);
        } else if (state.allPhoto && Array.isArray(state.allPhoto) && action.payload.photo) {
            // Nếu state.allPhoto là mảng trực tiếp
            state.allPhoto.unshift(action.payload.photo);
        }
    },

     // --------THÊM: ACTIONS CHO USER PHOTOS-------- //
    Loading_User_Photos: (state) => {
      state.loadingUserPhotos = true;
      state.error = null; // Reset lỗi chung nếu có
    },
    GetUserPhotos_Success: (state, action) => {
      state.loadingUserPhotos = false;
      state.userPhotos = action.payload; 
      state.error = null;
    },
    GetUserPhotos_Failed: (state, action) => {
      state.loadingUserPhotos = false;
      state.userPhotos = null;
      state.error = action.payload; // Có thể lưu lỗi vào error chung hoặc một error state riêng
    },

  },
});

export const {
    Loading_Photo,
    SetView_Success,
    CreatePhoto_Success,
    UpdatePhoto_Success,
    DeletePhoto_Success,
    GetAllPhoto_Success,
    GetDetailPhoto_Success,
    Failed_Photo,

    UploadPhoto_Success,

    Loading_User_Photos,
    GetUserPhotos_Success,
    GetUserPhotos_Failed,
} = photoSlice.actions;

export default photoSlice.reducer;