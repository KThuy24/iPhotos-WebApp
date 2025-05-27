const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// router
router.post('/create', authenticate, albumController.createAlbum);
router.put('/update/:id', authenticate, albumController.updateAlbum);
router.delete('/delete/:id', authenticate, albumController.deleteAlbum);
router.post('/add', authenticate, albumController.addPhotoToAlbum);
router.post('/remove', authenticate, albumController.removePhotoFromAlbum);
router.get('/list', authenticate, albumController.allAlbum);
router.get('/detail/:id', authenticate, albumController.detailAlbum);

module.exports = router;