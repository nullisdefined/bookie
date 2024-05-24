const express = require('express');
// const { body, param, validationResult } = require('express-validator');
const userController = require('../controllers/userController');

const router = express.Router();
router.use(express.json());

router.post('/join', userController.hashPassword, userController.joinHandler);
router.post('/login', userController.loginHandler);
router.post('/logout', userController.logoutHandler);
router.post('/reset', userController.authenticateToken, userController.pwdResetReqHandler);
router.put('/reset', userController.pwdReset);

module.exports = router;