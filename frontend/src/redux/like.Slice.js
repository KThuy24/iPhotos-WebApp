import { createSlice } from "@reduxjs/toolkit";

const likeSlice = createSlice({
  name: "like",
  initialState:{
    allLike: null,
    newLike: null,
    detailLike: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    //--------LOADING--------//
    Loading_Like: (state) => {
      state.loading = true;
    },
    //----------POST LIKE----------//
    PostLike_Success: (state, action) => {
        state.newLike = null;
        state.loading = false;
        state.success = true;
        state.newLike = action.payload;
        state.allLike?.allLike.push(state.newLike?.newLike);
      },
    //----------REMOVE LIKE----------//
    RemoveLike_Success: (state) => {
        state.loading = false;
        state.success = true;
    },
    //----------GET ALL LIKE----------//
    GetAllLike_Success: (state, action) => {
        state.loading = false;
        state.success = true;
        state.allLike = action.payload;
    },
    //----------GET DETAIL LIKE----------//
    GetDetailLike_Success: (state,action) => {
        state.detailLike = null;
        state.loading = false;
        state.success = true;
        state.detailLike = action.payload;
    }, 
    //--------FAILED--------//
    Failed_Like: (state,action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    }
  },
});

export const {
    Loading_Like,
    PostLike_Success,
    RemoveLike_Success,
    GetAllLike_Success,
    GetDetailLike_Success,
    Failed_Like,
} = likeSlice.actions;

export default likeSlice.reducer;