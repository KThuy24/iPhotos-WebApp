const Photo = require('../models/photo.model.js');
const Album = require('../models/album.model.js');
const getDataUri = require("../config/dataUri.js");
const cloudinary = require("../config/cloudinary.js");

// hàm tạo ảnh mới
const createPhoto = async (req, res) => {
    try {
        const accountId = req.user.id; // Lấy từ middleware auth

        // Lấy các trường text từ req.body
        const { title, description, tags, visibility /*, albums, likes */ } = req.body; // Lấy title từ frontend

        // Kiểm tra file đã được upload bởi Multer hay chưa
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng chọn một file ảnh để tải lên."
            });
        }

        // kiểm tra đã xác thực hay chưa
        if (!accountId) {
            return res.status(401).json({
                success: false,
                message: "Bạn chưa đăng nhập !"
            });
        }
        // kiểm tra thông tin nhập (title)
        if (!title) { // Frontend gửi 'title', không phải 'url' trong req.body cho thông tin này
            return res.status(400).json({ // Sửa status code thành 400 Bad Request
                success: false,
                message: "Vui lòng nhập tiêu đề cho ảnh!" // Sửa message
            });
        }

        // Xử lý upload file lên Cloudinary
        const fileUri = getDataUri(req.file); // req.file được cung cấp bởi multer
        const myCloud = await cloudinary.uploader.upload(fileUri.content, {
            folder: "iphoto_uploads", // Tên thư mục trên Cloudinary (tùy chọn)
            // resource_type: "auto" // Hoặc "image"
        });

        if (!myCloud || !myCloud.secure_url) {
            return res.status(500).json({
                success: false,
                message: "Lỗi khi tải ảnh lên Cloudinary."
            });
        }
        const imageUrl = myCloud.secure_url; // URL của ảnh trên Cloudinary

        // Xử lý tags từ chuỗi JSON (frontend gửi tags dưới dạng JSON string)
        let parsedTags = [];
        if (tags) {
            try {
                parsedTags = JSON.parse(tags);
                if (!Array.isArray(parsedTags)) {
                    parsedTags = [tags]; // Nếu parse không ra mảng, coi như 1 tag
                }
            } catch (e) {
                // Nếu parse lỗi, có thể coi chuỗi đó là một tag duy nhất (tách bằng dấu phẩy nếu có)
                parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }


        // thêm ảnh mới
        const newPhoto = new Photo({
            account: accountId,
            url: [imageUrl], // Sử dụng URL từ Cloudinary
            title: title,    // Sử dụng title từ req.body
            description: description || '',
            tags: parsedTags, // Sử dụng tags đã parse
            visibility: visibility || 'công khai',
            views: 0,        // Khởi tạo views
            albums: [],      // Khởi tạo rỗng, xử lý album sau nếu cần
            likes: []        // Khởi tạo rỗng
        });

        const photo = await newPhoto.save();

        // Logic đồng bộ album (nếu có trường 'albums' được gửi từ frontend và bạn muốn xử lý ngay)
        // Hiện tại, form upload của chúng ta không gửi 'albums'
        // if (req.body.albums && Array.isArray(req.body.albums) && req.body.albums.length > 0) {
        //     await Promise.all(
        //         req.body.albums.map((albumId) =>
        //             Album.findByIdAndUpdate(albumId, { $addToSet: { photos: photo._id } })
        //         )
        //     );
        //     await Photo.findByIdAndUpdate(photo._id, { $addToSet: { albums: { $each: req.body.albums } } });
        // }

        return res.status(201).json({ // 201 Created
            success: true,
            message: 'Ảnh đã được tải lên thành công!', // Sửa message
            photo: photo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi tải ảnh lên, vui lòng kiểm tra lại Server !", // Sửa message
            error: error.message // Gửi message lỗi cụ thể hơn
        });
        console.log(error);
    }
};


// hàm cập nhật ảnh
const updatePhoto = async (req, res) => {
    try {
        const accountId = req.user.id; // Lấy từ middleware auth
        const photoId = req.params.id;
        const { title, description, tags, visibility } = req.body;

        // kiểm tra đã xác thực hay chưa
        if(!accountId) {
            return res.status(401).json({ 
                success: false,
                message: "Bạn chưa đăng nhập !" 
            });
        }

        // kiểm tra đã xác thực hay chưa
        if(!photoId) {
            return res.status(404).json({ 
                success: false,
                message: "Ảnh không tồn tại !" 
            });
        }

        const file = req.file;
        let photoUrl = null;
    
        // kiểm tra sự tồn tại
        const existingPhoto = await Photo.findById(photoId);
        if (!existingPhoto) {
            return res.status(404).json({ message: "Ảnh không tồn tại!" });
        }

        if (file) {
            const fileUri = getDataUri(file);
      
            // Xóa ảnh cũ nếu có
            const oldPhoto = existingPhoto.url?.[0];
            if (oldPhoto) {
              const publicId = oldPhoto.split('/').pop().split('.')[0];
              await cloudinary.uploader.destroy(`${publicId}`);
            }
      
            // Upload ảnh mới
            const uploadResponse = await cloudinary.uploader.upload(fileUri.content);
            if (uploadResponse) {
                photoUrl = uploadResponse.secure_url;
            }
        }
      
        const updatedPhoto = photoUrl ? [photoUrl] : existingPhoto.url;
        
        // cập nhật thông tin tài khoản
        const data = await Photo.findByIdAndUpdate(
            photoId,
            {
                title,
                description,
                tags,
                visibility,
                url: updatedPhoto,
            },
            { new: true }
        );
    
        // trả về kết quả
        return res.status(200).json({
            message: "Cập nhật ảnh thành công !",
            data
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Lỗi cập nhật ảnh, vui lòng kiểm tra lại Server !", error 
        });
        console.log(error);
    }
};

// hàm xóa ảnh
const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Ảnh không tồn tại!",
            });
        }
        
        // Nếu có album chứa ảnh thì pull ra
        if (photo.albums && photo.albums.length > 0) {
            await Promise.all(
            photo.albums.map((albumId) =>
                Album.findByIdAndUpdate(albumId, {
                $pull: { photos: photo },
                })
            )
            );
        }

        await Photo.findByIdAndDelete(req.params.id);

        return res.status(200).json({ 
            success: true,
            message: 'Xóa ảnh thành công' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Lỗi xóa ảnh, vui lòng kiểm tra lại Server !", 
            error 
        });
        console.log(error);
    }
};

// hàm xử lý tăng lượt xem khi click vào xem chi tiết hình ảnh
const increaseViewCount = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ message: 'Không tìm thấy ảnh' });

        // Cập nhật view (giả sử kiểu số)
        const updated = await Photo.findByIdAndUpdate(req.params.id, {
        views: photo.views + 1
        }, { new: true });

        res.status(200).json({ message: 'Đã tăng 1 lượt xem', photo: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi tăng lượt xem",
            error
        });
    }
};

// hàm lấy danh sách ảnh
const allPhoto = async (req, res) => {
    try {
        const photos = await Photo.find()
        .populate('account','fullname avatar email username')
        .populate('albums');

        if(!photos){
            return res.status(404).json({ 
                success: false,
                message: "Danh sách ảnh rỗng !" 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách ảnh thành công !",
            photos
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Lỗi lấy danh sách ảnh, vui lòng kiểm tra lại Server !", 
            error 
        });
        console.log(error);
    }
};

// hàm lấy thông tin chi tiết 1 ảnh
const detailPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)
        .populate('account','fullname avatar')
        .populate('albums');;

        if(!photo){
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy ảnh !" 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin chi tiết ảnh thành công !",
            photo
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Lỗi lấy danh sách ảnh, vui lòng kiểm tra lại Server !", 
            error
        });
        console.log(error);
    }
};

const myPhotosHandler = async (req, res) => {
    try {
        const accountId = req.user.id; 
        if (!accountId) {
            return res.status(401).json({ success: false, message: "Yêu cầu xác thực." });
        }

        const photos = await Photo.find({ account: accountId })
                                .sort({ createdAt: -1 }) // Sắp xếp ảnh mới nhất lên đầu
                                .populate('account', 'fullname username avatar') // Populate thông tin người dùng                             

        return res.status(200).json({
            success: true,
            message: "Lấy ảnh của bạn thành công.",
            photos: photos // Trả về mảng các đối tượng ảnh
        });

    } catch (error) {
        console.error("Error fetching user photos:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi lấy ảnh của bạn.",
            error: error.message
        });
    }
};



module.exports = {
    createPhoto,
    updatePhoto,
    deletePhoto,
    increaseViewCount,
    allPhoto,
    detailPhoto,
    myPhotosHandler 
};