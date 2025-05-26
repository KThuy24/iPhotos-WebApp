const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const accountSchema = new mongoose.Schema({
    fullname: { type: String, required: true }, // họ và tên
    email: { type: String, unique: true, required: true }, // email
    username: { type: String, unique: true, required: true }, // tên đăng nhập
    password: { type: String, required: true }, // mật khẩu
    avatar: { type: String }, // ảnh đại diện,
    role: { type: String, enum:['admin', 'user'], default: 'user'}, // quyền hạn
    activation: { type: Number, default: 1}, // kích hoạt
    createdAt:{ type: Date, default: Date.now } // thời gian tạo
});

module.exports = mongoose.model("accountModel", accountSchema);