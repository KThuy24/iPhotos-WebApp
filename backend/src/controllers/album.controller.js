const Album = require('../models/album.model.js');
const Photo = require('../models/photo.model.js');

// hàm tạo album
const createAlbum = async (req, res) => {
    try{
        const accountId = req.user.id; // Lấy từ middleware auth
        const { title, description, coverPhoto, photos, visibility} = req.body;
        // kiểm tra đã xác thực hay chưa
        if(!accountId) {
            return res.status(401).json({ 
                success: false,
                message: "Bạn chưa đăng nhập !" 
            });
        }
        // kiểm tra thông tin nhập
        if(!title){
            return res.status(404).json({ 
                success: false,
                message: "Vui lòng nhập tiêu đề !" 
            });
        }
        // tạo album mới
        const newAlbum = new Album({
            account: accountId,
            title: title,
            description: description,
            visibility: visibility || 'công khai',
            coverPhoto: coverPhoto || null,
            photos: photos || [],
        });

        await newAlbum.save();

        return res.status(200).json({
            success: true,
            message: "Tạo album mới thành công !",
            album: newAlbum
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi tạo album, vui lòng kiểm tra lại Server !", error
        });
        console.log(error);
    }
};

// hàm cập nhật thông tin album
const updateAlbum = async (req, res) => {
    try{
        const albumId = req.params.id;
        const { title, description, visibility } = req.body;
        // Kiểm tra albumId có hợp lệ hay không
        if (!albumId) {
            return res.status(400).json({
            success: false,
            message: "Thiếu ID album!",
            });
        }

        // Kiểm tra album có tồn tại
        const existingAlbum = await Album.findById(albumId);
        if (!existingAlbum) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy album cần sửa !",
            });
        }

        // Cập nhật album
        const updatedAlbum = await Album.findByIdAndUpdate(
            albumId,
            {
                ...(title && { title }),
                ...(description && { description }),
                ...(visibility && { visibility }),
            },
            { new: true }
        );

        // trả về kết quả
        return res.status(200).json({
            success: true,
            message: "Cập nhật album thành công!",
            data: updatedAlbum,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi cập nhật thông tin album, vui lòng kiểm tra lại Server !", error
        });
        console.log(error);
    }
};

// hàm xóa album
const deleteAlbum = async (req, res) => {
    try{
        const albumId = req.params.id;
        // Kiểm tra albumId có hợp lệ hay không
        if (!albumId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu ID album cần xoá!",
            });
        }

        // Kiểm tra album có tồn tại
        const album = await Album.findById(albumId);
        if (!album) {
            return res.status(404).json({
                success: false,
                message: "Album không tồn tại!",
            });
        }

        // Gỡ liên kết ảnh (xóa albumId khỏi mảng albums của mỗi ảnh)
        await Promise.all(
            album.photos.map((photoId) =>
            Photo.findByIdAndUpdate(photoId, {
                $pull: { albums: albumId },
            })
            )
        );

        await Album.findByIdAndDelete(albumId);

        return res.status(200).json({
            success: true,
            message: "Xoá album thành công!",
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi xóa album, vui lòng kiểm tra lại Server !", error
        });
        console.log(error);
    }
};

// hàm thêm ảnh vào album
const addPhotoToAlbum = async (req, res) => {
    try{
        const { photoId, albumId } = req.body;
        // kiểm tra dữ liệu đầu vào
        if (!photoId || !albumId) {
            return res.status(400).json({
              success: false,
              message: "Thiếu thông tin: photoId hoặc albumId!",
            });
        }
        // kiểm tra sự tồn tại của ảnh và album
        const [photo, album] = await Promise.all([
            Photo.findById(photoId),
            Album.findById(albumId),
        ]);

        if (!photo) {
            return res.status(404).json({
              success: false,
              message: "Không tìm thấy ảnh!",
            });
        }
      
        if (!album) {
            return res.status(404).json({
              success: false,
              message: "Không tìm thấy album!",
            });
        }

        const updateAlbum = {
            $addToSet: { photos: photoId },
        };

        // nếu album chưa có ảnh nào thì sẽ gán ảnh đại diện là ảnh đầu tiên được thêm vào
        if (!album.photos || album.photos.length === 0) {
            updateAlbum.coverPhoto = photoId;
        }

        // cập nhật album và photo nếu hợp lệ
        await Promise.all([
            Album.findByIdAndUpdate(albumId, updateAlbum),
            Photo.findByIdAndUpdate(photoId, {
                $addToSet: { albums: albumId },
            }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Thêm ảnh vào album thành công!",
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi thêm ảnh vào album, vui lòng kiểm tra lại Server !", error
        });
        console.log(error);
    }
};

// hàm gỡ ảnh ra khỏi album
const removePhotoFromAlbum = async (req, res) => {
    try{
        const { photoId, albumId } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!photoId || !albumId) {
            return res.status(400).json({
            success: false,
            message: "Thiếu thông tin: photoId hoặc albumId!",
            });
        }
        // Kiểm tra sự tồn tại
        const [photo, album] = await Promise.all([
            Photo.findById(photoId),
            Album.findById(albumId),
        ]);
    
        if (!photo) {
            return res.status(404).json({
            success: false,
            message: "Không tìm thấy ảnh!",
            });
        }
    
        if (!album) {
            return res.status(404).json({
            success: false,
            message: "Không tìm thấy album!",
            });
        }
    
        // Gỡ liên kết 2 chiều
        await Promise.all([
            Album.findByIdAndUpdate(albumId, { $pull: { photos: photoId } }),
            Photo.findByIdAndUpdate(photoId, { $pull: { albums: albumId } }),
        ]);

        // lấy album sau cập nhật để xử lý coverPhoto
        const updatedAlbum = await Album.findById(albumId);
        // nếu ảnh bị gỡ là coverPhoto thì sẽ thực hiện cập nhật lại coverPhoto
        if (updatedAlbum.coverPhoto?.toString() === photoId) {
            const newCoverPhoto = updatedAlbum.photos.length > 0 ? updatedAlbum.photos[0] : null;

            await Album.findByIdAndUpdate(albumId, {
                coverPhoto: newCoverPhoto,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Gỡ ảnh khỏi album thành công!",
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Lỗi gỡ ảnh ra khỏi album, vui lòng kiểm tra lại Server !", error
        });
        console.log(error);
    }
};

// hàm lấy danh sách album
const allAlbum = async (req, res) => {
    try {
        const albums = await Album.find();

        if(!albums){
            return res.status(404).json({ 
                success: false,
                message: "Danh sách album rỗng !" 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách album thành công !",
            albums
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Lỗi lấy danh sách album, vui lòng kiểm tra lại Server !", 
            error 
        });
        console.log(error);
    }
};

// hàm lấy thông tin chi tiết 1 album
const detailAlbum = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);

        if(!album){
            return res.status(404).json({ message: "Không tìm thấy album !" });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin chi tiết album thành công !",
            album
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Lỗi lấy thông tin chi tiết album, vui lòng kiểm tra lại Server !", 
            error 
        });
        console.log(error);
    }
};

module.exports = {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addPhotoToAlbum,
    removePhotoFromAlbum,
    allAlbum,
    detailAlbum
}