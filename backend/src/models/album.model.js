const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const albumSchema = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // tham chiếu đến khóa chính accountModel
  title: { type: String, required: true }, // tiêu đề
  description: { type: String }, // mô tả
  coverPhoto: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }, // ảnh đại diện - tham chiếu đến khóa chính photoModel
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }], // danh sách hình ảnh - tham chiếu đến khóa chính photoModel
  visibility: { type: String, enum: ['công khai', 'riêng tư'], default: 'công khai' }, // chế độ hiện thị
  createdAt: { type: Date, default: Date.now }, // thời gian tạo
});

module.exports = mongoose.model('Album', albumSchema);