const Like = require('../models/like.model.js');
const Photo = require('../models/photo.model.js');

// hàm tạo lượt yêu thích
const postLike = async (req, res) => {
    try{
        const accountId = req.user.id;
        const { photo } = req.body;

        if(!accountId){
            return res.status(400).json({
                message: 'Bạn chưa đăng nhập !'
            });
        }

        // kiểm tra ảnh có tồn tại
        const photoExist = await Photo.findById(photo);
        if (!photoExist) {
            return res.status(404).json({
                success: false,
                message: "Ảnh không tồn tại !"
            });
        }

        // kiểm tra xem đã like chưa
        const existed = await Like.findOne({ photo, account: accountId });
        if (existed) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã yêu thích ảnh này rồi!"
            });
        }

        // tạo lượt thích mới
        const newLike = new Like({ 
            photo, 
            account: accountId 
        });

        await newLike.save();

        // Thêm vào mảng likes trong Photo
        await Photo.findByIdAndUpdate(photo, {
            $addToSet: { likes: accountId },
        });

        return res.status(200).json({
            success: true,
            message: "Đã yêu thích ảnh !"
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi khi thực hiện yêu thích ảnh, vui lòng kiểm tra lại server !",
            error
        });
        console.log(error);
    }
};

// hàm gỡ bỏ yêu thích ảnh
const removeLike = async (req, res) => {
    try{
        const accountId = req.user.id;
        const { photo } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!photo || !accountId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin: photo hoặc accountId!",
            });
        }

        
        // Kiểm tra ảnh có tồn tại không
        const photoExist = await Photo.findById(photo);
        if (!photoExist) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy ảnh!",
            });
        }

        // Gỡ bỏ like từ bảng Like
        await Like.findOneAndDelete({ photo, account: accountId });

        // Gỡ bỏ accountId khỏi mảng likes trong Photo
        await Photo.findByIdAndUpdate(photo, {
            $pull: { likes: accountId },
        });

        return res.status(200).json({
            success: true,
            message: "Đã gỡ bỏ yêu thích ảnh !"
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi gỡ bỏ yêu thích ảnh, vui lòng kiểm tra lại server !",
            error
        });
        console.log(error);
    }
};

// hàm lấy danh sách yêu thích ảnh
const allLike = async (req, res) => {
    try{
        const likes = await Like.find().populate("photo").populate("account");
        if(!likes){
            return res.status(404).json({
                success: false,
                message: "Danh sách rỗng !"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách ảnh yêu thích thành công !",
            likes
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi danh sách ảnh yêu thích, vui lòng kiểm tra lại server !",
            error
        });
        console.log(error);
    }
};
// hàm lấy thông tin chi tiết yêu thích ảnh
const detailLike = async (req, res) => {
    try{
        const like = await Like.findById(req.params.id).populate("photo").populate("account");
        if(!like){
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy ảnh yêu thích !"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin chi tiết ảnh yêu thích thành công !",
            like
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi lấy thông tin chi tiết ảnh yêu thích, vui lòng kiểm tra lại server !",
            error
        });
        console.log(error);
    }
};
module.exports = {
    postLike,
    removeLike,
    allLike,
    detailLike
};