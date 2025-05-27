const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const photoSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // tham chiếu đến khóa chính accountModel
    url: { type: String, required: true }, // địa chỉ ảnh
    description: { type: String }, // mô tả
    tags: { type: [String] }, // thẻ
    visibility: { type: String, enum: ['công khai', 'riêng tư'], default: 'công khai' }, // chế độ hiện thị
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }], // danh sách album - tham chiếu đến khóa chỉnh albumModel
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }], // danh sách người yêu thích ảnh - tham chiếu đến khóa chỉnh accountModel
    createdAt: { type: Date, default: Date.now }, // thời gian tạo
});
  
module.exports = mongoose.model('Photo', photoSchema);