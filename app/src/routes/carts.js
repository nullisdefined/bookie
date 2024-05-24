const express = require('express');
const router = express();

router.use(express.json());

const addCartHandler = (req, res) => {

};
const getCartItemsHandler = (req, res) => {

};
const deleteCartItemsHandler = (req, res) => {

};

router.post('/',
    addCartHandler
);
router.get('/',
    getCartItemsHandler
);
router.delete('/:bookId',
    deleteCartItemsHandler
)

module.exports = router;