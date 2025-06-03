const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const photoSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // tham chiếu đến khóa chính accountModel
    url: { type: [String], required: true }, // địa chỉ ảnh
    title: { type: String }, // tiêu đề
    description: { type: String }, // mô tả
    tags: { type: [String] }, // thẻ
    visibility: { type: String, enum: ['công khai', 'riêng tư'], default: 'công khai' }, // chế độ hiện thị
    views: { type: Number }, // lượt xem
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }], // danh sách album - tham chiếu đến khóa chỉnh albumModel
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }], // danh sách người yêu thích ảnh - tham chiếu đến khóa chỉnh likeModel
    createdAt: { type: Date, default: Date.now }, // thời gian tạo
});
  
module.exports = mongoose.model('Photo', photoSchema);