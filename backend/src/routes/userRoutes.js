const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/pre-register', userController.preRegister);
router.post('/verify-code', userController.verifyCode);

module.exports = router;
