const {Router} = require('express');
const router = new Router();
const {
  addTruck,
  getTrucks,
  getTruckById,
  updateTruck,
  deleteTruck,
  assignTruck,
} = require('../controllers/TruckController');
const {checkAuthentication} = require('../middlewares/AuthMiddleware');
const {checkDriver} = require('../middlewares/CheckRole');
const {
  truckTypeValidator,
  checkMongodbId} = require('../middlewares/Validators');

router.post('/',
    checkAuthentication,
    checkDriver,
    truckTypeValidator,
    addTruck);
router.post('/:id/assign',
    checkAuthentication,
    checkDriver,
    checkMongodbId,
    assignTruck);
router.get('/', checkAuthentication, checkDriver, getTrucks);
router.get('/:id',
    checkAuthentication,
    checkDriver,
    checkMongodbId,
    getTruckById);
router.put('/:id',
    checkAuthentication,
    checkDriver,
    checkMongodbId,
    updateTruck);
router.delete('/:id',
    checkAuthentication,
    checkDriver,
    checkMongodbId,
    deleteTruck);

module.exports = router;
