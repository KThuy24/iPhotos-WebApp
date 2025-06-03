const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware'); 
const {uploadImages} = require('../middlewares/multer');

// router
router.post('/create', authenticate, uploadImages, photoController.createPhoto);
router.post('/view/:id', authenticate, photoController.increaseViewCount);
router.put('/update/:id', authenticate, uploadImages, photoController.updatePhoto);
router.delete('/delete/:id', authenticate, photoController.deletePhoto);
router.get('/list', photoController.allPhoto);
router.get('/detail/:id', photoController.detailPhoto);

module.exports = router;