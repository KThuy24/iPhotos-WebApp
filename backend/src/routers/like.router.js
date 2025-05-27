const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware'); 

// router
router.post('/my-favorite', authenticate, likeController.postLike);
router.post('/not-favorite', authenticate, likeController.removeLike);
router.get('/list', likeController.allLike);
router.get('/detail/:id', likeController.detailLike);

module.exports = router;