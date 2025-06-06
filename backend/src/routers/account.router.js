const express = require('express');
const router = express.Router();
const authController = require('../controllers/account.controller');
const {uploadImageProfile} = require('../middlewares/multer');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
// router
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.put('/update/:id', authenticate, uploadImageProfile, authController.updateAccount);
router.delete('/delete/:id', authenticate, authorize(['admin']), authController.deleteAccount);
router.get('/list', authController.allAccount);
router.get('/detail/:id', authController.detailAccount);

module.exports = router;