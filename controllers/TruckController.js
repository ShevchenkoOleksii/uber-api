const Truck = require('../models/Truck');

const addTruck = async (req, res) => {
  try {
    const userId = req.user._id;
    const truckType = req.body.type;

    const truck = new Truck({
      created_by: userId,
      type: truckType,
      created_date: Date.now(),
    });

    await truck.save();

    await res.json({
      message: `The ${truckType} truck has been created successfully!`,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const getTrucks = async (req, res) => {
  try {
    const userId = req.user._id;
    const trucks = await Truck.find({created_by: userId}, '-__v');

    if (!trucks) {
      return await res.status(400).json({
        message: `Bad request!`,
      });
    }

    await res.json({
      trucks,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const getTruckById = async (req, res) => {
  try {
    const userId = req.user._id;
    const truckId = req.params.id;

    const truck = await Truck.findOne({
      _id: truckId,
      created_by: userId,
    }, '-__v');

    if (!truck) {
      return await res.status(400).json({
        message: `Truck not found!`,
      });
    }

    await res.json({
      truck,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const updateTruck = async (req, res) => {
  try {
    const userId = req.user._id;
    const truckId = req.params.id;
    const truckType = req.body.type;

    const truck = await Truck.findOne({
      _id: truckId,
      created_by: userId,
      status: 'IS',
    });

    if (!truck) {
      return await res.status(400).json({
        message: `Truck's status is On Load!`,
      });
    }

    truck.type = truckType;

    await truck.save();

    await res.json({
      message: `Truck details have been changed successfully`,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const deleteTruck = async (req, res) => {
  try {
    const userId = req.user._id;
    const truckId = req.params.id;

    const truck = await Truck.findOneAndDelete({
      _id: truckId,
      created_by: userId,
      status: 'IS',
    });

    if (!truck) {
      return await res.status(400).json({
        message: `Truck not found!`,
      });
    }

    await truck.remove();

    await res.json({
      message: `Truck has been removed successfully`,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const assignTruck = async (req, res) => {
  try {
    const userId = req.user._id;
    const truckId = req.params.id;
    const checkAssignTruck = await Truck.findOne({
      _id: truckId,
      assigned_to: userId,
      status: 'IS',
    });

    if (checkAssignTruck) {
      // -----------------------------------------------
      // checkAssignTruck.assigned_to = null;
      // await checkAssignTruck.save();
      // return await res.status(200).json({
      //   message: `Truck has been assigned to nobody!`,
      // });
      // -----------------------------------------------
      return await res.status(400).json({
        message: `This truck has been already assigned to you!`,
      });
    }
    const checkOnLoadTruck = await Truck.findOne({
      _id: truckId,
      assigned_to: userId,
      status: 'OL',
    });

    if (checkOnLoadTruck) {
      return await res.status(400).json({
        message: `This truck is on load! It has been already assigned to you!`,
      });
    }

    const findAnotherAssignedTruck = await Truck.findOne({
      assigned_to: userId,
      status: 'OL',
    });

    if (findAnotherAssignedTruck) {
      return await res.status(400).json({
        message: `Another truck is on load!`,
      });
    }

    const findAssignedTruck = await Truck.findOne({
      assigned_to: userId,
      status: 'IS',
    });

    if (findAssignedTruck) {
      findAssignedTruck.assigned_to = null;
      await findAssignedTruck.save();
    }

    const truck = await Truck.findOne({
      _id: truckId,
      created_by: userId,
      status: 'IS',
    });

    if (!truck) {
      return await res.status(400).json({
        message: `Truck not found!`,
      });
    }

    truck.assigned_to = userId;
    await truck.save();

    await res.status(200).json({
      message: `Truck has been assigned to you successfully!`,
    });
  } catch (e) {
    return await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

module.exports = {
  addTruck,
  getTrucks,
  getTruckById,
  updateTruck,
  deleteTruck,
  assignTruck,
};
