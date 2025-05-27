const Photo = require('../models/photo.model.js');
const Album = require('../models/album.model.js');

// hàm tạo ảnh mới
const createPhoto = async (req, res) => {
    try {
        const accountId = req.user.id; // Lấy từ middleware auth
        const { url, description, tags, visibility, albums, likes } = req.body;
        // kiểm tra đã xác thực hay chưa
        if(!accountId) {
            return res.status(401).json({ 
                success: false,
                message: "Bạn chưa đăng nhập !" 
            });
        }
        // kiểm tra thông tin nhập
        if(!url){
            return res.status(401).json({ 
                success: false,
                message: "Vui lòng" 
            });
        }

        // thêm ảnh mới
        const newPhoto = new Photo({
            account: accountId,
            url: url,
        //   googlePhotoId: data.googlePhotoId || null,
            description: description || '',
            tags: tags || [],
            visibility: visibility || 'công khai',
            albums: [],
            likes: []
        });
        
        const photo = await newPhoto.save();

        // nếu có album thì đồng bộ
        if (photo.albums && photo.albums.length > 0) {
            await Promise.all(
                photo.albums.map((albumId) =>
                Album.findByIdAndUpdate(albumId, { $addToSet: { photos: photo._id } })
            )
            );
            await Photo.findByIdAndUpdate(photo._id, { $addToSet: { albums: { $each: photo.albums } } });
        }

        return res.status(201).json({
            success: true,
            message: 'Thêm ảnh thành công',
            photo: photo
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Lỗi thêm ảnh, vui lòng kiểm tra lại Server !", error 
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

// hàm lấy danh sách ảnh
const allPhoto = async (req, res) => {
    try {
        const photos = await Photo.find();

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
        const photo = await Photo.findById(req.params.id);

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

module.exports = {
    createPhoto,
    deletePhoto,
    allPhoto,
    detailPhoto
};