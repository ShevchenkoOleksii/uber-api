const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkAuthentication = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const {authorization} = await req.headers;

    if (!authorization) {
      return await res.status(400).json({
        message: 'No authorization!',
        reqData: req,
      });
    }

    const token = authorization.split(' ')[1];
    const decoded = await jwt.decode(token, process.env.jwtSecret);

    if (!decoded) {
      return await res.status(400).json({
        message: 'Invalid token!',
      });
    }

    const userId = decoded.userId;
    const user = await User.findOne({_id: userId});

    if (!user) {
      return await res.status(400).json({
        message: 'User not found!',
      });
    }

    req.decoded = decoded;
    req.user = user;

    next();
  } catch (e) {
    await res.status(500).json({
      message: `Error! No authorization! ${e.message}`,
    });
  }
};

module.exports = {
  checkAuthentication,
};
