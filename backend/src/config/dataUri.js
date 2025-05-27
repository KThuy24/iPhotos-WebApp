const DataUriParser  = require('datauri/parser.js'); // Nhập DataUriParser
const path = require('path'); // Nhập path

// Chuyển file thành 1 chuỗi data URL
const getDataUri = (file) => {
    const parser = new DataUriParser (); // Khởi tạo đối tượng
    const extName = path.extname(file.originalname).toString(); // Lấy tiện ích mở rộng
    return parser.format(extName, file.buffer); // Chuyển file thành data URL
    // data:image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...
};

module.exports = getDataUri; // Xuất hàm