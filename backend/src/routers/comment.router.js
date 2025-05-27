const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// router
router.post('/create', authenticate, commentController.createComment);
router.put('/update/:id', authenticate, commentController.updateComment);
router.delete('/delete/:id', authenticate, commentController.deleteComment);
router.get('/list', authenticate, commentController.allComment);
router.get('/detail/:id', authenticate, commentController.detailComment);

module.exports = router;