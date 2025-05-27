const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true }, // tham chiếu đến khóa chính photoModel
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // tham chiếu đến khóa chính accountModel
  content: { type: String, required: true }, // chủ đề
  createdAt: { type: Date, default: Date.now }, // thời gian tạo
});

module.exports = mongoose.model('Comment', commentSchema);
