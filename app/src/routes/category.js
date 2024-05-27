const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express();
router.use(express.json());

router.get('/', authMiddleware.authenticateToken, categoryController.getAllCategoriesHandler);

module.exports = router;