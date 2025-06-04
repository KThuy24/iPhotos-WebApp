const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ
const storage = multer.memoryStorage(); // Sử dụng bộ nhớ để lưu trữ tạm thời

// Tạo middleware Multer
const uploadImageProfile = multer({ storage }).single('avatar');
const uploadImages = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh!'), false);
        }
    }
}).single('imageFile'); 

module.exports = { uploadImageProfile, uploadImages };