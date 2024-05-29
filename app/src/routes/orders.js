const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authToken');

const router = express();

router.use(express.json());

router.post('/', authMiddleware.authenticateToken, orderController.orderHandler);
router.get('/', authMiddleware.authenticateToken, orderController.getOrdersHandler);
router.get('/:orderId', authMiddleware.authenticateToken, orderController.getOrderDetailHandler);

module.exports = router;