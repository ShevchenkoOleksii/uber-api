const User = require('../models/User');
// const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const {email, password, role} = req.body;
    const candidate = await User.findOne({email});

    if (candidate) {
      return await res.status(400).json({
        message: `${candidate.email} already exists`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      created_date: Date.now(),
      role,
    });

    await user.save();

    await res.status(200).json({
      message: `${email} has been created successfully!`,
    });
  } catch (e) {
    await res.status(500).json({
      message: `${e.message}`,
    });
  }
};

const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: 'Invalid password, try again',
      });
    }

    const jwtToken = jwt.sign(
        {userId: user.id},
        process.env.jwtSecret,
        {expiresIn: '1h'},
    );

    await res.json({
      jwt_token: jwtToken,
      userId: user.id,
      message: 'success!',
    });
  } catch (e) {
    await res.status(500).json({
      message: `Internal server error! ${e.message}`,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const {email} = req.body;

    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    await res.status(200).json({
      message: `The new password has been sent to your email address`,
    });
  } catch (e) {
    await res.status(500).json({
      message: `Internal server error! ${e.message}`,
    });
  }
};

module.exports = {
  register,
  login,
  resetPassword,
};
