import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",
  initialState:{
    allComment: null,
    newComment: null,
    detailComment: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    //--------LOADING--------//
    Loading_Comment: (state) => {
      state.loading = true;
    },
    //----------CREATE COMMENT----------//
    CreateComment_Success: (state, action) => {
        state.loading = false;
        state.success = true;
        state.allComment = action.payload;
      },
    //----------UPDATE COMMENT----------//
    UpdateComment_Success: (state,action) => {
        state.loading = false;
        state.success = true;
        state.allComment = action.payload;
    },
    //----------DELETE COMMENT----------//
    DeleteComment_Success: (state) => {
        state.loading = false;
        state.success = true;
    },
    //----------GET ALL COMMENT----------//
    GetAllComment_Success: (state, action) => {
        state.loading = false;
        state.success = true;
        state.allComment = action.payload;
    },
    //----------GET DETAIL COMMENT----------//
    GetDetailComment_Success: (state,action) => {
        state.detailComment = null;
        state.loading = false;
        state.success = true;
        state.detailComment = action.payload;
    }, 
    //--------FAILED--------//
    Failed_Comment: (state,action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    }
  },
});

export const {
    Loading_Comment,
    CreateComment_Success,
    UpdateComment_Success,
    DeleteComment_Success,
    GetAllComment_Success,
    GetDetailComment_Success,
    Failed_Comment,
} = commentSlice.actions;

export default commentSlice.reducer;