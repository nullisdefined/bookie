const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authToken');

const router = express();
router.use(express.json());

router.get('/', authMiddleware.authenticateToken, categoryController.getAllCategoriesHandler);

module.exports = router;