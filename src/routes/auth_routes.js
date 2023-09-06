const express = require('express');
const router = express.Router();

const {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth_controller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forget-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
