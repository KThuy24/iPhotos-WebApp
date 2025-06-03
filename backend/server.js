const express = require('express');
const cors = require('cors');
const connectDB = require("./src/config/database.js"); 
const bodyParser = require("body-parser"); 
const cookieParser = require("cookie-parser"); 
const accountRouter = require('./src/routers/account.router.js');
const photoRouter = require('./src/routers/photo.router.js');
const albumRouter = require('./src/routers/album.router.js');
const commentRouter = require('./src/routers/comment.router.js');
const likeRouter = require('./src/routers/like.router.js');
//--------------------------------------------------------------//
require('dotenv').config();
connectDB(); // chạy function kết nối mongoosedb trong config

const app = express();
//--------------------------------------------------------------//
//Cấu hình cors
app.use(cors({
  origin: "http://localhost:3000", // Cho phép React frontend (localhost:3000) gọi API
  methods: ["GET", "POST", "PUT", "DELETE"], // Cho phép các phương thức HTTP
  credentials: true, // Nếu cần gửi cookie hoặc token
})
);
//--------------------------------------------------------------//
app.use((req, res, next) => {
  res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; img-src https://example.com; script-src 'self' 'unsafe-inline' https://apis.google.com"
  );
  next();
});
//--------------------------------------------------------------//
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); 
//-----------------------------ROUTER---------------------------------//
app.use('/api/auth', accountRouter);
app.use('/api/photo', photoRouter);
app.use('/api/album', albumRouter);
app.use('/api/comment', commentRouter);
app.use('/api/like', likeRouter);
//--------------------------------------------------------------//
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Máy chủ đang chạy ở cổng ${PORT}`));