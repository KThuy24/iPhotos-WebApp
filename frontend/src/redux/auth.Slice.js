import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState:{
    account: null,
    allAccount: null,
    detailAccount: null,
    isAuthenticated: false,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    //--------LOADING--------//
    Loading_Auth: (state) => {
      state.loading = true;
    },
    //--------UPDATE NEW ACCOUNT--------//
    SetAccount_Success:  (state, action) => {
      state.loading = false;
      state.success = true;
      state.account = action.payload;
    },
    //--------DELETE ACCOUNT--------//
    DeleteAccount_Success:  (state) => {
      state.loading = false;
      state.success = true;
      state.account = null;
      state.isAuthenticated = false;
    },
    //--------ALL ACCOUNT--------//
    GetAllAccount_Success:  (state,action) => {
      state.loading = false;
      state.success = true;
      state.allAccount = action.payload;
    },
    //--------DETAIL ACCOUNT--------//
    GetDetailAccount_Success:  (state,action) => {
      state.detailAccount = null;
      state.loading = false;
      state.success = true;
      state.detailAccount = action.payload;
    },
    //--------LOGIN--------//
    Login_Success: (state, action) => {
      state.loading = false;
      state.success = true;
      state.account = action.payload;
      state.isAuthenticated = true;
    },
    //--------REGISTER--------//
    Register_Success: (state) => {
      state.loading = false;
      state.success = true;
    },
    //--------LOGOUT--------//
    Logout_Success: (state) => {
      state.loading = false;
      state.account = null;
      state.isAuthenticated = false;
    },
    //--------FORGOT--------//
    Forgot_Success: (state) => {
      state.loading = false;
      state.success = true;
    },
    //--------RESET--------//
    Reset_Success: (state) => {
      state.loading = false;
      state.success = true;
    },
    //--------FAILED--------//
    Failed_Auth: (state,action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    }
  },
});

export const {
  Loading_Auth,
  SetAccount_Success,
  DeleteAccount_Success,
  GetAllAccount_Success,
  GetDetailAccount_Success,
  Login_Success,
  Register_Success,
  Logout_Success,
  Forgot_Success,
  Reset_Success,
  Failed_Auth,
} = authSlice.actions;

export default authSlice.reducer;