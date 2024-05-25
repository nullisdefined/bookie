const express = require('express');
const bookController = require('../controllers/bookController');

const router = express();
router.use(express.json());

router.get('/', bookController.authenticateToken, bookController.getAllBooksHandler);
router.get('/:id', bookController.authenticateToken, bookController.getBookHandler);

module.exports = router;