const cloudinary = require('cloudinary').v2; // Nhập Cloudinary
const dotenv = require('dotenv'); // Nhập dotenv

dotenv.config(); // Tải biến môi trường từ tệp .env

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = cloudinary; // Xuất Cloudinary