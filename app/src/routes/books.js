const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authToken');

const router = express();
router.use(express.json());

router.get('/', authMiddleware.authenticateToken, bookController.getAllBooksHandler);
router.get('/:id', authMiddleware.authenticateToken, bookController.getBookHandler);

module.exports = router;