// src/App.js
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/auth/PrivateRoute.js";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Home from "./pages/Home.js";
import Login from "./components/auth/Login.js";
import Register from "./components/auth/Register.js"; // Import trang đăng ký
import Profile from "./components/Profile.js";
import ForgotPassword from "./components/auth/Forgot-password.js";
import ResetPassword from "./components/auth/Reset-password.js";

import AccountList from "./layouts/admin/AccountList.js";
import ImageList from "./layouts/admin/ImageList.js";
// import User from "./layouts/user/user.layout.js";
import AccountEdit from "./components/form/edit/AccountEdit.js";
import ImageEdit from "./components/form/edit/ImageEdit.js";
import ImageDetail from "./components/form/detail/ImageDetail.js";
import ViewDetailImage from "./components/form/detail/ViewDetailImage.js";
import TrendingPage from "./pages/TrendingPage.js";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="container flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/image/detail/:id" element={<ViewDetailImage />} />
            <Route path="/trending" element={<TrendingPage />} />
            {/* ---------- Các route yêu cầu đăng nhập ---------- */}
            <Route
              path="/my-profile/edit/:id"
              element={
                <PrivateRoute>
                  {" "}
                  <Profile />{" "}
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/accounts"
              element={
                <PrivateRoute>
                  {" "}
                  <AccountList />{" "}
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/images"
              element={
                <PrivateRoute>
                  {" "}
                  <ImageList />{" "}
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/image/edit/:id"
              element={
                <PrivateRoute>
                  {" "}
                  <ImageEdit />{" "}
                </PrivateRoute>
              }
            />
                        <Route
              path="/admin/image/detail/:id"
              element={
                <PrivateRoute>
                  {" "}
                  <ImageDetail />{" "}
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/account/edit/:id"
              element={
                <PrivateRoute>
                  <AccountEdit />
                </PrivateRoute>
              }
            />
          </Routes>
          <ToastContainer />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
