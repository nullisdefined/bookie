const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authToken');

const router = express();
router.use(express.json());

router.post('/',authMiddleware.authenticateToken, cartController.addToCartHandler);
router.get('/', authMiddleware.authenticateToken, cartController.getCartItemsHandler);
router.delete('/:id', authMiddleware.authenticateToken, cartController.deleteCartItemsHandler);

module.exports = router;