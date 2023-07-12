const {Router} = require('express');
const router = new Router();
const {
  getUserProfile,
  changeUserPassword,
  removeUser,
} = require('../controllers/UserController');
const {checkAuthentication} = require('../middlewares/AuthMiddleware');

router.get('/', checkAuthentication, getUserProfile);
router.delete('/', checkAuthentication, removeUser);
router.patch('/password', checkAuthentication, changeUserPassword);

module.exports = router;
