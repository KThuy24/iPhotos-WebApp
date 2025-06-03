import { createSlice } from "@reduxjs/toolkit";

const albumSlice = createSlice({
  name: "album",
  initialState:{
    allAlbum: null,
    newAlbum: null,
    detailAlbum: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    //--------LOADING--------//
    Loading_Album: (state) => {
      state.loading = true;
    },
    //----------CREATE ALBUM----------//
    CreateAlbum_Success: (state, action) => {
        state.newAlbum = null;
        state.loading = false;
        state.success = true;
        state.newAlbum = action.payload;
        state.allAlbum?.allAlbum.push(state.newAlbum?.newAlbum);
      },
    //----------UPDATE ALBUM----------//
    UpdateAlbum_Success: (state,action) => {
        state.loading = false;
        state.success = true;
        state.allAlbum = action.payload;
    },
    //----------DELETE ALBUM----------//
    DeleteAlbum_Success: (state) => {
        state.loading = false;
        state.success = true;
    },
    //----------GET ALL ALBUM----------//
    GetAllAlbum_Success: (state, action) => {
        state.loading = false;
        state.success = true;
        state.allAlbum = action.payload;
    },
    //----------GET DETAIL ALBUM----------//
    GetDetailAlbum_Success: (state,action) => {
        state.detailAlbum = null;
        state.loading = false;
        state.success = true;
        state.detailAlbum = action.payload;
    }, 
    //--------FAILED--------//
    Failed_Album: (state,action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    }
  },
});

export const {
    Loading_Album,
    CreatePhoto_Success,
    UpdatePhoto_Success,
    DeletePhoto_Success,
    GetAllPhoto_Success,
    GetDetailPhoto_Success,
    Failed_Album,
} = albumSlice.actions;

export default albumSlice.reducer;