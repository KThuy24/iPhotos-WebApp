const express = require('express');
const cors = require('cors');
const connectDB = require("./src/config/database.js"); 
const bodyParser = require("body-parser"); 
const cookieParser = require("cookie-parser"); 
const authRouter = require('./src/routers/auth.router.js');
//--------------------------------------------------------------//
require('dotenv').config();
connectDB(); // chạy function kết nối mongoosedb trong config

const app = express();
//Cấu hình cors
app.use(cors({
    origin: "http://localhost:3000", // Cho phép React frontend (localhost:3000) gọi API
    methods: ["GET", "POST", "PUT", "DELETE"], // Cho phép các phương thức HTTP
    credentials: true, // Nếu cần gửi cookie hoặc token
  })
);
//--------------------------------------------------------------//
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
//-----------------------------ROUTER---------------------------------//
app.use('/api/auth', authRouter);
//--------------------------------------------------------------//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Máy chủ đang chạy ở cổng ${PORT}`));