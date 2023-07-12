const checkDriver = async (req, res, next) => {
  const {role} = await req.user;

  if (role === 'SHIPPER') {
    return await res.status(500).json({
      message: `You are not a driver!`,
    });
  }

  next();
};

const checkShipper = async (req, res, next) => {
  const {role} = await req.user;

  if (role === 'DRIVER') {
    return await res.status(500).json({
      message: `You are not a shipper!`,
    });
  }

  next();
};

module.exports = {
  checkDriver,
  checkShipper,
};
