const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express();
router.use(express.json());

router.get('/', categoryController.authenticateToken, categoryController.getAllCategoriesHandler);

module.exports = router;