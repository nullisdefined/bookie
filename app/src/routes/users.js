const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authToken');

const router = express.Router();
router.use(express.json());

router.post('/join', userController.hashPassword, userController.joinHandler);
router.post('/login', userController.loginHandler);
router.post('/logout', userController.logoutHandler);
router.post('/reset', authMiddleware.authenticateToken, userController.pwdResetReqHandler);
router.put('/reset', userController.pwdReset);

module.exports = router;