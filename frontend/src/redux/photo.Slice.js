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
  },
  reducers: {
    //--------LOADING--------//
    Loading_Photo: (state) => {
      state.loading = true;
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
    DeletePhoto_Success: (state) => {
        state.loading = false;
        state.success = true;
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
    }
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
} = photoSlice.actions;

export default photoSlice.reducer;