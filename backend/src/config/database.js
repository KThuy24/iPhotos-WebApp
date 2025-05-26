const mongoose = require("mongoose");

// hàm kết nối dữ liệu khi chạy
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Kết nối mongoose thành công ");
  } catch (error) {
    console.error(`Error: ${error.message}`); // báo lỗi
    process.exit(1); // thoát
  }
};

module.exports = connectDB;