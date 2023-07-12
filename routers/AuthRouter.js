const express = require('express');
const {Router} = express;
const router = new Router();

const {authValidator} = require('../middlewares/Validators');
const {
  register,
  login,
  resetPassword,
} = require('../controllers/AuthController');

router.post('/register', authValidator, register);
router.post('/login', authValidator, login);
router.post('/forgot_password', authValidator, resetPassword);

module.exports = router;
