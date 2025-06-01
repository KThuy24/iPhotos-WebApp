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
        // const newPhoto = new Photo({
        //     account: accountId,
        //     url: url,
        // //   googlePhotoId: data.googlePhotoId || null,
        //     description: description || '',
        //     tags: tags || [],
        //     visibility: visibility || 'công khai',
        //     albums: [],
        //     likes: []
        // });
        
        // const photo = await newPhoto.save();

        // // nếu có album thì đồng bộ
        // if (photo.albums && photo.albums.length > 0) {
        //     await Promise.all(
        //         photo.albums.map((albumId) =>
        //         Album.findByIdAndUpdate(albumId, { $addToSet: { photos: photo._id } })
        //     )
        //     );
        //     await Photo.findByIdAndUpdate(photo._id, { $addToSet: { albums: { $each: photo.albums } } });
        // }

        // return res.status(201).json({
        //     success: true,
        //     message: 'Thêm ảnh thành công',
        //     photo: photo
        // });
        const newPhoto = new Photo({
            account: accountId,
            url: url,
            description: description || '',
            tags: tags || [],
            visibility: visibility || 'công khai',
            albums: albumIdsFromRequest || [], // Gán album IDs từ request
            // likes, views, comments sẽ được khởi tạo mặc định trong model hoặc không có ban đầu
        });

        let savedPhoto = await newPhoto.save();

        // Nếu có album IDs được cung cấp, cập nhật các album đó
        if (albumIdsFromRequest && albumIdsFromRequest.length > 0) {
            await Promise.all(
                albumIdsFromRequest.map((albumId) =>
                    Album.findByIdAndUpdate(albumId, { $addToSet: { photos: savedPhoto._id } })
                )
            );
        }

        // Populate thông tin account để trả về cho client nếu cần
        savedPhoto = await Photo.findById(savedPhoto._id).populate('account', 'username avatar fullname');

        return res.status(201).json({
            success: true,
            message: 'Thêm ảnh thành công',
            photo: savedPhoto
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
// const allPhoto = async (req, res) => {
//     try {
//         const photos = await Photo.find();

//         if(!photos){
//             return res.status(404).json({ 
//                 success: false,
//                 message: "Danh sách ảnh rỗng !" 
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Lấy danh sách ảnh thành công !",
//             photos
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false,
//             message: "Lỗi lấy danh sách ảnh, vui lòng kiểm tra lại Server !", 
//             error 
//         });
//         console.log(error);
//     }
// };
const allPhoto = async (req, res) => {
    try {
        // lấy 20 ảnh mỗi trang, trang hiện tại từ query param 'page'
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const photos = await Photo.find()
                                  .sort({ createdAt: -1 }) // Ảnh mới nhất lên đầu
                                  .populate('account', 'username avatar fullname role') // Lấy các trường cần thiết từ Account
                                  .skip(skip)
                                  .limit(limit);

        const totalPhotos = await Photo.countDocuments(); // Để frontend biết tổng số ảnh cho phân trang

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách ảnh thành công !",
            photos, // photos sẽ có trường account là object { _id, username, avatar, fullname, role }
            totalPages: Math.ceil(totalPhotos / limit),
            currentPage: page,
            totalResults: totalPhotos
        });
    } catch (error) {
        console.error("Error in allPhoto:", error); // Log lỗi chi tiết hơn
        res.status(500).json({
            success: false,
            message: "Lỗi lấy danh sách ảnh, vui lòng kiểm tra lại Server !",
            error: error.message // Trả về message của lỗi
        });
    }
};

// hàm lấy thông tin chi tiết 1 ảnh
// const detailPhoto = async (req, res) => {
//     try {
//         const photo = await Photo.findById(req.params.id);

//         if(!photo){
//             return res.status(404).json({ 
//                 success: false,
//                 message: "Không tìm thấy ảnh !" 
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Lấy thông tin chi tiết ảnh thành công !",
//             photo
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false,
//             message: "Lỗi lấy danh sách ảnh, vui lòng kiểm tra lại Server !", 
//             error
//         });
//         console.log(error);
//     }
// };

// photo.controller.js
const detailPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)
                                 .populate('account', 'username avatar fullname role')
                                 .populate('albums', 'title') // Lấy title của các album

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy ảnh !"
            });
        }

        // tăng số lượt xem ở đây
        photo.views = (photo.views || 0) + 1;
        await photo.save();


        return res.status(200).json({
            success: true,
            message: "Lấy thông tin chi tiết ảnh thành công !",
            photo
        });
    } catch (error) {
        console.error("Error in detailPhoto:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi lấy thông tin chi tiết ảnh, vui lòng kiểm tra lại Server !", // Sửa lỗi chính tả
            error: error.message
        });
    }
};

//xu hướng ảnh
const trendingPhotos = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5; // Lấy 5 ảnh trending mặc định
        const photos = await Photo.find({ visibility: 'công khai' }) // Chỉ lấy ảnh công khai
                                  .sort({ views: -1, createdAt: -1 }) // Sắp xếp theo lượt xem, rồi đến ngày tạo
                                  .limit(limit)
                                  .populate('account', 'username avatar fullname'); // Lấy thông tin người đăng

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách ảnh trending thành công !",
            photos
        });
    } catch (error) {
        console.error("Error in trendingPhotos:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi lấy ảnh trending!",
            error: error.message
        });
    }
};



module.exports = {
    createPhoto,
    deletePhoto,
    allPhoto,
    detailPhoto,
    trendingPhotos
};