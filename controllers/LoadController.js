const Load = require('../models/Load');
const Truck = require('../models/Truck');
const {TRUCK_PARAMS, LOAD_PARAMS} = require('../state/state');

const addLoad = async (req, res) => {
  try {
    const userId = req.user._id;
    const load = new Load({
      ...req.body,
      created_by: userId,
      created_date: Date.now(),
    });
    await load.save();

    await res.json({
      message: `The load has been created successfully!`,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const getLoads = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const statusData = req.query.status;
    const searchParams = {};

    if (statusData) {
      searchParams.status = statusData;
    }

    if (userRole === 'DRIVER') {
      searchParams.assigned_to = userId;
    } else {
      searchParams.created_by = userId;
    }
    const count = await Load.find(searchParams).countDocuments();
    const loads = await Load.find(searchParams, '-__v')
        .skip(offset)
        .limit(limit);

    if (!loads) {
      await res.status(400).json({
        message: `Loads not found!`,
      });
    }

    await res.json({
      loads,
      count,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const getActiveLoad = async (req, res) => {
  try {
    const userId = req.user._id;
    const load = await Load.findOne({
      assigned_to: userId,
      status: 'ASSIGNED',
    }, '-__v');

    if (!load) {
      return await res.status(400).json({
        message: `The active load not found!`,
      });
    }

    await res.json({
      load,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const changeLoadState = async (req, res) => {
  try {
    const userId = req.user._id;
    const load = await Load.findOne({
      assigned_to: userId,
      status: 'ASSIGNED',
    }, '-__v');

    if (!load) {
      return await res.status(400).json({
        message: `The active load not found!`,
      });
    }

    const index = LOAD_PARAMS.findIndex((state) => state === load.state);
    const condition = index === LOAD_PARAMS.length - 1;
    load.state = condition ? LOAD_PARAMS[0] : LOAD_PARAMS[index + 1];

    const infoMessage = {
      message: load.state,
      time: Date.now(),
    };

    load.logs.push(infoMessage);

    if (load.state === 'Arrived to delivery') {
      const truck = await Truck.findOne({assigned_to: userId}, '-__v');

      truck.status = 'IS';
      load.status = 'SHIPPED';
      await truck.save();
    }

    await load.save();
    await res.json({
      message: `Load state changed to ${load.state}`,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const getLoadById = async (req, res) => {
  try {
    const userId = req.user._id;
    const loadId = req.params.id;
    const load = await Load.findOne({
      _id: loadId,
      created_by: userId,
    }, '-__v');

    if (!load) {
      return await res.status(400).json({
        message: `The load not found!`,
      });
    }

    await res.json({
      load,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const updateLoadById = async (req, res) => {
  try {
    const userId = req.user._id;
    const loadId = req.params.id;
    const updatedName = req.body.name;
    const updatedPayload = req.body.payload;
    const updatedPickupAddress = req.body.pickup_address;
    const updatedDeliveryAddress = req.body.delivery_address;
    const updatedDimensions = req.body.dimensions;

    const load = await Load.findOne({
      _id: loadId,
      created_by: userId,
      status: 'NEW',
    });

    if (!load) {
      return await res.status(400).json({
        message: `The load not found!`,
      });
    }

    load.name = updatedName;
    load.payload = updatedPayload;
    load.pickup_address = updatedPickupAddress;
    load.delivery_address = updatedDeliveryAddress;
    load.dimensions = updatedDimensions;

    await load.save();

    await res.json({
      message: 'Load details have been changed successfully!',
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const deleteLoadById = async (req, res) => {
  try {
    const userId = req.user._id;
    const loadId = req.params.id;

    const load = await Load.findOne({
      _id: loadId,
      created_by: userId,
      status: 'NEW',
    });

    if (!load) {
      return await res.status(400).json({
        message: `The load not found!`,
      });
    }

    await load.remove();

    await res.json({
      message: 'Load has been removed successfully!',
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const checkTruck = (truck, payload, dimensions) => {
  if (truck.payload > payload &&
    truck.dimensions.width > dimensions.width &&
    truck.dimensions.length > dimensions.length &&
    truck.dimensions.height > dimensions.height) {
    return true;
  }
};

const postLoadById = async (req, res) => {
  try {
    const userId = req.user._id;
    const loadId = req.params.id;


    const load = await Load.findOne({
      _id: loadId,
      created_by: userId,
      status: 'NEW',
    });

    if (!load) {
      return await res.status(400).json({
        message: `The load not found!`,
      });
    }

    load.status = 'POSTED';

    await load.save();

    const {payload, dimensions} = load;

    const truck = TRUCK_PARAMS.find((truck) => {
      if (checkTruck(truck, payload, dimensions)) {
        return truck;
      }
    });
    console.log(`truck 260: ${truck.type}`);
    if (!truck) {
      const logInfo = {
        message: 'The load is too big!',
        time: Date.now(),
      };

      load.status = 'NEW';
      load.logs.push(logInfo);
      await load.save();

      return await res.status(400).json({
        message: `No truck found. The load is too big!`,
      });
    }

    const findFreeTruck = async () => {
      let result = await Truck.where('assigned_to').ne(null)
          .findOne({
            type: TRUCK_PARAMS[0].type,
            status: 'IS',
          });
      if (!result) {
        result = await Truck.where('assigned_to').ne(null)
            .findOne({
              type: TRUCK_PARAMS[1].type,
              status: 'IS',
            });
        if (!result) {
          result = await Truck.where('assigned_to').ne(null)
              .findOne({
                type: TRUCK_PARAMS[2].type,
                status: 'IS',
              });
        }
      }
      return result;
    };

    const freeTruck = await findFreeTruck();

    console.log(`freeTruck 281: ${freeTruck}`);
    if (!freeTruck) {
      const logInfo = {
        message: 'No Free Truck found',
        time: Date.now(),
      };

      load.status = 'NEW';
      load.logs.push(logInfo);

      await load.save();

      return await res.status(400).json({
        message: `No Free Truck found. No driver found for this load!`,
      });
    }

    freeTruck.status = 'OL';

    await freeTruck.save();

    const logInfo = {
      message: `Load assigned to driver with id ${freeTruck.assigned_to} and
      load state changed to 'En route to Pick Up'`,
      time: Date.now(),
    };

    load.logs.push(logInfo);
    load.assigned_to = freeTruck.assigned_to;
    load.status = 'ASSIGNED';
    load.state = 'En route to Pick Up';

    await load.save();

    await res.json({
      message: 'Load posted successfully!',
      driver_found: true,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const getLoadShippingInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const loadId = req.params.id;

    const load = await Load.where('status').ne('SHIPPED')
        .findOne({
          _id: loadId,
          created_by: userId,
        }, '-__v');

    if (!load) {
      return await res.status(400).json({
        message: `The load not found!`,
      });
    }

    const responseData = {load};
    const truck = await Truck.findOne({
      assigned_to: load.assigned_to,
    }, '-__v');

    if (truck) {
      responseData.truck = truck;
    }

    await res.json(responseData);
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

module.exports = {
  addLoad,
  getLoads,
  getActiveLoad,
  changeLoadState,
  getLoadById,
  updateLoadById,
  deleteLoadById,
  postLoadById,
  getLoadShippingInfo,
};

