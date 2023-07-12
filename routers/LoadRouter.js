const {Router} = require('express');
const router = new Router();
const {
  addLoad,
  getLoads,
  getActiveLoad,
  changeLoadState,
  getLoadById,
  updateLoadById,
  deleteLoadById,
  postLoadById,
  getLoadShippingInfo,
} = require('../controllers/LoadController');
const {checkAuthentication} = require('../middlewares/AuthMiddleware');
const {checkDriver, checkShipper} = require('../middlewares/CheckRole');
const {checkMongodbId, loadValidator} = require('../middlewares/Validators');

router.post('/', checkAuthentication, checkShipper, loadValidator, addLoad);
router.post('/:id/post',
    checkAuthentication,
    checkShipper,
    checkMongodbId,
    postLoadById);
router.get('/', checkAuthentication, getLoads);
router.get('/active', checkAuthentication, checkDriver, getActiveLoad);
router.get('/:id',
    checkAuthentication,
    checkShipper,
    checkMongodbId,
    getLoadById);
router.get('/:id/shipping_info',
    checkAuthentication,
    checkShipper,
    checkMongodbId,
    getLoadShippingInfo);
router.put('/:id',
    checkAuthentication,
    checkShipper,
    checkMongodbId,
    loadValidator,
    updateLoadById);
router.delete('/:id',
    checkAuthentication,
    checkShipper,
    checkMongodbId,
    deleteLoadById);
router.patch('/active/state',
    checkAuthentication,
    checkDriver,
    changeLoadState);

module.exports = router;
