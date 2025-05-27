const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware'); 

// router
router.post('/create', authenticate, photoController.createPhoto);
router.delete('/delete/:id', authenticate, photoController.deletePhoto);
router.get('/list', photoController.allPhoto);
router.get('/detail/:id', photoController.detailPhoto);

module.exports = router;