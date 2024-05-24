const express = require('express');
const router = express();

router.use(express.json());

const getAllBooksHandler = (req, res) => {

};
const getBookHandler = (req, res) => {

};
const getBooksByCategoryHandler = (req, res) => {

};

router.get('/books',
    getAllBooksHandler
);
router.get('/books/:id',
    getBookHandler
);
router.get('/books',
    getBooksByCategoryHandler
)

module.exports = router;