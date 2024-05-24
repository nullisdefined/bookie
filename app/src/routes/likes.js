const express = require('express');
const router = express();

router.use(express.json());

const toggleLikeHandler = (req, res) => {

}; 

router.post('/:bookId',
    toggleLikeHandler
);
router.delete('/:bookId',
    toggleLikeHandler
);


module.exports = router;