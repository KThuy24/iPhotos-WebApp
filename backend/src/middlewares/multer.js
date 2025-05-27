const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ
const storage = multer.memoryStorage(); // Sử dụng bộ nhớ để lưu trữ tạm thời

// Tạo middleware Multer
const uploadImageProfile = multer({ storage }).single('avatar');

module.exports = {uploadImageProfile};