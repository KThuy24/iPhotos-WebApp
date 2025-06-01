const Photo =  require('../models/photo.model');
const Comment =  require('../models/comment.model');

// hàm tạo bình luận
const createComment = async (req, res) => {
    try{
        const accountId = req.user.id; // lấy từ middleware auth
        const { photo, content } = req.body;
        
        if(!accountId){
            return res.status(401).json({
                success: false,
                message: "Bạn chưa đăng nhập !"
            })
        }

        const photoId = await Photo.findById(photo);
        if(!photoId){
            return res.status(404).json({
                success: false,
                message: "Ảnh không tồn tại !"
            })
        }

        if(!content){
            return res.status(404).json({
                success: false,
                message: "Vui lòng nhập nội dung !"
            })
        }
        
        const newComment = new Comment({
            account: accountId,
            photo: photoId,
            content: content
        });

        await newComment.save();
    const populatedComment = await Comment.findById(newComment._id)
                                          .populate("account", "username avatar fullname");

    return res.status(200).json({
        success: true,
        message: "Gửi bình luận thành công !",
        comment: populatedComment // Trả về comment đã được populate
    })
        // return res.status(200).json({
        //     success: true,
        //     message: "Gửi bình luận thành công !",
        //     comment: newComment
        // })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi khi thực hiện bình luận, vui lòng kiểm tra lại server !",
            error
        });
        console.log(error);
    }
};

// hàm cập nhật thông tin bình luận
const updateComment = async (req, res) => {
    try{
        const commentId = req.params.id;
        const { content } = req.body;
        // kiểm tra commentId có hợp lệ hay không
        if (!commentId) {
            return res.status(400).json({
            success: false,
            message: "Thiếu ID album!",
            });
        }

        // Kiểm tra bình luận có tồn tại
        const existingComment = await Comment.findById(commentId);
        if (!existingComment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bình luận cần sửa !",
            });
        }

        // cập nhật bình luận
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                ...(content && { content }),
            },
            { new: true }
        );

        // trả về kết quả
        return res.status(200).json({
            success: true,
            message: "Cập nhật bình luận thành công!",
            data: updatedComment,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi cập nhật thông tin bình luận, vui lòng kiểm tra lại server !",
            error
        });
        console.log(error);
    }
};

// hàm xóa bình luận
const deleteComment = async (req, res) => {
    try{
        const commentId = req.params.id;
         // Kiểm tra commentId có hợp lệ hay không
         if (!commentId) {
            return res.status(400).json({
                success: false,
                message: "Không tìm thấy bình luận cần xoá!",
            });
        }

        // Kiểm tra album có tồn tại
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Bình luận không tồn tại!",
            });
        }

        // thực hiện xóa bình luận
        await Comment.findByIdAndDelete(commentId);

        // trả về kết quả
        return res.status(200).json({
            success: true,
            message: "Xoá bình luận thành công!",
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi xóa bình luận, vui lòng kiểm tra lại server !",
            error
        });
        console.log(error);
    }
};

// hàm lấy danh sách bình luận
const allComment = async (req, res) => {
    try {
        // Có thể bạn muốn lấy comment cho một photo cụ thể
        const photoId = req.query.photoId;
        let query = {};
        if (photoId) {
            query.photo = photoId;
        }

        const comments = await Comment.find(query)
                                      .sort({ createdAt: -1 }) // Comment mới nhất lên đầu
                                      .populate("account", "username avatar fullname")
                                      .populate("photo", "title"); // Chỉ lấy title của photo liên quan


        return res.status(200).json({
            success: true,
            message: "Lấy danh sách bình luận thành công !",
            comments
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi lấy danh sách bình luận, vui lòng kiểm tra lại server !",
            error
        });
        console.log(error);
    }
};

// hàm lấy thông tin chi tiết bình luận
const detailComment = async (req, res) => {
    try{
        const comment = await Comment.findById(req.params.id).populate("account").populate("photo");

        if(!comment){
            return res.status(404).json({
                success: false,
                message: "Bình luận không tồn tại !"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin chi tiết bình luận thành công !",
            comment
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi lấy thông tin chi tiết bình luận, vui lòng kiểm tra lại server !",
            error
        });
        console.log(error);
    }
};
module.exports = {
    createComment,
    updateComment,
    deleteComment,
    allComment,
    detailComment
}