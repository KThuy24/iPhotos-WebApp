const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const likeSchema = new mongoose.Schema({
  photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true }, // tham chiếu đến photoModel
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // tham chiếu đến accountModel
  createdAt: { type: Date, default: Date.now }, // thời gian tạo
});

likeSchema.index({ photo: 1, account: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
