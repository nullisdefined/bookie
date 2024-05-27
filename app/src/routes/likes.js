const express = require('express');
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express();

router.use(express.json());

router.post('/:liked_book_id', authMiddleware.authenticateToken, likeController.addLikeHandler);
router.delete('/:liked_book_id', authMiddleware.authenticateToken, likeController.deleteLikeHandler);

module.exports = router;