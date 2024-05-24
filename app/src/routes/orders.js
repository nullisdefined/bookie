const express = require('express');
const router = express();

router.use(express.json());

const orderHandler = (req, res) => {

};
const getOrdersHandler = (req, res) => {

};
const getOrderByOrderIdHandler = (req, res) => {

};

router.post('/',
    orderHandler
);
router.get('/',
    getOrdersHandler
);
router.get('/:orderId',
    getOrderByOrderIdHandler
)

module.exports = router;